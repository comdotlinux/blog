<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-11-10 | Updated: 2026-11-11 -->

# styles

## Purpose

Global CSS, vendored unchanged from upstream: Tailwind v4 CSS-first config, design tokens and prose styles. No `tailwind.config.js`.

## Key Files

| File             | Description                                                                                                                                                                                                                                                             |
| ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `global.css`     | Entry point imported by `src/layouts/Layout.astro`. Imports `tailwindcss`, `theme.css`, `typography.css`, `rehype-callouts/theme/obsidian`; `dark` custom variant on `[data-theme=dark]`; base focus/scrollbar rules; utilities `max-w-app`, `app-layout`, `active-nav` |
| `theme.css`      | `@theme inline` tokens (`background`, `foreground`, `accent`, `accent-foreground`, `muted`, `muted-foreground`, `border`, `--font-app` = Google Sans Code) with light (`:root`, `[data-theme="light"]`) and dark (`[data-theme="dark"]`) values                         |
| `typography.css` | `@tailwindcss/typography` plugin; `.app-prose` overrides (headings, links, code, `.table-wrapper`) and Shiki dual-theme rules for `.astro-code` (dark via `html[data-theme="dark"]`, diff/highlight line classes)                                                       |

## For AI Agents

### Working In This Directory

- Change colours in `theme.css` (both theme blocks), not in components.
- Shiki uses `defaultColor: false` (`astro.config.ts`), so code colours come only from the `.astro-code` rules in `typography.css`; changing the Shiki theme pair needs no CSS change.
- Dark mode is driven by `data-theme` on `<html>`, set by the inline script in `Layout.astro` and `src/scripts/theme.ts`.

### Testing Requirements

- E2E: `e2e/dark-mode.spec.ts`, `e2e/code-blocks.spec.ts`. Run `bun run build` to catch Tailwind errors.

## Dependencies

### External

`tailwindcss` v4, `@tailwindcss/typography`, `rehype-callouts` (theme CSS).

<!-- MANUAL: Any manually added notes below this line are preserved on regeneration -->
