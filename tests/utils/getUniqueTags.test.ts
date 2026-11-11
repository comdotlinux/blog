import { describe, it, expect, vi, afterEach } from "vitest";
import type { CollectionEntry } from "astro:content";
import { getUniqueTags } from "@/utils/getUniqueTags";

const post = (
  tags: string[],
  { draft = false, pubDatetime = new Date("2022-10-08T12:00:00Z") } = {}
) => ({ data: { tags, draft, pubDatetime } }) as CollectionEntry<"posts">;

afterEach(() => vi.unstubAllEnvs());

describe("getUniqueTags", () => {
  it("returns {tag, tagName} objects", () => {
    expect(getUniqueTags([post(["Hello World"])])).toEqual([
      { tag: "hello-world", tagName: "Hello World" },
    ]);
  });

  it("dedupes by slug", () => {
    const tags = getUniqueTags([post(["tmux", "Tmux"]), post(["tmux"])]);
    expect(tags.map(t => t.tag)).toEqual(["tmux"]);
  });

  it("sorts by slug", () => {
    const tags = getUniqueTags([post(["tools", "asdf"]), post(["gradle"])]);
    expect(tags.map(t => t.tag)).toEqual(["asdf", "gradle", "tools"]);
  });

  it("excludes tags of draft posts", () => {
    const tags = getUniqueTags([
      post(["public"]),
      post(["secret"], { draft: true }),
    ]);
    expect(tags.map(t => t.tag)).toEqual(["public"]);
  });

  it("excludes tags of future posts in production", () => {
    vi.stubEnv("DEV", false);
    const tags = getUniqueTags([
      post(["public"]),
      post(["later"], { pubDatetime: new Date(Date.now() + 7 * 864e5) }),
    ]);
    expect(tags.map(t => t.tag)).toEqual(["public"]);
  });

  it("returns an empty array for no posts", () => {
    expect(getUniqueTags([])).toEqual([]);
  });
});
