import { expect, test } from "@playwright/test";

// Needs network: Sveltia itself comes from the unpkg CDN (pinned version, SRI).
test("admin shell renders the Sveltia sign-in screen", async ({ page }) => {
  const errors: string[] = [];
  page.on("console", msg => {
    if (msg.type() === "error") errors.push(msg.text());
  });
  await page.goto("/admin/");
  await expect(
    page.getByRole("button", { name: /Sign In with \W*GitHub/ })
  ).toBeVisible({ timeout: 30_000 });
  expect(errors.filter(e => /integrity|config/i.test(e))).toEqual([]);
});
