<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-11-11 | Updated: 2026-11-11 -->

# scripts

## Purpose

Client-side TypeScript bundled by Astro (not `is:inline`), vendored unchanged from upstream. Replaces the old `public/toggle-theme.js`.

## Key Files

| File       | Description                                                                                                                                                                                                                                                                                                                                                                                                                     |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `theme.ts` | Light/dark theme. Starts from `window.__theme` (set by the inline FOUC script in `src/layouts/Layout.astro`), else localStorage `theme`, else `prefers-color-scheme`. Sets `data-theme` and the `dark` class on `<html>`, `aria-label` on `#theme-btn`, and `<meta name="theme-color">` to the body background. Re-binds on `astro:after-swap`, carries `theme-color` across `astro:before-swap`, follows OS preference changes |

## For AI Agents

### Working In This Directory

- Loaded once from `Layout.astro` via `<script>import "@/scripts/theme";</script>`. With `<ClientRouter />` the module does not re-run on navigation, so per-page setup must hang off View Transitions events.
- Keep the localStorage key and `data-theme` values in sync with the inline script in `Layout.astro` and the `[data-theme]` selectors in `src/styles/`.

### Testing Requirements

- E2E: `e2e/dark-mode.spec.ts`.

## Dependencies

### Internal

`src/layouts/Layout.astro`, `src/components/Header.astro` (`#theme-btn`), `src/styles/theme.css`.

<!-- MANUAL: Any manually added notes below this line are preserved on regeneration -->
