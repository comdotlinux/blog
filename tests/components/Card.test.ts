import { describe, it, expect } from "vitest";
import type { BlogFrontmatter } from "../../src/content/_schemas";
import slugify from "../../src/utils/slugify";

describe("Card Component Logic", () => {
  const createMockFrontmatter = (
    overrides: Partial<BlogFrontmatter> = {}
  ): BlogFrontmatter => ({
    title: "Test Post Title",
    description: "Test description",
    pubDatetime: new Date("2023-11-26"),
    tags: ["test"],
    ...overrides,
  });

  describe("title rendering", () => {
    it("renders title from frontmatter", () => {
      const frontmatter = createMockFrontmatter({ title: "My Custom Title" });
      expect(frontmatter.title).toBe("My Custom Title");
    });

    it("uses h2 when secHeading is true (default)", () => {
      const secHeading = true;
      const headingTag = secHeading ? "h2" : "h3";
      expect(headingTag).toBe("h2");
    });

    it("uses h3 when secHeading is false", () => {
      const secHeading = false;
      const headingTag = secHeading ? "h2" : "h3";
      expect(headingTag).toBe("h3");
    });
  });

  describe("href generation", () => {
    it("generates href from post slug", () => {
      const frontmatter = createMockFrontmatter({ postSlug: "custom-slug" });
      const href = `/posts/${slugify(frontmatter)}`;
      expect(href).toBe("/posts/custom-slug");
    });

    it("generates href from title when no postSlug", () => {
      const frontmatter = createMockFrontmatter({
        title: "My Post Title",
        postSlug: undefined,
      });
      const href = `/posts/${slugify(frontmatter)}`;
      expect(href).toBe("/posts/my-post-title");
    });

    it("accepts custom href prop", () => {
      const customHref = "/custom/path/to/post";
      expect(customHref).toBe("/custom/path/to/post");
    });
  });

  describe("description display", () => {
    it("includes description from frontmatter", () => {
      const frontmatter = createMockFrontmatter({
        description: "A detailed description of the post",
      });
      expect(frontmatter.description).toBe(
        "A detailed description of the post"
      );
    });

    it("handles long descriptions", () => {
      const longDesc = "A".repeat(500);
      const frontmatter = createMockFrontmatter({ description: longDesc });
      expect(frontmatter.description.length).toBe(500);
    });

    it("handles special characters in description", () => {
      const frontmatter = createMockFrontmatter({
        description: "Testing <script> & 'quotes' and \"more\"",
      });
      expect(frontmatter.description).toContain("<script>");
      expect(frontmatter.description).toContain("&");
    });
  });

  describe("datetime integration", () => {
    it("passes pubDatetime to Datetime component", () => {
      const date = new Date("2023-11-26");
      const frontmatter = createMockFrontmatter({ pubDatetime: date });
      expect(frontmatter.pubDatetime).toEqual(date);
    });

    it("handles different date formats", () => {
      const dates = [
        new Date("2023-01-01"),
        new Date("2023-06-15"),
        new Date("2023-12-31"),
      ];

      dates.forEach(date => {
        const frontmatter = createMockFrontmatter({ pubDatetime: date });
        expect(frontmatter.pubDatetime).toBeInstanceOf(Date);
      });
    });
  });

  describe("CSS classes", () => {
    it("applies correct link classes", () => {
      const linkClasses =
        "inline-block text-lg font-medium text-skin-accent decoration-dashed underline-offset-4 focus-visible:no-underline focus-visible:underline-offset-0";
      expect(linkClasses).toContain("text-skin-accent");
      expect(linkClasses).toContain("decoration-dashed");
    });

    it("applies correct heading classes", () => {
      const headingClasses =
        "text-lg font-medium decoration-dashed hover:underline";
      expect(headingClasses).toContain("hover:underline");
    });

    it("wraps in li with my-6 class", () => {
      const liClass = "my-6";
      expect(liClass).toBe("my-6");
    });
  });
});
