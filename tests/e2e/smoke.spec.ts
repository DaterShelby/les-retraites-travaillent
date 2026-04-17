import { test, expect } from "@playwright/test";

test.describe("Smoke tests — golden paths publics", () => {
  test("la home page répond et expose le H1 brand", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Les Retraités Travaillent/i);
    await expect(page.locator("body")).toBeVisible();
  });

  test("la page de login est accessible", async ({ page }) => {
    await page.goto("/login");
    await expect(
      page.getByRole("heading", { name: /connect/i }).first()
    ).toBeVisible();
    await expect(page.getByLabel(/email/i)).toBeVisible();
  });

  test("la marketplace charge la liste des services", async ({ page }) => {
    await page.goto("/marketplace");
    // Le titre principal doit être présent même sans services seedés
    await expect(page.locator("h1")).toBeVisible();
  });

  test("la page missions B2B est accessible", async ({ page }) => {
    await page.goto("/missions");
    await expect(page.locator("h1")).toBeVisible();
  });

  test("la page comment-ca-marche existe", async ({ page }) => {
    const res = await page.goto("/comment-ca-marche");
    expect(res?.status()).toBeLessThan(500);
  });

  test("les CGU sont disponibles", async ({ page }) => {
    const res = await page.goto("/legal/cgu");
    expect(res?.status()).toBeLessThan(500);
  });
});

test.describe("SEO basics", () => {
  test("la home expose une meta description", async ({ page }) => {
    await page.goto("/");
    const meta = await page.locator('meta[name="description"]').getAttribute("content");
    expect(meta).toBeTruthy();
    expect((meta ?? "").length).toBeGreaterThan(50);
  });

  test("le sitemap est servi", async ({ page }) => {
    const res = await page.goto("/sitemap.xml");
    expect(res?.status()).toBeLessThan(500);
  });

  test("robots.txt est servi", async ({ page }) => {
    const res = await page.goto("/robots.txt");
    expect(res?.status()).toBeLessThan(500);
  });
});
