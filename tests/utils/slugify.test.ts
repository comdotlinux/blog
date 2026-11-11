import { describe, it, expect } from "vitest";
import { slugifyStr, slugifyAll } from "@/utils/slugify";

const siteTags = [
  "afx",
  "asdf",
  "automation",
  "build",
  "ci",
  "commandline",
  "githubactions",
  "github",
  "gradle",
  "linux",
  "productivity",
  "terminal",
  "tmux",
  "tools",
];

describe("slugifyStr", () => {
  it("lowercases and hyphenates Latin input", () => {
    expect(slugifyStr("E2E Testing")).toBe("e2e-testing");
  });

  it("strips punctuation from Latin input", () => {
    expect(slugifyStr("Test Post #1")).toBe("test-post-1");
  });

  it("transliterates accented Latin characters", () => {
    expect(slugifyStr("Café Crème")).toBe("cafe-creme");
  });

  it("keeps non-Latin characters", () => {
    expect(slugifyStr("日本語 タグ")).toBe("日本語-タグ");
  });

  it("returns an empty string for empty input", () => {
    expect(slugifyStr("")).toBe("");
  });

  it.each(siteTags)("maps site tag %s to itself", tag => {
    expect(slugifyStr(tag)).toBe(tag);
  });
});

describe("slugifyAll", () => {
  it("slugifies each element", () => {
    expect(slugifyAll(["Hello World", "Test Post"])).toEqual([
      "hello-world",
      "test-post",
    ]);
  });

  it("handles an empty array", () => {
    expect(slugifyAll([])).toEqual([]);
  });
});
