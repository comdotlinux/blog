<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-11-10 | Updated: 2026-11-10 -->

# styles

## Purpose

Global CSS: Tailwind v4 CSS-first config plus theme variables and base styles. No `tailwind.config.js` exists.

## Key Files

| File           | Description                                                                                                                                                                                                        |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `tailwind.css` | `@import "tailwindcss"`, `@plugin "@tailwindcss/typography"`, `@source "../../src"`, and `@theme` (IBM Plex Mono, `sm` breakpoint, `skin-*` colors mapped to `rgb(var(--color-*))`)                                |
| `base.css`     | Imports `tailwind.css`. `@layer base`: light/dark RGB variables (`html[data-theme]`), sun/moon icon toggle, body, `.prose` typography overrides, scrollbar. `@layer components`: `.display-none`, `.focus-outline` |

## For AI Agents

### Working In This Directory

- Imported globally by `src/layouts/Layout.astro` (`@styles/base.css`). Component `<style>` blocks pull in `tailwind.css` through `@reference "../styles/tailwind.css";` (path relative to the file).
- Add a color by defining the RGB triplet in both theme blocks of `base.css` and a `--color-skin-*` entry in `tailwind.css`.
- Dark mode is driven by `data-theme` set by `public/toggle-theme.js`.

### Testing Requirements

- E2E: `e2e/dark-mode.spec.ts`, `e2e/code-blocks.spec.ts`. Run `bun run build` to catch Tailwind errors.

## Dependencies

### External

`tailwindcss` v4, `@tailwindcss/typography`.

<!-- MANUAL: Any manually added notes below this line are preserved on regeneration -->
