<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-11-10 | Updated: 2026-11-10 -->

# assets

## Purpose

Build-time code assets. Contains only the social icon SVG map; blog images live in `public/assets/`.

## Key Files

| File             | Description                                                                                                                                                                                                                                                                                   |
| ---------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `socialIcons.ts` | Default export `socialIcons: SocialIcons` (type from `../types`): map of social name (Github, Facebook, Instagram, LinkedIn, Mail, Twitter, Twitch, YouTube, WhatsApp, Snapchat, Pinterest, TikTok, CodePen, Discord, GitLab, Reddit, Skype, Steam, Telegram, Mastodon) to inline SVG strings |

## For AI Agents

### Working In This Directory

- Keys must match the `SocialMedia` union in `src/types.ts` and the `name` values in `SOCIALS` (`src/config.ts`).
- Consumed only by `src/components/Socials.astro` via `<Fragment set:html={...} />`. Icons use the `icon-tabler` class styled in `src/styles/base.css`.

### Testing Requirements

- No dedicated tests. Visual check: `e2e/homepage.spec.ts`; run `bun run build` for type errors.

## Dependencies

### Internal

`src/types.ts`, `src/components/Socials.astro`.

<!-- MANUAL: Any manually added notes below this line are preserved on regeneration -->
