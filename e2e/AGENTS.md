<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-11-10 | Updated: 2026-11-10 -->

# e2e

## Purpose
Playwright specs run against the built site served by `bun run preview --port 4173 --ignore-lock` (`--ignore-lock` keeps Astro 7 from moving the server to the background when it detects an AI agent). Config: `../playwright.config.ts` (`testDir ./e2e`, chromium only, baseURL `http://localhost:4173`, HTML reporter, 2 retries and 1 worker on CI, webServer auto-started).

## Key Files
| File | Exercises |
|------|-----------|
| `homepage.spec.ts` | `/` loads, shows posts, nav links, social links |
| `navigation.spec.ts` | Home to posts/tags/about/search, logo to home, `/about/`, 404 for unknown route |
| `posts.spec.ts` | `/posts/` listing, open a post, `gradle-tricks` content, date, tags, table of contents |
| `tags.spec.ts` | `/tags/`, `/tags/gradle/`, `/tags/automation/`, `/tags/linux/` |
| `search.spec.ts` | `/search/` Pagefind input, queries "gradle" and "tmux", result count, URL query update |
| `code-blocks.spec.ts` | Shiki output on `gradle-tricks` and `tmux-how-i-use-it`: pre, highlighting, `astro-code`, background, whitespace, monospace, horizontal scroll, dark-mode theme |
| `dark-mode.spec.ts` | Theme toggle button, sun/moon icons, icon visibility on click |
| `og-images.spec.ts` | `og:*` and `twitter:*` meta tags on `/` and `gradle-tricks`; og:image URL reachable |
| `rss.spec.ts` | `/rss.xml` reachable, contains posts, site title |

## For AI Agents

### Working In This Directory
- **Never delete or modify existing tests without asking the user first.**
- Specs hard-code post slugs (`gradle-tricks`, `tmux-how-i-use-it`) and tags; renaming content in `../src/data/blog/` breaks them.

### Testing Requirements
| Command | Purpose |
|---------|---------|
| `bun run build` | Required first: preview serves `dist/`, and search needs the Pagefind index |
| `bun run test:e2e` | Run all specs |
| `bun run test:e2e:ui` | Playwright UI mode |

`../CLAUDE.md` gives the full pre-commit order.

## Dependencies

### Internal
Built site (`../dist/`), `../src/data/blog/`.

### External
`@playwright/test`, Pagefind (built into `dist/pagefind`).

<!-- MANUAL: Any manually added notes below this line are preserved on regeneration -->
