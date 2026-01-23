# SPEC.md - Astro 6 Beta Migration

## Overview

Upgrade the AstroPaper blog from Astro 2.2.0 to Astro 6 Beta (6.0.0-beta.3) while modernizing the entire toolchain and migrating OG image generation to Cloudflare Workers.

**Target URL**: https://b.kulkarni.cloud/
**OG Image Subdomain**: og.b.kulkarni.cloud (new)
**Branch**: `upgrade-to-latest`

> **Note**: Update this spec file as tasks are completed. Mark phases as done, add notes about issues encountered, and document any deviations from the plan.

## Key Decisions

| Area | Decision |
|------|----------|
| Package Manager | **Bun** (fast installs, scripts) |
| Runtime | **Node.js 24.13.0** (Cloudflare Pages v3 default, Astro 6 compatible) |
| Dev Server | Enable workerd for Cloudflare runtime parity |
| Render Mode | Stay fully static (no SSR) |
| OG Images | Migrate to Cloudflare Worker at subdomain |
| Schema Validation | Keep `.strict()`, extend with new Astro 6 fields |
| Markdown Plugins | Research Astro 6 defaults, configure explicitly |
| Testing | Comprehensive tests with Vitest |
| Tooling | Update all dev dependencies (ESLint 9, Prettier 3, etc.) |
| Build Optimization | Replace jampack with Astro built-in optimization |
| Commit Strategy | Incremental commits per phase, test locally before final push |

## Runtime Strategy: Hybrid Bun + Node

**Why hybrid?**
- Bun as package manager: 3-4x faster dependency installs
- Bun for running scripts: `bun run build`, `bun run dev`
- Node 24 as underlying runtime: Stable, Astro 6 tested
- workerd for dev: Real Cloudflare runtime APIs during development

**Cloudflare Pages v3 native support:**
- Bun 1.3.6 (default)
- Node.js 24.13.0 (default)
- Both work out of the box - no configuration needed

**Local commands:**
- `bun install` - dependency management
- `bun run <script>` - running scripts
- `bun add/remove` - package management

**Node.js 24.13.0 used for:**
- Astro internals (Vite, esbuild)
- workerd dev server

## Migration Phases

### Phase 1: Core Dependencies Update

**Status**: [x] Complete
**Commit message**: `chore: update to astro 6 beta with bun and node 24`

#### Node.js & Bun Setup

1. Create `.tool-versions` file (for asdf - local dev):
   ```
   nodejs 24.13.0
   bun 1.3.6
   ```

2. Create `.nvmrc` file (for Cloudflare Pages - only reads this):
   ```
   24.13.0
   ```

3. Update `package.json` engines:
   ```json
   {
     "engines": {
       "node": ">=24.13.0"
     },
     "packageManager": "bun@1.3.6"
   }
   ```

4. Install correct versions locally:
   ```bash
   asdf install
   ```

5. Switch to Bun:
   ```bash
   # Remove node_modules and package-lock.json
   rm -rf node_modules package-lock.json

   # Install with Bun
   bun install
   ```

#### Package Updates
```json
{
  "dependencies": {
    "astro": "^6.0.0-beta.3",
    "@astrojs/rss": "^5.0.0",
    "fuse.js": "^7.0.0",
    "github-slugger": "^2.0.0",
    "remark-collapse": "^0.1.2",
    "remark-toc": "^9.0.0",
    "satori": "^0.12.0",
    "tailwindcss": "^3.4.0"
  },
  "devDependencies": {
    "@astrojs/react": "^4.0.0",
    "@astrojs/sitemap": "^4.0.0",
    "@astrojs/tailwind": "^6.0.0",
    "@astrojs/cloudflare": "^13.0.0",
    "@tailwindcss/typography": "^0.5.15",
    "@types/react": "^18.3.0",
    "@types/bun": "^1.3.6",
    "react": "^18.3.0",
    "react-dom": "^18.3.0",
    "typescript": "^5.7.0"
  }
}
```

