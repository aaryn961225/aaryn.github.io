# ORD01｜一般訂貨 Happy Path Specification

## 1. Prompt / Requirement Input

使用者希望確認一般訂貨核心流程可順利完成，包含登入、設定門市與訂貨日、加入商品、送出訂貨並取得成功結果。

## 2. Specification Objective

驗證使用者可透過畫面完成一般訂貨 Happy Path，並在送出後看到可驗證的成功訊息。

## 3. Test Scope

- Test type: Black-box UI Automation
- Automation level: UI flow regression
- Source code access: Not required
- System under test: Mock app in this portfolio, or an existing test environment URL in a real project

## 4. Acceptance Criteria

- 使用者可使用有效帳號登入測試系統。
- 使用者可設定門市與訂貨日。
- 使用者可加入指定商品與數量。
- 使用者可送出訂貨資料。
- 系統畫面顯示訂貨成功訊息。
- 測試僅驗證可觀察 UI 結果，不驗證後端原始碼或資料庫內容。

## 5. Risk Focus

- 核心訂貨流程中斷會直接影響主要回歸測試效率。
- UI 改版可能造成定位器失效。
- 成功訊息若不明確，會降低自動化驗收可靠度。

## 6. Boundary Conditions

- 本案例聚焦 Happy Path，不涵蓋數量為 0、負數或超過上限等邊界值。
- 邊界值另由 ORD02 模組處理。
- 本案例不驗證資料庫落點，只驗證畫面流程與成功結果。

## 7. Error Cases

- 本案例不涵蓋登入失敗，登入失敗由 AUTH01 模組處理。
- 本案例不涵蓋數量異常，數量邊界由 ORD02 模組處理。
- 若畫面未出現成功訊息，測試應判定失敗。

## 8. Executable Examples

```gherkin
Feature: 一般訂貨 Happy Path

  Rule: 使用者可完成一般訂貨核心流程
    Example: 成功送出一般訂貨
      Given 使用者已登入測試系統
      When 使用者設定門市與訂貨日
      And 使用者加入商品與數量
      And 使用者送出訂貨
      Then 畫面顯示訂貨成功訊息
```

## 9. Human Review Point

This specification is designed to be reviewed by QA before execution.  
Automation is used to execute repeatable checks, but the decision to expand, modify, or accept the coverage remains human-led.

## 10. Automation Readiness

- Quality Gate status: Ready
- Required task file: `tasks/ORD01.task.json`
- Required test mapping: Playwright grep `Happy Path`

## 11. Boundary Statement

This test does not require application source code, database access, production credentials, or internal system logic.  
It validates observable behavior through the browser, following a black-box QA approach.
