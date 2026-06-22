# QA Career Journey Portfolio

## 啟動方式

Windows 建議直接雙擊：

```text
start-portfolio.bat
```

PowerShell 可使用目前工作階段的 Bypass 啟動，不會永久修改系統執行原則：

```powershell
powershell -ExecutionPolicy Bypass -File .\start-portfolio.ps1
```

啟動後開啟：

```text
http://localhost:8000/
```

若要手動啟動，請使用本專案的 UTF-8 靜態伺服器：

```powershell
py .\serve.py 8000
```

`serve.py` 會為 Markdown、JSON、JavaScript 與其他文字資源宣告 UTF-8，避免箭頭、全形符號與中文出現亂碼。

## 作品內容

- `index.html`：QA Career Journey 主作品集。
- `assets/vtrainer/`：VTrainer Requirement、Prototype Flow、操作畫面與 Demo 影片。
- `projects/dog/`：Dog Fetch 3D Demo、模型、材質、音效與必要執行資源。
- `projects/ui-charts/`：8 個可離線執行的代表性 ECharts。
- `projects/ui-charts/source-examples/`：`chart38.zip` 的來源案例；保留作為追溯資料，不作為面試現場的主要執行入口。
- `projects/automation/`：Automation Orchestrator、Demo App、Quality Gate、Playwright Report、Docker 設定與確定性 Mock Integration 輸出。

## Visualization Library 定位

主展示包含 8 個可操作的離線 ECharts：Line、Area、Bar、Stacked Bar、Donut、Radar、Gauge、Scatter。支援搜尋、分類、Theme、Tooltip、Legend、Responsive Resize 與 Dashboard 的 localStorage 持久化。

38 個原始案例保留於 `projects/ui-charts/source-examples/`。作品集未宣稱所有來源案例均已重新工程化。

## Automation 定位

前四個作品代表建立自動化前所需要的分析能力；Automation Orchestrator 是另一個可重複使用的執行框架範例。此作品集呈現能力與方法的銜接，不代表五個專案已完成端對端程式整合。

所有 npm 與 Docker 指令都必須先進入 Automation 專案：

```powershell
cd .\projects\automation
```

完整操作方式請查看：

- `projects/automation/RUN_GUIDE.html`
- `projects/automation/docs/docker-integration-guide.html`
- `projects/automation/docs/architecture.html`

## Release 驗證

在作品集根目錄執行：

```powershell
py .\verify-release.py
```

驗證工具會檢查主入口、ECharts、Automation Runbook、無障礙狀態、必要資源、UTF-8 文件、專業文本基準與已知版本回退字串。
