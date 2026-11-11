<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-11-10 | Updated: 2026-11-11 -->

# layouts

## Purpose

Page shells, vendored unchanged from upstream. `Layout.astro` is the only `<html>` document; `PostLayout.astro` wraps it for post pages. Header, Main and Footer are composed by each page, not by the layouts.

## Key Files

| File               | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| ------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Layout.astro`     | `<html>` shell: canonical, favicon, Google Sans Code `<Font>` (preloads latin 400), title/description, OG and Twitter tags (`og:image` from `resolveDefaultOgImagePath`), RSS autodiscovery, empty `theme-color` meta, `head` slot, optional Google verification, inline FOUC script (sets `data-theme`, exposes `window.__theme`), `<ClientRouter />`, bundled `import "@/scripts/theme"`. Imports `@/styles/global.css`. Props: `title?`, `description?`, `ogImage?`, `canonicalURL?` |
| `PostLayout.astro` | `Layout` plus `og:type=article`, `article:published_time`/`modified_time` and `BlogPosting` JSON-LD (`<` escaped so a title cannot close the script) in the `head` slot. Props: `Layout` props plus `pubDatetime?`, `modDatetime?`. Used by `src/pages/posts/[...slug]/index.astro`                                                                                                                                                                                                     |

## For AI Agents

### Working In This Directory

- Keep these upstream bytes; site values come from `astro-paper.config.ts`.
- The inline FOUC script and `src/scripts/theme.ts` share the `theme` localStorage key and the `data-theme` attribute; change them together.
- `<ClientRouter />` enables View Transitions, so client scripts must re-run on `astro:after-swap` / `astro:page-load`.

### Testing Requirements

- E2E: `e2e/og-images.spec.ts` (meta/OG tags), `e2e/dark-mode.spec.ts`, `e2e/posts.spec.ts`.
- `tests/build.test.ts` needs `dist/` from `bun run build`.

## Dependencies

### Internal

`@/config`, `@/utils/resolveDefaultOgImagePath`, `@/utils/withBase`, `@/scripts/theme`, `@/styles/global.css`.

### External

`astro:assets` (`Font`), `astro:transitions` (`ClientRouter`).

<!-- MANUAL: Any manually added notes below this line are preserved on regeneration -->
