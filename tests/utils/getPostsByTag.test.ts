import { describe, it, expect } from "vitest";
import getPostsByTag from "../../src/utils/getPostsByTag";
import type { CollectionEntry } from "astro:content";

// Helper to create mock posts
const createMockPost = (id: string, tags: string[]): CollectionEntry<"blog"> =>
  ({
    id,
    data: {
      title: `Post ${id}`,
      description: "Test description",
      pubDatetime: new Date(),
      draft: false,
      tags,
    },
  }) as CollectionEntry<"blog">;

describe("getPostsByTag", () => {
  it("filters posts by tag", () => {
    const posts = [
      createMockPost("1", ["javascript", "react"]),
      createMockPost("2", ["typescript", "react"]),
      createMockPost("3", ["python"]),
    ];

    const reactPosts = getPostsByTag(posts, "react");

    expect(reactPosts.length).toBe(2);
    expect(reactPosts.map(p => p.id)).toContain("1");
    expect(reactPosts.map(p => p.id)).toContain("2");
  });

  it("returns empty array when no posts match", () => {
    const posts = [
      createMockPost("1", ["javascript"]),
      createMockPost("2", ["typescript"]),
    ];

    expect(getPostsByTag(posts, "rust")).toEqual([]);
  });

  it("handles slugified tag matching", () => {
    const posts = [createMockPost("1", ["Hello World"])];

    const result = getPostsByTag(posts, "hello-world");

    expect(result.length).toBe(1);
  });

  it("handles empty posts array", () => {
    expect(getPostsByTag([], "javascript")).toEqual([]);
  });

  it("is case-insensitive through slugification", () => {
    const posts = [createMockPost("1", ["JavaScript"])];

    const result = getPostsByTag(posts, "javascript");

    expect(result.length).toBe(1);
  });
});
