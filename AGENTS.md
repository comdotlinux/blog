<!-- Generated: 2026-11-10 | Updated: 2026-11-11 -->

# blog (astro-paper)

## Purpose
Personal blog ("Developer Musings") built on AstroPaper v7.1.0: Astro 7, TypeScript 6, Tailwind v4, Bun. Static output in `dist/`, deployed to Cloudflare Pages. `.idea/`, `.vscode/`, `.wrangler/`, `.omc/`, `dist/`, `node_modules/` are editor/tooling/generated and intentionally undocumented.

## Key Files
| File | Description |
|------|-------------|
| `package.json` | Package `astro-paper` 3.0.0, `bun@1.4.4`, node >=26.13.0. Scripts: `dev`, `build` (`astro check && astro build && pagefind --site dist && node copy-pagefind.mjs`), `preview`, `sync`, `format`, `format:check`, `lint`, `lint:fix`, `test` (vitest), `test:run`, `test:e2e`, `test:e2e:ui`, `lighthouse` (`lhci autorun`), `cz`, `prepare` (`husky`). Also holds the `lint-staged` config (`prettier --write --ignore-unknown` on all staged files) |
| `bun.lock` | Bun lockfile |
| `astro-paper.config.ts` | User config (upstream shape, our values): site URL/title/author, `ogImage: "astropaper-og.jpg"`, timezone `Europe/Berlin`, `perPage: 3`, archives off, edit-post link on, socials (incl. youtube/reddit/telegram/mastodon) and share links. Edit this, not `src/config.ts` |
| `astro.config.ts` | `site` from `astro-paper.config.ts`; mdx, sitemap and the inline-TOC deprecation integration; `redirects` `/posts/1` -> `/posts/` (preview only) and `compressHTML: true`; `unified()` processor with rehype plugins `rehypeHeadingIds`, `rehypeInlineToc`, `rehype-callouts`, `rehypeTableWrapper`; Shiki `github-light`/`github-dark` with fileName + notation transformers; Google Sans Code via the Fonts API; `PUBLIC_GOOGLE_SITE_VERIFICATION` env field; SVGO optimizer |
| `copy-pagefind.mjs` | Last build step: copies `dist/pagefind` to `public/pagefind` (git-ignored) so `astro dev` can serve the index |
| `tsconfig.json` | Extends `astro/tsconfigs/strict`; one alias `@/*` -> `./src/*` (plus `@/astro-paper.config`); excludes `dist`, `public/pagefind`, `old-posts`, `.lighthouseci`, `playwright-report`, `test-results` |
| `eslint.config.js` | ESLint 10 flat config: `@eslint/js` + typescript-eslint + eslint-plugin-astro recommended; node globals for `*.js`/`*.mjs`; `no-control-regex` off for vendored `src/utils/slugify.ts` and `toTransitionName.ts`; `no-console` only for `src/**` and root `*.ts`/`*.mjs`; ignores `dist/`, `public/`, `old-posts/`, test output, `.astro/`, `.husky/`, `.vscode/` |
| `.prettierrc` | Upstream file: semi, double quotes, 80 cols, `trailingComma: es5`, `arrowParens: avoid`, LF; astro (pinned 0.14.1) and tailwindcss plugins |
| `.prettierignore` | Ignores everything except `src`, `public/**/*.ts`, `public/**/*.js`, `.github`, and a few root files (incl. `astro.config.ts`, `astro-paper.config.ts`, `copy-pagefind.mjs`, `README.md`) |
| `vitest.config.ts` | `getViteConfig` from `astro/config` so tests resolve `astro:*` virtual modules; `tests/**/*.test.ts`, globals on. Needs no network (the font provider only warns offline) |
| `playwright.config.ts` | E2E: `./e2e`, chromium only, baseURL `http://localhost:4173`, web server `bun run preview --port 4173 --ignore-lock` (`--ignore-lock` keeps Astro 7 from moving the server to the background when it detects an AI agent), CI uses 2 retries and 1 worker |
| `lighthouserc.json` | Lighthouse CI: 3 runs, performance only, fails below 0.85; server `bun run preview --ignore-lock`; reports written to `.lighthouseci/reports/`, never uploaded |
| `mise.toml` | Toolchain pins: `node` 26.13.0, `bun` 1.4.4. Source of truth for local dev (`mise install`) and CI (`jdx/mise-action`) |
| `.nvmrc` | Node `26.13.0`, read by Cloudflare Pages. Must equal the `mise.toml` node pin; CI checks this |
| `.markdownlint.json` | Disables MD033 and MD013 |
| `.gitattributes` | Git LFS filter for four PNGs in `public/assets/20221008/` and `public/assets/20221010/` |
| `.gitignore` | Ignores `dist/`, `node_modules/`, `.astro`, `.env*`, `public/pagefind/`, `.wrangler/`, `.omc/`, Playwright and Lighthouse output, and everything in `.idea/` and `.vscode/` except `.idea/.gitignore`, `.vscode/extensions.json`, `.vscode/launch.json` |
| `CLAUDE.md` | Authoritative agent instructions (see below) |
| `CHANGELOG.md` | Newest-first log of pre-commit check results, one dated section per change |
| `README.md` | Human-facing overview and commands |
| `LICENSE` | License text (identical to upstream) |
| `AstroPaper-lighthouse-score.svg` | AstroPaper Lighthouse badge image |

