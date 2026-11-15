import { expect, test } from "@playwright/test";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const publicDir = join(import.meta.dirname, "../../public");
const PRODUCTION = "https://cms.blog.kulkarni.cloud";

// Needs network: Sveltia itself comes from the unpkg CDN (pinned version, SRI).
test("sign-in uses auth.html and sends every GitHub call to the /gh/ proxy", async ({
  page,
  context,
  baseURL,
}) => {
  const proxied: { url: string; authorization?: string }[] = [];
  const direct: string[] = [];

  // Point the backend at this server; Pages serves /auth from auth.html, python http.server does not.
  await context.route(/\/admin\/config\.yml(\?|$)/, route =>
    route.fulfill({
      contentType: "application/yaml",
      body: readFileSync(
        join(publicDir, "admin/config.yml"),
        "utf8"
      ).replaceAll(PRODUCTION, baseURL ?? ""),
    })
  );
  await context.route(/\/auth(\?|$)/, route =>
    route.fulfill({
      contentType: "text/html",
      body: readFileSync(join(publicDir, "auth.html"), "utf8"),
    })
  );
  await context.route("**/gh/**", route => {
    const request = route.request();
    proxied.push({
      url: new URL(request.url()).pathname,
      authorization: request.headers().authorization,
    });
    if (request.url().endsWith("/gh/api/v3/user")) {
      return route.fulfill({
        contentType: "application/json",
        body: JSON.stringify({ id: 1, login: "comdotlinux", name: "Owner" }),
      });
    }
    return route.fulfill({ status: 404, body: '{"message":"Not Found"}' });
  });
  await context.route(/^https:\/\/(api\.github\.com|github\.com)\//, route => {
    direct.push(route.request().url());
    return route.abort();
  });

  await page.goto("/admin/");
  const signIn = page.getByRole("button", { name: /Sign In with \W*GitHub/ });
  await expect(signIn).toBeVisible({ timeout: 30_000 });
  await expect(
    page.getByRole("button", { name: /Sign In Using Access Token/ })
  ).toHaveCount(0);

  await signIn.click();
  await expect
    .poll(() => proxied.find(r => r.url === "/gh/api/v3/user"), {
      timeout: 15_000,
    })
    .toBeDefined();
  expect(proxied.find(r => r.url === "/gh/api/v3/user")?.authorization).toBe(
    "token cf-access"
  );
  expect(direct).toEqual([]);
});
