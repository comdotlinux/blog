import { describe, it, expect, beforeAll } from "vitest";
import { existsSync, readdirSync } from "fs";
import { join } from "path";

const distDir = join(process.cwd(), "dist");

describe("Build Output", () => {
  beforeAll(() => {
    if (!existsSync(distDir)) {
      console.log("Run `bun run build` before running build tests");
    }
  }, 120000);

  it("generates dist directory", () => {
    expect(existsSync(distDir)).toBe(true);
  });

  it("generates index.html", () => {
    expect(existsSync(join(distDir, "index.html"))).toBe(true);
  });

  it("generates sitemap", () => {
    expect(existsSync(join(distDir, "sitemap-index.xml"))).toBe(true);
  });

  it("generates RSS feed", () => {
    expect(existsSync(join(distDir, "rss.xml"))).toBe(true);
  });

  it("generates 404 page", () => {
    expect(existsSync(join(distDir, "404.html"))).toBe(true);
  });

  it("generates about page", () => {
    expect(existsSync(join(distDir, "about", "index.html"))).toBe(true);
  });

  it("generates posts directory", () => {
    expect(existsSync(join(distDir, "posts"))).toBe(true);
  });

  it("generates tags directory", () => {
    expect(existsSync(join(distDir, "tags"))).toBe(true);
  });

  it("generates search page", () => {
    expect(existsSync(join(distDir, "search", "index.html"))).toBe(true);
  });

  it("includes CSS assets", () => {
    const assetsDir = join(distDir, "_astro");
    if (existsSync(assetsDir)) {
      const files = readdirSync(assetsDir);
      const cssFiles = files.filter(f => f.endsWith(".css"));
      expect(cssFiles.length).toBeGreaterThan(0);
    }
  });

  it("includes JS assets", () => {
    const assetsDir = join(distDir, "_astro");
    if (existsSync(assetsDir)) {
      const files = readdirSync(assetsDir);
      const jsFiles = files.filter(f => f.endsWith(".js"));
      expect(jsFiles.length).toBeGreaterThan(0);
    }
  });
});
