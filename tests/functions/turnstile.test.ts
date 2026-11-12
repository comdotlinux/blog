import { describe, it, expect, vi } from "vitest";
import { isPublicPath, onRequest } from "../../functions/_middleware";
import {
  SESSION_COOKIE,
  hasValidSession,
  signSession,
} from "../../functions/api/verify-turnstile";

const SECRET = "test-secret";
const req = (path: string, headers: Record<string, string> = {}) =>
  new Request(`https://blog.kulkarni.cloud${path}`, { headers });
const ok = () => Promise.resolve(new Response("site", { status: 200 }));

describe("session cookie", () => {
  it("accepts a freshly signed session", async () => {
    const cookie = `${SESSION_COOKIE}=${await signSession(SECRET)}`;
    expect(await hasValidSession(req("/", { Cookie: cookie }), SECRET)).toBe(
      true
    );
  });

  it("rejects a session signed with another secret", async () => {
    const cookie = `${SESSION_COOKIE}=${await signSession("other")}`;
    expect(await hasValidSession(req("/", { Cookie: cookie }), SECRET)).toBe(
      false
    );
  });

  it("rejects an expired session", async () => {
    const twoDaysAgo = Date.now() - 2 * 24 * 60 * 60 * 1000;
    const cookie = `${SESSION_COOKIE}=${await signSession(SECRET, twoDaysAgo)}`;
    expect(await hasValidSession(req("/", { Cookie: cookie }), SECRET)).toBe(
      false
    );
  });
});

describe("isPublicPath", () => {
  it.each([
    "/rss.xml",
    "/sitemap-index.xml",
    "/robots.txt",
    "/og.png",
    "/posts/gradle-tricks/index.png",
    "/api/verify-turnstile",
    "/On%20the%20topic%20of%20tools,%20their%20versions%20&%20automated%20installations.png",
  ])("%s is public", path => expect(isPublicPath(path)).toBe(true));

  it.each([
    "/",
    "/posts/gradle-tricks/",
    "/posts/gradle-tricks/index.html",
    "/posts/a/b/index.png",
    "/search/",
    "/%E0%A4%A",
  ])("%s is gated", path => expect(isPublicPath(path)).toBe(false));
});

describe("onRequest", () => {
  const env = { TURNSTILE_SECRET_KEY: SECRET, TURNSTILE_SITE_KEY: "site-key" };

  it("serves the challenge page to a browser without a session", async () => {
    const next = vi.fn(ok);
    const res = await onRequest({
      request: req("/", { Accept: "text/html" }),
      env,
      next,
    });
    expect(res.status).toBe(401);
    expect(await res.text()).toContain('data-sitekey="site-key"');
    expect(next).not.toHaveBeenCalled();
  });

  it("returns a bare 401 for non-page requests without a session", async () => {
    const res = await onRequest({
      request: req("/_astro/x.css"),
      env,
      next: ok,
    });
    expect(res.status).toBe(401);
  });

  it("passes through with a valid session", async () => {
    const cookie = `${SESSION_COOKIE}=${await signSession(SECRET)}`;
    const res = await onRequest({
      request: req("/", { Cookie: cookie, Accept: "text/html" }),
      env,
      next: ok,
    });
    expect(res.status).toBe(200);
  });

  it("passes public paths and preview deployments through", async () => {
    expect(
      (await onRequest({ request: req("/rss.xml"), env, next: ok })).status
    ).toBe(200);
    expect(
      (
        await onRequest({
          request: req("/"),
          env: { ...env, PREVIEW: "true" },
          next: ok,
        })
      ).status
    ).toBe(200);
  });

  it.each(["/posts/1", "/posts/1/"])(
    "redirects %s to /posts/ before the gate",
    async path => {
      const res = await onRequest({ request: req(path), env, next: ok });
      expect(res.status).toBe(301);
      expect(res.headers.get("Location")).toBe("/posts/");
    }
  );

  it("fails closed when the secret is missing", async () => {
    const res = await onRequest({
      request: req("/"),
      env: { TURNSTILE_SECRET_KEY: "" },
      next: ok,
    });
    expect(res.status).toBe(500);
  });
});