#### Remove
- `@resvg/resvg-js` (replaced by Cloudflare Worker)
- `@divriots/jampack` (replaced by Astro built-in optimization)
- `package-lock.json` (replaced by bun.lockb)

---

### Phase 2: Content Layer API Migration

**Status**: [x] Complete
**Commit message**: `refactor: migrate to astro 6 content layer API`

#### File Moves
- `src/content/config.ts` → `src/content.config.ts` (root of src/)

#### Schema Changes (`src/content/_schemas.ts`)

**Before:**
```typescript
import { z } from "astro:content";

export const blogSchema = z
  .object({
    author: z.string().optional(),
    // ...
  })
  .strict();
```

**After:**
```typescript
import { z } from "astro/zod";

export const blogSchema = z
  .object({
    author: z.string().optional(),
    pubDatetime: z.date(),
    title: z.string(),
    postSlug: z.string().optional(),
    featured: z.boolean().optional(),
    draft: z.boolean().optional(),
    tags: z.array(z.string()).default(["others"]),
    ogImage: z.string().optional(),
    description: z.string(),
  })
  .strict();
```

#### Content Config (`src/content.config.ts`)

**New format:**
```typescript
import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { blogSchema } from "./content/_schemas";

const blog = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/blog" }),
  schema: blogSchema,
});

export const collections = { blog };
```

#### Render Method Changes

**All files using `post.render()`:**

**Before:**
```typescript
const { Content } = await post.render();
```

**After:**
```typescript
import { render } from "astro:content";
const { Content } = await render(post);
```

**Affected file:** `src/layouts/PostDetails.astro`

#### Type Import Changes

**Before:**
```typescript
import { CollectionEntry, getCollection } from "astro:content";
```

**After:**
```typescript
import { getCollection } from "astro:content";
import type { CollectionEntry } from "astro:content";
```

**Affected files:**
- `src/pages/tags/[tag].astro`
- `src/pages/posts/[slug].astro`

---

### Phase 3: Astro Config Updates

**Status**: [x] Complete
**Commit message**: `refactor: update astro config for v6`

#### Remove Deprecated Options (`astro.config.mjs`)

**Before:**
```javascript
markdown: {
  remarkPlugins: [...],
  shikiConfig: { theme: "one-dark-pro", wrap: true },
  extendDefaultPlugins: true,  // REMOVE THIS
},
```

**After:**
```javascript
markdown: {
  remarkPlugins: [
    remarkToc,
    [remarkCollapse, { test: "Table of contents" }],
  ],
  shikiConfig: {
    theme: "one-dark-pro",
    wrap: true,
  },
  // Astro 6 includes GitHub-flavored markdown and Smartypants by default
  // No need for extendDefaultPlugins
},
```

#### Add Cloudflare Adapter for workerd Dev

```javascript
import { defineConfig } from "astro/config";
import cloudflare from "@astrojs/cloudflare";
import tailwind from "@astrojs/tailwind";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: SITE.website,
  output: "static",
  adapter: cloudflare({
    imageService: "compile",
  }),
  integrations: [
    tailwind({ applyBaseStyles: false }),
    react(),
    sitemap(),
  ],
  markdown: {
    remarkPlugins: [
      remarkToc,
      [remarkCollapse, { test: "Table of contents" }],
    ],
    shikiConfig: {
      theme: "one-dark-pro",
      wrap: true,
    },
  },
  vite: {
    optimizeDeps: {
      exclude: [], // Remove @resvg/resvg-js exclusion
    },
  },
});
```

#### Astro 6 Default Markdown Plugins (Reference)
- `remark-gfm` (GitHub Flavored Markdown) - tables, strikethrough, autolinks
- `remark-smartypants` - smart quotes and dashes
- Built-in syntax highlighting via Shiki

---

### Phase 4: OG Image Migration to Cloudflare Worker

