<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-11-10 | Updated: 2026-11-10 -->

# content

## Purpose

Holds the Zod schema that validates blog post frontmatter. The collection itself is registered in `../content.config.ts`; posts live in `../data/blog/`.

## Key Files

| File          | Description                                                                                         |
| ------------- | --------------------------------------------------------------------------------------------------- |
| `_schemas.ts` | Exports `blogSchema` (`z.object({...}).strict()`, Zod from `astro/zod`) and type `BlogFrontmatter`. |

## For AI Agents

### Working In This Directory

- Schema is `.strict()`: unknown frontmatter keys fail the build.
- Fields: `title` (string), `description` (string), `pubDatetime` (date) required; `author`, `postSlug`, `featured`, `draft`, `ogImage` optional; `tags` string[] defaulting to `["others"]`.
- Changing the schema affects every post in `../data/blog/`, `../utils/slugify.ts` (imports `BlogFrontmatter`) and `../../tests/components/Card.test.ts`.

### Testing Requirements

`bun run build` validates all posts against the schema.

## Dependencies

### Internal

`../content.config.ts`, `../utils/slugify.ts`.

### External

`astro/zod`.

<!-- MANUAL: Any manually added notes below this line are preserved on regeneration -->
