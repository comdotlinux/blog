/**
 * Same-origin GitHub API proxy for Sveltia CMS (config.yml `api_root`).
 * Every request needs a valid Cloudflare Access JWT for the owner. The proxy mints a GitHub App
 * installation token, keeps it in memory and forwards only the calls Sveltia needs, so no GitHub
 * credential reaches the browser. Never log tokens, keys or JWTs.
 */

export interface Env {
  GITHUB_APP_ID?: string;
  GITHUB_APP_INSTALLATION_ID?: string;
  GITHUB_APP_PRIVATE_KEY?: string;
  OWNER_EMAIL?: string;
}

const ACCESS_TEAM = "https://kulkarni.cloudflareaccess.com";
const ACCESS_AUD =
  "a9ed3790181fa358b0b922d6aa046c04abbb5f2df5134f0dfbd8c8e30893874e";
const GITHUB = "https://api.github.com";
const OWNER = "comdotlinux";
const REPO = `/repos/${OWNER}/blog`;
const REST_PREFIX = "/gh/api/v3";
const GRAPHQL_PATH = "/gh/api/graphql";
const CERTS_TTL = 300;
const CERTS_MIN_REFETCH = 30;
const CLOCK_SKEW = 60;
const RSA = { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" };
const GITHUB_HEADERS = {
  "X-GitHub-Api-Version": "2022-11-28",
  "User-Agent": "blog-cms",
};

// Write calls Sveltia makes in the editorial workflow. Anything else that is not GET/HEAD gets 403,
// so DELETE, PR merges and ref updates outside cms/ branches never reach GitHub.
const WRITES: [string, RegExp][] = [
  ["POST", /^\/repos\/comdotlinux\/blog\/pulls$/],
  ["PATCH", /^\/repos\/comdotlinux\/blog\/pulls\/\d+$/],
  ["PATCH", /^\/repos\/comdotlinux\/blog\/issues\/\d+$/],
  ["POST", /^\/repos\/comdotlinux\/blog\/issues\/\d+\/labels$/],
  ["POST", /^\/repos\/comdotlinux\/blog\/pulls\/\d+\/reviews$/],
  ["PUT", /^\/repos\/comdotlinux\/blog\/pulls\/\d+\/reviews\/\d+\/dismissals$/],
  // Sveltia force-resets a stale workflow branch that has no open PR.
  ["PATCH", /^\/repos\/comdotlinux\/blog\/git\/refs\/heads\/cms\/.+$/],
];

const MUTATIONS = new Set([
  "createCommitOnBranch",
  "createRef",
  "convertPullRequestToDraft",
  "markPullRequestReadyForReview",
  "disablePullRequestAutoMerge",
]);

const encoder = new TextEncoder();
const fromB64 = (s: string) =>
  Uint8Array.from(atob(s.replace(/-/g, "+").replace(/_/g, "/")), c =>
    c.charCodeAt(0)
  );
const toB64url = (bytes: ArrayBuffer | Uint8Array) =>
  btoa(String.fromCharCode(...new Uint8Array(bytes)))
    .replace(/=+$/, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
const decodeJson = (part: string): unknown =>
  JSON.parse(new TextDecoder().decode(fromB64(part)));
const isObject = (v: unknown): v is Record<string, unknown> =>
  typeof v === "object" && v !== null && !Array.isArray(v);

const json = (status: number, message: string) =>
  new Response(JSON.stringify({ message }), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
    },
  });

type Jwk = JsonWebKey & { kid?: string };
let certs: { keys: Jwk[]; fetchedAt: number } | undefined;

async function accessKey(kid: string, now: number): Promise<Jwk | undefined> {
  const find = () => certs?.keys.find(k => k.kid === kid);
  if (
    !certs ||
    now - certs.fetchedAt >= CERTS_TTL ||
    (!find() && now - certs.fetchedAt >= CERTS_MIN_REFETCH)
  ) {
    const res = await fetch(`${ACCESS_TEAM}/cdn-cgi/access/certs`);
    if (!res.ok) throw new Error("certs unavailable");
    const body = (await res.json()) as { keys?: Jwk[] };
    certs = { keys: body.keys ?? [], fetchedAt: now };
  }
  return find();
}

