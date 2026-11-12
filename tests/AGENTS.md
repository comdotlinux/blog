<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-11-10 | Updated: 2026-11-11 -->

# tests

## Purpose
Vitest unit tests. Config: `../vitest.config.ts` uses Astro's `getViteConfig()`, so tests import real modules through the `@/*` alias and Astro virtual modules (`astro:content`, `astro:i18n`, `astro:env/client`) resolve. Includes `tests/**/*.test.ts`, `globals: true`.

Unit tests need no network: offline, the Google font provider in `astro.config.ts` only logs a warning.

## Key Files
| File | Description |
|------|-------------|
| `build.test.ts` | Checks `dist/` output: index.html, sitemaps, rss.xml, 404.html, about/, posts/, tags/, search/, `_astro` CSS, `pagefind/`; the 5 `posts/*/index.png` start with PNG magic bytes; `_redirects` has the `/posts/1/` 301. Needs a prior build. |

## Subdirectories
| Directory | Purpose |
|-----------|---------|
| `utils/` | Tests for `src/utils/` (see `utils/AGENTS.md`) |
| `functions/` | `turnstile.test.ts`: session cookie signing, public-path list and middleware branches of `../functions/` |

## For AI Agents

### Working In This Directory
- **Never delete or modify existing tests without asking the user first.** If a test fails, fix the code, or ask whether the expectation is wrong.
- `postFilter` returns `true` for every non-draft post when `import.meta.env.DEV` is set, which Vitest does. Use `vi.stubEnv("DEV", false)` to test future-post exclusion, and `vi.unstubAllEnvs()` afterwards.

### Testing Requirements
| Command | Purpose |
|---------|---------|
| `bun run test` | Vitest watch mode |
| `bun run test:run` | Run once |

`build.test.ts` reads `dist/`: run `bun run build` before `bun run test:run`. CI order is in `../CLAUDE.md`.

## Dependencies

### Internal
`../src/utils/`, `../src/config.ts`, `../astro-paper.config.ts`.

### External
`vitest`.

<!-- MANUAL: Any manually added notes below this line are preserved on regeneration -->
