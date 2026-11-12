# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a personal blog built with AstroPaper, an Astro 7-based static site generator. The blog is deployed to Cloudflare Pages at https://blog.kulkarni.cloud/.

**Stack:** Astro 7 + TypeScript 6 + TailwindCSS v4 + Bun

## Commands

| Command | Purpose |
|---------|---------|
| `bun run dev` | Start dev server at localhost:4321 |
| `bun run build` | Build production site to `./dist/` |
| `bun run clean` | Remove `dist/` and `public/pagefind/` |
| `bun run preview` | Preview production build locally |
| `bun run lint` | Run ESLint (flat config) |
| `bun run lint:fix` | Run ESLint with auto-fix |
| `bun run format` | Format code with Prettier |
| `bun run format:check` | Check formatting without fixing |
| `bun run test` | Run unit tests with Vitest |
| `bun run test:run` | Run unit tests once |
| `bun run test:e2e` | Run e2e tests with Playwright |
| `bun run lighthouse` | Run Lighthouse CI (85%+ performance required) |
| `bun run cz` | Commit with commitizen (conventional commits) |
| `bun run sync` | Generate TypeScript types for Astro modules |

## Architecture

The theme is upstream AstroPaper v7.1.0 (commit `2e8bcbe6`). Keep upstream bytes; every deviation is listed under "Upstream delta" in `AGENTS.md`.

**Key Directories:**
- `src/content/posts/` - Blog posts (`.md`/`.mdx`) with YAML frontmatter
- `src/content/pages/about.md` - About page content
- `src/content.config.ts` - Content collections and their Zod schemas (Content Layer API)
- `astro-paper.config.ts` - Site configuration (URL, title, author, timezone, pagination, features, socials, share links)
- `src/config.ts` - Resolves `astro-paper.config.ts` with defaults; do not put values here
- `src/components/` - Shared Astro components (all server-rendered)
- `src/layouts/` - `Layout.astro` and `PostLayout.astro`
- `src/pages/` - Route definitions; post-page components in `src/pages/posts/[...slug]/_components/`
- `src/i18n/` - UI strings (`useTranslations`)
- `src/scripts/theme.ts` - Light/dark theme toggle (bundled client script)
- `src/utils/` - Post paths, sorting, filtering, tags, slugs, timezone, rehype plugins, Shiki transformer

**Component Pattern:** All components are Astro (`.astro`). Search is the Pagefind UI in `src/pages/search.astro`.

## Blog Post Frontmatter Schema

```yaml
title: string (required)
description: string (required)
pubDatetime: date (required)
modDatetime: date | null (optional)
author: string (default: site author)
featured: boolean (optional)
draft: boolean (optional)
tags: string[] (default: ["others"])
ogImage: image | string (optional)
canonicalURL: string (optional)
hideEditPost: boolean (optional)
hideToc: boolean (optional)
timezone: string (optional, IANA; empty means site timezone)
```

The URL slug is the file name: `src/content/posts/foo.md` → `/posts/foo/`. Files and directories starting with `_` are not loaded.

## TypeScript Path Aliases

```
@/*                   → src/*
@/astro-paper.config  → astro-paper.config.ts
```

## Git Workflow

- Uses conventional commits via commitizen (`bun run cz`)
- Pre-commit hooks run Prettier via lint-staged
- GitHub Actions runs lint, unit tests, build, e2e tests, and Lighthouse CI on every push/PR
- Lighthouse CI enforces a minimum 85% performance score (fails build if below threshold)

## Code Style

- **No useless comments:** NEVER add obvious, redundant, or explanatory comments that merely restate what the code does. Comments should only explain non-obvious logic or provide important context that cannot be understood from the code itself.
- **Remove AI-generated comments:** If you encounter comments that appear to be AI-generated boilerplate (e.g., "// Initialize the search", "// Handle input changes", "// Render results"), remove them.
- **Clean code over documented code:** Write self-documenting code with clear variable/function names instead of adding comments.

## Tests Policy

**NEVER delete or modify existing tests without explicitly asking the user first.** If a test is failing:
1. Fix the code to make the test pass, OR
2. Ask the user if the test expectation is wrong before changing it

## Before Committing Any Change

