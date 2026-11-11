<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-11-10 | Updated: 2026-11-11 -->

# utils

## Purpose
Unit tests for `src/utils/`.

## Key Files
| File | Covers |
|------|--------|
| `slugify.test.ts` | `slugifyStr`, `slugifyAll`: Latin, accents, non-Latin, empty; the site's 14 tags map to themselves |
| `getSortedPosts.test.ts` | `getSortedPosts`: newest first, `modDatetime` over `pubDatetime`, drafts, future posts with `DEV` false/true |
| `getUniqueTags.test.ts` | `getUniqueTags`: `{tag, tagName}` shape, dedupe, sort, drafts, future posts |
| `getPostPaths.test.ts` | `getPostSlug` (flat, `_`-prefixed and nested paths) and `getPostUrl` (`/posts/<slug>/`); post URLs depend on these |

## For AI Agents

### Working In This Directory
- Never delete or modify existing tests without asking the user first.
- A new util in `src/utils/` gets a matching `<name>.test.ts` here.

### Testing Requirements
`bun run test:run`. Config: `../../vitest.config.ts`.

## Dependencies

### Internal
`../../src/utils/`, `../../src/config.ts`.

### External
`vitest`.

<!-- MANUAL: Any manually added notes below this line are preserved on regeneration -->
