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
