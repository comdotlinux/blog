<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-11-10 | Updated: 2026-11-10 -->

# utils

## Purpose

Pure helpers for post listing, tags, slugs, pagination and OG image rendering. Imported via `@utils/*` (or relatively). Each has a matching test in `../../tests/utils/`.

## Key Files

| File                 | Description                                                                                                                                                                                                                                                                                                                         | Main consumers                                                                                                                                               |
| -------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `slugify.ts`         | `slugifyStr(str)` (kebabCase then slugify, lower, strict); `slugifyAll(arr)`; default `slugify(post)` uses `postSlug` else `title`.                                                                                                                                                                                                 | `layouts/Posts.astro`, `pages/index.astro`, `pages/rss.xml.ts`, `pages/posts/[slug].astro`, `pages/tags/[tag].astro`, `getPostsByTag.ts`, `getUniqueTags.ts` |
| `getSortedPosts.ts`  | Drops `draft` posts, sorts by `pubDatetime` newest first (second resolution).                                                                                                                                                                                                                                                       | `pages/index.astro`, `pages/rss.xml.ts`, `pages/posts/index.astro`, `pages/posts/[slug].astro`                                                               |
| `getPostsByTag.ts`   | Filters posts whose slugified tags include the given (already slugified) tag. Does not drop drafts.                                                                                                                                                                                                                                 | `pages/tags/[tag].astro`                                                                                                                                     |
| `getUniqueTags.ts`   | Slugified, de-duplicated tags of non-draft posts.                                                                                                                                                                                                                                                                                   | `pages/tags/index.astro`, `pages/tags/[tag].astro`                                                                                                           |
| `getPageNumbers.ts`  | `[1..ceil(n / SITE.postPerPage)]`.                                                                                                                                                                                                                                                                                                  | `pages/posts/index.astro`, `pages/posts/[slug].astro`                                                                                                        |
| `generateOgImage.ts` | Default export `generateOgImage(text = SITE.title)` returns a 1200x630 PNG Buffer (satori to SVG, resvg to PNG). Replaces slash, backslash, ?, %, \*, colon, pipe, quotes, angle brackets and spaces with `-`, then collapses `--`. Fetches IBM Plex Mono from 1001fonts.com at module load (top-level await), so it needs network. | `pages/[ogTitle].png.ts`                                                                                                                                     |

## For AI Agents

### Working In This Directory

- Posts are typed `CollectionEntry<"blog">`.
- `getPostsByTag` expects the tag slugified by the caller; do not pass raw tags.
- Before changing a signature, grep callers (list above).

### Testing Requirements

`bun run test:run` (see `../../tests/utils/AGENTS.md`). Never modify existing tests without asking the user.

## Dependencies

### Internal

`@config` (`SITE`), `@content/_schemas` (type `BlogFrontmatter`).

### External

`slugify`, `lodash.kebabcase`, `satori`, `@resvg/resvg-js`.

<!-- MANUAL: Any manually added notes below this line are preserved on regeneration -->
