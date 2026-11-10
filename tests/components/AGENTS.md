<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-11-10 | Updated: 2026-11-10 -->

# components

## Purpose
Vitest tests named after components. They do not render the `.astro` files; they re-implement the component logic inline and assert on it.

## Key Files
| File | Description |
|------|-------------|
| `Card.test.ts` | "Card Component Logic": title/heading level, href from `postSlug` or title via `src/utils/slugify.ts`, description, datetime, CSS classes. Covers `src/components/Card.astro` indirectly. |
| `Datetime.test.ts` | "Datetime Component Logic": date/time formatting, `size` (sm/lg) classes, `className` passthrough. Covers `src/components/Datetime.astro` indirectly. |

## For AI Agents

### Working In This Directory
- Never delete or modify existing tests without asking the user first.
- Passing here does not prove the Astro component works; rely on `../../e2e/` for rendered behaviour.

### Testing Requirements
`bun run test:run` (these two files do not need `dist/`, but run `bun run build` first for the full suite).

## Dependencies

### Internal
`../../src/utils/slugify.ts`, `../../src/content/_schemas.ts` (type).

### External
`vitest`.

<!-- MANUAL: Any manually added notes below this line are preserved on regeneration -->