**REQUIRED:** Before making ANY commit, you MUST run these checks locally IN THIS EXACT ORDER and ensure they ALL pass:

```bash
bun run clean               # Start fresh like CI (removes dist/ and public/pagefind/)
bun run lint                # 1. Linting (0 errors)
bun run build               # 2. Build (must run before unit tests!)
bun run test:run            # 3. Unit tests (71+ tests, requires dist/)
bun run test:e2e            # 4. E2E tests (96+ tests)
bun run lighthouse          # 5. Lighthouse CI (85%+ performance)
```

This matches the exact order in `.github/workflows/test.yml`. The build MUST run before unit tests because `tests/build.test.ts` checks for files in `dist/`. Do NOT commit if any check fails.

**After running all checks, you MUST:**

1. Display a summary table to the user:

| Check | Status | Details |
|-------|--------|---------|
| Lint | ✓ PASS | 0 errors |
| Build | ✓ PASS | X pages indexed |
| Unit Tests | ✓ PASS | X tests passed |
| E2E Tests | ✓ PASS | X tests passed |
| Lighthouse | ✓ PASS | X% performance |

2. Prepend an entry to `CHANGELOG.md` with the current date/time as header:

```markdown
## YYYY-MM-DD HH:MM

| Check | Status | Details |
|-------|--------|---------|
| Lint | ✓ PASS | 0 errors |
| Build | ✓ PASS | X pages indexed |
| Unit Tests | ✓ PASS | X tests passed |
| E2E Tests | ✓ PASS | X tests passed |
| Lighthouse | ✓ PASS | X% performance |

### Lighthouse Performance (https://blog.kulkarni.cloud/)

| Device | Score | FCP | LCP | TBT | CLS | SI |
|--------|-------|-----|-----|-----|-----|-----|
| Mobile | X% | Xs | Xs | Xms | X | Xs |
| Desktop | X% | Xs | Xs | Xms | X | Xs |

**Diagnostics:** <list any issues found>

Changes: <brief description of what changed>
```

## Content Layer API

Content collections use the new Content Layer API:
- Config file at `src/content.config.ts` (not `src/content/config.ts`)
- Collection `posts`: `loader: glob({ pattern: "**/[^_]*.{md,mdx}", base: "./src/content/posts" })`
- Collection `pages`: same pattern, `base: "./src/content/pages"`
- Never put `AGENTS.md` or any other non-content `.md` under `src/content/posts/`, `src/content/pages/` or `src/pages/`: it becomes an entry or a route
- Zod imported from `astro/zod` (not `astro:content`)
- Render method: `import { render } from "astro:content"; const { Content } = await render(post);`

## Tooling

- **Versions:** `mise.toml` pins Node.js, Bun and the Cloudflare CLI (`cloudflare-cf`, command `cloudflare`) (`mise install`); CI installs them with `jdx/mise-action`
- **Package Manager:** Bun 1.4.4
- **Runtime:** Node.js 26.13.0 (for Astro internals)
- **TypeScript:** 6.x. Do not move to 7 until `astro check` and typescript-eslint support it (both refuse to run on 7.0)
- **Markdown:** `unified()` processor from `@astrojs/markdown-remark` in `astro.config.ts` (Astro 7 defaults to Sätteri) with rehype plugins `rehypeHeadingIds`, `rehypeInlineToc` (deprecated, v8 removes it), `rehype-callouts`, `rehypeTableWrapper`; MDX via `@astrojs/mdx`
- **ESLint:** v10 with flat config (`eslint.config.js`)
- **Prettier:** v3 with Astro and Tailwind plugins
- **Testing:** Vitest (unit), Playwright (e2e)
- **Performance:** Lighthouse CI (min 85% score, config in `lighthouserc.json`)
- **Search:** Pagefind (build-time indexing)
- **Tailwind:** v4 with CSS-first config (`src/styles/global.css`, tokens in `src/styles/theme.css`)

## Key Libraries & Technical Details

