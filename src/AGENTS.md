<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-11-10 | Updated: 2026-11-11 -->

# src

## Purpose

All site source: Astro routes, components, layouts, content collections, i18n strings, client scripts and utilities. Conventions, the `@/*` alias and commands live in `../CLAUDE.md`.

## Key Files

| File                | Description                                                                                                                                                                                                                                                                                                       |
| ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `config.ts`         | Upstream resolver: default export `config: ResolvedAstroPaperConfig` = `../astro-paper.config.ts` plus defaults (`ogImage`, `lang`, `timezone`, `dir`, `googleVerification` from `PUBLIC_GOOGLE_SITE_VERIFICATION`, `perPage`, `perIndex`, `features.*`). Do not put values here; edit `../astro-paper.config.ts` |
| `content.config.ts` | Collections `posts` (`glob` over `**/[^_]*.{md,mdx}` in `src/content/posts`, exported as `BLOG_PATH`) and `pages` (same pattern in `src/content/pages`). Frontmatter schemas live here (see `../CLAUDE.md`)                                                                                                       |

## Subdirectories

| Directory     | Purpose                                                                                                          |
| ------------- | ---------------------------------------------------------------------------------------------------------------- |
| `assets/`     | SVG icons imported as components (see `assets/AGENTS.md`)                                                        |
| `components/` | Shared Astro components (see `components/AGENTS.md`)                                                             |
| `content/`    | `posts/` and `pages/` markdown (see `content/AGENTS.md`; no `AGENTS.md` inside `posts/` or `pages/`)             |
| `i18n/`       | UI strings and `useTranslations` (see `i18n/AGENTS.md`)                                                          |
| `layouts/`    | `Layout.astro` and `PostLayout.astro` (see `layouts/AGENTS.md`)                                                  |
| `pages/`      | File-based routes, documented in "Routes" below (no `AGENTS.md` inside)                                          |
| `scripts/`    | Bundled client scripts: `theme.ts` (see `scripts/AGENTS.md`)                                                     |
| `styles/`     | `global.css`, `theme.css`, `typography.css` (see `styles/AGENTS.md`)                                             |
| `types/`      | `config.ts`: config types (see `types/AGENTS.md`)                                                                |
| `utils/`      | Post paths, sorting, filtering, tags, slugs, timezone, rehype plugins, Shiki transformer (see `utils/AGENTS.md`) |

## Routes (`pages/`)

Never put an `AGENTS.md` (or any stray `.md`) under `pages/`, `content/posts/` or `content/pages/`: Astro turns every `.md` in `pages/` into a public route, and the `posts`/`pages` glob loaders treat every `.md` there as an entry and fail the build on missing frontmatter. Files and directories starting with `_` are skipped by both.

| File                                 | Route                            | Description                                                                                                                 |
| ------------------------------------ | -------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| `pages/index.astro`                  | `/`                              | Hero, socials, featured posts, `config.posts.perIndex` recent posts                                                         |
| `pages/about.astro`                  | `/about/`                        | Renders the `pages` entry `about` (`content/pages/about.md`)                                                                |
| `pages/search.astro`                 | `/search/`                       | Pagefind UI (`@pagefind/default-ui`)                                                                                        |
| `pages/404.astro`                    | 404                              | Not-found page                                                                                                              |
| `pages/rss.xml.ts`                   | `/rss.xml`                       | `@astrojs/rss` feed of sorted posts, links from `getPostUrl`                                                                |
| `pages/robots.txt.ts`                | `/robots.txt`                    | Allows all, points at `sitemap-index.xml`                                                                                   |
| `pages/og.png.ts`                    | `/og.png`                        | Site-wide default OG PNG (satori + sharp). Only used when `public/<site.ogImage>` is missing                                |
| `pages/archives/index.astro`         | `/archives/`                     | Posts grouped by year/month; redirects to 404 while `features.showArchives` is false (it is). `_utils/` is not a route      |
| `pages/posts/[...page].astro`        | `/posts/`, `/posts/N/`           | `paginate` over sorted posts, `config.posts.perPage` per page. `/posts/1` is redirected (see `../public/_redirects`)        |
| `pages/posts/[...slug]/index.astro`  | `/posts/<slug>/`                 | Post page: `PostLayout`, TOC, edit-post, share links, prev/next. Slug from `getPostSlug`. Local `_components/` (not routes) |
| `pages/posts/[...slug]/index.png.ts` | `/posts/<slug>/index.png`        | Per-post OG PNG for posts without `ogImage`, when `features.dynamicOgImage` is on                                           |
| `pages/tags/index.astro`             | `/tags/`                         | All tags from `getUniqueTags`                                                                                               |
| `pages/tags/[tag]/[...page].astro`   | `/tags/<tag>/`, `/tags/<tag>/N/` | Paginated posts per slugified tag                                                                                           |

- All `pages/**` files are vendored upstream bytes; keep them unchanged (see "Upstream delta" in `../AGENTS.md`).
- Both OG routes read Google Sans Code from the Astro Fonts API (`fontData["--font-google-sans-code"]`) via `utils/getFontPathByWeight.ts`.

## For AI Agents

### Working In This Directory

- Import with the single alias `@/*` (`@/config`, `@/utils/...`, `@/components/...`).
- Site values (URL, socials, pagination, features) belong in `../astro-paper.config.ts`; `config.ts` only resolves defaults.
- Add a social network by adding `assets/icons/socials/<name>.svg` and a `socials` entry with that `name`.

### Testing Requirements

`bun run lint` and `bun run build` (runs `astro check`). See `../tests/AGENTS.md` and `../e2e/AGENTS.md`.

## Dependencies

### Internal

`../astro-paper.config.ts`, `../public/` (static files), `../tests/`, `../e2e/`.

### External

`astro` (`astro:content`, `astro:i18n`, `astro:assets`, `astro:env/client`, `astro:transitions`), `astro/zod`, `astro/loaders`.

<!-- MANUAL: Any manually added notes below this line are preserved on regeneration -->
