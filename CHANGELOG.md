## 2026-11-12 21:56

| Check | Status | Details |
|-------|--------|---------|
| Lint | ✓ PASS | 0 errors |
| Build | ✓ PASS | 27 pages built, 5 pages indexed (Pagefind) |
| Unit Tests | ✓ PASS | 73 tests passed |
| E2E Tests | ✓ PASS | 96 tests passed |
| Lighthouse | ✓ PASS | 99.7% performance (avg) |

### Lighthouse Performance (local build)

| Page | Scores (3 runs) |
|------|-----------------|
| / (index) | 100%, 100%, 100% |
| /about | 99%, 99%, 99% |
| /posts | 99%, 100%, 100% |
| /archives (soft 404, not linked) | 100%, 100%, 100% |
| /404 | 100%, 100%, 100% |

**Diagnostics:** Production check after #13: `/posts/1/` answered 401 instead of 301, because Pages Functions run before `public/_redirects`. Live site not measured.

Changes: The Turnstile middleware answers `/posts/1` and `/posts/1/` with a 301 to `/posts/` before the gate, restoring the redirect for visitors without a session. 2 new unit tests.

## 2026-11-12 21:40

| Check | Status | Details |
|-------|--------|---------|
| Lint | ✓ PASS | 0 errors |
| Build | ✓ PASS | 27 pages built, 5 pages indexed (Pagefind) |
| Unit Tests | ✓ PASS | 71 tests passed |
| E2E Tests | ✓ PASS | 96 tests passed |
| Lighthouse | ✓ PASS | 99.8% performance (avg) |

### Lighthouse Performance (local build)

| Page | Scores (3 runs) |
|------|-----------------|
| / (index) | 100%, 100%, 100% |
| /about | 99%, 99%, 99% |
| /posts | 100%, 100%, 100% |
| /archives (soft 404, not linked) | 100%, 100%, 100% |
| /404 | 100%, 100%, 100% |

**Diagnostics:** The local build runs without the gate: Pages Functions only run on Cloudflare. Live site not measured.

Changes: Gate the whole site behind Cloudflare Turnstile, ported from the bio repo. `functions/_middleware.ts` serves a challenge page (401, `noindex`) without a valid `blog_session` cookie; `functions/api/verify-turnstile.ts` verifies the token and sets the HMAC-signed cookie (24 h). Feeds, sitemaps, robots.txt, favicons and OG images stay public; `PREVIEW=true` opens preview deployments; a missing secret fails closed. 21 new unit tests in `tests/functions/turnstile.test.ts`.

## 2026-11-12 16:47

| Check | Status | Details |
|-------|--------|---------|
| Lint | ✓ PASS | 0 errors |
| Build | ✓ PASS | 27 pages built, 5 pages indexed (Pagefind) |
| Unit Tests | ✓ PASS | 50 tests passed |
| E2E Tests | ✓ PASS | 96 tests passed |
| Lighthouse | ✓ PASS | 99.8% performance (avg) |

### Lighthouse Performance (local build)

| Page | Scores (3 runs) |
|------|-----------------|
| / (index) | 100%, 100%, 100% |
| /about | 99%, 99%, 99% |
| /posts | 100%, 100%, 100% |
| /archives (soft 404, not linked) | 100%, 100%, 100% |
| /404 | 100%, 100%, 100% |

**Diagnostics:** None. Live site not measured.

Changes: Fix the asdf follow-up post: the two `asdf install <name> latest` commands were bare text, so `<name>` and `<version>` rendered as HTML tags and vanished. They are now one `bash` code block, with the "Install latest stable version" line as a shell comment (as in the asdf docs) instead of a stray heading in the table of contents. Recast the prose ` -- ` (rendered as em dashes by smartypants) and spaced hyphens in the asdf, tools and tmux posts with commas, colons, semicolons, periods or parentheses; the no-em-dashes checker now reports 0 hits for all posts and `AGENTS.md` files. Switch `site.url` from `https://b.kulkarni.cloud/` (no DNS record) to `https://blog.kulkarni.cloud/`, so canonical, RSS, sitemap, robots and `og:image` URLs point at the live host; RSS readers see new item links once. Host updated in two e2e expectations (user-approved). Add `bun run clean` (removes `dist/` and `public/pagefind/`) as the first pre-commit step.

