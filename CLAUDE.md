# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a personal blog built with AstroPaper, an Astro 6 Beta-based static site generator. The blog is deployed to Cloudflare Pages at https://b.kulkarni.cloud/.

**Stack:** Astro 6 Beta + React + TypeScript + TailwindCSS + Bun

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
| `bun run test` | Run tests with Vitest |
| `bun run test:run` | Run tests once |
| `bun run cz` | Commit with commitizen (conventional commits) |
| `bun run sync` | Generate TypeScript types for Astro modules |

## Architecture

**Key Directories:**
- `src/content/blog/` - Markdown blog posts with YAML frontmatter
- `src/content.config.ts` - Content collection configuration (Astro 6 Content Layer API)
- `src/content/_schemas.ts` - Zod schema for blog post frontmatter validation
- `src/components/` - Astro (server) and React (interactive) components
- `src/layouts/` - Page layout templates
- `src/pages/` - Route definitions
- `src/utils/` - Utility functions (sorting, slugifying, pagination, OG image generation)
- `src/config.ts` - Site configuration (title, author, socials, posts per page)

**Component Pattern:** Astro components (`.astro`) for static content, React components (`.tsx`) for interactive features (Search, Card, Datetime).

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

## Code Style

- **No useless comments:** Do not add obvious or redundant comments that merely restate what the code does. Comments should only explain non-obvious logic or provide important context.

## Astro 6 Content Layer API

Content collections use the new Content Layer API:
- Config file at `src/content.config.ts` (not `src/content/config.ts`)
- Uses `glob` loader: `loader: glob({ pattern: "**/*.md", base: "./src/content/blog" })`
- Zod imported from `astro/zod` (not `astro:content`)
- Render method: `import { render } from "astro:content"; const { Content } = await render(post);`

## Tooling

- **Package Manager:** Bun 1.3.6
- **Runtime:** Node.js 24.13.0 (for Astro internals)
- **ESLint:** v9 with flat config (`eslint.config.js`)
- **Prettier:** v3 with Astro and Tailwind plugins
- **Testing:** Vitest

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
