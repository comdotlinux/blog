<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-11-11 | Updated: 2026-11-11 -->

# i18n

## Purpose

UI strings for the theme, vendored unchanged from upstream. The site has one locale, `en` (`i18n` block in `astro.config.ts`, `prefixDefaultLocale: false`).

## Key Files

| File         | Description                                                                                                                                                                                 |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `index.ts`   | `useTranslations(locale = "en")`: eagerly globs `lang/*.ts`, falls back to `en`, fills the two v8-optional labels (`post.tableOfContents`, `a11y.skipTableOfContents`). Re-exports `tplStr` |
| `format.ts`  | `tplStr(template, vars)` replaces `{{key}}` placeholders                                                                                                                                    |
| `types.ts`   | `UIStrings`: `nav`, `post`, `pagination`, `home`, `footer`, `pages`, `a11y`, `notFound` groups                                                                                              |
| `lang/en.ts` | English strings (`satisfies UIStrings`)                                                                                                                                                     |

## For AI Agents

### Working In This Directory

- Components call `useTranslations(Astro.currentLocale)`; change wording in `lang/en.ts`, not in components.
- A new key goes into `types.ts` and every `lang/*.ts`. Any edit here is a deviation from upstream: record it in "Upstream delta" in `../../AGENTS.md`.

### Testing Requirements

`bun run build` (`astro check` type-checks `lang/*.ts` against `UIStrings`).

## Dependencies

### Internal

Used by most of `src/components/` and `src/pages/`.

<!-- MANUAL: Any manually added notes below this line are preserved on regeneration -->
