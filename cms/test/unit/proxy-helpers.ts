import { vi } from "vitest";

export const ORIGIN = "https://cms.blog.kulkarni.cloud";
export const TEAM = "https://kulkarni.cloudflareaccess.com";
export const AUD =
  "a9ed3790181fa358b0b922d6aa046c04abbb5f2df5134f0dfbd8c8e30893874e";
export const OWNER_EMAIL = "owner@example.com";
const RSA = {
  name: "RSASSA-PKCS1-v1_5",
  modulusLength: 2048,
  publicExponent: new Uint8Array([1, 0, 1]),
  hash: "SHA-256",
};

export const b64url = (bytes: ArrayBuffer | Uint8Array) =>
  Buffer.from(new Uint8Array(bytes)).toString("base64url");
const part = (o: object) => b64url(new TextEncoder().encode(JSON.stringify(o)));

export const rsaKeyPair = () =>
  crypto.subtle.generateKey(RSA, true, [
    "sign",
    "verify",
  ]) as Promise<CryptoKeyPair>;

export async function sign(
  privateKey: CryptoKey,
  header: object,
  claims: object
): Promise<string> {
  const unsigned = `${part(header)}.${part(claims)}`;
  const sig = await crypto.subtle.sign(
    RSA.name,
    privateKey,
    new TextEncoder().encode(unsigned)
  );
  return `${unsigned}.${b64url(sig)}`;
}

export async function publicJwk(publicKey: CryptoKey, kid: string) {
  return { ...(await crypto.subtle.exportKey("jwk", publicKey)), kid };
}

export async function pkcs8Pem(privateKey: CryptoKey): Promise<string> {
  const der = Buffer.from(
    await crypto.subtle.exportKey("pkcs8", privateKey)
  ).toString("base64");
  return `-----BEGIN PRIVATE KEY-----\n${der.match(/.{1,64}/g)?.join("\n")}\n-----END PRIVATE KEY-----\n`;
}

export const now = () => Math.floor(Date.now() / 1000);

export const validClaims = (overrides: object = {}) => ({
  aud: [AUD],
  iss: TEAM,
  email: OWNER_EMAIL,
  iat: now() - 10,
  nbf: now() - 10,
  exp: now() + 3600,
  type: "app",
  ...overrides,
});

export interface Upstream {
  url: string;
  init: RequestInit & { headers: Record<string, string> };
}

/**
 * Fake fetch for the Access certs endpoint and GitHub. `github` answers every api.github.com
 * call except the installation token endpoint, which returns `ghs_test_token`.
 */
export function fakeFetch(options: {
  keys: object[];
  certsStatus?: number;
  tokenStatus?: number;
  github?: (url: URL, init: RequestInit) => Response;
}) {
  const calls: Upstream[] = [];
  const fn = vi.fn(async (input: string | URL, init: RequestInit = {}) => {
    const url = new URL(input);
    calls.push({ url: url.href, init: init as Upstream["init"] });
    if (url.href === `${TEAM}/cdn-cgi/access/certs`) {
      return new Response(JSON.stringify({ keys: options.keys }), {
        status: options.certsStatus ?? 200,
      });
    }
    if (/^\/app\/installations\/\d+\/access_tokens$/.test(url.pathname)) {
      return new Response(
        JSON.stringify({
          token: "ghs_test_token",
          expires_at: new Date(Date.now() + 3600_000).toISOString(),
        }),
        { status: options.tokenStatus ?? 201 }
      );
    }
    return (
      options.github?.(url, init) ??
      new Response("{}", {
        status: 200,
        headers: { "Content-Type": "application/json" },
      })
    );
  });
  vi.stubGlobal("fetch", fn);
  return { fn, calls };
}
