import { describe, it, expect } from "vitest";
import { published, tags } from "./published-posts";

describe("published-posts helper", () => {
  it("lists published posts", () => {
    expect(published.length).toBeGreaterThanOrEqual(5);
    expect(published.every(post => !post.draft)).toBe(true);
  });

  it("lists unique slugified tags", () => {
    expect(tags).toContain("gradle");
    expect(new Set(tags).size).toBe(tags.length);
  });
});
