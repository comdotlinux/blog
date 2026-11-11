<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-11-10 | Updated: 2026-11-11 -->

# components

## Purpose

Shared server-rendered Astro components, vendored unchanged from upstream AstroPaper v7.1.0. No client framework. Post-page-only components live next to their route in `src/pages/posts/[...slug]/_components/`.

## Key Files

| File                    | Description                                                                                                                                                                                      |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `Breadcrumb.astro`      | Crumbs from `Astro.url.pathname` (base and locale stripped); collapses pagination segments. No props                                                                                             |
| `Card.astro`            | Post list item. Props: `variant?: "h2" \| "h3"` plus a `CollectionEntry<"posts">`. Links via `getPostUrl`, sets `transition:name` via `toTransitionName`, renders `Datetime`                     |
| `Datetime.astro`        | dayjs date in the post or site timezone (`resolveTimezone`); shows `modDatetime` when later. Props: `pubDatetime`, `modDatetime?`, `timezone?`, `size?`, `class?`                                |
| `Footer.astro`          | `Socials` and copyright line. Props: `noMarginTop?` plus footer HTML attributes                                                                                                                  |
| `Header.astro`          | Logo text, nav (archives link only when `features.showArchives`), search, theme toggle (`#theme-btn`), mobile menu. Bundled `<script>` for the menu                                              |
| `LinkButton.astro`      | `<a>`, or `<span>` when `disabled`. Props: `disabled?` plus anchor HTML attributes                                                                                                               |
| `Main.astro`            | `<main id="main-content">` with title/description and slot. Props: `pageTitle` (string or `[string, string]`), `pageDesc?`, `class?`. Bundled `<script>` stores the back URL in `sessionStorage` |
| `Pagination.astro`      | Prev/next for an Astro `Page<CollectionEntry<"posts">>`. Prop: `page`                                                                                                                            |
| `ResponsiveTable.astro` | MDX table wrapper. Props: `class?`, `variant?: "minimal" \| "striped" \| "striped-minimal"`. `utils/rehypeTableWrapper.js` skips tables inside it                                                |
| `Socials.astro`         | `config.socials` with icons from `@/assets/icons/socials/<name>.svg`; title is `linkTitle` or "`<site.title>` on `<Name>`"                                                                       |
| `Tag.astro`             | Link to `tags/<tag>/` via `getRelativeLocaleUrl`. Props: `tag` (slug), `tagName` (label), `size?: "sm" \| "lg"`                                                                                  |

## For AI Agents

### Working In This Directory

- These are upstream bytes; prefer config (`astro-paper.config.ts`) over edits. Any edit becomes a row in "Upstream delta" in `../../AGENTS.md`.
- Props are declared with `type Props = ...` and destructured from `Astro.props`.
- UI strings come from `useTranslations(Astro.currentLocale)` (`@/i18n`); internal links use `getRelativeLocaleUrl` from `astro:i18n`.
- Styling is Tailwind utilities on design tokens (`bg-background`, `text-accent`, ...) from `src/styles/theme.css`; no scoped `<style>` blocks here.

### Testing Requirements

- Unit: see `../../tests/AGENTS.md`.
- E2E: `e2e/navigation.spec.ts` (Header, Breadcrumb), `e2e/dark-mode.spec.ts` (theme toggle), `e2e/homepage.spec.ts` (Socials), `e2e/tags.spec.ts`.

## Dependencies

### Internal

`@/config`, `@/i18n`, `@/utils/*`, `@/assets/icons/*`.

### External

`dayjs` (utc, timezone plugins), `astro:i18n`, `astro:content`.

<!-- MANUAL: Any manually added notes below this line are preserved on regeneration -->
