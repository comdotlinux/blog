# AstroPaper v5.5.1 Migration Specification

**Status:** Implementation Complete
**Last Updated:** 2026-01-24
**Branch:** (current working branch)

---

## Objective

Upgrade blog from AstroPaper v3 features to v5.5.1 features while maintaining Astro 6.0.0-beta.3 compatibility.

---

## Current State

| Component | Version/Implementation |
|-----------|----------------------|
| Astro | 6.0.0-beta.3 |
| Tailwind | 3.4.0 |
| Search | Fuse.js (client-side) |
| React | 18.3.0 (Search, Card, Datetime) |
| OG Images | Satori (SVG output) |
| Slugs | github-slugger |
| Dates | Native Date API |
| Content | `src/content/blog/` |

---

## Target State

| Component | Version/Implementation |
|-----------|----------------------|
| Astro | 6.0.0-beta.3 (unchanged) |
| Tailwind | 4.x (CSS-first config) |
| Search | Pagefind (build-time index) |
| React | Removed |
| OG Images | Satori + sharp + resvg (PNG output) |
| Slugs | slugify + lodash.kebabcase |
| Dates | dayjs |
| Content | `src/data/blog/` |
| Syntax HL | Shiki transformers |

---

## Migration Checklist

### Phase 1: Pre-Migration Tests
- [x] Create `tests/components/Datetime.test.ts`
- [x] Create `tests/components/Card.test.ts`
- [x] Create `tests/utils/generateOgImage.test.ts`
- [x] Create `e2e/og-images.spec.ts`
- [x] Create `e2e/code-blocks.spec.ts`
- [x] All tests passing

### Phase 2: Dependencies
- [x] Remove: fuse.js, github-slugger, react, react-dom, @astrojs/react, @types/react
- [x] Add: slugify, lodash.kebabcase, dayjs, sharp, @resvg/resvg-js
- [x] Add: pagefind, @pagefind/default-ui, @shikijs/transformers
- [x] Add: @tailwindcss/vite
- [x] Upgrade: tailwindcss to v4
- [x] Remove: @astrojs/tailwind
- [x] Run `bun install`

### Phase 3: Content Migration
- [x] Move `src/content/blog/*.md` → `src/data/blog/`
- [x] Update `src/content.config.ts` glob base path

### Phase 4: Component Conversions
- [x] Convert `Datetime.tsx` → `Datetime.astro` (with dayjs)
- [x] Convert `Card.tsx` → `Card.astro`
- [x] Rewrite `Search.tsx` → `Search.astro` (with Pagefind)
- [x] Update all imports in pages/layouts

### Phase 5: Utility Updates
- [x] Rewrite `src/utils/slugify.ts` (slugify + kebabcase)
- [x] Update `src/utils/generateOgImage.tsx` → `.ts` (PNG output)
- [x] Rename `src/pages/[ogTitle].svg.ts` → `[ogTitle].png.ts`

### Phase 6: Tailwind v4 Migration
- [x] Delete `tailwind.config.cjs`
- [x] Create `src/styles/tailwind.css` (CSS-first config)
- [x] Update `src/styles/base.css` imports
- [x] Preserve custom color system (skin-base, skin-accent, etc.)

### Phase 7: Astro Config
- [x] Remove `react()` integration
- [x] Replace `tailwind()` with `vite.plugins: [tailwindcss()]`
- [x] Add Shiki transformers (copy button, diff notation)
- [x] Update build script for Pagefind

### Phase 8: Test Updates
- [x] Update `vitest.config.ts` path aliases
- [x] Update `e2e/search.spec.ts` for Pagefind
- [x] Update slugify tests for new library
- [x] All unit tests passing
- [x] All E2E tests passing

### Phase 9: Verification
- [x] `bun run build` succeeds
- [x] Homepage loads correctly
- [x] Dark mode works
- [x] Search returns results (Pagefind)
- [x] Posts render correctly
- [x] Code blocks have syntax highlighting
- [x] OG images generate as PNG
- [x] RSS feed works
- [x] Tags work
- [x] Pagination works

---

## Technical Details

### Pagefind Integration

Build script:
```bash
astro build && pagefind --site dist
```

Search component loads Pagefind dynamically:
```javascript
const pagefind = await import("/pagefind/pagefind.js");
await pagefind.init();
```

### Tailwind v4 CSS-First Config

```css
@import "tailwindcss";

@theme {
  --color-skin-fill: rgb(var(--color-fill));
  --color-skin-accent: rgb(var(--color-accent));
  /* ... */
}
```

### OG Image PNG Generation

```typescript
import { Resvg } from "@resvg/resvg-js";
const svg = await satori(template, options);
const resvg = new Resvg(svg);
return resvg.render().asPng();
```

### Dayjs Date Formatting

```typescript
import dayjs from "dayjs";
const formatted = dayjs(datetime).format("MMMM D, YYYY");
```

---

## Files Modified

| File | Action |
|------|--------|
| `package.json` | Dependency changes |
| `astro.config.mjs` | Config updates |
| `src/content.config.ts` | Path change |
| `tailwind.config.cjs` | DELETE |
| `src/styles/tailwind.css` | CREATE |
| `src/styles/base.css` | Update imports |
| `src/components/Datetime.tsx` | DELETE |
| `src/components/Datetime.astro` | CREATE |
| `src/components/Card.tsx` | DELETE |
| `src/components/Card.astro` | CREATE |
| `src/components/Search.tsx` | DELETE |
| `src/components/Search.astro` | CREATE |
| `src/utils/slugify.ts` | Rewrite |
| `src/utils/generateOgImage.tsx` | Rewrite → .ts |
| `src/pages/[ogTitle].svg.ts` | Rename → .png.ts |
| `src/pages/search.astro` | Update imports |
| `src/layouts/PostDetails.astro` | Update imports |
| `src/layouts/Posts.astro` | Update imports |
| `vitest.config.ts` | Path updates |
| `e2e/search.spec.ts` | Pagefind updates |

---

## Risks

| Risk | Impact | Mitigation |
|------|--------|------------|
| Tailwind v4 breaking changes | High | Test custom classes thoroughly |
| Slug output changes | High | Compare old/new slugs before committing |
| Pagefind initialization delay | Medium | Add loading state |
| sharp/resvg Cloudflare compat | Medium | Use wasm builds if needed |

---

## Notes

- RTL support intentionally skipped
- Keeping Astro 6 (not downgrading to v5)
- Single "all at once" migration approach
- Tests added before migration to catch regressions
