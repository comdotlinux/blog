import { describe, it, expect, vi } from "vitest";

// Mock the config module
vi.mock("@config", () => ({
  SITE: {
    postPerPage: 3,
  },
}));

import getPageNumbers from "../../src/utils/getPageNumbers";

describe("getPageNumbers", () => {
  it("returns [1] for posts less than or equal to postPerPage", () => {
    expect(getPageNumbers(1)).toEqual([1]);
    expect(getPageNumbers(2)).toEqual([1]);
    expect(getPageNumbers(3)).toEqual([1]);
  });

  it("returns [1, 2] for posts requiring 2 pages", () => {
    expect(getPageNumbers(4)).toEqual([1, 2]);
    expect(getPageNumbers(5)).toEqual([1, 2]);
    expect(getPageNumbers(6)).toEqual([1, 2]);
  });

  it("returns [1, 2, 3] for posts requiring 3 pages", () => {
    expect(getPageNumbers(7)).toEqual([1, 2, 3]);
    expect(getPageNumbers(9)).toEqual([1, 2, 3]);
  });

  it("handles zero posts", () => {
    expect(getPageNumbers(0)).toEqual([]);
  });

  it("handles large number of posts", () => {
    const result = getPageNumbers(30);
    expect(result).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    expect(result.length).toBe(10);
  });
});
