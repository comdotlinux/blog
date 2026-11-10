<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-11-10 | Updated: 2026-11-10 -->

# utils

## Purpose
Unit tests for `src/utils/`, one file per util.

## Key Files
| File | Covers |
|------|--------|
| `slugify.test.ts` | `slugifyStr`, `slugifyAll`, default `slugify` (`src/utils/slugify.ts`) |
| `getSortedPosts.test.ts` | `src/utils/getSortedPosts.ts`: ordering, drafts, empty, same date |
| `getPostsByTag.test.ts` | `src/utils/getPostsByTag.ts`: filtering, slug matching |
| `getUniqueTags.test.ts` | `src/utils/getUniqueTags.ts`: slugify, dedupe, drafts |
| `getPageNumbers.test.ts` | `src/utils/getPageNumbers.ts` (mocks `@config`) |
| `generateOgImage.test.ts` | Does not import `generateOgImage.ts`; asserts the sanitization regex, `SITE` values and template constants inline. |

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
