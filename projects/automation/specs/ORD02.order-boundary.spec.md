# ORD02｜一般訂貨邊界條件 Specification

## 1. Prompt / Requirement Input

使用者希望確認訂貨數量輸入 0 時，系統的摘要與計算結果符合預期。

## 2. Specification Objective

驗證訂貨量為 0 的邊界條件下，系統摘要應正確顯示總量為 0，避免數量計算或 UI 顯示錯誤。

## 3. Test Scope

- Test type: Black-box UI Automation
- Automation level: UI flow regression
- Source code access: Not required
- System under test: Mock app in this portfolio, or an existing test environment URL in a real project

## 4. Acceptance Criteria

- 使用者可登入並進入訂貨流程。
- 訂貨量輸入 0 時，系統可加入該商品或依設計顯示對應結果。
- 訂貨摘要總量應為 0。
- 測試需聚焦畫面結果，不驗證後端內部計算程式碼。

## 5. Risk Focus

- 邊界值處理錯誤可能造成訂貨數量異常。
- 畫面摘要與實際輸入不一致會造成作業誤判。
- 未來改版時，數量欄位驗證邏輯容易受到影響。

## 6. Boundary Conditions

- 本案例明確涵蓋訂貨數量為 0 的邊界值。
- 本案例不自行假設負數、超過上限或小數數量的處理方式；若需納入，必須先進入釐清流程。
- 預期可觀察結果為訂貨摘要總量顯示 0。

## 7. Error Cases

- 本案例目前未將數量 0 視為錯誤，而是驗證摘要總量是否正確。
- 若未來需求改為禁止數量 0，需先更新本規格與對應測試任務。
- 若畫面摘要總量不是 0，測試應判定失敗。

## 8. Executable Examples

```gherkin
Feature: 一般訂貨邊界條件

  Rule: 訂貨量為 0 時摘要總量必須為 0
    Example: 訂貨量為 0 的商品摘要
      Given 使用者已登入測試系統
      When 使用者加入商品且訂貨數量為 0
      Then 訂貨摘要總量為 0
```

## 9. Human Review Point

This specification is designed to be reviewed by QA before execution.  
Automation is used to execute repeatable checks, but the decision to expand, modify, or accept the coverage remains human-led.

## 10. Automation Readiness

- Quality Gate status: Ready
- Required task file: `tasks/ORD02.task.json`
- Required test mapping: Playwright grep `Boundary`

## 11. Boundary Statement

This test does not require application source code, database access, production credentials, or internal system logic.  
It validates observable behavior through the browser, following a black-box QA approach.
