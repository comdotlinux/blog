import { defineConfig } from "vitest/config";
import { resolve } from "path";

export default defineConfig({
  test: {
    include: ["tests/**/*.test.ts"],
    globals: true,
  },
  resolve: {
    alias: {
      "@config": resolve(__dirname, "./src/config.ts"),
      "@content/*": resolve(__dirname, "./src/content/*"),
      "@utils/*": resolve(__dirname, "./src/utils/*"),
    },
  },
});
