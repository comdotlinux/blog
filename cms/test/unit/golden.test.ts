import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { blogPostKeys, cmsRoot, frontmatter } from "./helpers";

const goldenDir = join(cmsRoot, "test/fixtures/golden");
const goldens = readdirSync(goldenDir).filter(name => name.endsWith(".md"));

describe("golden outputs written by Sveltia in Spike 1", () => {
  it("has golden files", () => {
    expect(goldens.length).toBeGreaterThan(0);
  });

  it.each(goldens)("%s has blog-valid frontmatter", name => {
    const data = frontmatter(readFileSync(join(goldenDir, name), "utf8"));
    expect(data.pubDatetime).toBeInstanceOf(Date);
    expect(Array.isArray(data.tags)).toBe(true);
    for (const tag of data.tags as unknown[]) expect(typeof tag).toBe("string");
    for (const [key, value] of Object.entries(data)) {
      expect(value, key).not.toBe("");
      expect(blogPostKeys(), key).toContain(key);
    }
  });

  it("writes a new entry's pubDatetime as an unquoted date", () => {
    const source = readFileSync(
      join(goldenDir, "spike-compat-new-b.md"),
      "utf8"
    );
    expect(source).toMatch(/^pubDatetime: \d{4}-\d{2}-\d{2}$/m);
    expect(source).toMatch(/^draft: false$/m);
  });
});