function accessToken(request: Request): string | undefined {
  const header = request.headers.get("Cf-Access-Jwt-Assertion");
  if (header) return header;
  for (const part of (request.headers.get("Cookie") ?? "").split(";")) {
    const [name, ...value] = part.trim().split("=");
    if (name === "CF_Authorization") return value.join("=");
  }
}

export async function verifyAccessJwt(
  request: Request,
  ownerEmail: string,
  now: number
): Promise<boolean> {
  const token = accessToken(request);
  if (!token) return false;
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return false;
    const [h, p, s] = parts;
    const header = decodeJson(h);
    if (
      !isObject(header) ||
      header.alg !== "RS256" ||
      typeof header.kid !== "string"
    )
      return false;
    const jwk = await accessKey(header.kid, now);
    if (!jwk || jwk.kty !== "RSA") return false;
    const key = await crypto.subtle.importKey(
      "jwk",
      { kty: "RSA", n: jwk.n, e: jwk.e },
      RSA,
      false,
      ["verify"]
    );
    if (
      !(await crypto.subtle.verify(
        RSA.name,
        key,
        fromB64(s),
        encoder.encode(`${h}.${p}`)
      ))
    )
      return false;
    const c = decodeJson(p);
    if (!isObject(c)) return false;
    const aud = Array.isArray(c.aud) ? c.aud : [c.aud];
    return (
      aud.includes(ACCESS_AUD) &&
      c.iss === ACCESS_TEAM &&
      typeof c.exp === "number" &&
      c.exp > now &&
      typeof c.nbf === "number" &&
      c.nbf <= now + CLOCK_SKEW &&
      typeof c.email === "string" &&
      c.email.toLowerCase() === ownerEmail.trim().toLowerCase()
    );
  } catch {
    return false;
  }
}

export async function appJwt(
  appId: string,
  privateKeyPem: string,
  now: number
): Promise<string> {
  const part = (o: object) => toB64url(encoder.encode(JSON.stringify(o)));
  // GitHub takes the numeric App ID as a number, or the Client ID as a string.
  const iss = /^\d+$/.test(appId) ? Number(appId) : appId;
  const unsigned = `${part({ alg: "RS256", typ: "JWT" })}.${part({ iat: now - 60, exp: now + 540, iss })}`;
  const der = fromB64(privateKeyPem.replace(/-----[^-]+-----|\s/g, ""));
  const key = await crypto.subtle.importKey("pkcs8", der, RSA, false, ["sign"]);
  const sig = await crypto.subtle.sign(RSA.name, key, encoder.encode(unsigned));
  return `${unsigned}.${toB64url(sig)}`;
}

let installation: { token: string; expiresAt: number } | undefined;

