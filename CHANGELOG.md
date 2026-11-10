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
