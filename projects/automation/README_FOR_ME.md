# README_FOR_ME｜個人操作與後續規劃

這份文件用於記錄目前專案範圍、操作方式與後續可擴充方向；正式面試說明以 `README.md` 與 `RUN_GUIDE.html` 為準。

## 1. 專案定位

這是一個可執行的 QA 作品集原型，採黑箱 UI 自動化方式展示 QA 可主導的流程：

```text
不存取受測系統原始碼
不封裝公司系統
不連線正式環境
以本機模擬受測頁面展示規格、執行與報告流程
```

它不是完整自動化平台，也不是可自主決策的 AI Agent。

## 2. 目前範圍

### Phase 1｜已實作

```text
npm.cmd test
→ 選擇示範模組
→ 顯示 Specification Summary
→ 執行 Specification Quality Gate
→ 人工確認後執行 Playwright
→ 產出 Playwright Report
→ 產出 reports/test-summary.json
```

### Phase 1+｜選用 Docker 執行環境

專案包含 Dockerfile 與操作文件。Docker 的用途是固定 QA 自動化執行環境，不是封裝受測系統或取得開發原始碼。

### Phase 2｜確定性 Mock Integration

已建立未來整合所需的 Prompt Library、JSON Schema、Mock Adapter 與輸出範例。目前不會呼叫外部 AI、n8n Webhook 或 Live MCP Server。

## 3. 第一次執行

從作品集根目錄進入 Automation 專案：

```powershell
cd .\projects\automation
npm.cmd install
npm.cmd run install:browsers
npm.cmd run quality:check
npm.cmd test
```

若看到 `user@1.0.0` 或 `Error: no test specified`，代表目前不在 `projects\automation`。

## 4. 常用指令

```powershell
npm.cmd test
npm.cmd run quality:check
npm.cmd run quality:check -- --module ORD01
npm.cmd run quality:clarify
npm.cmd run integration:mock
npm.cmd run report:playwright
```

## 5. 資料夾用途

```text
demo-app/      本機模擬受測頁面
tests/         Playwright 測試腳本
pages/         Page Object
fixtures/      測試資料
specs/         人工可讀的測試規格
tasks/         程式可讀的任務設定
quality-gate/  規格品質檢查規則
.clarify/      待釐清與已處理問題
prompts/       未來 AI-assisted review 的 Prompt 模板
contracts/     JSON Schema 與資料邊界
adapters/      確定性 Mock Adapter
scripts/       Node.js 執行腳本
reports/       測試與 Mock Integration 輸出
docs/          架構、操作與安全說明
docker/        Docker 補充說明
```

## 6. Quality Gate 邊界

目前 Quality Gate 是規則式檢查，可確認必要章節、Gherkin Example、任務映射與人工審查旗標是否存在；它不能自行判定業務規則是否正確。業務正確性與風險接受仍由 QA 人工審查。

## 7. 未來整合原則

- AI 僅提供建議，不自動修改規格。
- 不允許 AI 直接執行系統指令。
- 不提供公司原始碼、正式資料或未遮蔽敏感資訊。
- n8n、MCP 與 LLM 整合皆需經授權、資料最小化與人工審查。

## 8. 面試展示順序

1. 說明專案定位與安全邊界。
2. 執行 `npm.cmd test`，選擇 `ORD01`。
3. 說明 Specification Summary 與 Quality Gate。
4. 輸入 `Y` 執行 Playwright。
5. 展示瀏覽器操作、Playwright Report 與測試摘要。
6. 視面試官興趣補充 Docker 與 Phase 2 Mock Integration。

## 9. 一句話總結

這份作品集呈現的是：QA 如何從需求規格、品質檢查、任務映射、測試執行到報告產出，建立可審查、可追溯且具明確安全邊界的自動化流程。

## Docker 版本對齊

`@playwright/test` 固定為 `1.54.0`，Dockerfile 使用 `mcr.microsoft.com/playwright:v1.54.0-noble`。升級時必須同步調整兩者並重新建置映像檔。
