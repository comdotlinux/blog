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

1. `actions/checkout@v4`
2. Parse `.tool-versions` (awk) into step outputs, then echo them
3. `actions/setup-node@v4` and `oven-sh/setup-bun@v2` with those versions
4. `bun install`
5. `bun run lint`
6. `bun run build`
7. `bun run test:run`
8. `bunx playwright install --with-deps chromium`
9. `bun run test:e2e`
10. `treosh/lighthouse-ci-action@v12`: urls `http://localhost:4321/`, `configPath: ./lighthouserc.json`, 3 runs, uploads artifacts and temporary public storage
11. On failure only: upload `playwright-report/` as artifact `playwright-report` (7 days)

## For AI Agents

### Working In This Directory

- Keep step order aligned with `CLAUDE.md` (lint, build, unit, e2e, lighthouse); unit tests need `dist/` from the build step.
- Node and Bun versions come from `.tool-versions`; change them there, not here.
- `format:check` is not run in CI; Prettier only runs via the pre-commit hook.
- Prettier covers `.github` (see root `.prettierignore`).

## Dependencies

### Internal

`.tool-versions`, `/lighthouserc.json`, `/package.json` scripts.

<!-- MANUAL: Any manually added notes below this line are preserved on regeneration -->
