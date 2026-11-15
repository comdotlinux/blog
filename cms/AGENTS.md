<!-- Parent: ../AGENTS.md -->

# cms

## Purpose

Owner-only post editor: Sveltia CMS as a static admin page, deployed by the Cloudflare Pages project `blog-cms` (root directory `cms`, no build command, output `public`) to `cms.blog.kulkarni.cloud`, behind Cloudflare Access. Own `package.json` and `bun.lock` (test tooling only, no workspaces) and own CI (`.github/workflows/cms.yml`). The blog never builds or lints this directory (`tsconfig.json` exclude, `eslint.config.js` ignore).

## Key Files

| File                       | Description                                                                                                                                                                                                                                                                                                      |
| -------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `public/admin/index.html`  | Loads `@sveltia/cms` at an exact version from unpkg with `integrity` (sha384) and `crossorigin`; `noindex`                                                                                                                                                                                                       |
| `public/admin/config.yml`  | GitHub backend `comdotlinux/blog`, branch `main`, `publish_mode: editorial_workflow` (branch `cms/posts/<slug>` plus a PR per post); `output.omit_empty_optional_fields: true`; collection `posts` in `src/content/posts`, date-only `pubDatetime`/`modDatetime`, `draft` default false, raw Markdown body first |
| `package.json`             | Scripts `serve`, `format:check`, `test:unit`, `test:integration`, `test:e2e`, `test:compat`; exact pins                                                                                                                                                                                                          |
| `vitest.config.ts`         | Unit tests in `test/unit/`                                                                                                                                                                                                                                                                                       |
| `playwright.config.ts`     | Projects `integration` (HTTP only) and `e2e` (Chromium, 1 retry for the CDN); web server `python3 -m http.server` on `CMS_PORT` (default 8787)                                                                                                                                                                   |
| `scripts/compat-check.sh`  | Copies `test/fixtures/compat-post.md` and the golden new entry into `../src/content/posts/zz-cms-compat-*.md`, builds the blog, greps the HTML (table, `hello.ts` label, callout div, image, no `{%`), then moves the two files to `../.trash/`                                                                  |
| `scripts/content-guard.sh` | Run by the `content-guard` CI job on post changes: no `{%` in posts, removed `file=` fence lines must be re-added, changed posts need `title`, `description`, `pubDatetime` and no empty-string values                                                                                                           |
| `test/fixtures/`           | Spike 1 fixture and the files Sveltia wrote in Spike 1 (`golden/`)                                                                                                                                                                                                                                               |

## For AI Agents

- Keep `config.yml` field names a subset of the blog's `posts` schema keys (`src/content.config.ts`); `test/unit/config.test.ts` enforces it.
- Never remove `omit_empty_optional_fields`: without it Sveltia writes `modDatetime: ''`, which fails the blog build.
- Upgrading Sveltia means a new version and a new sha384 in `index.html` (see `README.md`), then all tests.
- Do not add a build step or runtime secrets. Pages runs with `SKIP_DEPENDENCY_INSTALL=1`.
- Branch prefix is Sveltia's `cms/posts/`. Post PRs are merged or closed on GitHub, never with Sveltia's Publish or Discard (both delete branches).
- `wrangler` installed anywhere under a checkout that has a stale `.wrangler/deploy/config.json` refuses `pages dev`; the tests here use `python3 -m http.server` instead.
