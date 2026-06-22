# Test Cases

The test cases in this portfolio are derived from human-readable specifications.

## ORD01｜一般訂貨 Happy Path

Specification: `specs/ORD01.order-happy-path.spec.md`  
Task: `tasks/ORD01.task.json`

Purpose:

- Verify login
- Set store and order date
- Add item
- Submit order
- Confirm success message

## AUTH01｜登入例外情境

Specification: `specs/AUTH01.login-exception.spec.md`  
Task: `tasks/AUTH01.task.json`

Purpose:

- Verify failed login behavior
- Ensure order area is not accessible after wrong password

## ORD02｜一般訂貨邊界條件

Specification: `specs/ORD02.order-boundary.spec.md`  
Task: `tasks/ORD02.task.json`

Purpose:

- Verify quantity boundary value
- Confirm total quantity remains 0 when order quantity is 0

## Review Principle

These tests validate observable browser behavior. They do not require source code, database access, or internal implementation details.