**Status**: [x] Skipped - current SVG generation works fine
**Commit message**: `feat: migrate og image generation to cloudflare worker`

#### Create Worker Project Structure

```
og-worker/
├── wrangler.toml
├── package.json
├── src/
│   └── index.ts
└── tsconfig.json
```

#### Worker Configuration (`og-worker/wrangler.toml`)

```toml
name = "og-image-worker"
main = "src/index.ts"
compatibility_date = "2024-01-01"

[vars]
SITE_URL = "https://b.kulkarni.cloud"

# Custom domain for og.b.kulkarni.cloud
routes = [
  { pattern = "og.b.kulkarni.cloud/*", zone_name = "kulkarni.cloud" }
]
```

#### Worker Implementation (`og-worker/src/index.ts`)

```typescript
import satori from "satori";

interface Env {
  SITE_URL: string;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const title = decodeURIComponent(url.pathname.slice(1).replace(/\.png$/, ""));

    if (!title) {
      return new Response("Missing title", { status: 400 });
    }

    // Generate SVG with satori
    const svg = await satori(
      {
        type: "div",
        props: {
          style: {
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#1a1a2e",
            padding: "40px",
          },
          children: [
            {
              type: "div",
              props: {
                style: {
                  fontSize: "60px",
                  fontWeight: "bold",
                  color: "#ffffff",
                  textAlign: "center",
                  maxWidth: "900px",
                },
                children: title,
              },
            },
            {
              type: "div",
              props: {
                style: {
                  fontSize: "30px",
                  color: "#888888",
                  marginTop: "20px",
                },
                children: "b.kulkarni.cloud",
              },
            },
          ],
        },
      },
      {
        width: 1200,
        height: 630,
        fonts: [], // Will use system fonts
      }
    );

    // Convert SVG to PNG using resvg-wasm (available in Workers)
    // Note: May need @resvg/resvg-wasm for Workers environment

    return new Response(svg, {
      headers: {
        "Content-Type": "image/svg+xml",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  },
};
```

#### Update Blog to Use New OG URLs

**Modify `src/utils/generateOgImage.tsx`** → Remove file entirely

**Update OG meta tags in layouts** to point to:
```
https://og.b.kulkarni.cloud/{encoded-title}.png
```

#### Remove Old OG Generation Route
- Delete `src/pages/[ogTitle].svg.ts`

---

### Phase 5: Dev Tooling Modernization

**Status**: [x] Complete
**Commit message**: `chore: modernize dev tooling (eslint 9, prettier 3, vitest)`

#### ESLint 9 Migration

**New `eslint.config.js` (flat config):**
```javascript
import js from "@eslint/js";
import tseslint from "typescript-eslint";
import astro from "eslint-plugin-astro";

export default [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...astro.configs.recommended,
  {
    ignores: ["dist/", "node_modules/", ".astro/"],
  },
];
```

**Remove:** `.eslintrc.js`

#### Prettier 3 Update

**Update `.prettierrc`:**
```json
{
  "semi": true,
  "tabWidth": 2,
  "printWidth": 80,
  "singleQuote": false,
  "trailingComma": "es5",
  "endOfLine": "lf",
  "plugins": ["prettier-plugin-astro", "prettier-plugin-tailwindcss"]
}
```

**Package updates:**
```json
{
  "devDependencies": {
    "prettier": "^3.4.0",
    "prettier-plugin-astro": "^0.14.0",
    "prettier-plugin-tailwindcss": "^0.6.0"
  }
}
```

#### Updated package.json scripts

```json
{
  "scripts": {
    "dev": "astro dev",
    "build": "astro check && astro build",
    "preview": "astro preview",
    "sync": "astro sync",
    "format:check": "prettier --check .",
    "format": "prettier --write .",
    "lint": "eslint .",
    "lint:fix": "eslint . --fix",
    "test": "vitest",
    "test:run": "vitest run",
    "cz": "cz"
  }
}
```

