import { test, expect } from "@playwright/test";

test.describe("Playwright Demo - playwright.dev", () => {
  test("首頁標題與主視覺按鈕存在", async ({ page }) => {
    await page.goto("/");

    // 1) Title 斷言
    await expect(page).toHaveTitle(/Playwright/);

    // 2) 主視覺 H1
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      "Playwright"
    );

    // 3) 常見 CTA：Get started
    await expect(
      page.getByRole("link", { name: /Get started/i })
    ).toBeVisible();
  });

  test("Get started 導航到 intro", async ({ page }) => {
    await page.goto("/");

    await page.getByRole("link", { name: /Get started/i }).click();

    // URL 應該包含 intro
    await expect(page).toHaveURL(/.*intro/);

    // intro 頁面應該有 "Installation" 或類似內容
    await expect(
      page.getByRole("heading", { name: /Installation/i })
    ).toBeVisible();
  });

  test("站內搜尋能打開並顯示結果", async ({ page }) => {
    await page.goto("/");

    // Playwright dev 是 Docusaurus，搜尋按鈕通常是 role="button" 名稱含 Search
    await page.getByRole("button", { name: /Search/i }).click();

    const input = page.getByRole("textbox");
    await input.fill("locator");

    // 等待搜尋結果出現
    // 有些版本結果是 listbox 或 region，這裡用「包含文字」的方式保守驗證
    await expect(page.locator("text=locator")).toBeVisible();
  });
});
