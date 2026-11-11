<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-11-11 | Updated: 2026-11-11 -->

# types

## Purpose

Config types, vendored unchanged from upstream.

## Key Files

| File        | Description                                                                                                                                                                                                                                                                                                                                                 |
| ----------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `config.ts` | `AstroPaperConfig` (`site`, `posts?`, `features?`, `socials?`, `shareLinks?`) with `SiteConfig`, `PostsConfig`, `FeaturesConfig`, `SocialLink`, `ShareLink`; `ResolvedAstroPaperConfig` (defaults applied, built by `src/config.ts`); `defineAstroPaperConfig()` identity helper used by `astro-paper.config.ts`. JSDoc on each field documents its default |

## For AI Agents

### Working In This Directory

- Read the JSDoc here before changing `astro-paper.config.ts`; it is the reference for every option (e.g. `features.dynamicOgImage`, `editPost`, `search`, `toc`).
- `posts.scheduledPostMargin` is deprecated and ignored.

### Testing Requirements

`bun run build` (`astro check`).

## Dependencies

### Internal

`../../astro-paper.config.ts`, `src/config.ts`, `src/utils/resolveDefaultOgImagePath.ts`.

<!-- MANUAL: Any manually added notes below this line are preserved on regeneration -->
