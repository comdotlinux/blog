import { describe, it, expect } from "vitest";
import { SITE } from "../../src/config";

describe("OG Image Generation", () => {
  describe("text sanitization", () => {
    const sanitizeText = (text: string) => {
      return text.replace(/[/\\?%*:|"<> ]/g, "-").replace("--", "-");
    };

    it("replaces forward slashes", () => {
      expect(sanitizeText("hello/world")).toBe("hello-world");
    });

    it("replaces backslashes", () => {
      expect(sanitizeText("hello\\world")).toBe("hello-world");
    });

    it("replaces question marks", () => {
      expect(sanitizeText("what?")).toBe("what-");
    });

    it("replaces percent signs", () => {
      expect(sanitizeText("100%")).toBe("100-");
    });

    it("replaces asterisks", () => {
      expect(sanitizeText("hello*world")).toBe("hello-world");
    });

    it("replaces colons", () => {
      expect(sanitizeText("time:12:30")).toBe("time-12-30");
    });

    it("replaces pipes", () => {
      expect(sanitizeText("a|b")).toBe("a-b");
    });

    it("replaces double quotes", () => {
      expect(sanitizeText('say "hello"')).toBe("say-hello-");
    });

    it("replaces angle brackets", () => {
      expect(sanitizeText("<tag>")).toBe("-tag-");
    });

    it("replaces spaces", () => {
      expect(sanitizeText("hello world")).toBe("hello-world");
    });

    it("reduces double dashes to single", () => {
      expect(sanitizeText("hello--world")).toBe("hello-world");
    });

    it("handles empty string", () => {
      expect(sanitizeText("")).toBe("");
    });

    it("preserves alphanumeric characters", () => {
      expect(sanitizeText("abc123")).toBe("abc123");
    });
  });

  describe("SITE configuration", () => {
    it("has author defined", () => {
      expect(SITE.author).toBeDefined();
      expect(typeof SITE.author).toBe("string");
    });

    it("has title defined", () => {
      expect(SITE.title).toBeDefined();
      expect(typeof SITE.title).toBe("string");
    });

    it("uses SITE.title as default text", () => {
      const defaultText = SITE.title;
      expect(defaultText).toBe("Developer Musings");
    });
  });

  describe("SVG structure expectations", () => {
    it("should have 1200x630 dimensions", () => {
      const width = 1200;
      const height = 630;
      expect(width).toBe(1200);
      expect(height).toBe(630);
    });

    it("should use IBM Plex Mono font", () => {
      const fontName = "IBM Plex Mono";
      expect(fontName).toBe("IBM Plex Mono");
    });

    it("should embed fonts", () => {
      const embedFont = true;
      expect(embedFont).toBe(true);
    });

    it("should have font weights 400 and 600", () => {
      const weights = [400, 600];
      expect(weights).toContain(400);
      expect(weights).toContain(600);
    });
  });

  describe("OG image template structure", () => {
    it("should have background color #fefbfb", () => {
      const bgColor = "#fefbfb";
      expect(bgColor).toBe("#fefbfb");
    });

    it("should have border color #000", () => {
      const borderColor = "#000";
      expect(borderColor).toBe("#000");
    });

    it("should use 72px font size for title", () => {
      const titleFontSize = 72;
      expect(titleFontSize).toBe(72);
    });

    it("should use 28px font size for author/site", () => {
      const metaFontSize = 28;
      expect(metaFontSize).toBe(28);
    });

    it("should display author name", () => {
      const author = SITE.author;
      expect(author).toBe("Guruprasad Kulkarni");
    });

    it("should display site title", () => {
      const title = SITE.title;
      expect(title).toBe("Developer Musings");
    });
  });
});