## Subdirectories
| Directory | Purpose |
|-----------|---------|
| `src/` | Site source: content, components, layouts, pages, utils (see `src/AGENTS.md`) |
| `tests/` | Vitest unit tests; need `dist/` (see `tests/AGENTS.md`) |
| `e2e/` | Playwright tests (see `e2e/AGENTS.md`) |
| `functions/` | Cloudflare Pages Functions: Turnstile gate in front of the whole site (see `functions/AGENTS.md`) |
| `public/` | Static files served as-is, documented in "Static files" below (no `AGENTS.md` inside) |
| `old-posts/` | Unused upstream AstroPaper demo posts (see `old-posts/AGENTS.md`) |
| `.github/` | CI workflow (see `.github/AGENTS.md`) |
| `.husky/` | Git hooks (see `.husky/AGENTS.md`) |

## Static files (`public/`)
Everything in `public/` is copied verbatim into `dist/` and published, so never put an `AGENTS.md` or any other non-site file there. The same applies to `src/pages/`, `src/content/posts/` and `src/content/pages/` (see `src/AGENTS.md`). `public/` is excluded from ESLint; Prettier only checks `public/**/*.ts` and `*.js`.

| File | Description |
|------|-------------|
| `public/_redirects` | Cloudflare Pages rules: `/posts/1` and `/posts/1/` -> `/posts/` with 301 |
| `public/astropaper-og.jpg` | Default OG image (`site.ogImage` in `astro-paper.config.ts`). While it exists, `/og.png` is not used as the site default |
| `public/On the topic of tools, their versions & automated installations.png` | Static copy of an OG image from the old `/<title>.png` route, kept so links shared before v7 still resolve |
| `public/favicon.svg` | Site favicon |
| `public/favicon-old.svg` | Older favicon; no references found in the repo |
| `public/assets/logo.png`, `public/assets/logo.svg` | Old header logos; not referenced by the current header |
| `public/assets/dev.svg` | Illustration used in `src/content/pages/about.md` |
| `public/pagefind/` | Generated by `copy-pagefind.mjs`, git-ignored |

`robots.txt` is generated by `src/pages/robots.txt.ts`.

Post images live in date-named directories under `public/assets/` and are referenced in markdown as `/assets/YYYYMMDD/filename.png`. Use a new date directory for a new post.

| Directory | Files | Referenced by (`src/content/posts/`) |
|-----------|-------|--------------------------------------|
| `public/assets/20221008/` | `nicely-arranged-tools-and-tool-boxes-high-quality-digital-art.png`, `so-many-tools-and-tool-boxes-high-quality-digital-art.png` | `on-the-topic-of-tools-their-versions-and-automated-installations.md` |
| `public/assets/20221010/` | `104-final-patch.png`, `236-buglog.png` | `followup-latest-version-of-the-tools-using-asdf.md` |
| `public/assets/20221112/` | `96-zenos-progress.png`, `TmuxEverywhere.gif`, `XKCD-everywhere.gif`, `automation.png`, `ok_okay_ok.png`, `x11.png` | `tmux-how-i-use-it.md` |
| `public/assets/20221126/` | `gradle-logo.png`, `small-delights.png` | `gradle-tricks.md` |
| `public/assets/20221227/` | `CompositeInputOutputTest.png`, `GithubCompositeAction.png`, `meaning.png`, `workflow-dispatch-inputs.png` | `some-interesting-features-in-github-actions.md` |

The four PNGs in `20221008/` and `20221010/` are Git LFS objects (`.gitattributes`); `git-lfs` must be installed to check them out.

## Upstream delta

**Baseline:** `satnaing/astro-paper` tag `v7.1.0`, commit `2e8bcbe61d85d52cb3420e876e2c308f37322d0d`. Every file not listed here is byte-identical to upstream. To upgrade: fetch the new upstream tree, `diff -rq <upstream> . -x node_modules -x .git -x dist -x .omc -x .astro`, and re-apply only these rows. Generated, git-ignored paths (`public/pagefind/`, `.lighthouseci/`, `playwright-report/`, `test-results/`, `.wrangler/`) also show up in that diff and are not deltas.

