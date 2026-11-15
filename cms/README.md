# Blog CMS

An owner-only web editor for the blog's posts, built on [Sveltia CMS](https://sveltiacms.app/). It is a static admin page (`public/admin/`) served by the Cloudflare Pages project `blog-cms` at `https://cms.blog.kulkarni.cloud/admin/`, behind Cloudflare Access. There is no build step. Cloudflare Access is the only login: one Pages Function, `functions/gh/[[path]].ts`, proxies Sveltia's GitHub calls with a GitHub App token that never leaves the server (see [How sign-in works](#how-sign-in-works)).

## Writing a post

1. Open `https://cms.blog.kulkarni.cloud/admin/`, pass Cloudflare Access, then click "Sign In with GitHub". A small window opens and closes by itself; there is no GitHub login and no token to paste. Allow popups for the host if the browser blocks it.
2. Create or edit a post under Posts and save. Sveltia commits it to its own branch `cms/posts/<slug>` and opens a pull request against `main`; commits and pull requests show the App bot (`<app name>[bot]`) as author. Nothing reaches `main` until that pull request is merged.
3. Check the blog's Cloudflare Pages preview for the branch (alias `cms-posts-<slug>.blog-7qk.pages.dev`) and the CI checks on the pull request.
4. **Merge or close the pull request on GitHub.** Never use Sveltia's **Publish** or **Discard** (the proxy refuses both with 403): Publish merges and then deletes the branch, Discard closes the pull request and deletes the unmerged branch. Log every merged or closed branch in `.trash/MOVED.md` (name, PR number, head SHA) as restorable from its PR.

Field notes:

- `pubDatetime` and `modDatetime` are dates only (`2026-11-15`), written unquoted. Existing posts keep their full timestamps unless you edit the field.
- `draft` defaults to `false`; the branch is the draft.
- `ogImage`, `canonicalURL`, `hideEditPost`, `hideToc` and `timezone` are not in the form; add them by hand if needed.
- Images: upload by hand to `public/assets/YYYYMMDD/` and link `/assets/YYYYMMDD/<file>`.
- The body editor opens in raw Markdown. Keep it there for tables, `file="..."` code labels and `> [!NOTE]` callouts.

## How sign-in works

- Cloudflare Access (one-time PIN for the owner's email) gates the whole host, including `*.pages.dev`.
- "Sign In with GitHub" opens `public/auth.html` (config `base_url` + `auth_endpoint: auth`). It answers Sveltia's popup handshake with the placeholder token `cf-access`, so browser storage never holds a GitHub credential.
- Sveltia sends every GitHub call to `/gh/api/v3/*` and `/gh/api/graphql` (config `api_root`). `functions/gh/[[path]].ts`:
  - accepts only same-origin requests (`Sec-Fetch-Site`, else `Origin`);
  - verifies the Access JWT (`Cf-Access-Jwt-Assertion` header, else `CF_Authorization` cookie): RS256 only, key by `kid` from the team certs (5 min cache, refetch on an unknown `kid`), `aud`, `iss`, `exp`, `nbf` and `email` equal to `OWNER_EMAIL`;
  - forwards only `/user`, `/repos/comdotlinux/blog/**` and `/graphql` to `api.github.com` with a GitHub App installation token (minted per hour, held in memory); it never forwards cookies, `Cf-*` headers or the incoming `Authorization`, and answers with `Cache-Control: no-store`;
  - allows only the writes Sveltia's editorial workflow makes: no `DELETE`, no PR merge, ref updates and GraphQL commits only on `cms/` branches, GraphQL mutations limited to `createCommitOnBranch`, `createRef`, `convertPullRequestToDraft`, `markPullRequestReadyForReview` and `disablePullRequestAutoMerge`;
  - serves `GET /user` from the public `comdotlinux` profile and adds `permissions.push` to the repository response, because GitHub answers installation tokens without either.
- Missing or invalid settings return 503 "CMS GitHub App not configured"; nothing reaches GitHub.
- Sveltia's "View on GitHub" links point at `/gh/comdotlinux/blog/...`; the function redirects exactly that prefix to `github.com` (no token involved).
- Sveltia's **Publish** tries auto-merge (`enablePullRequestAutoMerge`) and then a REST merge; the proxy refuses both with 403, so Publish shows an error and nothing is merged. Merge on GitHub instead.
- The Access session lasts 24 hours. When it ends, calls start failing with 401: reload `/admin/` to pass Access again.

## One-time setup (owner)

Until these steps are done the editor shows "Signing in" errors; the proxy fails closed.

1. **Create the GitHub App.** github.com, avatar, Settings, Developer settings, GitHub Apps, New GitHub App.
   - Name: for example `comdotlinux-blog-cms`. Homepage URL: `https://cms.blog.kulkarni.cloud/admin/`.
   - Callback URL: empty. Uncheck "Expire user authorization tokens" and "Request user authorization (OAuth) during installation".
   - Webhook: uncheck "Active".
   - Repository permissions: Contents "Read and write", Pull requests "Read and write", Metadata "Read-only" (automatic). Nothing else.
   - "Where can this GitHub App be installed?": "Only on this account". Create.
2. **Note the App ID** at the top of the app page (or the Client ID; both work).
3. **Generate a private key**: "Private keys", "Generate a private key". The browser downloads `<app>.<date>.private-key.pem` (PKCS#1).
4. **Install the App**: "Install App", `comdotlinux`, "Only select repositories", `blog`, Install. The page URL ends in `/settings/installations/<number>`: that number is the installation ID.
5. **Convert the key to PKCS#8** (WebCrypto cannot read PKCS#1), locally:

   ```sh
   openssl pkcs8 -topk8 -nocrypt -in ~/Downloads/<app>.*.private-key.pem -out ~/blog-cms-app.pk8.pem
   ```

   The result starts with `-----BEGIN PRIVATE KEY-----`. A key that starts with `-----BEGIN RSA PRIVATE KEY-----` is refused (503).

6. **Add the variables** in the Cloudflare dashboard: Workers & Pages, `blog-cms`, Settings, Variables and Secrets, **Production** only:

   | Name                         | Type       | Value                                     |
   | ---------------------------- | ---------- | ----------------------------------------- |
   | `GITHUB_APP_ID`              | Text       | App ID (or Client ID) from step 2         |
   | `GITHUB_APP_INSTALLATION_ID` | Text       | Installation ID from step 4               |
   | `GITHUB_APP_PRIVATE_KEY`     | **Secret** | Full contents of `~/blog-cms-app.pk8.pem` |
   | `OWNER_EMAIL`                | **Secret** | The email address in the Access policy    |

   Do not add them to Preview: the config points at the production host, so previews never need them, and every pushed branch would otherwise run with the key.

7. **Redeploy** production (variables apply to new deployments): Deployments, latest production deployment, "Retry deployment", or merge the next change.
8. **Check** (keep the `.pem` files until this passes; a failed check may need the key again):
   - Open `/admin/`, "Sign In with GitHub": the post list loads.
   - Save a test post: branch `cms/posts/<slug>` and a pull request by the App bot appear.
   - Open the Sveltia workflow view for that post (it lists the pull request and its checks). If it shows an error about checks or statuses, add the repository permissions "Checks: Read-only" and "Commit statuses: Read-only" to the App and accept the new permissions on the installation; nothing in the proxy needs to change.
   - Close the test pull request on GitHub.
   - In DevTools, Application, Local Storage holds `cf-access` and no `ghs_` value.
9. **Move both `.pem` files** into encrypted storage of your choice.

If the key may be exposed: in the App settings revoke the key (and suspend the installation if needed), generate a new one and replace `GITHUB_APP_PRIVATE_KEY`. Rotate the key yearly.

## Local development

Everything runs from this directory with the versions in the repository's `mise.toml`.

```sh
bun install --frozen-lockfile
bun run format:check
bun run test:unit          # config.yml against the blog schema, golden outputs, admin page pins, auth page, /gh/ proxy
bun run test:integration   # serves public/ with python3 http.server, checks /admin/ and /admin/config.yml
bun run test:e2e           # loads the admin page in Chromium and runs the sign-in handshake against a stubbed /gh/; needs network for the Sveltia CDN
bun run test:compat        # builds the blog with test/fixtures and greps the rendered HTML
```

The local server listens on port 8787; set `CMS_PORT` to use another port. `test:compat` needs the blog's dependencies installed at the repository root; it moves the posts it added to `../.trash/<timestamp>-cms-compat/` afterwards.

To try the editor against your working copy, serve `public/` (`bun run serve`), open `http://127.0.0.1:8787/admin/` in a Chromium-based browser and choose "Work with Local Repository" with the repository root.

## Upgrading Sveltia

`public/admin/index.html` pins an exact version from unpkg with a `sha384` integrity hash. To upgrade, change the version and replace the hash with the output of:

```sh
curl -sL https://unpkg.com/@sveltia/cms@<version>/dist/sveltia-cms.js | openssl dgst -sha384 -binary | base64
```

Then run all tests above. `test/e2e/auth.spec.ts` must pass: Sveltia upgrades can change the popup handshake, the `/user` call or how `api_root` maps to `/api/v3` and `/api/graphql`.