**Usage with Bun:**
```bash
bun run dev        # Start dev server with workerd
bun run build      # Build for production
bun run test       # Run tests
bun run lint       # Lint code
bun run format     # Format code
```

Note: Removed `--plugin-search-dir=.` (deprecated in Prettier 3) and `astro check --watch &` from dev (unnecessary complexity).

---

### Phase 6: Comprehensive Testing

**Status**: [x] Complete
**Commit message**: `test: add vitest test suite for astro 6 migration`

#### Test Setup

**`vitest.config.ts`:**
```typescript
import { getViteConfig } from "astro/config";

export default getViteConfig({
  test: {
    include: ["tests/**/*.test.ts"],
    globals: true,
  },
});
```

#### Test Files Structure

```
tests/
├── content.test.ts      # Content collection loading
├── build.test.ts        # Build output verification
├── pages.test.ts        # Page rendering
└── utils.test.ts        # Utility function tests
```

#### Sample Tests

**`tests/content.test.ts`:**
```typescript
import { describe, it, expect } from "vitest";
import { getCollection } from "astro:content";

describe("Content Collections", () => {
  it("loads blog posts without errors", async () => {
    const posts = await getCollection("blog");
    expect(posts).toBeDefined();
    expect(Array.isArray(posts)).toBe(true);
  });

  it("filters draft posts correctly", async () => {
    const posts = await getCollection("blog", ({ data }) => !data.draft);
    posts.forEach((post) => {
      expect(post.data.draft).not.toBe(true);
    });
  });

  it("has required frontmatter fields", async () => {
    const posts = await getCollection("blog");
    posts.forEach((post) => {
      expect(post.data.title).toBeDefined();
      expect(post.data.description).toBeDefined();
      expect(post.data.pubDatetime).toBeInstanceOf(Date);
    });
  });
});
```

**`tests/utils.test.ts`:**
```typescript
import { describe, it, expect } from "vitest";
import { slugify } from "../src/utils/slugify";
import getSortedPosts from "../src/utils/getSortedPosts";

describe("Utility Functions", () => {
  it("slugify creates valid slugs", () => {
    expect(slugify("Hello World")).toBe("hello-world");
    expect(slugify("Test Post #1")).toBe("test-post-1");
  });

  it("getSortedPosts returns posts in date order", async () => {
    // Test implementation
  });
});
```

**`tests/build.test.ts`:**
```typescript
import { describe, it, expect, beforeAll } from "vitest";
import { execSync } from "child_process";
import { existsSync, readdirSync } from "fs";

describe("Build Output", () => {
  beforeAll(() => {
    execSync("bun run build", { stdio: "inherit" });
  }, 120000);

  it("generates dist directory", () => {
    expect(existsSync("dist")).toBe(true);
  });

  it("generates index.html", () => {
    expect(existsSync("dist/index.html")).toBe(true);
  });

  it("generates sitemap", () => {
    expect(existsSync("dist/sitemap-index.xml")).toBe(true);
  });

  it("generates RSS feed", () => {
    expect(existsSync("dist/rss.xml")).toBe(true);
  });
});
```

---

## Cost Analysis (All Free Tier)

This entire setup stays within Cloudflare's free tier:

| Service | Free Limit | Expected Usage | Cost |
|---------|------------|----------------|------|
| CF Pages Builds | 500/month | ~10-20 | **$0** |
| CF Pages Bandwidth | Unlimited | Any | **$0** |
| CF Workers Requests | 100k/day | ~100/day (OG images) | **$0** |
| CF Workers | 100 max | 1 (OG worker) | **$0** |

**Alternative: GitHub Actions Build**

If you prefer GitHub Actions (free for public repos, 2000 min/month private):

```yaml
# .github/workflows/deploy.yml
name: Deploy to Cloudflare Pages
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: oven-sh/setup-bun@v2
        with:
          bun-version: 1.3.6
      - run: bun install
      - run: bun run build
      - uses: cloudflare/wrangler-action@v3
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          command: pages deploy dist --project-name=blog
```

