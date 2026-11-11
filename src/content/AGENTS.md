<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-11-10 | Updated: 2026-11-11 -->

# content

## Purpose

Markdown content for the two collections defined in `../content.config.ts`: `posts/` (blog posts) and `pages/` (standalone pages). Schemas live in `../content.config.ts`, not here.

## Key Files

| Path                                                                        | Description                                                                      |
| --------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| `posts/on-the-topic-of-tools-their-versions-and-automated-installations.md` | Tools and version managers (images in `public/assets/20221008/`)                 |
| `posts/followup-latest-version-of-the-tools-using-asdf.md`                  | asdf follow-up (`public/assets/20221010/`)                                       |
| `posts/tmux-how-i-use-it.md`                                                | tmux setup (`public/assets/20221112/`)                                           |
| `posts/gradle-tricks.md`                                                    | Gradle tips (`public/assets/20221126/`)                                          |
| `posts/some-interesting-features-in-github-actions.md`                      | GitHub Actions features (`public/assets/20221227/`)                              |
| `pages/about.md`                                                            | About page, rendered by `src/pages/about.astro` via `getEntry("pages", "about")` |

## For AI Agents

### Working In This Directory

- NEVER create `AGENTS.md`, `README.md` or any other non-content `.md`/`.mdx` inside `posts/` or `pages/`: the glob loaders (`**/[^_]*.{md,mdx}`) load it as an entry and the build fails on missing frontmatter. Prefix with `_` to exclude a file or directory.
- The file name (entry `id`) is the URL slug: `posts/foo.md` -> `/posts/foo/`. Sub-directories become path segments (see `getPostSlug` in `../utils/getPostPaths.ts`). Renaming a post changes its URL.
- `.mdx` is supported (`@astrojs/mdx`); `src/components/ResponsiveTable.astro` is meant for MDX tables.
- Post OG images default to `/posts/<slug>/index.png` unless frontmatter sets `ogImage`.
- Avoid a "Table of contents" heading: the inline TOC is deprecated (removed in v8) and the build warns. Posts get the layout TOC instead; `hideToc: true` turns it off.
- Images go in `public/assets/YYYYMMDD/` and are referenced as `/assets/YYYYMMDD/name.png`.

### Testing Requirements

`bun run build` validates every entry against its schema.

## Dependencies

### Internal

`../content.config.ts`, `../utils/getPostPaths.ts`, `../../public/assets/`.

<!-- MANUAL: Any manually added notes below this line are preserved on regeneration -->
