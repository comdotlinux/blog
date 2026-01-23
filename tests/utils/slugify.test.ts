import { describe, it, expect } from "vitest";
import slugify, { slugifyStr, slugifyAll } from "../../src/utils/slugify";

describe("slugifyStr", () => {
  it("converts string to lowercase slug", () => {
    expect(slugifyStr("Hello World")).toBe("hello-world");
  });

  it("handles special characters", () => {
    expect(slugifyStr("Test Post #1")).toBe("test-post-1");
  });

  it("handles multiple spaces", () => {
    // github-slugger converts each space to a dash
    expect(slugifyStr("Multiple   Spaces")).toBe("multiple---spaces");
  });

  it("handles unicode characters", () => {
    expect(slugifyStr("Café & Restaurant")).toBe("café--restaurant");
  });

  it("handles empty string", () => {
    expect(slugifyStr("")).toBe("");
  });
});

describe("slugifyAll", () => {
  it("slugifies array of strings", () => {
    const input = ["Hello World", "Test Post"];
    const expected = ["hello-world", "test-post"];
    expect(slugifyAll(input)).toEqual(expected);
  });

  it("handles empty array", () => {
    expect(slugifyAll([])).toEqual([]);
  });
});

describe("slugify (default export)", () => {
  it("uses postSlug if provided", () => {
    const post = {
      title: "My Post Title",
      postSlug: "custom-slug",
      description: "Test",
      pubDatetime: new Date(),
    };
    expect(slugify(post)).toBe("custom-slug");
  });

  it("falls back to title if no postSlug", () => {
    const post = {
      title: "My Post Title",
      description: "Test",
      pubDatetime: new Date(),
    };
    expect(slugify(post)).toBe("my-post-title");
  });

  it("slugifies postSlug with spaces", () => {
    const post = {
      title: "Title",
      postSlug: "Custom Post Slug",
      description: "Test",
      pubDatetime: new Date(),
    };
    expect(slugify(post)).toBe("custom-post-slug");
  });
});
