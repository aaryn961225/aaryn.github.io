# Specification Quality Gate Rules

This project applies a rule-based Specification Quality Gate before UI test execution.

## Purpose

The gate blocks the demonstration workflow when required structural information is missing, such as acceptance criteria, boundary conditions, error cases, executable examples, or task-to-test mappings. It does not independently determine whether a business rule is correct.

## Core Principles

1. **No guessing**: The workflow does not invent business rules.
2. **Black-box boundary**: Checks and tests focus on observable UI behavior.
3. **Human review required**: Clarification answers and execution approval remain human decisions.
4. **High and Medium issues block the prototype workflow**: Low-priority items may be deferred by an explicit human decision.
5. **The Quality Gate Report is an input to approval**: It does not execute tests or replace QA judgment.

## Output

- `.clarify/overview.md`
- `.clarify/features/*.md`
- `reports/quality-gate-report.json`
