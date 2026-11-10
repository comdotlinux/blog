<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-11-10 | Updated: 2026-11-10 -->

# tests

## Purpose
Vitest unit tests. Config: `../vitest.config.ts` (includes `tests/**/*.test.ts`, `globals: true`, aliases `@config`, `@content/*`, `@utils/*`).

## Key Files
| File | Description |
|------|-------------|
| `build.test.ts` | Checks `dist/` output: index.html, sitemap-index.xml, rss.xml, 404.html, about/, posts/, tags/, search/, `_astro` CSS, `pagefind/`. Needs a prior build. |

## Subdirectories
| Directory | Purpose |
|-----------|---------|
| `components/` | Logic tests for Card and Datetime (see `components/AGENTS.md`) |
| `utils/` | One test per util in `src/utils/` (see `utils/AGENTS.md`) |

## For AI Agents

### Working In This Directory
- **Never delete or modify existing tests without asking the user first.** If a test fails, fix the code, or ask whether the expectation is wrong.

### Testing Requirements
| Command | Purpose |
|---------|---------|
| `bun run test` | Vitest watch mode |
| `bun run test:run` | Run once |

`build.test.ts` reads `dist/`: run `bun run build` before `bun run test:run`. CI order is in `../CLAUDE.md`.

## Dependencies

### Internal
`../src/utils/`, `../src/config.ts`, `../src/content/_schemas.ts`.

### External
`vitest`.

<!-- MANUAL: Any manually added notes below this line are preserved on regeneration -->