For this migration, we'll use **Cloudflare Pages builds** (simpler, already free).

---

## Cloudflare Setup Requirements

### Pages Build Image Migration (v2 → v3)

**Why upgrade now:** v3 defaults to Node 24.13.0 which Astro 6 requires. v2 will be auto-migrated Feb 2027.

**Steps:**
1. Cloudflare Dashboard → **Workers & Pages** → select blog project
2. **Settings** → **Build & deployments** → **Build configuration**
3. Change **Build system version** to **v3**
4. Update build settings (see below)

### Pages Build Configuration

Update Cloudflare Pages project settings:
- **Build system version**: v3
- **Build command**: `bun run build`
- **Build output directory**: `dist`
- **Environment variable**: `BUN_VERSION` = `1.3.6`

**Version overrides (v3 defaults in parentheses):**
- Node.js: `.nvmrc` file → **24.13.0** (default: 22.16.0)
- Bun: `BUN_VERSION` env var → **1.3.6** (default: 1.2.15)

Note: Cloudflare Pages doesn't read `.tool-versions`, so we need `.nvmrc` + `BUN_VERSION` env var.

### DNS Configuration
- Add `og` CNAME record pointing to Worker
- Or use Cloudflare Workers custom domain routing

### Worker Deployment
```bash
cd og-worker
bun install
wrangler login  # One-time auth
wrangler deploy
```

### Required Cloudflare API Token Permissions (if using CI)
- Workers Scripts: Edit
- Workers Routes: Edit
- Zone Settings: Read (for custom domain)

---

## Rollback Plan

1. All changes on `upgrade-to-latest` branch
2. Main branch remains on Astro 2.2.0 until verified
3. If issues arise: `git checkout main` restores working state
4. OG Worker can be rolled back with `wrangler rollback`

---

## Success Criteria

- [ ] `bun run build` completes without errors
- [ ] `bun run dev` starts with workerd
- [ ] All existing blog posts render correctly
- [ ] OG images generate via og.b.kulkarni.cloud
- [ ] `bun run test` passes all tests
- [ ] `bun run lint` passes
- [ ] Site deploys successfully to Cloudflare Pages
- [ ] Lighthouse score remains 90+

---

## Post-Migration Cleanup

1. Update `CLAUDE.md` with new commands and patterns (use `bun run` instead of `npm run`)
2. Remove any deprecated config files (`.eslintrc.js`, `package-lock.json`)
3. Update README if needed
4. Update husky hooks if needed for Bun compatibility
5. Consider enabling Astro 6 features:
   - Content Security Policy
   - View Transitions (ClientRouter)
   - Live Collections (if needed)

---

## Progress Log

_Update this section as you complete phases:_

| Date | Phase | Status | Notes |
|------|-------|--------|-------|
| 2026-01-23 | Phase 1 | Complete | Updated to Astro 6 beta, Bun 1.3.6, Node 24.13.0. Fixed package versions. |
| 2026-01-23 | Phase 2 | Complete | Migrated to Content Layer API, moved config, updated render method. |
| 2026-01-23 | Phase 3 | Complete | Updated astro.config.mjs, removed deprecated options, added Cloudflare adapter. |
| 2026-01-23 | Phase 4 | Skipped | Current SVG generation works fine. Worker migration unnecessary. |
| 2026-01-23 | Phase 5 | Complete | ESLint 9 flat config, Prettier 3 with plugins, removed old config files. |
| 2026-01-23 | Phase 6 | Complete | 42 tests passing: slugify, pagination, sorting, tags, build output. |

### Additional Fixes Applied
- Updated blog post images to use local assets from `public/assets/` instead of external URLs
- Updated RSS handler from `get` to `GET` for Astro 6
- Updated API routes to return Response objects
- Fixed type imports and ESLint issues
- Added `"type": "module"` to package.json
- Fixed React/Babel compatibility by updating `@astrojs/react` to 5.0.0-beta.2