async function installationToken(env: Required<Env>, now: number) {
  if (installation && installation.expiresAt - now > 300)
    return installation.token;
  const res = await fetch(
    `${GITHUB}/app/installations/${env.GITHUB_APP_INSTALLATION_ID}/access_tokens`,
    {
      method: "POST",
      headers: {
        ...GITHUB_HEADERS,
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${await appJwt(env.GITHUB_APP_ID, env.GITHUB_APP_PRIVATE_KEY, now)}`,
      },
      body: JSON.stringify({
        repositories: ["blog"],
        permissions: {
          contents: "write",
          pull_requests: "write",
          metadata: "read",
        },
      }),
    }
  );
  if (!res.ok) {
    console.error("cms proxy: installation token request failed", res.status);
    return undefined;
  }
  const body = (await res.json()) as { token: string; expires_at: string };
  installation = {
    token: body.token,
    expiresAt: Math.floor(Date.parse(body.expires_at) / 1000),
  };
  return body.token;
}

/** Validated GitHub path (still percent-encoded, as sent upstream) and its decoded form. */
export function githubPath(
  pathname: string
): { raw: string; path: string } | null {
  if (pathname === GRAPHQL_PATH) return { raw: "/graphql", path: "/graphql" };
  if (!pathname.startsWith(`${REST_PREFIX}/`)) return null;
  const raw = pathname.slice(REST_PREFIX.length);
  if (/%2f/i.test(raw)) return null;
  let path: string;
  try {
    path = decodeURIComponent(raw);
  } catch {
    return null;
  }
  // A `%` left after one decode means double encoding; GitHub could decode it again.
  if (/[%\\\x00-\x1f\x7f]/.test(path)) return null;
  if (
    path
      .split("/")
      .slice(1)
      .some(s => s === "" || s === "." || s === "..")
  )
    return null;
  if (path === "/user" || path === REPO || path.startsWith(`${REPO}/`))
    return { raw, path };
  return null;
}

export function writeAllowed(method: string, path: string): boolean {
  return WRITES.some(([m, re]) => m === method && re.test(path));
}

function tokenize(query: string): string[] | null {
  const re =
    /\s+|,|#[^\n\r]*|("""[\s\S]*?(?<!\\)"""|"(?:\\.|[^"\\\n\r])*")|(\.\.\.|[!$&():=@[\]{}|]|-?\d[\w.+-]*|[_A-Za-z]\w*)/y;
  const tokens: string[] = [];
  while (re.lastIndex < query.length) {
    const m = re.exec(query);
    if (!m) return null;
    if (m[1]) tokens.push('"');
    else if (m[2]) tokens.push(m[2]);
  }
  return tokens;
}

/** Root fields of every mutation in the document, or null if it cannot be checked safely. */
export function mutationFields(
  query: string
): { name: string; args: string }[] | null {
  const t = tokenize(query);
  if (!t) return null;
  let i = 0;
  const skip = (): boolean => {
    const open = t[i];
    const close = open === "{" ? "}" : ")";
    for (let depth = 0; i < t.length; i++) {
      if (t[i] === open) depth++;
      else if (t[i] === close && --depth === 0) {
        i++;
        return true;
      }
    }
    return false;
  };
  const isName = (s: string | undefined) => /^[_A-Za-z]/.test(s ?? "");
  const fields: { name: string; args: string }[] = [];
  while (i < t.length) {
    const kind = t[i];
    if (kind === "{") {
      if (!skip()) return null;
      continue;
    }
    if (kind !== "query" && kind !== "mutation" && kind !== "fragment")
      return null;
    for (i++; i < t.length && t[i] !== "{";)
      if (t[i] === "(") {
        if (!skip()) return null;
      } else i++;
    if (i >= t.length) return null;
    if (kind !== "mutation") {
      if (!skip()) return null;
      continue;
    }
    for (i++; t[i] !== "}";) {
      // Fragment spreads, inline fragments and directives at the root are refused.
      let name = t[i];
      if (!isName(name)) return null;
      i++;
      if (t[i] === ":") {
        name = t[i + 1];
        i += 2;
        if (!isName(name)) return null;
      }
      let args = "";
      if (t[i] === "(") {
        const start = i;
        if (!skip()) return null;
        args = t.slice(start, i).join("");
      }
      if (t[i] === "{" && !skip()) return null;
      fields.push({ name, args });
    }
    i++;
  }
  return fields;
}

const isCmsBranch = (v: unknown, prefix = "") =>
  typeof v === "string" && v.startsWith(`${prefix}cms/`);

/** Only Sveltia's own mutations, and commits or new refs only on cms/ branches (never main). */
export function graphqlAllowed(body: unknown): boolean {
  if (!isObject(body) || typeof body.query !== "string") return false;
  const fields = mutationFields(body.query);
  if (!fields) return false;
  const input = isObject(body.variables) ? body.variables.input : undefined;
  return fields.every(({ name, args }) => {
    if (!MUTATIONS.has(name) || args !== "(input:$input)") return false;
    if (!isObject(input)) return false;
    if (name === "createCommitOnBranch")
      return isObject(input.branch) && isCmsBranch(input.branch.branchName);
    if (name === "createRef") return isCmsBranch(input.name, "refs/heads/");
    return true;
  });
}

function configured(env: Env): env is Required<Env> {
  return (
    /^[A-Za-z0-9.]+$/.test(env.GITHUB_APP_ID ?? "") &&
    /^\d+$/.test(env.GITHUB_APP_INSTALLATION_ID ?? "") &&
    /-----BEGIN PRIVATE KEY-----/.test(env.GITHUB_APP_PRIVATE_KEY ?? "") &&
    /@/.test(env.OWNER_EMAIL ?? "")
  );
}

function sameOrigin(request: Request, origin: string): boolean {
  const site = request.headers.get("Sec-Fetch-Site");
  if (site !== null) return site === "same-origin";
  return request.headers.get("Origin") === origin;
}

export async function onRequest({
  request,
  env,
}: {
  request: Request;
  env: Env;
}): Promise<Response> {
  if (!configured(env)) {
    console.error("cms proxy: GitHub App settings missing or invalid");
    return json(503, "CMS GitHub App not configured");
  }
  const url = new URL(request.url);
  if (!sameOrigin(request, url.origin)) return json(403, "Forbidden");
  const now = Math.floor(Date.now() / 1000);
  if (!(await verifyAccessJwt(request, env.OWNER_EMAIL, now)))
    return json(401, "Access required");

  const target = githubPath(url.pathname);
  if (!target) return json(404, "Not Found");
  const method = request.method;
  const read = method === "GET" || method === "HEAD";
  let body: string | ArrayBuffer | undefined;
  if (target.path === "/graphql") {
    if (method !== "POST") return json(405, "Method Not Allowed");
    let parsed: unknown;
    try {
      parsed = await request.json();
    } catch {
      return json(400, "Bad Request");
    }
    if (!graphqlAllowed(parsed)) return json(403, "Forbidden");
    // Forward the parsed form, so GitHub sees exactly the query that was checked.
    body = JSON.stringify(parsed);
  } else if (!read) {
    if (target.path === "/user" || !writeAllowed(method, target.path))
      return json(403, "Forbidden");
    body = await request.arrayBuffer();
  } else if (target.path === "/user" && method !== "GET") {
    return json(405, "Method Not Allowed");
  }

  const token = await installationToken(env, now).catch(() => {
    console.error("cms proxy: installation token could not be created");
    return undefined;
  });
  if (!token) return json(502, "GitHub token unavailable");

  // Installation tokens get 403 on /user, and GitHub omits `permissions` for them; Sveltia needs both.
  const upstreamRaw = target.path === "/user" ? `/users/${OWNER}` : target.raw;
  const headers: Record<string, string> = {
    ...GITHUB_HEADERS,
    Authorization: `Bearer ${token}`,
    Accept: request.headers.get("Accept") ?? "application/vnd.github+json",
  };
  for (const name of ["Content-Type", "If-None-Match"]) {
    const value = request.headers.get(name);
    if (value) headers[name] = value;
  }
  const upstreamUrl = new URL(`${GITHUB}${upstreamRaw}${url.search}`);
  if (upstreamUrl.origin !== GITHUB) return json(404, "Not Found");

  let res: Response;
  try {
    res = await fetch(upstreamUrl, { method, headers, body });
  } catch {
    console.error("cms proxy: GitHub request failed");
    return json(502, "GitHub unavailable");
  }

  const out = new Headers({ "Cache-Control": "no-store" });
  for (const name of [
    "Content-Type",
    "ETag",
    "Retry-After",
    "X-RateLimit-Remaining",
  ]) {
    const value = res.headers.get(name);
    if (value) out.set(name, value);
  }
  const link = res.headers.get("Link");
  if (link)
    out.set(
      "Link",
      link.replaceAll(`${GITHUB}/`, `${url.origin}${REST_PREFIX}/`)
    );

  if (res.status === 200 && method === "GET" && target.path === REPO) {
    const repo = (await res.json()) as Record<string, unknown>;
    repo.permissions = {
      admin: false,
      maintain: false,
      push: true,
      triage: true,
      pull: true,
    };
    out.delete("ETag");
    return new Response(JSON.stringify(repo), { status: 200, headers: out });
  }
  return new Response(res.body, { status: res.status, headers: out });
}