## 2026-11-11 22:00

| Check | Status | Details |
|-------|--------|---------|
| Lint | ✓ PASS | 0 errors |
| Build | ✓ PASS | 27 pages built, 5 pages indexed (Pagefind), astro check 0 errors / 0 warnings / 0 hints |
| Unit Tests | ✓ PASS | 50 tests passed |
| E2E Tests | ✓ PASS | 96 tests passed |
| Lighthouse | ✓ PASS | 99.3% performance (avg) |

### Lighthouse Performance (local build)

| Page | Scores (3 runs) |
|------|-----------------|
| / (index) | 100%, 100%, 100% |
| /about | 99%, 99%, 92% |
| /posts | 100%, 100%, 100% |
| /archives (soft 404, not linked) | 100%, 100%, 100% |
| /404 | 100%, 100%, 100% |

**Diagnostics:** `/about` LCP 2.0s (median) is the slowest page; everything else paints in 0.8s. Compared with `main`, the only removed URL is `/toggle-theme.js`; `/posts/1/` leaves the sitemap (Cloudflare now answers it with a 301 from `public/_redirects`); RSS links and GUIDs are byte-identical. Live site not measured.

Changes: Re-port onto upstream AstroPaper v7.1.0 (commit `2e8bcbe`). Content moves to `src/content/posts` and `src/content/pages/about.md`; site config to `astro-paper.config.ts` (Europe/Berlin, archives off, edit-post and share links on, 9 socials with new YouTube/Reddit/Mastodon icons). Per-post OG images at `/posts/<slug>/index.png`; the one old OG PNG URL is kept as a static file. Shiki switches to github-light/github-dark; the in-post "Table of contents" headings give way to the layout's sidebar TOC. Tests: 5 unit files retired, the rest rewritten against the real modules (`getViteConfig`), new URL-preservation spec over `e2e/fixtures/urls.txt`. Upstream deltas are listed in `AGENTS.md`.

## 2026-11-10 16:39

| Check | Status | Details |
|-------|--------|---------|
| Lint | ✓ PASS | 0 errors |
| Build | ✓ PASS | 27 pages indexed |
| Unit Tests | ✓ PASS | 94 tests passed |
| E2E Tests | ✓ PASS | 55 tests passed |
| Lighthouse | ✓ PASS | 99.7% performance (avg) |

### Lighthouse Performance (local build)

| Page | Scores (3 runs) |
|------|-----------------|
| / (index) | 100%, 100%, 100% |
| /about | 98%, 98%, 100% |
| /posts | 100%, 100%, 100% |
| /posts/1 | 100%, 100%, 100% |
| /404 | 100%, 100%, 100% |

**Diagnostics:** `astro check` reports 12 hints (`'await' has no effect`) in `e2e/og-images.spec.ts`, surfaced by the newer TypeScript; tests left unchanged. Live site not measured.

Changes: Replace `.tool-versions` (asdf) with `mise.toml` (Node.js 26.13.0, Bun 1.4.4); CI uses `jdx/mise-action` and checks `.nvmrc` matches. Upgrade all dependencies to latest (Astro 7.4.8, ESLint 10, Vitest 5, satori 0.63, Shiki transformers 4, Playwright 1.65, sharp 0.35, lint-staged 17, Prettier plugins); TypeScript held at 6.0.3 because `astro check` and typescript-eslint refuse 7.0. Astro 7 fixes: `unified()` Markdown processor for the remark plugins, `compressHTML: true` to keep inline whitespace, `--ignore-lock` on test preview servers. OG image card gets `position: relative` so newer satori paints it above its shadow box.

## 2026-11-10 16:26

| Check | Status | Details |
|-------|--------|---------|
| Lint | ✓ PASS | 0 errors |
| Build | ✓ PASS | 27 pages indexed |
| Unit Tests | ✓ PASS | 94 tests passed |
| E2E Tests | ✓ PASS | 55 tests passed |
| Lighthouse | ✓ PASS | 98% performance (avg) |

