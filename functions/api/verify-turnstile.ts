/**
 * POST /api/verify-turnstile
 *
 * Verifies a Turnstile token with Cloudflare and, on success, sets the session cookie that
 * functions/_middleware.ts requires before it serves any page. The gate page posts here.
 *
 * Body: { token: string }
 */

export interface Env {
  TURNSTILE_SECRET_KEY: string;
  TURNSTILE_SITE_KEY?: string;
  PREVIEW?: string;
}

export const SESSION_COOKIE = "blog_session";
const SESSION_TTL_S = 24 * 60 * 60;

const enc = new TextEncoder();
const toHex = (buf: ArrayBuffer) =>
  Array.from(new Uint8Array(buf), b => b.toString(16).padStart(2, "0")).join(
    ""
  );

async function hmac(secret: string, message: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  return toHex(await crypto.subtle.sign("HMAC", key, enc.encode(message)));
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

// Stateless session: `${expiry}.${hmac(expiry)}`. The Turnstile secret doubles as the signing key,
// so no extra configuration is needed.
export async function signSession(
  secret: string,
  now = Date.now()
): Promise<string> {
  const exp = String(Math.floor(now / 1000) + SESSION_TTL_S);
  return `${exp}.${await hmac(secret, exp)}`;
}

export async function hasValidSession(
  request: Request,
  secret: string
): Promise<boolean> {
  const match = (request.headers.get("Cookie") ?? "").match(
    new RegExp(`(?:^|;\\s*)${SESSION_COOKIE}=(\\d+)\\.([0-9a-f]+)`)
  );
  if (!match) return false;
  const [, exp, sig] = match;
  if (Number(exp) * 1000 < Date.now()) return false;
  return timingSafeEqual(sig, await hmac(secret, exp));
}

export function sessionCookie(value: string): string {
  return `${SESSION_COOKIE}=${value}; Max-Age=${SESSION_TTL_S}; Path=/; HttpOnly; Secure; SameSite=Lax`;
}

interface TurnstileResponse {
  success: boolean;
  "error-codes"?: string[];
}

const json = (
  body: unknown,
  status: number,
  headers: Record<string, string> = {}
) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...headers },
  });

export async function onRequestPost(context: { request: Request; env: Env }) {
  try {
    const { token } = (await context.request.json()) as { token?: string };
    if (!token)
      return json({ success: false, error: "No token provided" }, 400);

    const secretKey = context.env.TURNSTILE_SECRET_KEY;
    if (!secretKey) {
      console.error("TURNSTILE_SECRET_KEY not set in environment variables");
      return json({ success: false, error: "Server configuration error" }, 500);
    }

    const verification = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ secret: secretKey, response: token }),
      }
    );
    const result = (await verification.json()) as TurnstileResponse;

    if (!result.success) {
      console.error("Turnstile verification failed:", result["error-codes"]);
      return json(
        {
          success: false,
          error: "Verification failed",
          details: result["error-codes"],
        },
        400
      );
    }

    return json({ success: true }, 200, {
      "Set-Cookie": sessionCookie(await signSession(secretKey)),
    });
  } catch (error) {
    console.error("Error verifying Turnstile token:", error);
    return json({ success: false, error: "Internal server error" }, 500);
  }
}
