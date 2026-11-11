import { describe, it, expect } from "vitest";
import { getPostSlug, getPostUrl } from "@/utils/getPostPaths";

describe("getPostSlug", () => {
  it("uses the id for a flat post", () => {
    expect(
      getPostSlug("gradle-tricks", "src/content/posts/gradle-tricks.md")
    ).toBe("/gradle-tricks");
  });

  it("drops _-prefixed directories", () => {
    expect(
      getPostSlug("gradle-tricks", "src/content/posts/_drafts/gradle-tricks.md")
    ).toBe("/gradle-tricks");
  });

  it("keeps slugified nested directories", () => {
    expect(
      getPostSlug(
        "2022/gradle-tricks",
        "src/content/posts/2022/Build Tools/gradle-tricks.md"
      )
    ).toBe("/2022/build-tools/gradle-tricks");
  });
});

describe("getPostUrl", () => {
  it("builds /posts/<slug>/", () => {
    expect(
      getPostUrl("tmux-how-i-use-it", "src/content/posts/tmux-how-i-use-it.md")
    ).toBe("/posts/tmux-how-i-use-it/");
  });
});
