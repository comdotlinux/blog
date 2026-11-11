<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-11-10 | Updated: 2026-11-11 -->

# utils

## Purpose

Helpers for post paths, listing, filtering, tags, slugs, timezones and OG fonts, plus the rehype plugins and Shiki transformer wired in `astro.config.ts`. All vendored unchanged from upstream. Imported via `@/utils/*`.

## Key Files

| File                           | Description                                                                                                                                                                                                                         | Main consumers                                                                                                                        |
| ------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| `getPostPaths.ts`              | `getPostSlug(id, filePath)` (route param, e.g. `/my-post`; sub-directories of `content/posts/` become slugified path segments, `_dirs` skipped) and `getPostUrl(id, filePath, locale?)` (`posts/<slug>` via `getRelativeLocaleUrl`) | `components/Card.astro`, `pages/rss.xml.ts`, `pages/posts/[...slug]/*`                                                                |
| `postFilter.ts`                | Drops drafts; in production also drops posts whose `pubDatetime` day is after the build day (post or site timezone). Dev shows all non-drafts                                                                                       | `getSortedPosts.ts`, `getUniqueTags.ts`, `pages/archives/`, `pages/posts/[...slug]/index.png.ts`                                      |
| `getSortedPosts.ts`            | `postFilter`, then newest first by `modDatetime ?? pubDatetime` (second resolution)                                                                                                                                                 | `pages/index.astro`, `pages/rss.xml.ts`, `pages/posts/**`, `pages/tags/[tag]/[...page].astro`                                         |
| `getUniqueTags.ts`             | De-duplicated, sorted `{ tag, tagName }` of non-filtered posts; `tag` is the slug, `tagName` the first label seen                                                                                                                   | `pages/tags/**`                                                                                                                       |
| `slugify.ts`                   | `slugifyStr(str)`: `slugify` (lower, strict) for ASCII, `lodash.kebabcase` when non-Latin chars are present; `slugifyAll(arr)`                                                                                                      | `getPostPaths.ts`, `getUniqueTags.ts`, `toTransitionName.ts`, `pages/posts/[...slug]/index.astro`, `pages/tags/[tag]/[...page].astro` |
| `toTransitionName.ts`          | Valid CSS `<custom-ident>` for `view-transition-name` (non-ASCII hex-encoded, `p-` prefix before a digit)                                                                                                                           | `components/Card.astro`, `pages/posts/[...slug]/index.astro`                                                                          |
| `resolveTimezone.ts`           | Returns the zone if valid IANA, else `UTC` with one warning per bad value                                                                                                                                                           | `components/Datetime.astro`, `postFilter.ts`, `pages/archives/`                                                                       |
| `resolveDefaultOgImagePath.ts` | Default OG path: `public/<site.ogImage>` if it exists, else `/og.png` (when `dynamicOgImage`). Throws on a non-filename `ogImage`, or a missing file with `dynamicOgImage` off                                                      | `layouts/Layout.astro`                                                                                                                |
| `withBase.ts`                  | `stripLocale`, `stripBase`, `getAssetPath` for the Astro `base` setting                                                                                                                                                             | `components/Breadcrumb.astro`, `components/Header.astro`, `layouts/Layout.astro`, `pages/search.astro`                                |
| `getFontPathByWeight.ts`       | Finds a `FontData` file URL by weight/style/format (default `truetype`)                                                                                                                                                             | `pages/og.png.ts`, `pages/posts/[...slug]/index.png.ts`                                                                               |
| `buildTocTree.ts`              | `buildTocTree(headings, maxDepth = 3)` nests headings; `hasToc` is true from 2 headings in range                                                                                                                                    | `pages/posts/[...slug]/_components/*`, `rehypeInlineToc.js`                                                                           |
| `rehypeInlineToc.js`           | Deprecated (removed in v8): turns an author-written "Table of contents" heading into a collapsed `details.toc-inline`. `inlineTocDeprecation()` integration warns when posts use it                                                 | `astro.config.ts`, `pages/posts/[...slug]/_components/PostToc.astro`                                                                  |
| `rehypeTableWrapper.js`        | Wraps each table in a focusable, scrollable `div.table-wrapper` (skips `ResponsiveTable`)                                                                                                                                           | `astro.config.ts`                                                                                                                     |
| `transformers/fileName.js`     | Shiki transformer: `file="name"` code-block meta becomes a label (`style` `v1`/`v2`, `hideDot`)                                                                                                                                     | `astro.config.ts`                                                                                                                     |

## For AI Agents

### Working In This Directory

- Posts are typed `CollectionEntry<"posts">`.
- Keep upstream bytes. `slugify.ts` and `toTransitionName.ts` have intentional ASCII-range regexes; ESLint's `no-control-regex` is turned off for them in `eslint.config.js` rather than editing the files.
- Before changing a signature, grep callers (list above).

### Testing Requirements

`bun run test:run` (see `../../tests/utils/AGENTS.md`). Never modify existing tests without asking the user.

## Dependencies

### Internal

`@/config`, `@/content.config` (`BLOG_PATH`), `@/types/config`.

### External

`slugify`, `lodash.kebabcase`, `dayjs`, `astro:i18n`, `astro:assets` (types).

<!-- MANUAL: Any manually added notes below this line are preserved on regeneration -->
