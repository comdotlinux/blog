/**
 * Edge gate for the whole site. No page is served without the session cookie set by
 * /api/verify-turnstile. Unauthenticated page loads get a standalone Turnstile page; other
 * requests get 401. Feeds, sitemaps, robots.txt and OG images stay public so RSS readers and
 * crawlers that fetch them directly keep working. Preview deployments (PREVIEW=true) are open.
 */
import { type Env, hasValidSession } from "./api/verify-turnstile";

const PUBLIC_PREFIXES = ["/api/"];
const PUBLIC_PATHS = new Set([
  "/rss.xml",
  "/sitemap-index.xml",
  "/sitemap-0.xml",
  "/robots.txt",
  "/favicon.svg",
  "/favicon.ico",
  "/og.png",
  "/astropaper-og.jpg",
  "/On the topic of tools, their versions & automated installations.png",
]);
const PUBLIC_PATTERNS = [/^\/posts\/[^/]+\/index\.png$/];

export function isPublicPath(pathname: string): boolean {
  let path = pathname;
  try {
    path = decodeURIComponent(pathname);
  } catch {
    // Malformed escapes are never public.
  }
  return (
    PUBLIC_PATHS.has(path) ||
    PUBLIC_PREFIXES.some(p => path.startsWith(p)) ||
    PUBLIC_PATTERNS.some(re => re.test(path))
  );
}

export async function onRequest(context: {
  request: Request;
  env: Env;
  next: () => Promise<Response>;
}) {
  const { request, env, next } = context;
  const { pathname } = new URL(request.url);

  if (env.PREVIEW === "true") return next();
  if (isPublicPath(pathname)) return next();
  if (!env.TURNSTILE_SECRET_KEY)
    return new Response("Server configuration error", { status: 500 });
  if (await hasValidSession(request, env.TURNSTILE_SECRET_KEY)) return next();

  const wantsPage = (request.headers.get("Accept") ?? "").includes("text/html");
  if (!wantsPage) return new Response("Verification required", { status: 401 });
  return new Response(gatePage(env.TURNSTILE_SITE_KEY ?? ""), {
    status: 401,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}

// Self-contained: system monospace, no site assets, so it needs nothing else to be public.
// On success the verify endpoint sets the cookie and a reload serves the requested URL.
const gatePage = (siteKey: string) => `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="robots" content="noindex">
  <title>Developer Musings</title>
  <style>
    :root { color-scheme: light dark; --bg: #fdfdfd; --text: #282728; --dim: #6b7280; --accent: #006cac; --border: #ece9e9; }
    @media (prefers-color-scheme: dark) { :root { --bg: #212737; --text: #eaedf3; --dim: #afb9ca; --accent: #ff6b01; --border: #ab4b08; } }
    html, body { height: 100%; margin: 0; background: var(--bg); color: var(--text);
      font: 14px/1.6 ui-monospace, Menlo, Consolas, monospace; }
    main { min-height: 100%; display: grid; place-items: center; padding: 24px; box-sizing: border-box; }
    .frame { border: 1px solid var(--border); padding: 24px 28px; max-width: 420px; width: 100%; }
    .dim { color: var(--dim); }
    h1 { font-size: 18px; margin: 0 0 4px; }
    p { margin: 0 0 16px; }
    .cf-turnstile { min-height: 65px; }
    .error { color: #e64553; margin-top: 12px; display: none; }
  </style>
  <script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer></script>
</head>
<body>
  <main>
    <div class="frame">
      <h1>Developer Musings</h1>
      <p class="dim">One quick check before the blog loads.</p>
      ${
        siteKey
          ? `<div class="cf-turnstile" data-sitekey="${siteKey}" data-callback="onVerify" data-theme="auto"></div>`
          : `<p class="error" style="display:block">Verification is not configured for this deployment.</p>`
      }
      <p class="error" id="error">Verification failed. Please try again.</p>
      <p class="dim" style="margin:16px 0 0;font-size:12px">Protected by Cloudflare Turnstile</p>
    </div>
  </main>
  <script>
    async function onVerify(token) {
      try {
        const res = await fetch('/api/verify-turnstile', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'same-origin',
          body: JSON.stringify({ token }),
        });
        const body = await res.json().catch(() => ({}));
        if (res.ok && body.success) { location.reload(); return; }
      } catch (_) {}
      document.getElementById('error').style.display = 'block';
      if (window.turnstile) window.turnstile.reset();
    }
  </script>
</body>
</html>
`;
