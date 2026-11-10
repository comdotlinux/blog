<!-- Generated: 2026-11-10 | Updated: 2026-11-10 -->

# blog (astro-paper)

## Purpose
Personal blog ("Developer Musings") built on AstroPaper: Astro 7, TypeScript 6, Tailwind v4, Bun. Static output in `dist/`, deployed to Cloudflare Pages. `.idea/`, `.vscode/`, `.wrangler/`, `.omc/`, `dist/`, `node_modules/` are editor/tooling/generated and intentionally undocumented.

## Key Files
| File | Description |
|------|-------------|
| `package.json` | Package `astro-paper` 3.0.0, `bun@1.4.4`, node >=26.13.0. Scripts: `dev`, `build` (`astro check && astro build && pagefind --site dist`), `preview`, `sync`, `format`, `format:check`, `lint`, `lint:fix`, `test` (vitest), `test:run`, `test:e2e`, `test:e2e:ui`, `lighthouse` (`lhci autorun`), `cz`, `prepare` (`husky`). Also holds the `lint-staged` config (`prettier --write` on all files) |
| `bun.lock` | Bun lockfile |
| `astro.config.mjs` | `site` from `SITE.website` in `src/config.ts`; sitemap integration; Tailwind via `@tailwindcss/vite`; remark-toc + remark-collapse ("Table of contents"); Shiki theme `one-dark-pro` with notation transformers |
| `tsconfig.json` | Extends `astro/tsconfigs/strict`; `baseUrl: src` with `@assets`, `@config`, `@components`, `@content`, `@layouts`, `@pages`, `@styles`, `@utils` aliases |
| `eslint.config.js` | ESLint 9 flat config: js + typescript-eslint + eslint-plugin-astro recommended; ignores `dist/`, `node_modules/`, `.astro/`, `.husky/`, `.vscode/`, `public/` |
| `.prettierrc` | Prettier: semi, double quotes, 80 cols, `trailingComma: es5`, `arrowParens: avoid`, LF; astro and tailwindcss plugins |
| `.prettierignore` | Ignores everything except `src`, `public/**/*.ts`, `public/**/*.js`, `.github`, and a few root files |
| `vitest.config.ts` | Unit tests: `tests/**/*.test.ts`, globals on, `@config` alias |
| `playwright.config.ts` | E2E: `./e2e`, chromium only, baseURL `http://localhost:4173`, web server `bun run preview --port 4173 --ignore-lock` (`--ignore-lock` keeps Astro 7 from moving the server to the background when it detects an AI agent), CI uses 2 retries and 1 worker |
| `lighthouserc.json` | Lighthouse CI: 3 runs, performance only, fails below 0.85; server `bun run preview --ignore-lock`; reports written to `.lighthouseci/reports/`, never uploaded |
| `mise.toml` | Toolchain pins: `node` 26.13.0, `bun` 1.4.4. Source of truth for local dev (`mise install`) and CI (`jdx/mise-action`) |
| `.nvmrc` | Node `26.13.0`, read by Cloudflare Pages. Must equal the `mise.toml` node pin; CI checks this |
| `.markdownlint.json` | Disables MD033 and MD013 |
| `.gitattributes` | Git LFS filter for four PNGs in `public/assets/20221008/` and `public/assets/20221010/` |
| `.gitignore` | Ignores `dist/`, `node_modules/`, `.astro`, `.env*`, `.wrangler/`, `.omc/`, Playwright and Lighthouse output, and everything in `.idea/` and `.vscode/` except `.idea/.gitignore`, `.vscode/extensions.json`, `.vscode/launch.json` |
| `CLAUDE.md` | Authoritative agent instructions (see below) |
| `CHANGELOG.md` | Newest-first log of pre-commit check results, one dated section per change |
| `README.md` | Human-facing overview and commands |
| `LICENSE` | License text |
| `AstroPaper-lighthouse-score.svg` | Upstream AstroPaper Lighthouse badge image |

