# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a personal blog built with AstroPaper, an Astro 6 Beta-based static site generator. The blog is deployed to Cloudflare Pages at https://b.kulkarni.cloud/.

**Stack:** Astro 6 Beta + TypeScript + TailwindCSS v4 + Bun

## Commands

| Command | Purpose |
|---------|---------|
| `bun run dev` | Start dev server at localhost:4321 |
| `bun run build` | Build production site to `./dist/` |
| `bun run preview` | Preview production build locally |
| `bun run lint` | Run ESLint (flat config) |
| `bun run lint:fix` | Run ESLint with auto-fix |
| `bun run format` | Format code with Prettier |
| `bun run format:check` | Check formatting without fixing |
| `bun run test` | Run unit tests with Vitest |
| `bun run test:run` | Run unit tests once |
| `bun run test:e2e` | Run e2e tests with Playwright |
| `bun run cz` | Commit with commitizen (conventional commits) |
| `bun run sync` | Generate TypeScript types for Astro modules |

## Architecture

**Key Directories:**
- `src/data/blog/` - Markdown blog posts with YAML frontmatter
- `src/content.config.ts` - Content collection configuration (Astro 6 Content Layer API)
- `src/content/_schemas.ts` - Zod schema for blog post frontmatter validation
- `src/components/` - Astro components (all server-rendered)
- `src/layouts/` - Page layout templates
- `src/pages/` - Route definitions
- `src/utils/` - Utility functions (sorting, slugifying, pagination, OG image generation)
- `src/config.ts` - Site configuration (title, author, socials, posts per page)

**Component Pattern:** All components are Astro (`.astro`) including Search (Pagefind-based), Card, and Datetime.

## Blog Post Frontmatter Schema

```yaml
title: string (required)
description: string (required)
pubDatetime: date (required)
author: string (optional)
postSlug: string (optional)
featured: boolean (optional)
draft: boolean (optional)
tags: string[] (default: ["others"])
ogImage: string (optional)
```

## TypeScript Path Aliases

```
@assets/*     → src/assets/*
@components/* → src/components/*
@content/*    → src/content/*
@layouts/*    → src/layouts/*
@pages/*      → src/pages/*
@styles/*     → src/styles/*
@utils/*      → src/utils/*
@config       → src/config.ts
```

## Git Workflow

- Uses conventional commits via commitizen (`bun run cz`)
- Pre-commit hooks run Prettier via lint-staged
- GitHub Actions runs lint, unit tests, build, and e2e tests on every push/PR

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
rm -rf dist                 # Start fresh like CI
bun run lint                # 1. Linting (0 errors)
bun run build               # 2. Build (must run before unit tests!)
bun run test:run            # 3. Unit tests (94+ tests, requires dist/)
bun run test:e2e            # 4. E2E tests (55+ tests)
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

2. Prepend an entry to `CHANGELOG.md` with the current date/time as header:

```markdown
## YYYY-MM-DD HH:MM

| Check | Status | Details |
|-------|--------|---------|
| Lint | ✓ PASS | 0 errors |
| Build | ✓ PASS | X pages indexed |
| Unit Tests | ✓ PASS | X tests passed |
| E2E Tests | ✓ PASS | X tests passed |

Changes: <brief description of what changed>
```

## Astro 6 Content Layer API

Content collections use the new Content Layer API:
- Config file at `src/content.config.ts` (not `src/content/config.ts`)
- Uses `glob` loader: `loader: glob({ pattern: "**/*.md", base: "./src/data/blog" })`
- Zod imported from `astro/zod` (not `astro:content`)
- Render method: `import { render } from "astro:content"; const { Content } = await render(post);`

## Tooling

- **Package Manager:** Bun 1.3.6
- **Runtime:** Node.js 24.13.0 (for Astro internals)
- **ESLint:** v9 with flat config (`eslint.config.js`)
- **Prettier:** v3 with Astro and Tailwind plugins
- **Testing:** Vitest (unit), Playwright (e2e)
- **Search:** Pagefind (build-time indexing)
- **Tailwind:** v4 with CSS-first config (`src/styles/tailwind.css`)

## Key Libraries & Technical Details

| Purpose | Library | Notes |
|---------|---------|-------|
| Date formatting | `dayjs` | Used in Datetime.astro |
| Slug generation | `slugify` + `lodash.kebabcase` | kebabCase first, then slugify |
| OG image generation | `satori` + `@resvg/resvg-js` | Outputs PNG (not SVG) |
| Search | Pagefind | Build-time indexing, `<script is:inline>` for runtime |
| Syntax highlighting | Shiki with `@shikijs/transformers` | Theme: one-dark-pro |
| Tailwind scoped styles | `@reference` directive | Required in all `<style>` blocks |

**Important patterns:**
- All interactive components use `<script is:inline>` (no React/client-side hydration)
- Tailwind v4 uses CSS-first config in `src/styles/tailwind.css` (no `tailwind.config.js`)
- OG images route: `src/pages/[ogTitle].png.ts` generates PNG dynamically
- Content path: `src/data/blog/` (not `src/content/blog/`)

## Cloudflare Pages Deployment

- **Build command:** `bun install && bun run build`
- **Output directory:** `dist`
- **Versions:** Managed via `.tool-versions` (Cloudflare reads this automatically)

The `.tool-versions` file specifies:
```
nodejs 24.13.0
bun 1.3.6
```

## Static Assets

Images for blog posts are stored in `public/assets/` organized by date:
- `public/assets/20221008/` - DALL-E generated images
- `public/assets/20221010/` - MonkeyUser comics
- `public/assets/20221112/` - XKCD comics, tmux images
- `public/assets/20221126/` - Gradle post images
- `public/assets/20221227/` - GitHub Actions screenshots

Reference in markdown as `/assets/YYYYMMDD/filename.png`
