import { defineConfig, devices } from "@playwright/test";

const baseURL = `http://127.0.0.1:${process.env.CMS_PORT ?? "8787"}`;

export default defineConfig({
  testDir: "test/e2e",
  forbidOnly: !!process.env.CI,
  reporter: process.env.CI ? "github" : "list",
  use: { baseURL },
  projects: [
    { name: "integration", testMatch: "integration.spec.ts" },
    {
      name: "e2e",
      testMatch: "smoke.spec.ts",
      // The admin shell loads Sveltia from the unpkg CDN; one retry absorbs a CDN blip.
      retries: 1,
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    // Cloudflare Pages serves cms/public as static files; a plain static server is equivalent here.
    command: "bun run serve",
    url: `${baseURL}/admin/`,
    reuseExistingServer: !process.env.CI,
  },
});
