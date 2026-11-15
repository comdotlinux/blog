import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  ORIGIN,
  OWNER_EMAIL,
  fakeFetch,
  now,
  pkcs8Pem,
  publicJwk,
  rsaKeyPair,
  sign,
  validClaims,
} from "./proxy-helpers";

type Proxy = typeof import("../../functions/gh/[[path]]");
let proxy: Proxy;
let access: CryptoKeyPair;
let app: CryptoKeyPair;
let jwk: object;
let jwt: string;
let env: Record<string, string>;

beforeEach(async () => {
  vi.resetModules();
  proxy = await import("../../functions/gh/[[path]]");
  access = await rsaKeyPair();
  app = await rsaKeyPair();
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

const call = (
  path: string,
  init: RequestInit & { headers?: Record<string, string> } = {}
) =>
  proxy.onRequest({
    request: new Request(`${ORIGIN}${path}`, {
      ...init,
      headers: {
        "Sec-Fetch-Site": "same-origin",
        "Cf-Access-Jwt-Assertion": jwt,
        ...init.headers,
      },
    }),
    env,
  });

const githubCalls = (calls: { url: string }[]) =>
  calls.filter(
    c =>
      c.url.startsWith("https://api.github.com/") &&
      !c.url.includes("/access_tokens")
  );

describe("configuration", () => {
  it.each([
    "GITHUB_APP_ID",
    "GITHUB_APP_INSTALLATION_ID",
    "GITHUB_APP_PRIVATE_KEY",
    "OWNER_EMAIL",
  ])("returns 503 without %s and calls nothing", async name => {
    const { fn } = fakeFetch({ keys: [jwk] });
    vi.spyOn(console, "error").mockImplementation(() => {});
    delete env[name];
    const res = await call("/gh/api/v3/user");
    expect(res.status).toBe(503);
    expect(await res.json()).toEqual({
      message: "CMS GitHub App not configured",
    });
    expect(fn).not.toHaveBeenCalled();
  });

  it("refuses a PKCS#1 key (must be converted to PKCS#8)", async () => {
    fakeFetch({ keys: [jwk] });
    vi.spyOn(console, "error").mockImplementation(() => {});
    env.GITHUB_APP_PRIVATE_KEY =
      "-----BEGIN RSA PRIVATE KEY-----\nAAAA\n-----END RSA PRIVATE KEY-----";
    expect((await call("/gh/api/v3/user")).status).toBe(503);
  });

  it("refuses a non-numeric installation id", async () => {
    fakeFetch({ keys: [jwk] });
    vi.spyOn(console, "error").mockImplementation(() => {});
    env.GITHUB_APP_INSTALLATION_ID = "1/../../user";
    expect((await call("/gh/api/v3/user")).status).toBe(503);
  });
});

describe("request guards", () => {
  it("returns 401 without an Access token", async () => {
    fakeFetch({ keys: [jwk] });
    const res = await call("/gh/api/v3/user", {
      headers: { "Cf-Access-Jwt-Assertion": "" },
    });
    expect(res.status).toBe(401);
    expect(await res.json()).toEqual({ message: "Access required" });
    expect(res.headers.get("Cache-Control")).toBe("no-store");
  });

  it.each(["cross-site", "same-site", "none"])(
    "returns 403 for Sec-Fetch-Site %s",
    async site => {
      const { calls } = fakeFetch({ keys: [jwk] });
      const res = await call("/gh/api/v3/user", {
        headers: { "Sec-Fetch-Site": site },
      });
      expect(res.status).toBe(403);
      expect(githubCalls(calls)).toEqual([]);
    }
  );

  it("falls back to the Origin header when Sec-Fetch-Site is absent", async () => {
    fakeFetch({ keys: [jwk] });
    const request = (origin?: string) =>
      new Request(`${ORIGIN}/gh/api/v3/user`, {
        headers: {
          "Cf-Access-Jwt-Assertion": jwt,
          ...(origin ? { Origin: origin } : {}),
        },
      });
    expect(
      (await proxy.onRequest({ request: request(ORIGIN), env })).status
    ).toBe(200);
    expect(
      (await proxy.onRequest({ request: request("https://evil.example"), env }))
        .status
    ).toBe(403);
    expect((await proxy.onRequest({ request: request(), env })).status).toBe(
      403
    );
  });
});

describe("githubPath", () => {
  it.each([
    ["/gh/api/v3/user", "/user"],
    ["/gh/api/v3/repos/comdotlinux/blog", "/repos/comdotlinux/blog"],
    [
      "/gh/api/v3/repos/comdotlinux/blog/git/trees/main%3Asrc/content/posts",
      "/repos/comdotlinux/blog/git/trees/main:src/content/posts",
    ],
    ["/gh/api/graphql", "/graphql"],
  ])("allows %s", (pathname, path) => {
    expect(proxy.githubPath(pathname)?.path).toBe(path);
  });

  it.each([
    "/gh/api/v3/users/comdotlinux",
    "/gh/api/v3/user/repos",
    "/gh/api/v3/user/repository_invitations",
    "/gh/api/v3/repos/comdotlinux/other",
    "/gh/api/v3/repos/comdotlinux/blogger",
    "/gh/api/v3/repos/comdotlinux/blog-other",
    "/gh/api/v3/repos/comdotlinux/blog/contents/%2e",
    "/gh/api/v3/repos/comdotlinux/blog/contents/a%2Emd",
    "/gh/api/v3/repos/comdotlinux/blog/contents/a%5Cb",
    "/gh/api/v3/repos/comdotlinux/blog/../other",
    "/gh/api/v3/repos/comdotlinux/blog/%2e%2e/%2e%2e/other",
    "/gh/api/v3/repos/comdotlinux/blog/.",
    "/gh/api/v3/repos/comdotlinux%2Fblog",
    "/gh/api/v3/repos/comdotlinux/blog/contents/a%2fb",
    "/gh/api/v3/repos/comdotlinux/blog/contents/a%5cb",
    "/gh/api/v3/repos/comdotlinux/blog/contents/%252e%252e",
    "/gh/api/v3/repos/comdotlinux/blog/contents/%E0%A4%A",
    "/gh/api/v3/repos/comdotlinux/blog/contents/a%00",
    "/gh/api/v3/repos/comdotlinux/blog//x",
    "/gh/api/v3//evil.example/repos/comdotlinux/blog",
    "/gh/api/v3/https://evil.example/",
    "/gh/api/v3",
    "/gh/api/v4/user",
    "/gh/api/graphql/x",
    "/admin/",
  ])("rejects %s", pathname => {
    expect(proxy.githubPath(pathname)).toBeNull();
  });

  it("answers 404 for a path outside the allow-list", async () => {
    const { calls } = fakeFetch({ keys: [jwk] });
    const res = await call("/gh/api/v3/repos/comdotlinux/other");
    expect(res.status).toBe(404);
    expect(githubCalls(calls)).toEqual([]);
  });

  it("never lets an absolute URL change the upstream host", async () => {
    const { calls } = fakeFetch({ keys: [jwk] });
    for (const path of [
      "/gh/api/v3//evil.example/x",
      "/gh/api/v3/%2F%2Fevil.example/x",
      "/gh/api/v3/@evil.example/x",
    ]) {
      expect((await call(path)).status).toBe(404);
    }
    expect(calls.every(c => !c.url.includes("evil.example"))).toBe(true);
  });
});

describe("write rules", () => {
  it.each([
    ["POST", "/repos/comdotlinux/blog/pulls"],
    ["PATCH", "/repos/comdotlinux/blog/pulls/12"],
    ["PATCH", "/repos/comdotlinux/blog/issues/12"],
    ["POST", "/repos/comdotlinux/blog/issues/12/labels"],
    ["POST", "/repos/comdotlinux/blog/pulls/12/reviews"],
    ["PUT", "/repos/comdotlinux/blog/pulls/12/reviews/3/dismissals"],
    ["PATCH", "/repos/comdotlinux/blog/git/refs/heads/cms/posts/hello"],
  ])("allows %s %s", (method, path) => {
    expect(proxy.writeAllowed(method, path)).toBe(true);
  });

  it.each([
    ["DELETE", "/repos/comdotlinux/blog/git/refs/heads/cms/posts/hello"],
    ["DELETE", "/repos/comdotlinux/blog/pulls/12"],
    ["PUT", "/repos/comdotlinux/blog/pulls/12/merge"],
    ["POST", "/repos/comdotlinux/blog/merges"],
    ["POST", "/repos/comdotlinux/blog/merge-upstream"],
    ["PATCH", "/repos/comdotlinux/blog/git/refs/heads/main"],
    ["POST", "/repos/comdotlinux/blog/git/refs"],
    ["PUT", "/repos/comdotlinux/blog/contents/src/content/posts/a.md"],
    ["POST", "/repos/comdotlinux/blog/dispatches"],
    ["POST", "/repos/comdotlinux/blog/forks"],
    ["PATCH", "/repos/comdotlinux/blog"],
    ["PUT", "/repos/comdotlinux/blog/pulls/12/update-branch"],
    ["POST", "/repos/comdotlinux/blog/git/refs/heads/cms/posts/a"],
    ["PATCH", "/repos/comdotlinux/blog/git/refs/heads/cmsx/a"],
    ["PATCH", "/repos/comdotlinux/blog/git/refs/tags/cms/a"],
  ])("blocks %s %s", (method, path) => {
    expect(proxy.writeAllowed(method, path)).toBe(false);
  });

  it.each([
    ["DELETE", "/gh/api/v3/repos/comdotlinux/blog/git/refs/heads/cms/posts/a"],
    ["PUT", "/gh/api/v3/repos/comdotlinux/blog/pulls/12/merge"],
    ["PATCH", "/gh/api/v3/repos/comdotlinux/blog/git/refs/heads/main"],
    ["POST", "/gh/api/v3/user"],
  ])("answers 403 to %s %s without calling GitHub", async (method, path) => {
    const { calls } = fakeFetch({ keys: [jwk] });
    const res = await call(path, { method, body: "{}" });
    expect(res.status).toBe(403);
    expect(githubCalls(calls)).toEqual([]);
  });
});

describe("graphqlAllowed", () => {
  const commit = (branchName: string) => ({
    query: `
      mutation($input: CreateCommitOnBranchInput!) {
        createCommitOnBranch(input: $input) {
          commit { oid file_0: file(path: "src/content/posts/a.md") { oid } }
        }
      }`,
    variables: {
      input: {
        branch: { repositoryNameWithOwner: "comdotlinux/blog", branchName },
        fileChanges: { additions: [], deletions: [] },
      },
    },
  });

  it("allows read queries", () => {
    expect(
      proxy.graphqlAllowed({
        query:
          'query($owner: String!) { repository(owner: $owner, name: "blog") { defaultBranchRef { name } } }',
        variables: { owner: "comdotlinux" },
      })
    ).toBe(true);
    expect(proxy.graphqlAllowed({ query: "{ viewer { login } }" })).toBe(true);
  });

  it("allows a commit on a cms/ branch", () => {
    expect(proxy.graphqlAllowed(commit("cms/posts/hello"))).toBe(true);
  });

  it.each(["main", "cmsx/posts/a", "", "refs/heads/cms/posts/a"])(
    "refuses a commit on branch %j",
    branch => {
      expect(proxy.graphqlAllowed(commit(branch))).toBe(false);
    }
  );

  it("allows createRef only for refs/heads/cms/", () => {
    const createRef = (name: string) => ({
      query:
        "mutation($input: CreateRefInput!) { createRef(input: $input) { ref { name } } }",
      variables: { input: { repositoryId: "R_1", name, oid: "abc" } },
    });
    expect(proxy.graphqlAllowed(createRef("refs/heads/cms/posts/a"))).toBe(
      true
    );
    expect(proxy.graphqlAllowed(createRef("refs/heads/main"))).toBe(false);
    expect(proxy.graphqlAllowed(createRef("refs/tags/cms/x"))).toBe(false);
  });

  it.each([
    "convertPullRequestToDraft",
    "markPullRequestReadyForReview",
    "disablePullRequestAutoMerge",
  ])("allows %s", name => {
    expect(
      proxy.graphqlAllowed({
        query: `mutation($input: X!) { ${name}(input: $input) { clientMutationId } }`,
        variables: { input: { pullRequestId: "PR_1" } },
      })
    ).toBe(true);
  });

  it.each([
    [
      "deleteRef",
      "mutation($input: DeleteRefInput!) { deleteRef(input: $input) { clientMutationId } }",
    ],
    [
      "mergePullRequest",
      "mutation($input: MergePullRequestInput!) { mergePullRequest(input: $input) { clientMutationId } }",
    ],
    [
      "updateRef",
      "mutation($input: UpdateRefInput!) { updateRef(input: $input) { clientMutationId } }",
    ],
    [
      "updateRefs",
      "mutation($input: UpdateRefsInput!) { updateRefs(input: $input) { clientMutationId } }",
    ],
    [
      "enablePullRequestAutoMerge",
      "mutation($input: X!) { enablePullRequestAutoMerge(input: $input) { clientMutationId } }",
    ],
    [
      "mergeBranch",
      "mutation($input: X!) { mergeBranch(input: $input) { clientMutationId } }",
    ],
    [
      "alias hiding deleteRef",
      "mutation($input: X!) { createRef: deleteRef(input: $input) { clientMutationId } }",
    ],
    [
      "second root field",
      "mutation($input: X!) { createRef(input: $input) { ref { name } } deleteRef(input: $input) { clientMutationId } }",
    ],
    [
      "second operation",
      "query Q { viewer { login } } mutation M($input: X!) { deleteRef(input: $input) { clientMutationId } }",
    ],
    [
      "fragment spread at root",
      "mutation($input: X!) { ...F } fragment F on Mutation { deleteRef(input: $input) { clientMutationId } }",
    ],
    [
      "inline fragment at root",
      "mutation($input: X!) { ... on Mutation { deleteRef(input: $input) { clientMutationId } } }",
    ],
    [
      "directive at root",
      "mutation($input: X!) { createRef(input: $input) @include(if: true) { ref { name } } }",
    ],
    [
      "inline arguments",
      'mutation { createRef(input: {repositoryId: "R", name: "refs/heads/main", oid: "a"}) { ref { name } } }',
    ],
    ["subscription", "subscription { x }"],
    [
      "comment trick",
      "mutation($input: X!) { # createRef(input: $input)\n deleteRef(input: $input) { clientMutationId } }",
    ],
    [
      "string trick",
      'mutation($input: X!) { deleteRef(input: $input) { clientMutationId } } query { a(b: "}") }',
    ],
    [
      "unbalanced",
      "mutation($input: X!) { createRef(input: $input) { ref { name } }",
    ],
    ["garbage", "mutation ` {"],
  ])("refuses %s", (_, query) => {
    expect(
      proxy.graphqlAllowed({
        query,
        variables: { input: { name: "refs/heads/cms/a" } },
      })
    ).toBe(false);
  });

  it.each([null, "x", [], { query: 1 }, [{ query: "{ viewer { login } }" }]])(
    "refuses body %j",
    body => {
      expect(proxy.graphqlAllowed(body)).toBe(false);
    }
  );

  it("forwards the checked query and refuses a GET", async () => {
    const { calls } = fakeFetch({ keys: [jwk] });
    const body = commit("cms/posts/hello");
    const res = await call("/gh/api/graphql", {
      method: "POST",
      body: JSON.stringify(body),
      headers: { "Content-Type": "application/json" },
    });
    expect(res.status).toBe(200);
    const [forwarded] = githubCalls(calls);
    expect(forwarded.url).toBe("https://api.github.com/graphql");
    expect(JSON.parse(forwarded.init.body as string)).toEqual(body);
    expect((await call("/gh/api/graphql")).status).toBe(405);
  });

  it("answers 403 to a deleteRef mutation without calling GitHub", async () => {
    const { calls } = fakeFetch({ keys: [jwk] });
    const res = await call("/gh/api/graphql", {
      method: "POST",
      body: JSON.stringify({
        query:
          "mutation($input: DeleteRefInput!) { deleteRef(input: $input) { clientMutationId } }",
        variables: { input: { refId: "REF_1" } },
      }),
    });
    expect(res.status).toBe(403);
    expect(githubCalls(calls)).toEqual([]);
  });

  it("answers 400 to a body that is not JSON", async () => {
    fakeFetch({ keys: [jwk] });
    const res = await call("/gh/api/graphql", { method: "POST", body: "{" });
    expect(res.status).toBe(400);
  });
});

describe("forwarding", () => {
  it("replaces Authorization and never forwards Cookie or Cf-* headers", async () => {
    const { calls } = fakeFetch({ keys: [jwk] });
    await call("/gh/api/v3/repos/comdotlinux/blog/branches/main?per_page=1", {
      headers: {
        Authorization: "token cf-access",
        Cookie: "CF_Authorization=abc; other=1",
        "Cf-Connecting-Ip": "203.0.113.1",
        "Cf-Ray": "abc",
        "If-None-Match": '"etag"',
        Accept: "application/vnd.github.raw",
      },
    });
    const [forwarded] = githubCalls(calls);
    expect(forwarded.url).toBe(
      "https://api.github.com/repos/comdotlinux/blog/branches/main?per_page=1"
    );
    const headers = Object.fromEntries(
      Object.entries(forwarded.init.headers).map(([k, v]) => [
        k.toLowerCase(),
        v,
      ])
    );
    expect(headers.authorization).toBe("Bearer ghs_test_token");
    expect(headers.accept).toBe("application/vnd.github.raw");
    expect(headers["if-none-match"]).toBe('"etag"');
    expect(headers["x-github-api-version"]).toBe("2022-11-28");
    expect(Object.keys(headers).sort()).toEqual([
      "accept",
      "authorization",
      "if-none-match",
      "user-agent",
      "x-github-api-version",
    ]);
  });

  it("forwards an allowed write with its body", async () => {
    const { calls } = fakeFetch({ keys: [jwk] });
    const res = await call("/gh/api/v3/repos/comdotlinux/blog/pulls", {
      method: "POST",
      body: JSON.stringify({ title: "t", head: "cms/posts/a", base: "main" }),
      headers: { "Content-Type": "application/json" },
    });
    expect(res.status).toBe(200);
    const [forwarded] = githubCalls(calls);
    expect(forwarded.init.method).toBe("POST");
    expect(
      JSON.parse(new TextDecoder().decode(forwarded.init.body as ArrayBuffer))
    ).toEqual({ title: "t", head: "cms/posts/a", base: "main" });
  });

  it("passes status, body and selected headers back with no-store", async () => {
    fakeFetch({
      keys: [jwk],
      github: () =>
        new Response('{"message":"Not Found"}', {
          status: 404,
          headers: {
            "Content-Type": "application/json",
            ETag: '"e"',
            "Set-Cookie": "x=1",
            "X-RateLimit-Remaining": "4999",
          },
        }),
    });
    const res = await call("/gh/api/v3/repos/comdotlinux/blog/contents/x");
    expect(res.status).toBe(404);
    expect(await res.text()).toBe('{"message":"Not Found"}');
    expect(res.headers.get("Cache-Control")).toBe("no-store");
    expect(res.headers.get("ETag")).toBe('"e"');
    expect(res.headers.get("X-RateLimit-Remaining")).toBe("4999");
    expect(res.headers.get("Set-Cookie")).toBeNull();
  });
});

describe("upstream request", () => {
  it("forwards the query string verbatim", async () => {
    const { calls } = fakeFetch({ keys: [jwk] });
    await call(
      "/gh/api/v3/repos/comdotlinux/blog/git/trees/main%3Asrc/content/posts?recursive=1&per_page=100"
    );
    expect(githubCalls(calls).map(c => c.url)).toEqual([
      "https://api.github.com/repos/comdotlinux/blog/git/trees/main%3Asrc/content/posts?recursive=1&per_page=100",
    ]);
  });

  it("sends User-Agent and the API version on every upstream request", async () => {
    const { calls } = fakeFetch({ keys: [jwk] });
    await call("/gh/api/v3/user");
    await call("/gh/api/v3/repos/comdotlinux/blog/pulls", {
      method: "POST",
      body: "{}",
    });
    await call("/gh/api/graphql", {
      method: "POST",
      body: JSON.stringify({ query: "{ viewer { login } }" }),
    });
    const upstream = calls.filter(c =>
      c.url.startsWith("https://api.github.com/")
    );
    expect(upstream.length).toBe(4); // one token mint plus three calls
    for (const c of upstream) {
      expect(c.init.headers["User-Agent"]).toBe("blog-cms");
      expect(c.init.headers["X-GitHub-Api-Version"]).toBe("2022-11-28");
    }
  });

  it("does not pass Link headers through (GitHub page links would 404)", async () => {
    fakeFetch({
      keys: [jwk],
      github: () =>
        new Response("[]", {
          headers: {
            Link: '<https://api.github.com/repositories/1/pulls?page=2>; rel="next"',
          },
        }),
    });
    const res = await call("/gh/api/v3/repos/comdotlinux/blog/pulls");
    expect(res.headers.get("Link")).toBeNull();
  });
});

describe("View on GitHub links", () => {
  it.each([
    ["/gh/comdotlinux/blog", "https://github.com/comdotlinux/blog"],
    [
      "/gh/comdotlinux/blog/blob/main/src/content/posts/a.md?plain=1",
      "https://github.com/comdotlinux/blog/blob/main/src/content/posts/a.md?plain=1",
    ],
  ])("redirects %s without a token or GitHub call", async (path, location) => {
    const { fn } = fakeFetch({ keys: [jwk] });
    const res = await proxy.onRequest({
      request: new Request(`${ORIGIN}${path}`),
      env: {},
    });
    expect(res.status).toBe(302);
    expect(res.headers.get("Location")).toBe(location);
    expect(fn).not.toHaveBeenCalled();
  });

  it.each(["/gh/comdotlinux/blog-other", "/gh/other/blog"])(
    "does not redirect %s",
    async path => {
      fakeFetch({ keys: [jwk] });
      const res = await call(path);
      expect(res.status).toBe(404);
    }
  );
});

describe("shims", () => {
  it("serves /user from the public owner profile", async () => {
    const { calls } = fakeFetch({
      keys: [jwk],
      github: url =>
        new Response(
          JSON.stringify({ login: "comdotlinux", path: url.pathname })
        ),
    });
    const res = await call("/gh/api/v3/user");
    expect(await res.json()).toEqual({
      login: "comdotlinux",
      path: "/users/comdotlinux",
    });
    expect(githubCalls(calls).map(c => c.url)).toEqual([
      "https://api.github.com/users/comdotlinux",
    ]);
  });

  it("adds push permission to the repository response", async () => {
    fakeFetch({
      keys: [jwk],
      github: () =>
        new Response(JSON.stringify({ full_name: "comdotlinux/blog" }), {
          headers: { "Content-Type": "application/json", ETag: '"e"' },
        }),
    });
    const res = await call("/gh/api/v3/repos/comdotlinux/blog");
    const body = await res.json();
    expect(body.full_name).toBe("comdotlinux/blog");
    expect(body.permissions).toMatchObject({ push: true, admin: false });
    expect(res.headers.get("ETag")).toBeNull();
    expect(res.headers.get("Cache-Control")).toBe("no-store");
  });
});

describe("installation token", () => {
  it("signs an App JWT GitHub accepts (RS256, iss, iat, exp)", async () => {
    const t = now();
    const token = await proxy.appJwt("123456", env.GITHUB_APP_PRIVATE_KEY, t);
    const [h, p, s] = token.split(".");
    const decode = (x: string) =>
      JSON.parse(Buffer.from(x, "base64url").toString());
    expect(decode(h)).toEqual({ alg: "RS256", typ: "JWT" });
    expect(decode(p)).toEqual({ iat: t - 60, exp: t + 540, iss: 123456 });
    expect(
      await crypto.subtle.verify(
        "RSASSA-PKCS1-v1_5",
        app.publicKey,
        Buffer.from(s, "base64url"),
        new TextEncoder().encode(`${h}.${p}`)
      )
    ).toBe(true);
  });

  it("requests a token scoped to the blog repo and caches it", async () => {
    const { calls } = fakeFetch({ keys: [jwk] });
    await call("/gh/api/v3/repos/comdotlinux/blog/pulls");
    await call("/gh/api/v3/repos/comdotlinux/blog/pulls");
    const mints = calls.filter(c => c.url.includes("/access_tokens"));
    expect(mints).toHaveLength(1);
    expect(mints[0].url).toBe(
      "https://api.github.com/app/installations/7890/access_tokens"
    );
    expect(JSON.parse(mints[0].init.body as string)).toEqual({
      repositories: ["blog"],
      permissions: {
        contents: "write",
        pull_requests: "write",
        metadata: "read",
      },
    });
    expect(mints[0].init.headers.Authorization).toMatch(/^Bearer ey/);
  });

  it("re-mints when the cached token has under 5 minutes left", async () => {
    const { calls } = fakeFetch({ keys: [jwk] });
    await call("/gh/api/v3/repos/comdotlinux/blog/pulls");
    vi.spyOn(Date, "now").mockReturnValue(Date.now() + 56 * 60_000);
    // A fresh Access JWT for the shifted clock.
    jwt = await sign(
      access.privateKey,
      { alg: "RS256", kid: "kid-1" },
      validClaims({ nbf: now(), exp: now() + 3600 })
    );
    await call("/gh/api/v3/repos/comdotlinux/blog/pulls");
    expect(calls.filter(c => c.url.includes("/access_tokens"))).toHaveLength(2);
  });

  it("answers 502 when GitHub refuses the token, and logs no secret", async () => {
    fakeFetch({ keys: [jwk], tokenStatus: 401 });
    const errors = vi.spyOn(console, "error").mockImplementation(() => {});
    const res = await call("/gh/api/v3/repos/comdotlinux/blog/pulls");
    expect(res.status).toBe(502);
    expect(errors).toHaveBeenCalled();
  });
});

describe("logging", () => {
  it("never logs the token, the key or the JWT", async () => {
    const logged: unknown[] = [];
    for (const level of ["error", "warn", "log", "info", "debug"] as const)
      vi.spyOn(console, level).mockImplementation((...args) => {
        logged.push(...args);
      });
    fakeFetch({ keys: [jwk], tokenStatus: 500 });
    await call("/gh/api/v3/repos/comdotlinux/blog/pulls");
    fakeFetch({
      keys: [jwk],
      github: () => {
        throw new Error("network");
      },
    });
    await call("/gh/api/v3/repos/comdotlinux/blog/pulls");
    delete env.OWNER_EMAIL;
    await call("/gh/api/v3/user");

    const text = logged.map(String).join("\n");
    expect(logged.length).toBeGreaterThan(0);
    expect(text).not.toContain("ghs_test_token");
    expect(text).not.toContain(jwt);
    expect(text).not.toContain("PRIVATE KEY");
    expect(text).not.toContain(env.GITHUB_APP_PRIVATE_KEY.slice(40, 80));
  });
});