### Lighthouse Performance (local build)

| Page | Scores (3 runs) |
|------|-----------------|
| / (index) | 96%, 99%, 100% |
| /about | 95%, 97%, 100% |
| /posts | 95%, 95%, 100% |
| /posts/1 | 99%, 100%, 100% |
| /404 | 96%, 100%, 100% |

**Diagnostics:** None. Live site not measured; scores are from the local preview build.

Changes: Stop uploading Lighthouse reports to public temporary storage; `lighthouserc.json` writes them to `.lighthouseci/reports/` (git-ignored) and CI sets `temporaryPublicStorage: false`, keeping reports as private workflow artifacts

## 2026-11-10 14:10

| Check | Status | Details |
|-------|--------|---------|
| Lint | ✓ PASS | 0 errors |
| Build | ✓ PASS | 27 pages indexed |
| Unit Tests | ✓ PASS | 94 tests passed |
| E2E Tests | ✓ PASS | 55 tests passed |
| Lighthouse | ✓ PASS | 99% performance (avg) |

### Lighthouse Performance (local build)

| Page | Scores (3 runs) |
|------|-----------------|
| / (index) | 99%, 99%, 99% |
| /about | 99%, 100%, 100% |
| /posts | 99%, 100%, 100% |
| /posts/1 | 99%, 100%, 100% |
| /404 | 99%, 99%, 100% |

**Diagnostics:** None. Live site not measured; scores are from the local preview build.

Changes: Add hierarchical `AGENTS.md` docs (17 files, none inside `public/`, `src/pages/` or `src/data/blog/` because Astro would publish them), ignore `.omc/` and untracked `.idea/` / `.vscode/` files in `.gitignore`

## 2026-01-25 10:02

| Check | Status | Details |
|-------|--------|---------|
| Lint | ✓ PASS | 0 errors |
| Build | ✓ PASS | 27 pages indexed |
| Unit Tests | ✓ PASS | 94 tests passed |
| E2E Tests | ✓ PASS | 55 tests passed |
| Lighthouse | ✓ PASS | 97% performance (avg) |

### Lighthouse Performance (local build)

| Page | Scores (3 runs) |
|------|-----------------|
| / (index) | 90%, 96%, 99% |
| /about | 95%, 99% |
| /posts | 97%, 99% |
| /posts/1 | 90%, 96%, 99% |
| /404 | 99% |

Changes: Add Lighthouse CI with 85% threshold, add `bun run lighthouse` command, add @lhci/cli dependency, update CLAUDE.md with Lighthouse requirements

## 2026-01-25 09:57

### Lighthouse Performance (https://blog.kulkarni.cloud/)

| Device | Score | FCP | LCP | TBT | CLS | SI |
|--------|-------|-----|-----|-----|-----|-----|
| Mobile | 88% | 1.5s | 1.5s | 460ms | 0.006 | 2.4s |
| Desktop | 92% | 1.5s | 1.5s | 340ms | 0.006 | 2.4s |

**Diagnostics:**
- Image elements do not have explicit `width` and `height`
- Cache lifetimes could be more efficient
- Render blocking requests affecting LCP

Changes: Add Lighthouse CI to GitHub Actions with 85% performance threshold, add lighthouserc.json config

## 2026-01-25 09:43

| Check | Status | Details |
|-------|--------|---------|
| Lint | ✓ PASS | 0 errors |
| Build | ✓ PASS | 27 pages indexed |
| Unit Tests | ✓ PASS | 94 tests passed |
| E2E Tests | ✓ PASS | 55 tests passed |

Changes: Fix CI to use setup-node action with Node.js version from .tool-versions, use awk for parsing, echo versions in CI logs

## 2026-01-25 09:39

| Check | Status | Details |
|-------|--------|---------|
| Lint | ✓ PASS | 0 errors |
| Build | ✓ PASS | 27 pages indexed |
| Unit Tests | ✓ PASS | 94 tests passed |
| E2E Tests | ✓ PASS | 55 tests passed |

Changes: Add GitHub Actions CI workflow, fix lint error in Search.astro, update CLAUDE.md with testing requirements and changelog policy
