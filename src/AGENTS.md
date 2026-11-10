<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-11-10 | Updated: 2026-11-10 -->

# src

## Purpose

All site source: Astro routes, components, layouts, content collection config, blog posts and utilities. Conventions, aliases and commands live in `../CLAUDE.md`.

## Key Files

| File                | Description                                                                                                                                                                                                              |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `config.ts`         | Exports `SITE` (website `https://b.kulkarni.cloud/`, author, title, desc, default `ogImage`, `lightAndDarkMode`, `postPerPage: 3`), `LOGO_IMAGE` and `SOCIALS` (entries with an `active` flag; only active ones render). |
| `types.ts`          | Types `Site`, `SocialObjects`, `SocialIcons`, `SocialMedia` (union of supported network names).                                                                                                                          |
| `content.config.ts` | Defines the `blog` collection: `glob` loader over `**/*.md` in `./src/data/blog`, schema `blogSchema` from `content/_schemas.ts`.                                                                                        |
| `env.d.ts`          | Triple-slash references to `.astro/types.d.ts` and `astro/client`.                                                                                                                                                       |

## Subdirectories

| Directory     | Purpose                                                                                                   |
| ------------- | --------------------------------------------------------------------------------------------------------- |
| `assets/`     | `socialIcons.ts` only: SVG strings per `SocialMedia` (see `assets/AGENTS.md`)                             |
| `components/` | Astro components (see `components/AGENTS.md`)                                                             |
| `content/`    | Zod frontmatter schema (see `content/AGENTS.md`)                                                          |
| `data/`       | `blog/` posts, frontmatter schema, image rules (see `data/AGENTS.md`; no `AGENTS.md` inside `data/blog/`) |
| `layouts/`    | Page layouts (see `layouts/AGENTS.md`)                                                                    |
| `pages/`      | File-based routes, documented in "Routes" below (no `AGENTS.md` inside)                                   |
| `styles/`     | `base.css`, `tailwind.css` (see `styles/AGENTS.md`)                                                       |
| `utils/`      | Post sorting, tags, slugs, pagination, OG image (see `utils/AGENTS.md`)                                   |

## Routes (`pages/`)

Never put an `AGENTS.md` (or any stray `.md`) under `pages/` or `data/blog/`: Astro turns every `.md` in `pages/` into a public route, and the `blog` glob loader treats every `.md` in `data/blog/` as a post and fails the build on missing frontmatter. Both directories are documented here and in `data/AGENTS.md` instead.

| File                       | Route                         | Description                                                                                                                                             |
| -------------------------- | ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `pages/index.astro`        | `/`                           | Hero, optional Featured (`data.featured`), 4 most recent posts. Uses `getSortedPosts`, `slugify`, `SOCIALS`                                             |
| `pages/about.md`           | `/about`                      | Markdown with `layout: ../layouts/AboutLayout.astro`                                                                                                    |
| `pages/search.astro`       | `/search`                     | Layout + Main + `Search` component                                                                                                                      |
| `pages/404.astro`          | 404                           | Not-found page with "Go back home" link                                                                                                                 |
| `pages/rss.xml.ts`         | `/rss.xml`                    | `@astrojs/rss` feed from sorted posts; links are `posts/<slugify(data)>`                                                                                |
| `pages/[ogTitle].png.ts`   | `/<post title>.png`           | Static PNG per non-draft post lacking `ogImage`, via `@utils/generateOgImage`                                                                           |
| `pages/posts/index.astro`  | `/posts`                      | First `SITE.postPerPage` posts into `Posts` layout with `pageNum={1}`                                                                                   |
| `pages/posts/[slug].astro` | `/posts/<slug>`, `/posts/<N>` | `getStaticPaths` returns one path per non-draft post (`slugify(post.data)`, props `{ post }`) plus one per page number from `getPageNumbers` (no props) |
| `pages/tags/index.astro`   | `/tags`                       | All tags from `getUniqueTags`, rendered as `Tag` (`size="lg"`) inside `Main`                                                                            |
| `pages/tags/[tag].astro`   | `/tags/<tag>`                 | `getStaticPaths` maps `getUniqueTags(posts)` to params/props; lists non-draft posts via `getPostsByTag` as `Card`s                                      |

- Blog content lives in `data/blog/`, not `pages/`. `getSortedPosts` and `getUniqueTags` already filter drafts.
- `[ogTitle].png.ts` uses the raw post title as the param; `PostDetails` builds the matching URL `<title>.png`.
- `posts/[slug].astro` branches on `Astro.props.post`: present renders `PostDetails`, absent renders `Posts` for page `Number(slug)`. A purely numeric post slug would collide with a page number.
- Prev/Next links in `layouts/Posts.astro` expect page 1 at `/posts` and later pages at `/posts/N`.
- Tag params are slugified by `getUniqueTags`; `Tag.astro` links use `name.toLowerCase()`, which must match the slug.
- Scoped styles in `pages/index.astro` and `pages/404.astro` need `@reference "../styles/tailwind.css";`.
- E2E coverage: `homepage`, `navigation` (about, 404), `search`, `rss`, `og-images`, `posts`, `code-blocks`, `tags` specs in `../e2e/`. Unit: `../tests/build.test.ts` plus `../tests/utils/` (`getPageNumbers`, `slugify`, `getSortedPosts`, `getUniqueTags`, `getPostsByTag`, `generateOgImage`).

## For AI Agents

### Working In This Directory

- Use the path aliases from `../CLAUDE.md` (`@config`, `@utils/*`, ...) instead of relative imports across directories.
- `SITE.postPerPage` drives pagination via `utils/getPageNumbers.ts`; `SITE.ogImage` is the fallback OG image.
- Add a social link by editing `SOCIALS` (and `SocialMedia`/`assets/socialIcons.ts` for a new network).

### Testing Requirements

`bun run lint` and `bun run build` (runs `astro check`). See `../tests/AGENTS.md` and `../e2e/AGENTS.md`.

## Dependencies

### Internal

`../public/` (static files), `../tests/`, `../e2e/`.

### External

`astro`, `astro/zod`, `astro/loaders`.

<!-- MANUAL: Any manually added notes below this line are preserved on regeneration -->
