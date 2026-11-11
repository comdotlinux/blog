import { describe, it, expect, vi, afterEach } from "vitest";
import type { CollectionEntry } from "astro:content";
import { getSortedPosts } from "@/utils/getSortedPosts";

const post = (
  id: string,
  pubDatetime: Date,
  { draft = false, modDatetime }: { draft?: boolean; modDatetime?: Date } = {}
) =>
  ({
    id,
    data: { draft, pubDatetime, modDatetime, tags: [] },
  }) as unknown as CollectionEntry<"posts">;

const ids = (posts: CollectionEntry<"posts">[]) => posts.map(p => p.id);

afterEach(() => vi.unstubAllEnvs());

describe("getSortedPosts", () => {
  it("sorts newest first by pubDatetime", () => {
    const sorted = getSortedPosts([
      post("old", new Date("2022-01-01")),
      post("new", new Date("2024-01-01")),
      post("mid", new Date("2023-01-01")),
    ]);
    expect(ids(sorted)).toEqual(["new", "mid", "old"]);
  });

  it("uses modDatetime over pubDatetime when present", () => {
    const sorted = getSortedPosts([
      post("recent", new Date("2023-01-01")),
      post("updated", new Date("2022-01-01"), {
        modDatetime: new Date("2024-01-01"),
      }),
    ]);
    expect(ids(sorted)).toEqual(["updated", "recent"]);
  });

  it("excludes drafts", () => {
    const sorted = getSortedPosts([
      post("published", new Date("2024-01-01")),
      post("draft", new Date("2024-02-01"), { draft: true }),
    ]);
    expect(ids(sorted)).toEqual(["published"]);
  });

  it("excludes posts dated after today (Europe/Berlin) in production", () => {
    vi.stubEnv("DEV", false);
    const sorted = getSortedPosts([
      post("today", new Date()),
      post("future", new Date(Date.now() + 2 * 864e5)),
    ]);
    expect(ids(sorted)).toEqual(["today"]);
  });

  it("includes future posts in dev", () => {
    vi.stubEnv("DEV", true);
    const sorted = getSortedPosts([
      post("today", new Date()),
      post("future", new Date(Date.now() + 2 * 864e5)),
    ]);
    expect(ids(sorted)).toEqual(["future", "today"]);
  });

  it("returns an empty array for no posts", () => {
    expect(getSortedPosts([])).toEqual([]);
  });
});
