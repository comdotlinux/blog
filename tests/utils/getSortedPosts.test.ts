import { describe, it, expect } from "vitest";
import getSortedPosts from "../../src/utils/getSortedPosts";
import type { CollectionEntry } from "astro:content";

const createMockPost = (
  id: string,
  pubDatetime: Date,
  draft = false
): CollectionEntry<"blog"> =>
  ({
    id,
    data: {
      title: `Post ${id}`,
      description: "Test description",
      pubDatetime,
      draft,
      tags: ["test"],
    },
  }) as CollectionEntry<"blog">;

describe("getSortedPosts", () => {
  it("sorts posts by date in descending order (newest first)", () => {
    const posts = [
      createMockPost("old", new Date("2022-01-01")),
      createMockPost("new", new Date("2024-01-01")),
      createMockPost("mid", new Date("2023-01-01")),
    ];

    const sorted = getSortedPosts(posts);

    expect(sorted[0].id).toBe("new");
    expect(sorted[1].id).toBe("mid");
    expect(sorted[2].id).toBe("old");
  });

  it("filters out draft posts", () => {
    const posts = [
      createMockPost("published", new Date("2024-01-01"), false),
      createMockPost("draft", new Date("2024-02-01"), true),
    ];

    const sorted = getSortedPosts(posts);

    expect(sorted.length).toBe(1);
    expect(sorted[0].id).toBe("published");
  });

  it("handles empty array", () => {
    expect(getSortedPosts([])).toEqual([]);
  });

  it("handles all drafts", () => {
    const posts = [
      createMockPost("draft1", new Date("2024-01-01"), true),
      createMockPost("draft2", new Date("2024-02-01"), true),
    ];

    expect(getSortedPosts(posts)).toEqual([]);
  });

  it("handles posts with same date", () => {
    const sameDate = new Date("2024-01-01");
    const posts = [createMockPost("a", sameDate), createMockPost("b", sameDate)];

    const sorted = getSortedPosts(posts);
    expect(sorted.length).toBe(2);
  });
});
