<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-11-10 | Updated: 2026-11-10 -->

# components

## Purpose

Reusable server-rendered Astro components. No client framework; the only client JS is in `Header.astro` and `Search.astro`.

## Key Files

| File                | Description                                                                                                                                   |
| ------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| `Breadcrumbs.astro` | Builds crumbs from `Astro.url.pathname`; collapses `/posts/N` into "Posts (page N)". No props                                                 |
| `Card.astro`        | Post list item. Props: `href?`, `frontmatter: BlogFrontmatter`, `secHeading = true` (h2 vs h3). Renders `Datetime`                            |
| `Datetime.astro`    | dayjs-formatted date and time. Props: `datetime`, `size?: "sm" \| "lg"`, `class?`                                                             |
| `Footer.astro`      | Uses `Hr` and `Socials`; CC BY-NC-SA badge. Prop: `noMarginTop?`                                                                              |
| `Header.astro`      | Nav, logo, theme toggle, mobile menu. Prop: `activeNav?: "posts" \| "tags" \| "about" \| "search"`. Reads `SITE`, `LOGO_IMAGE` from `@config` |
| `Hr.astro`          | Divider. Props: `noPadding?`, `ariaHidden?`                                                                                                   |
| `LinkButton.astro`  | Anchor wrapper with slot. Props: `href`, `className?`, `ariaLabel?`, `title?`, `disabled?`                                                    |
| `Search.astro`      | Pagefind UI (input, status, results); no props. Dynamically imports `/pagefind/pagefind.js`, reads/writes `?q=`                               |
| `Socials.astro`     | Active `SOCIALS` from `@config` rendered via `@assets/socialIcons`. Prop: `centered?`                                                         |
| `Tag.astro`         | Tag link to `/tags/<lowercased name>`. Props: `name`, `size?: "sm" \| "lg"`                                                                   |

## For AI Agents

### Working In This Directory

- Props are declared with `export interface Props` and destructured from `Astro.props`; keep that style.
- `Search.astro` uses `<script is:inline>` (needed for the runtime `/pagefind/` import). `Header.astro` uses a plain `<script>` (Astro-bundled, not inline), unlike the rule in CLAUDE.md.
- Scoped `<style>` blocks must start with `@reference "../styles/tailwind.css";` before `@apply` (Breadcrumbs, Footer, Header, LinkButton, Socials, Tag). Card, Datetime, Hr, Search use utility classes only.
- Theme colors are `skin-*` utilities defined in `src/styles/tailwind.css`.

### Testing Requirements

- Unit: `tests/components/Card.test.ts`, `tests/components/Datetime.test.ts`.
- E2E: `e2e/navigation.spec.ts` (Header, Breadcrumbs), `e2e/dark-mode.spec.ts` (theme toggle), `e2e/search.spec.ts` (Search; needs `bun run build` for the Pagefind index), `e2e/tags.spec.ts`.

### Common Patterns

- `class:list` for conditional classes (Datetime); template-string classes elsewhere.
- Tag links lowercase the name only; post slugs come from `@utils/slugify`.

## Dependencies

### Internal

`@config`, `@assets/socialIcons`, `@content/_schemas` (`BlogFrontmatter`), `@styles/tailwind.css`.

### External

`dayjs`, Pagefind (runtime, generated at build).

<!-- MANUAL: Any manually added notes below this line are preserved on regeneration -->
