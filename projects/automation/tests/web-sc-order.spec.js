const { test, expect } = require("@playwright/test");
const path = require("path");
const { pathToFileURL } = require("url");
const { LoginPage } = require("../pages/LoginPage");
const { OrderPage } = require("../pages/OrderPage");
const testData = require("../fixtures/order-test-data.json");

const demoAppUrl = pathToFileURL(
  path.resolve(__dirname, "../demo-app/index.html"),
).toString();

test.describe("Web 一般訂貨流程 Demo", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(demoAppUrl);
  });

  test("Happy Path｜登入後可加入商品並送出訂貨", async ({ page }) => {
    const loginPage = new LoginPage(page);
    const orderPage = new OrderPage(page);

    await test.step("登入測試帳號", async () => {
      await loginPage.login(testData.validUser);
      await expect(loginPage.loginStatus).toContainText("登入成功");
      await expect(orderPage.orderPanel).toBeVisible();
    });

    await test.step("設定訂貨表頭", async () => {
      await orderPage.setOrderHeader(testData.happyPathOrder);
    });

    await test.step("加入訂貨商品並驗證摘要", async () => {
      await orderPage.addItems(testData.happyPathOrder.items);
      await expect(orderPage.summaryCount).toHaveText(
        String(testData.happyPathOrder.expectedItemCount),
      );
      await expect(orderPage.summaryTotal).toHaveText(
        String(testData.happyPathOrder.expectedTotalQuantity),
      );
    });

    await test.step("送出訂貨並確認結果", async () => {
      await orderPage.submitOrder();
      await expect(orderPage.orderStatus).toContainText("訂貨成功");
      await expect(orderPage.orderStatus).toContainText("A001-20260617-018");
    });
  });

  test("Exception｜密碼錯誤時不得進入訂貨流程", async ({ page }) => {
    const loginPage = new LoginPage(page);
    const orderPage = new OrderPage(page);

    await loginPage.login(testData.invalidUser);

    await expect(loginPage.loginStatus).toContainText("登入失敗");
    await expect(orderPage.orderPanel).toBeHidden();
  });

  test("Boundary｜訂貨量為 0 時可加入但總量應為 0", async ({ page }) => {
    const loginPage = new LoginPage(page);
    const orderPage = new OrderPage(page);

    await loginPage.login(testData.validUser);
    await orderPage.setOrderHeader(testData.boundaryOrder);
    await orderPage.addItems(testData.boundaryOrder.items);

    await expect(orderPage.summaryCount).toHaveText(
      String(testData.boundaryOrder.expectedItemCount),
    );
    await expect(orderPage.summaryTotal).toHaveText(
      String(testData.boundaryOrder.expectedTotalQuantity),
    );
  });
});
