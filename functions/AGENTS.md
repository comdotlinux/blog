<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-11-12 | Updated: 2026-11-12 -->

# functions

## Purpose

Cloudflare Pages Functions that gate the whole blog behind Cloudflare Turnstile, ported from the bio repo. Not part of AstroPaper; Pages picks up this directory from the repo root and builds it automatically. Astro, `astro preview`, Playwright and Lighthouse never run these files.

## Key Files

| File                      | Description                                                                                                                                                                                                                                                                                                                                                                                                      |
| ------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `_middleware.ts`          | Runs on every request. Without a valid `blog_session` cookie, page loads get a self-contained Turnstile page (401, `noindex`) and other requests get a bare 401. Public without a cookie: `/api/*`, `/rss.xml`, both sitemaps, `/robots.txt`, favicons, `/og.png`, `/astropaper-og.jpg`, `/posts/<slug>/index.png` and the pre-v7 OG PNG. `PREVIEW=true` passes everything. A missing secret fails closed (500). |
| `api/verify-turnstile.ts` | `POST /api/verify-turnstile` with `{ token }`: verifies via Cloudflare siteverify and sets `blog_session=<expiry>.<HMAC-SHA256>` (`HttpOnly; Secure; SameSite=Lax`, 24 h), signed with `TURNSTILE_SECRET_KEY`. Exports the cookie helpers the middleware uses.                                                                                                                                                   |

## For AI Agents

### Working In This Directory

- Environment variables come from the Cloudflare Pages project `blog` settings, not `.env`: `TURNSTILE_SITE_KEY` (public, injected into the challenge page), `TURNSTILE_SECRET_KEY` (secret: verification and cookie signing), `PREVIEW=true` in the Preview environment only.
- Never commit, log or echo the secret.
- The gate hides post HTML from search engines and link-preview bots (the user chose this, 2026-11-12). Keep feeds, sitemaps, robots.txt and OG images public.
- Use the `cloudflare` CLI for Pages settings, and ask the user before every `cloudflare` command.

### Testing Requirements

`../tests/functions/turnstile.test.ts` covers cookie signing, the public-path list and the middleware branches (`bun run test:run`). After deploy, check production: `curl -sI https://blog.kulkarni.cloud/` returns 401 without the cookie, `/rss.xml` returns 200.

## Dependencies

### External

Cloudflare Pages Functions runtime (Web Crypto, `fetch`); Turnstile siteverify `https://challenges.cloudflare.com/turnstile/v0/siteverify`.

<!-- MANUAL: Any manually added notes below this line are preserved on regeneration -->
