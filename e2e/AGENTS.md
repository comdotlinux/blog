<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-11-10 | Updated: 2026-11-11 -->

# e2e

## Purpose
Playwright specs run against the built site served by `bun run preview --port 4173 --ignore-lock` (`--ignore-lock` keeps Astro 7 from moving the server to the background when it detects an AI agent). Config: `../playwright.config.ts` (`testDir ./e2e`, chromium only, baseURL `http://localhost:4173`, HTML reporter, 2 retries and 1 worker on CI, webServer auto-started).

## Key Files
| File | Exercises |
|------|-----------|
| `url-preservation.spec.ts` | Every path in `fixtures/urls.txt` returns 200; `/posts/1/` meta refresh to `/posts/`; unknown path 404; RSS links equal the pre-v7 ones; the old mismatched slug 404s |
| `fixtures/urls.txt` | The 35 URLs that existed before the AstroPaper v7 re-port and must keep resolving. Also used by the post-deploy `curl` check |
| `homepage.spec.ts` | `/` loads, 4 recent posts, nav links, 9 social links, titles for YouTube/Reddit/Mastodon |
| `navigation.spec.ts` | Header journeys, logo to home, 404 for unknown route, no archives link |
| `posts.spec.ts` | Listing and pagination, post detail, Europe/Berlin date, tags, sidebar TOC, inline whitespace (`compressHTML`), edit links, share links |
| `tags.spec.ts` | `/tags/` (14 tags) and tag pages (`Tag: x` titles) |
| `search.spec.ts` | `/search/` Pagefind UI, queries, result count, URL query update |
| `code-blocks.spec.ts` | Shiki `github-light`/`github-dark` CSS-variable output, dark switch, scroll, monospace |
| `dark-mode.spec.ts` | `#theme-btn` toggle, `data-theme` and `.dark` on `<html>`, persistence on reload |
| `og-images.spec.ts` | `og:image` per post is `/posts/<slug>/index.png` (fetched against baseURL), home image, meta tags, old OG PNG still served |
| `rss.spec.ts` | `/rss.xml` reachable, contains posts, site title |

## For AI Agents

### Working In This Directory
- **Never delete or modify existing tests without asking the user first.**
- Specs hard-code post slugs (`gradle-tricks`, `tmux-how-i-use-it`, ...) and tags; renaming files in `../src/content/posts/` changes URLs and breaks them.
- `og:image` values are absolute production URLs; always fetch `new URL(content).pathname` against the local baseURL.

### Testing Requirements
| Command | Purpose |
|---------|---------|
| `bun run build` | Required first: preview serves `dist/`, and search needs the Pagefind index |
| `bun run test:e2e` | Run all specs |
| `bun run test:e2e:ui` | Playwright UI mode |

`../CLAUDE.md` gives the full pre-commit order.

## Dependencies

### Internal
Built site (`../dist/`), `../src/content/posts/`, `fixtures/urls.txt`.

### External
`@playwright/test`, Pagefind (built into `dist/pagefind`).

<!-- MANUAL: Any manually added notes below this line are preserved on regeneration -->
