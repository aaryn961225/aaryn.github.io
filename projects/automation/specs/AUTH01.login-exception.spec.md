# AUTH01｜登入例外情境 Specification

## 1. Prompt / Requirement Input

使用者希望確認密碼錯誤時，系統不得進入訂貨流程，並應顯示可被驗證的錯誤訊息。

## 2. Specification Objective

驗證登入失敗情境下，系統會阻擋未授權使用者進入後續訂貨流程。

## 3. Test Scope

- Test type: Black-box UI Automation
- Automation level: UI exception regression
- Source code access: Not required
- System under test: Mock app in this portfolio, or an existing test environment URL in a real project

## 4. Acceptance Criteria

- 使用者輸入錯誤密碼後不得進入訂貨頁面。
- 系統畫面顯示登入失敗訊息。
- 訂貨區塊不得被顯示或啟用。
- 測試僅驗證畫面狀態，不驗證身份驗證原始碼。

## 5. Risk Focus

- 登入失敗卻仍進入流程會造成權限風險。
- 錯誤訊息若不明確，會使 QA 難以判斷失敗原因。
- UI 改版可能造成錯誤訊息定位失效。

## 6. Boundary Conditions

- 本案例只驗證密碼錯誤，不涵蓋帳號不存在、帳號鎖定或 session 逾時。
- 本案例不驗證密碼加密、帳號權限模型或後端驗證邏輯。
- 其他登入邊界情境應於後續規格釐清後再建立新模組。

## 7. Error Cases

- 密碼錯誤時，系統需顯示登入失敗訊息。
- 密碼錯誤時，系統不得顯示訂貨操作區。
- 若錯誤密碼仍可進入訂貨流程，測試應判定失敗。

## 8. Executable Examples

```gherkin
Feature: 登入例外情境

  Rule: 密碼錯誤時不得進入訂貨流程
    Example: 使用錯誤密碼登入失敗
      Given 使用者停留在登入頁面
      When 使用者輸入錯誤密碼並送出登入
      Then 畫面顯示登入失敗訊息
      And 訂貨操作區不可見
```

## 9. Human Review Point

This specification is designed to be reviewed by QA before execution.  
Automation is used to execute repeatable checks, but the decision to expand, modify, or accept the coverage remains human-led.

## 10. Automation Readiness

- Quality Gate status: Ready
- Required task file: `tasks/AUTH01.task.json`
- Required test mapping: Playwright grep `Exception`

## 11. Boundary Statement

This test does not require application source code, database access, production credentials, or internal system logic.  
It validates observable behavior through the browser, following a black-box QA approach.
