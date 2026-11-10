<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-11-10 | Updated: 2026-11-10 -->

# workflows

## Purpose

GitHub Actions CI. One workflow that mirrors the local pre-commit check sequence in `CLAUDE.md`.

## Key Files

| File       | Description                                                                                                                                                     |
| ---------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `test.yml` | Workflow "Test". Triggers: push to `main`, any pull request. Concurrency group `<workflow>-<ref>` with cancel-in-progress. Single job `test` on `ubuntu-latest` |

### `test.yml` steps, in order

1. `actions/checkout@v7`
2. `jdx/mise-action@v5` installs Node.js and Bun from `mise.toml`
3. Print versions and fail if `.nvmrc` differs from the installed Node.js (Cloudflare Pages reads `.nvmrc`)
4. `bun install`
5. `bun run lint`
6. `bun run build`
7. `bun run test:run`
8. `bunx playwright install --with-deps chromium`
9. `bun run test:e2e`
10. `treosh/lighthouse-ci-action@v12`: urls `http://localhost:4321/`, `configPath: ./lighthouserc.json`, 3 runs, uploads artifacts only (`temporaryPublicStorage: false`)
11. On failure only: upload `playwright-report/` as artifact `playwright-report` (7 days)

## For AI Agents

### Working In This Directory

- Keep step order aligned with `CLAUDE.md` (lint, build, unit, e2e, lighthouse); unit tests need `dist/` from the build step.
- Node and Bun versions come from `mise.toml`; change them there (and `.nvmrc` for Node), not here.
- `format:check` is not run in CI; Prettier only runs via the pre-commit hook.
- Prettier covers `.github` (see root `.prettierignore`).

## Dependencies

### Internal

`/mise.toml`, `/.nvmrc`, `/lighthouserc.json`, `/package.json` scripts.

<!-- MANUAL: Any manually added notes below this line are preserved on regeneration -->
