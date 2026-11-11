<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-11-10 | Updated: 2026-11-11 -->

# assets

## Purpose

SVG icons imported as Astro components (`import IconX from "@/assets/icons/IconX.svg"`) and optimised by the experimental SVGO optimizer in `astro.config.ts`. Blog images live in `public/assets/`; upstream's demo `images/` were not taken.

## Key Files

| Path                  | Description                                                                                                                                                                       |
| --------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `icons/Icon*.svg`     | UI icons (Tabler): Archive, ArrowLeft, ArrowNarrowUp, ArrowRight, Calendar, ChevronLeft, Edit, Hash, ListTree, MenuDeep, Moon, Rss, Search, SunHigh, Underline, X. Upstream bytes |
| `icons/socials/*.svg` | One icon per social `name`: facebook, github, linkedin, mail, pinterest, telegram, whatsapp, x (upstream) and youtube, reddit, mastodon (ours)                                    |

## For AI Agents

### Working In This Directory

- `src/components/Socials.astro` and the post `ShareLinks` component load `icons/socials/<name>.svg` via `import.meta.glob`; a `socials`/`shareLinks` entry in `astro-paper.config.ts` whose `name` has no file renders without an icon.
- A new social icon is a deviation from upstream: add it to "Upstream delta" in `../../AGENTS.md`.

### Testing Requirements

- `e2e/homepage.spec.ts` checks the social links; run `bun run build` for type errors.

## Dependencies

### Internal

`src/components/Socials.astro`, `src/components/Header.astro`, `src/components/Tag.astro`, `src/pages/**`, `../../astro-paper.config.ts`.

<!-- MANUAL: Any manually added notes below this line are preserved on regeneration -->
