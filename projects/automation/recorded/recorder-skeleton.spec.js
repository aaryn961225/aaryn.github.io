// 示意：由 Recorder / Codegen 產生的初始腳本骨架。
// 注意：這份檔案刻意保留「錄製後尚未整理」的樣貌，供 demo 說明 Low-Code 起點。
// 實務上應搬到 pages/ 與 fixtures/ 進行模組化與資料抽離。

const { test, expect } = require('@playwright/test');
const path = require('path');
const { pathToFileURL } = require('url');

test('recorded skeleton - order happy path', async ({ page }) => {
  const demoAppUrl = pathToFileURL(path.resolve(__dirname, '../demo-app/index.html')).toString();
  await page.goto(demoAppUrl);
  await page.getByLabel('帳號').fill('qa.demo');
  await page.getByLabel('密碼').fill('demo1234');
  await page.getByRole('button', { name: '登入' }).click();
  await page.getByLabel('門市').selectOption('A001');
  await page.getByLabel('訂貨日').fill('2026-06-17');
  await page.getByLabel('冰美式咖啡 訂貨量').fill('8');
  await page.getByRole('button', { name: '加入 冰美式咖啡' }).click();
  await page.getByLabel('鮪魚飯糰 訂貨量').fill('10');
  await page.getByRole('button', { name: '加入 鮪魚飯糰' }).click();
  await page.getByRole('button', { name: '送出訂貨' }).click();
  await expect(page.locator('#order-status')).toContainText('訂貨成功');
});
