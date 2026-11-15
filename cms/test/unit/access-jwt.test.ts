import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  AUD,
  OWNER_EMAIL,
  ORIGIN,
  b64url,
  fakeFetch,
  now,
  publicJwk,
  rsaKeyPair,
  sign,
  validClaims,
} from "./proxy-helpers";

type Proxy = typeof import("../../functions/gh/[[path]]");
let proxy: Proxy;
let keys: CryptoKeyPair;
let jwk: object;

beforeEach(async () => {
  vi.resetModules();
  proxy = await import("../../functions/gh/[[path]]");
  keys = await rsaKeyPair();
  jwk = await publicJwk(keys.publicKey, "kid-1");
});
afterEach(() => vi.unstubAllGlobals());

const header = { alg: "RS256", kid: "kid-1", typ: "JWT" };
const withHeader = (token: string) =>
  new Request(`${ORIGIN}/gh/api/v3/user`, {
    headers: { "Cf-Access-Jwt-Assertion": token },
  });
const verify = (request: Request, email = OWNER_EMAIL) =>
  proxy.verifyAccessJwt(request, email, now());

describe("verifyAccessJwt", () => {
  it("accepts a valid token from the Cf-Access-Jwt-Assertion header", async () => {
    fakeFetch({ keys: [jwk] });
    const token = await sign(keys.privateKey, header, validClaims());
    expect(await verify(withHeader(token))).toBe(true);
  });

  it("accepts a valid token from the CF_Authorization cookie", async () => {
    fakeFetch({ keys: [jwk] });
    const token = await sign(keys.privateKey, header, validClaims());
    const request = new Request(`${ORIGIN}/gh/api/v3/user`, {
      headers: { Cookie: `other=1; CF_Authorization=${token}` },
    });
    expect(await verify(request)).toBe(true);
  });

  it("accepts aud as a plain string", async () => {
    fakeFetch({ keys: [jwk] });
    const token = await sign(
      keys.privateKey,
      header,
      validClaims({ aud: AUD })
    );
    expect(await verify(withHeader(token))).toBe(true);
  });

  it("compares the email case-insensitively", async () => {
    fakeFetch({ keys: [jwk] });
    const token = await sign(
      keys.privateKey,
      header,
      validClaims({ email: "Owner@Example.COM" })
    );
    expect(await verify(withHeader(token), " owner@example.com ")).toBe(true);
  });

  it.each([
    ["wrong aud", { aud: ["other-aud"] }],
    ["wrong iss", { iss: "https://evil.cloudflareaccess.com" }],
    ["expired", { exp: now() - 1 }],
    ["missing exp", { exp: undefined }],
    ["nbf in the future", { nbf: now() + 600 }],
    ["missing nbf", { nbf: undefined }],
    ["wrong email", { email: "someone@example.com" }],
    ["missing email", { email: undefined }],
  ])("rejects %s", async (_, overrides) => {
    fakeFetch({ keys: [jwk] });
    const token = await sign(keys.privateKey, header, validClaims(overrides));
    expect(await verify(withHeader(token))).toBe(false);
  });

  it("tolerates 60 s of clock skew on nbf", async () => {
    fakeFetch({ keys: [jwk] });
    const token = await sign(
      keys.privateKey,
      header,
      validClaims({ nbf: now() + 30 })
    );
    expect(await verify(withHeader(token))).toBe(true);
  });

  it("rejects a token signed by another key", async () => {
    fakeFetch({ keys: [jwk] });
    const other = await rsaKeyPair();
    const token = await sign(other.privateKey, header, validClaims());
    expect(await verify(withHeader(token))).toBe(false);
  });

  it("rejects a tampered payload", async () => {
    fakeFetch({ keys: [jwk] });
    const token = await sign(keys.privateKey, header, validClaims());
    const [h, , s] = token.split(".");
    const forged = b64url(
      new TextEncoder().encode(
        JSON.stringify(validClaims({ email: "x@example.com" }))
      )
    );
    expect(await verify(withHeader(`${h}.${forged}.${s}`))).toBe(false);
  });

  it.each([
    ["HS256", { alg: "HS256", kid: "kid-1" }],
    ["none", { alg: "none", kid: "kid-1" }],
    ["RS512", { alg: "RS512", kid: "kid-1" }],
    ["missing kid", { alg: "RS256" }],
  ])("rejects alg/header %s", async (_, h) => {
    fakeFetch({ keys: [jwk] });
    const token = await sign(keys.privateKey, h, validClaims());
    expect(await verify(withHeader(token))).toBe(false);
  });

  it("rejects an unknown kid after one refetch", async () => {
    const { calls } = fakeFetch({ keys: [jwk] });
    const token = await sign(
      keys.privateKey,
      { ...header, kid: "kid-unknown" },
      validClaims()
    );
    expect(await verify(withHeader(token))).toBe(false);
    expect(calls.filter(c => c.url.endsWith("/certs"))).toHaveLength(1);
  });

  it("refetches the certs for a new kid once the cache is 30 s old", async () => {
    const { calls } = fakeFetch({ keys: [jwk] });
    const first = await sign(keys.privateKey, header, validClaims());
    expect(
      await proxy.verifyAccessJwt(withHeader(first), OWNER_EMAIL, now())
    ).toBe(true);

    const rotated = await rsaKeyPair();
    const rotatedJwk = await publicJwk(rotated.publicKey, "kid-2");
    fakeFetch({ keys: [jwk, rotatedJwk] });
    const second = await sign(
      rotated.privateKey,
      { ...header, kid: "kid-2" },
      validClaims()
    );
    // Within 30 s: no refetch, unknown kid fails.
    expect(
      await proxy.verifyAccessJwt(withHeader(second), OWNER_EMAIL, now() + 5)
    ).toBe(false);
    // After 30 s the unknown kid triggers a refetch.
    expect(
      await proxy.verifyAccessJwt(withHeader(second), OWNER_EMAIL, now() + 31)
    ).toBe(true);
    expect(calls.filter(c => c.url.endsWith("/certs"))).toHaveLength(1);
  });

  it("caches the certs between requests", async () => {
    const { calls } = fakeFetch({ keys: [jwk] });
    const token = await sign(keys.privateKey, header, validClaims());
    await verify(withHeader(token));
    await verify(withHeader(token));
    expect(calls.filter(c => c.url.endsWith("/certs"))).toHaveLength(1);
  });

  it("rejects a missing token", async () => {
    fakeFetch({ keys: [jwk] });
    expect(await verify(new Request(`${ORIGIN}/gh/api/v3/user`))).toBe(false);
  });

  it.each(["", "abc", "a.b", "a.b.c.d", "!!!.###.$$$"])(
    "rejects malformed token %j",
    async token => {
      fakeFetch({ keys: [jwk] });
      const request = new Request(`${ORIGIN}/gh/api/v3/user`, {
        headers: { Cookie: `CF_Authorization=${token}` },
      });
      expect(await verify(request)).toBe(false);
    }
  );

  it("rejects (does not throw) when the certs endpoint fails", async () => {
    fakeFetch({ keys: [jwk], certsStatus: 500 });
    const token = await sign(keys.privateKey, header, validClaims());
    expect(await verify(withHeader(token))).toBe(false);
  });
});