| Path | Kind | Reason |
|---|---|---|
| `package.json`, `bun.lock` | ours | Bun (`packageManager`, node >=26.13.0), extra scripts, husky/lint-staged/commitizen, Vitest/Playwright/LHCI deps; `typescript-eslint`, `@eslint/js` and `globals` instead of `@typescript-eslint/parser`; no `remark-toc`/`remark-collapse`; `@astrojs/mdx` ^8.1.5; `astro` and `@astrojs/rss` pinned; `@astrojs/sitemap` and `@tailwindcss/vite` in devDependencies; `prettier` as `^3.9.10`; `lint-staged` runs `prettier --write --ignore-unknown` (SVG/TTF safe). `prettier-plugin-astro` stays at upstream's `0.14.1` pin so vendored `.astro` files pass Prettier unchanged |
| `mise.toml`, `.nvmrc`, `.github/workflows/test.yml`, `lighthouserc.json`, `playwright.config.ts`, `vitest.config.ts`, `.husky/**` | ours | Tooling |
| `eslint.config.js` | ours | typescript-eslint flat config; node globals for `*.js`/`*.mjs`; `no-control-regex` off for vendored `slugify.ts`/`toTransitionName.ts` (instead of editing them); `no-console` scoped to `src/**` and root `*.ts`/`*.mjs`; ignores `public/`, `old-posts/`, test output |
| `.gitignore` | ours | Adds `.omc/`, `.wrangler/`, Playwright and LHCI output, `.idea`/`.vscode` whitelist; keeps `public/pagefind/` |
| `.prettierignore` | ours | `/*` whitelist with `!astro.config.ts`, `!astro-paper.config.ts`, `!copy-pagefind.mjs` so the new root config files are formatted; `public` limited to `**/*.ts`/`*.js` |
| `tsconfig.json` | upstream, plus `exclude` additions | `old-posts`, `.lighthouseci`, `playwright-report`, `test-results` keep `astro check` scoped |
| `astro.config.ts` | upstream, plus `redirects`, `compressHTML: true`, Shiki `github-light`/`github-dark` | `/posts/1` redirect for `astro preview` (Cloudflare uses `public/_redirects`); Astro 7 `"jsx"` default strips inline whitespace; theme choice |
| `astro-paper.config.ts` | upstream shape, our values | Site identity, timezone, pagination, features, socials |
| `src/content/posts/*.md` (5), `src/content/pages/about.md` | ours | Content |
| `src/assets/icons/socials/{youtube,reddit,mastodon}.svg` | ours | Icons upstream lacks |
| `AGENTS.md`, `src/**/AGENTS.md`, `old-posts/**`, `tests/**`, `e2e/**`, `.github/AGENTS.md`, `.github/workflows/AGENTS.md` | ours | Docs and tests |
| `public/_redirects` | ours | `/posts/1(/)` 301 |
| `functions/**`, `tests/functions/**` | ours | Turnstile edge gate (Pages Functions), ported from the bio repo |
| `src/pages/index.astro` | upstream, hero changed | Hero `h1` "Musings of A Developer" and our intro paragraph replace upstream's demo greeting, description and README link |
| `public/On the topic of tools, their versions & automated installations.png` | ours | Old OG URL kept alive |
| `public/favicon.svg`, `public/favicon-old.svg`, `public/astropaper-og.jpg`, `public/assets/**` | ours | Site assets |
| `README.md`, `CHANGELOG.md`, `CLAUDE.md`, `AstroPaper-lighthouse-score.svg`, `.markdownlint.json`, `.gitattributes`, `.idea/.gitignore`, `.vscode/extensions.json` | ours | Repo files |
| **Absent from our tree:** upstream demo `src/content/posts/**`, `src/assets/images/*` (`AstroPaper-v3/v4/v5.png`, `forrest-gump-quote.png`, `astropaper-og.jpg`), `public/default-og.jpg`, `src/remark-collapse.d.ts`, `pnpm-lock.yaml`, `pnpm-workspace.yaml`, `Dockerfile`, `compose.yaml`, `.dockerignore`, `cz.yaml`, `.github/{workflows/ci.yml,dependabot.yml,FUNDING.yml,ISSUE_TEMPLATE,PULL_REQUEST_TEMPLATE.md,CODE_OF_CONDUCT.md,CONTRIBUTING.md}`, `.vscode/astro-paper.code-snippets` | absent | Demo content, pnpm/Docker/upstream-repo files not used here |

## For AI Agents

### Working In This Directory
- `CLAUDE.md` is the source of truth for commands, the pre-commit check sequence and the CHANGELOG entry requirement. Read it first; do not duplicate it here.
- Check order before any commit: lint, build, `test:run`, `test:e2e`, lighthouse. Build must precede unit tests because they read `dist/`.
- Prepend a dated results entry to `CHANGELOG.md` after the checks pass.
- Never delete or edit existing tests without asking the user.
- Use `bun`, not npm/yarn; blog posts live in `src/content/posts/`.
- Keep upstream bytes: any new deviation from upstream gets a row in "Upstream delta" above.

### Testing Requirements
`bun run lint`, `bun run build`, `bun run test:run`, `bun run test:e2e`, `bun run lighthouse` (>= 85% performance).

## Dependencies

### External
Astro 7 (+ `@astrojs/mdx`, `@astrojs/sitemap`, `@astrojs/rss`, `@astrojs/markdown-remark`), Tailwind 4, TypeScript 6, Pagefind, `rehype-callouts`, satori + sharp (OG images), dayjs, vitest, Playwright, Lighthouse CI, husky + lint-staged, commitizen.

<!-- MANUAL: Any manually added notes below this line are preserved on regeneration -->
