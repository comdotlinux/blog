# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a personal blog built with AstroPaper, an Astro-based static site generator. The blog is deployed to Cloudflare Pages at https://b.kulkarni.cloud/.

## Commands

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start dev server at localhost:3000 |
| `npm run build` | Build production site to `./dist/` |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint |
| `npm run format` | Format code with Prettier |
| `npm run format:check` | Check formatting without fixing |
| `npm run cz` | Commit with commitizen (conventional commits) |
| `npm run sync` | Generate TypeScript types for Astro modules |

## Architecture

**Tech Stack:** Astro + React + TypeScript + TailwindCSS

**Key Directories:**
- `src/content/blog/` - Markdown blog posts with YAML frontmatter
- `src/components/` - Astro (server) and React (interactive) components
- `src/layouts/` - Page layout templates
- `src/pages/` - Route definitions
- `src/utils/` - Utility functions (sorting, slugifying, pagination, OG image generation)
- `src/config.ts` - Site configuration (title, author, socials, posts per page)
- `src/content/_schemas.ts` - Zod schema for blog post frontmatter validation

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

- Uses conventional commits via commitizen (`npm run cz`)
- Pre-commit hooks run Prettier via lint-staged
