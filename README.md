# Developer Musings

Personal blog built with AstroPaper, deployed at [blog.kulkarni.cloud](https://blog.kulkarni.cloud/)

## Tech Stack

| Category        | Technology             |
| --------------- | ---------------------- |
| Framework       | Astro 6 Beta           |
| Components      | React 18               |
| Styling         | TailwindCSS            |
| Language        | TypeScript             |
| Package Manager | Bun 1.3.6              |
| Runtime         | Node.js 24.13.0        |
| Linting         | ESLint 9 (flat config) |
| Formatting      | Prettier 3             |
| Unit Tests      | Vitest                 |
| E2E Tests       | Playwright             |
| Deployment      | Cloudflare Pages       |

## Commands

```bash
bun install          # Install dependencies
bun run dev          # Start dev server (localhost:4321)
bun run build        # Build for production
bun run preview      # Preview production build
bun run test:run     # Run unit tests (42 tests)
bun run test:e2e     # Run E2E tests (34 tests)
bun run lint         # Lint code
bun run format       # Format code
bun run cz           # Commit with conventional commits
```

## Project Structure

```
src/
├── content/
│   ├── blog/           # Markdown blog posts
│   └── _schemas.ts     # Zod frontmatter schema
├── content.config.ts   # Astro 6 Content Layer config
├── components/         # Astro + React components
├── layouts/            # Page layouts
├── pages/              # Routes
├── utils/              # Utilities
└── config.ts           # Site configuration

public/assets/          # Static images
tests/                  # Vitest unit tests
e2e/                    # Playwright E2E tests
```

## Blog Post Frontmatter

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

## Features

- Light/dark mode
- Fuzzy search
- SEO optimized
- RSS feed
- Sitemap
- Dynamic OG images
- Accessible (keyboard/screen reader)
- Mobile responsive

## License

MIT

---

Based on [AstroPaper](https://github.com/satnaing/astro-paper) by Sat Naing
