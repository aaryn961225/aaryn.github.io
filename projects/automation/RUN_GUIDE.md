# QA Automation Orchestrator｜操作指南

## 專案位置

所有 npm 與 Docker 指令都必須在 Automation 專案內執行：

```powershell
cd .\projects\automation
```

正確的套件名稱應為：

```text
specification-driven-qa-automation-orchestrator@1.0.8
```

若看到 `user@1.0.0` 或 `Error: no test specified`，代表 PowerShell 仍位於作品集根目錄。

## 第一次安裝

```powershell
cd .\projects\automation
npm.cmd install
npm.cmd run install:browsers
npm.cmd run quality:check
npm.cmd test
```

- `npm.cmd install`：安裝專案固定版本的 `@playwright/test`。
- `npm.cmd run install:browsers`：安裝與專案 Playwright 版本相符的 Chromium；通常只需首次執行。
- `npm.cmd run quality:check`：以規則式 Quality Gate 檢查規格是否符合此原型的自動化進入條件。
- `npm.cmd test`：進入互動式模組選單。

## 互動式展示

選單包含：

- `ALL`：執行示範範圍內的全部測試。
- `ORD01`：一般訂貨 Happy Path。
- `AUTH01`：登入例外。
- `ORD02`：訂貨量為 0 的邊界情境。

建議首次展示輸入：

```text
ORD01
```

執行流程：

1. 顯示 Specification Summary。
2. 執行 Specification Quality Gate。
3. Gate 通過並經人工確認後，輸入 `Y`。
4. Chromium 以可視化模式（headed mode）顯示自動操作。
5. 產生 `reports/test-summary.json`。
6. 開啟 Playwright HTML Report。
7. 查看完畢後，在 PowerShell 按 `Ctrl + C` 關閉報告伺服器。

## 日常重跑

```powershell
cd .\projects\automation
npm.cmd test
```

日常重跑不需要再次安裝 Chromium。

只開啟既有報告：

```powershell
npm.cmd run report:playwright
```

只檢查規格：

```powershell
npm.cmd run quality:check
```

執行 Phase 2 deterministic mock integration：

```powershell
npm.cmd run integration:mock
```

## Docker（選用）

Docker 僅封裝 QA 自動化執行環境，包括 Node.js、Playwright、Chromium 與測試腳本。映像檔不包含受測系統原始碼、正式資料庫、正式環境憑證或外部 AI 服務。

建置映像檔：

```powershell
cd .\projects\automation
docker build --no-cache -t low-code-qa-demo-portfolio-v8 .
```

執行測試並將報告保存至本機：

```powershell
docker run --rm `
  -v "${PWD}\playwright-report:/work/playwright-report" `
  -v "${PWD}\reports:/work/reports" `
  low-code-qa-demo-portfolio-v8
```

Docker 預設以無頭模式（headless mode）執行示範範圍內的測試。面試現場建議使用本機可視化執行；Docker 用於說明執行環境一致性、隔離性與未來 CI 整合基礎。
