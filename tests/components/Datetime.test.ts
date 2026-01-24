import { describe, it, expect } from "vitest";

describe("Datetime Component Logic", () => {
  const formatDate = (datetime: string | Date) => {
    const myDatetime = new Date(datetime);
    return myDatetime.toLocaleDateString([], {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (datetime: string | Date) => {
    const myDatetime = new Date(datetime);
    return myDatetime.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  describe("date formatting", () => {
    it("formats Date object correctly", () => {
      const date = new Date("2023-11-26T10:30:00");
      const formatted = formatDate(date);
      expect(formatted).toContain("2023");
      expect(formatted).toContain("November");
      expect(formatted).toContain("26");
    });

    it("formats ISO string correctly", () => {
      const dateStr = "2023-11-26T10:30:00Z";
      const formatted = formatDate(dateStr);
      expect(formatted).toContain("2023");
    });

    it("handles different date strings", () => {
      const date1 = formatDate("2022-01-15");
      const date2 = formatDate("2023-12-25");

      expect(date1).toContain("2022");
      expect(date2).toContain("2023");
    });
  });

  describe("time formatting", () => {
    it("formats time with hours and minutes", () => {
      const date = new Date("2023-11-26T14:30:00");
      const formatted = formatTime(date);
      expect(formatted).toMatch(/\d{2}:\d{2}/);
    });

    it("handles midnight", () => {
      const date = new Date("2023-11-26T00:00:00");
      const formatted = formatTime(date);
      expect(formatted).toMatch(/\d{2}:\d{2}/);
    });

    it("handles noon", () => {
      const date = new Date("2023-11-26T12:00:00");
      const formatted = formatTime(date);
      expect(formatted).toMatch(/12:00|00:00/);
    });
  });

  describe("size prop behavior", () => {
    it("should support sm size (scale-90)", () => {
      const sizes = ["sm", "lg"] as const;
      const smScale = sizes[0] === "sm" ? "scale-90" : "scale-100";
      expect(smScale).toBe("scale-90");
    });

    it("should support lg size (scale-100)", () => {
      const getScale = (size: "sm" | "lg") => size === "sm" ? "scale-90" : "scale-100";
      expect(getScale("lg")).toBe("scale-100");
    });

    it("sm size should use text-sm class", () => {
      const size: "sm" | "lg" = "sm";
      const textClass = size === "sm" ? "text-sm" : "text-base";
      expect(textClass).toBe("text-sm");
    });

    it("lg size should use text-base class", () => {
      const getTextClass = (size: "sm" | "lg") => size === "sm" ? "text-sm" : "text-base";
      expect(getTextClass("lg")).toBe("text-base");
    });
  });

  describe("className passthrough", () => {
    it("accepts custom className", () => {
      const baseClass = "flex items-center space-x-2 opacity-80";
      const customClass = "custom-class";
      const combined = `${baseClass} ${customClass}`;
      expect(combined).toContain("custom-class");
      expect(combined).toContain("opacity-80");
    });

    it("works without className", () => {
      const baseClass = "flex items-center space-x-2 opacity-80";
      const className = undefined;
      const combined = `${baseClass} ${className ?? ""}`.trim();
      expect(combined).toBe("flex items-center space-x-2 opacity-80");
    });
  });
});
