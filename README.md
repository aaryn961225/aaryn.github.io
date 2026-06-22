# QA Career Journey｜Interview Portfolio

這是一份互動式 QA 面試作品集，主線涵蓋需求拆解、風險分析、知識資產化、使用者品質驗證，以及可重複使用的自動化執行框架。

## 快速啟動

Windows 建議直接雙擊：

```text
start-portfolio.bat
```

PowerShell 亦可使用：

```powershell
powershell -ExecutionPolicy Bypass -File .\start-portfolio.ps1
```

啟動後開啟：

```text
http://localhost:8000/
```

本作品使用 `serve.py` 提供明確宣告 UTF-8 的本機靜態伺服器。請勿直接以 `file://` 開啟；若改用其他靜態伺服器，需確認 Markdown、JSON 與 JavaScript 回應包含正確的 UTF-8 編碼資訊。

## 作品模組

### VTrainer

- PRD Analysis
- User Flow
- Decision Table：8 組核心規則、6 項高風險情境
- Requirement → Test Traceability
- Prototype 影片與 7 張操作畫面

### Dog Fetch

- 可操作的 Three.js 3D Demo
- 11 個 Behavior Tree 節點
- Risk Analysis：High 4／Medium 3／Low 4
- 7 組 Given／When／Then 測試情境

### QA Checklist

共 9 大分類、140 項：API、RWD、Form、Permission、Web Security Sanity Checks、Accessibility、VR／XR、Hardware Integration、Gamepad Input。

XR／Hardware／Gamepad 明確標示為 Scenario Library，執行狀態為 `Designed／Not yet device-tested`；Security 為 QA-level sanity checks，不等同正式滲透測試、弱點掃描或資安稽核。

### UI／UX Quality Tools

- Visualization Library：38 個來源案例與 8 個可互動的離線 ECharts
- Personalized Dashboard：排序、移除與 localStorage 持久化
- Management Data Interface：搜尋、篩選、選取、詳細資訊與 CSV 匯出
- Interaction Feedback：Loading、Empty、Success、Error、Disabled 與 Live Message

### QA Automation Orchestrator

前四個作品呈現建立自動化前所需要的分析能力；Automation Orchestrator 是另一個可重複使用的執行框架範例。此關係用於說明能力與方法的銜接，不代表五個專案已完成端對端程式整合。

內容包含：

- Specification Quality Gate
- Playwright 本機可視化執行流程
- ALL／ORD01／AUTH01／ORD02 示範模組
- Playwright HTML Report
- 選用的 Docker 執行環境設定
- 確定性 Mock MCP Context／AI Review／n8n Payload

第一次執行請先進入 Automation 專案：

```powershell
cd .\projects\automation
npm.cmd install
npm.cmd run install:browsers
npm.cmd run quality:check
npm.cmd test
```

完整操作方式請參考 `projects/automation/RUN_GUIDE.html`。

## Release 驗證

在作品集根目錄執行：

```powershell
py .\verify-release.py
```

此工具會檢查必要資源、ECharts、Automation Runbook、無障礙狀態、UTF-8 文件，以及受保護的專業文本基準。
