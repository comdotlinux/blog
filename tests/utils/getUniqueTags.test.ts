import { describe, it, expect } from "vitest";
import getUniqueTags from "../../src/utils/getUniqueTags";
import type { CollectionEntry } from "astro:content";

const createMockPost = (
  id: string,
  tags: string[],
  draft = false
): CollectionEntry<"blog"> =>
  ({
    id,
    data: {
      title: `Post ${id}`,
      description: "Test description",
      pubDatetime: new Date(),
      draft,
      tags,
    },
  }) as CollectionEntry<"blog">;

describe("getUniqueTags", () => {
  it("extracts unique tags from posts", () => {
    const posts = [
      createMockPost("1", ["javascript", "react"]),
      createMockPost("2", ["javascript", "typescript"]),
    ];

    const tags = getUniqueTags(posts);

    expect(tags).toContain("javascript");
    expect(tags).toContain("react");
    expect(tags).toContain("typescript");
    expect(tags.length).toBe(3);
  });

  it("slugifies tags", () => {
    const posts = [createMockPost("1", ["Hello World", "Test Tag"])];

    const tags = getUniqueTags(posts);

    expect(tags).toContain("hello-world");
    expect(tags).toContain("test-tag");
  });

  it("excludes tags from draft posts", () => {
    const posts = [
      createMockPost("published", ["public-tag"], false),
      createMockPost("draft", ["draft-tag"], true),
    ];

    const tags = getUniqueTags(posts);

    expect(tags).toContain("public-tag");
    expect(tags).not.toContain("draft-tag");
  });

  it("handles empty array", () => {
    expect(getUniqueTags([])).toEqual([]);
  });

  it("handles posts with no tags", () => {
    const posts = [createMockPost("1", [])];
    expect(getUniqueTags(posts)).toEqual([]);
  });

  it("removes duplicate tags", () => {
    const posts = [
      createMockPost("1", ["same", "same", "same"]),
      createMockPost("2", ["same"]),
    ];

    const tags = getUniqueTags(posts);
    expect(tags.filter(t => t === "same").length).toBe(1);
  });
});
