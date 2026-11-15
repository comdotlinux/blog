# Blog CMS

An owner-only web editor for the blog's posts, built on [Sveltia CMS](https://sveltiacms.app/). It is a static admin page (`public/admin/`) served by the Cloudflare Pages project `blog-cms` at `https://cms.blog.kulkarni.cloud/admin/`, behind Cloudflare Access. There is no build step and no server code; Sveltia talks to GitHub from the browser with a fine-grained personal access token.

## Writing a post

1. Open `https://cms.blog.kulkarni.cloud/admin/`, pass Cloudflare Access, then "Sign In Using Access Token" with your PAT (Contents read and write, Metadata read, this repository only).
2. Create or edit a post under Posts and save. Sveltia commits it to its own branch `cms/posts/<slug>` and opens a pull request against `main`. Nothing reaches `main` until that pull request is merged.
3. Check the blog's Cloudflare Pages preview for the branch (alias `cms-posts-<slug>.blog-7qk.pages.dev`) and the CI checks on the pull request.
4. **Merge or close the pull request on GitHub.** Never use Sveltia's **Publish** or **Discard**: Publish merges and then deletes the branch, Discard closes the pull request and deletes the unmerged branch. Log every merged or closed branch in `.trash/MOVED.md` (name, PR number, head SHA) as restorable from its PR.

Field notes:

- `pubDatetime` and `modDatetime` are dates only (`2026-11-15`), written unquoted. Existing posts keep their full timestamps unless you edit the field.
- `draft` defaults to `false`; the branch is the draft.
- `ogImage`, `canonicalURL`, `hideEditPost`, `hideToc` and `timezone` are not in the form; add them by hand if needed.
- Images: upload by hand to `public/assets/YYYYMMDD/` and link `/assets/YYYYMMDD/<file>`.
- The body editor opens in raw Markdown. Keep it there for tables, `file="..."` code labels and `> [!NOTE]` callouts.

## Local development

Everything runs from this directory with the versions in the repository's `mise.toml`.

```sh
bun install --frozen-lockfile
bun run format:check
bun run test:unit          # config.yml against the blog schema, golden outputs, admin page pins
bun run test:integration   # serves public/ with python3 http.server, checks /admin/ and /admin/config.yml
bun run test:e2e           # loads the admin page in Chromium; needs network for the Sveltia CDN
bun run test:compat        # builds the blog with test/fixtures and greps the rendered HTML
```

The local server listens on port 8787; set `CMS_PORT` to use another port. `test:compat` needs the blog's dependencies installed at the repository root; it moves the posts it added to `../.trash/<timestamp>-cms-compat/` afterwards.

To try the editor against your working copy, serve `public/` (`bun run serve`), open `http://127.0.0.1:8787/admin/` in a Chromium-based browser and choose "Work with Local Repository" with the repository root.

## Upgrading Sveltia

`public/admin/index.html` pins an exact version from unpkg with a `sha384` integrity hash. To upgrade, change the version and replace the hash with the output of:

```sh
curl -sL https://unpkg.com/@sveltia/cms@<version>/dist/sveltia-cms.js | openssl dgst -sha384 -binary | base64
```

Then run all tests above.