| Purpose | Library | Notes |
|---------|---------|-------|
| Date formatting | `dayjs` (utc, timezone) | Datetime.astro, postFilter; site timezone `Europe/Berlin` |
| Slug generation | `slugify` + `lodash.kebabcase` | slugify for ASCII, kebabCase when non-Latin chars are present |
| OG image generation | `satori` + `sharp` | Outputs PNG; font read from the Astro Fonts API |
| Font | Google Sans Code | Astro Fonts API (`fonts` in `astro.config.ts`, `<Font>` in Layout.astro) |
| Search | Pagefind + `@pagefind/default-ui` | Build-time indexing; `copy-pagefind.mjs` copies the index to `public/pagefind/` for dev |
| Syntax highlighting | Shiki with `@shikijs/transformers` | Themes: `github-light` / `github-dark`, plus the `fileName` transformer |
| Callouts | `rehype-callouts` | Obsidian theme CSS imported in `global.css` |

**Important patterns:**
- No client framework. Client JS is bundled `<script>` (Astro-processed); `is:inline` only for the FOUC theme script and JSON-LD in the layouts and the post page script
- Theme: inline FOUC script in `Layout.astro` sets `data-theme` before paint; `src/scripts/theme.ts` handles the toggle and View Transitions
- Tailwind v4 uses CSS-first config in `src/styles/global.css` (no `tailwind.config.js`)
- OG image routes: `src/pages/og.png.ts` (site default, used only when `public/astropaper-og.jpg` is missing) and `src/pages/posts/[...slug]/index.png.ts` (per post without `ogImage`)
- Content path: `src/content/posts/` (not `src/data/blog/`)
- Redirects: `public/_redirects` (Cloudflare, `/posts/1` → `/posts/` 301); `redirects` in `astro.config.ts` covers `astro preview` only

## Cloudflare Pages Deployment

- **Build command:** `bun install && bun run build`
- **Output directory:** `dist`
- **Node.js version:** read from `.nvmrc`. Cloudflare Pages does not read `mise.toml`, so `.nvmrc` must equal the `node` pin in `mise.toml`; CI fails if they differ
- **Bun version:** Cloudflare Pages takes it only from the `BUN_VERSION` environment variable in the Pages project settings; keep it equal to the `bun` pin in `mise.toml`
- **Pages project:** `blog` (subdomain `blog-7qk.pages.dev`). Manage it with the `cloudflare` CLI, and ask the user before every `cloudflare` command

### Bot Protection (Cloudflare Turnstile)

The production site is gated at the edge, as in the bio repo: no page is served until Cloudflare Turnstile has been passed.
- `functions/_middleware.ts` checks every request for the `blog_session` cookie. Without it, page loads get a self-contained challenge page (401, `noindex`) and other requests a bare 401. Public without the cookie: `/api/*`, `/rss.xml`, sitemaps, `/robots.txt`, favicons and OG images.
- The challenge page posts the token to `functions/api/verify-turnstile.ts`, which verifies it with Cloudflare siteverify and sets `blog_session` (HMAC-signed with `TURNSTILE_SECRET_KEY`, `HttpOnly; Secure; SameSite=Lax`, 24 h). The page reloads into the requested URL.
- Environment variables (Pages project settings): `TURNSTILE_SITE_KEY` and `TURNSTILE_SECRET_KEY` for Production; `PREVIEW=true` for Preview, which leaves preview deployments open.
- Trade-off the user accepted: search engines and link-preview bots cannot read post pages.
- Local dev, `astro preview`, e2e and Lighthouse run without the gate (Functions only run on Cloudflare). Unit tests: `tests/functions/turnstile.test.ts`.

## Static Assets

Images for blog posts are stored in `public/assets/` organized by date:
- `public/assets/20221008/` - DALL-E generated images
- `public/assets/20221010/` - MonkeyUser comics
- `public/assets/20221112/` - XKCD comics, tmux images
- `public/assets/20221126/` - Gradle post images
- `public/assets/20221227/` - GitHub Actions screenshots

Reference in markdown as `/assets/YYYYMMDD/filename.png`

Other files in `public/`: `astropaper-og.jpg` (default OG image), `favicon.svg`, `_redirects`, and a static copy of one pre-v7 OG PNG kept for old links. `robots.txt` is generated by `src/pages/robots.txt.ts`. Never put an `AGENTS.md` in `public/`: everything there is published.
