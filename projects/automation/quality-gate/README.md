# Specification Quality Gate

This folder defines the rule-based structural checks applied before Playwright execution.

## Commands

```powershell
npm.cmd run quality:check
npm.cmd run quality:check -- --module ORD01
npm.cmd run quality:clarify
npm.cmd run quality:clarify -- --module ORD01
npm.cmd test
```

## Relationship to Automation

The gate evaluates whether a selected specification contains the required sections and mappings defined by this prototype. A passing result permits the workflow to continue only after human confirmation; it does not prove that the business rule is correct or that the test is production-ready.

If a blocking check fails, the workflow generates clarification items under `.clarify/` for QA review.
