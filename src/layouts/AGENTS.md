<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-11-10 | Updated: 2026-11-10 -->

# layouts

## Purpose

Page shells. `Layout.astro` is the base HTML document; the others compose it with Header/Footer for specific page types.

## Key Files

| File                | Description                                                                                                                                                                                                                                                                                        |
| ------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Layout.astro`      | `<html>` shell: meta/OG/Twitter tags, canonical URL, IBM Plex Mono font, optional `PUBLIC_GOOGLE_SITE_VERIFICATION`, imports `@styles/base.css`, loads `/toggle-theme.js` inline. Props: `title?`, `author?`, `description?`, `ogImage?`, `ogType?: "website" \| "article"` (defaults from `SITE`) |
| `Main.astro`        | Breadcrumbs + `<main id="main-content">` with h1/description and slot. Props: `pageTitle`, `pageDesc?`. Used by Posts, search, tags pages                                                                                                                                                          |
| `Posts.astro`       | Paginated post list (Layout + Header + Main + Card + Footer + Prev/Next `LinkButton`s). Props: `pageNum`, `totalPages`, `posts`. Card links use `slugify(data)`                                                                                                                                    |
| `PostDetails.astro` | Single post: `render(post)` to `Content`, back button, `Datetime`, tags. Prop: `post: CollectionEntry<"blog">`. OG image is `ogImage` or `<title>.png` (route `src/pages/[ogTitle].png.ts`)                                                                                                        |
| `AboutLayout.astro` | Layout for `pages/about.md` (markdown `layout:`). Prop: `frontmatter: { title, description? }`                                                                                                                                                                                                     |

## For AI Agents

### Working In This Directory

- `Layout.astro` is the only file with `<html>`; do not nest layouts except as Layout wraps content.
- Pages pass `activeNav` to `Header` themselves (Posts/AboutLayout set it; `PostDetails` does not).
- `Main.astro`, `PostDetails.astro`, `Posts.astro` have scoped styles that need `@reference "../styles/tailwind.css";`. `Layout.astro` and `AboutLayout.astro` have none.

### Testing Requirements

- E2E: `e2e/posts.spec.ts`, `e2e/navigation.spec.ts`, `e2e/og-images.spec.ts` (meta/OG tags), `e2e/dark-mode.spec.ts`, `e2e/code-blocks.spec.ts` (PostDetails prose).
- `tests/build.test.ts` needs `dist/` from `bun run build`.

## Dependencies

### Internal

`@config`, `@components/*`, `@utils/slugify`, `@styles/base.css`, `public/toggle-theme.js`, `astro:content`.

### External

`astro:content` `render`.

<!-- MANUAL: Any manually added notes below this line are preserved on regeneration -->