## Subdirectories
| Directory | Purpose |
|-----------|---------|
| `src/` | Site source: content, components, layouts, pages, utils (see `src/AGENTS.md`) |
| `tests/` | Vitest unit tests; need `dist/` (see `tests/AGENTS.md`) |
| `e2e/` | Playwright tests (see `e2e/AGENTS.md`) |
| `public/` | Static files served as-is, documented in "Static files" below (no `AGENTS.md` inside) |
| `old-posts/` | Unused upstream AstroPaper demo posts (see `old-posts/AGENTS.md`) |
| `.github/` | CI workflow (see `.github/AGENTS.md`) |
| `.husky/` | Git hooks (see `.husky/AGENTS.md`) |

## Static files (`public/`)
Everything in `public/` is copied verbatim into `dist/` and published, so never put an `AGENTS.md` or any other non-site file there. The same applies to `src/pages/` and `src/data/blog/` (see `src/AGENTS.md`). `public/` is excluded from ESLint; Prettier only checks `public/**/*.ts` and `*.js`.

| File | Description |
|------|-------------|
| `public/toggle-theme.js` | Dark/light theme script loaded by `src/layouts/Layout.astro` as `/toggle-theme.js`. Stores `theme` in localStorage, sets `data-theme` on the root element, toggles via `#theme-btn`, follows system preference. Plain JS, keep it dependency-free |
| `public/astropaper-og.jpg` | Default OG image, referenced as `ogImage` in `src/config.ts` |
| `public/favicon.svg` | Site favicon |
| `public/favicon-old.svg` | Older favicon; no references found in the repo |
| `public/robots.txt` | Disallows `/nogooglebot/` for Googlebot, allows everything else |
| `public/assets/logo.png` | Header logo (PNG), referenced in `src/components/Header.astro` |
| `public/assets/logo.svg` | Header logo (SVG), referenced in `src/components/Header.astro` |
| `public/assets/dev.svg` | Illustration used in `src/pages/about.md` |

Post images live in date-named directories under `public/assets/` and are referenced in markdown as `/assets/YYYYMMDD/filename.png`. Use a new date directory for a new post.

| Directory | Files | Referenced by (`src/data/blog/`) |
|-----------|-------|-----------------------------------|
| `public/assets/20221008/` | `nicely-arranged-tools-and-tool-boxes-high-quality-digital-art.png`, `so-many-tools-and-tool-boxes-high-quality-digital-art.png` | `on-the-topic-of-tools-their-versions-automated-installations.md` |
| `public/assets/20221010/` | `104-final-patch.png`, `236-buglog.png` | `followup-latest-version-of-the-tools-using-asdf.md` |
| `public/assets/20221112/` | `96-zenos-progress.png`, `TmuxEverywhere.gif`, `XKCD-everywhere.gif`, `automation.png`, `ok_okay_ok.png`, `x11.png` | `tmux-how-i-use-it.md` |
| `public/assets/20221126/` | `gradle-logo.png`, `small-delights.png` | `gradle-tricks.md` |
| `public/assets/20221227/` | `CompositeInputOutputTest.png`, `GithubCompositeAction.png`, `meaning.png`, `workflow-dispatch-inputs.png` | `some-interesting-features-in-github-actions.md` |

The four PNGs in `20221008/` and `20221010/` are Git LFS objects (`.gitattributes`); `git-lfs` must be installed to check them out.

## For AI Agents

### Working In This Directory
- `CLAUDE.md` is the source of truth for commands, the pre-commit check sequence and the CHANGELOG entry requirement. Read it first; do not duplicate it here.
- Check order before any commit: lint, build, `test:run`, `test:e2e`, lighthouse. Build must precede unit tests because they read `dist/`.
- Prepend a dated results entry to `CHANGELOG.md` after the checks pass.
- Never delete or edit existing tests without asking the user.
- Use `bun`, not npm/yarn; blog posts live in `src/data/blog/`.

### Testing Requirements
`bun run lint`, `bun run build`, `bun run test:run`, `bun run test:e2e`, `bun run lighthouse` (>= 85% performance).

## Dependencies

### External
Astro 7, `@astrojs/markdown-remark` (unified processor for remark plugins), Tailwind 4, TypeScript 6, Pagefind, satori + resvg (OG images), vitest, Playwright, Lighthouse CI, husky + lint-staged, commitizen.

<!-- MANUAL: Any manually added notes below this line are preserved on regeneration -->
