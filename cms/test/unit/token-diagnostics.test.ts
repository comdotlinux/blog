import { afterEach, beforeEach, expect, it, vi } from "vitest";
import {
  ORIGIN,
  OWNER_EMAIL,
  TEAM,
  pkcs8Pem,
  publicJwk,
  rsaKeyPair,
  sign,
  validClaims,
} from "./proxy-helpers";

type Proxy = typeof import("../../functions/gh/[[path]]");
let proxy: Proxy;
let jwt: string;
let jwk: object;
let env: Record<string, string>;

beforeEach(async () => {
  vi.resetModules();
  proxy = await import("../../functions/gh/[[path]]");
  const access = await rsaKeyPair();
  const app = await rsaKeyPair();
  jwk = await publicJwk(access.publicKey, "kid-1");
  jwt = await sign(
    access.privateKey,
    { alg: "RS256", kid: "kid-1" },
    validClaims()
  );
  env = {
    GITHUB_APP_ID: "123456",
    GITHUB_APP_INSTALLATION_ID: "7890",
    GITHUB_APP_PRIVATE_KEY: await pkcs8Pem(app.privateKey),
    OWNER_EMAIL,
  };
});
afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

function stubGitHub(tokenResponse: Response) {
  vi.stubGlobal(
    "fetch",
    vi.fn(async (input: string | URL) => {
      const url = new URL(input);
      if (url.href === `${TEAM}/cdn-cgi/access/certs`)
        return new Response(JSON.stringify({ keys: [jwk] }));
      return tokenResponse;
    })
  );
}

const call = () =>
  proxy.onRequest({
    request: new Request(`${ORIGIN}/gh/api/v3/user`, {
      headers: {
        "Sec-Fetch-Site": "same-origin",
        "Cf-Access-Jwt-Assertion": jwt,
      },
    }),
    env,
  });

it("shows GitHub's status and message when the token mint is refused", async () => {
  vi.spyOn(console, "error").mockImplementation(() => {});
  stubGitHub(
    new Response(
      JSON.stringify({
        message:
          "The permissions requested are not granted to this installation.",
      }),
      { status: 422 }
    )
  );
  const res = await call();
  expect(res.status).toBe(502);
  expect(await res.text()).toContain(
    "GitHub answered 422: The permissions requested are not granted to this installation."
  );
});

it("names the private key when it cannot be imported, without echoing it", async () => {
  vi.spyOn(console, "error").mockImplementation(() => {});
  env.GITHUB_APP_PRIVATE_KEY =
    "-----BEGIN PRIVATE KEY-----\nAAAA\n-----END PRIVATE KEY-----";
  stubGitHub(new Response("{}", { status: 201 }));
  const res = await call();
  const text = await res.text();
  expect(res.status).toBe(502);
  expect(text).toContain("private key could not be used");
  expect(text).not.toContain("AAAA");
});
