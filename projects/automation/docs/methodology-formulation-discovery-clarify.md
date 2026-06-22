# Methodology｜Formulation → Discovery → Clarify

This portfolio uses a staged workflow to convert requirement-style input into a reviewable specification.

## Step 1｜Formulation

Structure the test intent, scope, acceptance criteria, risks, boundaries, and observable expected results.

Primary output in this project:

- `specs/*.spec.md`

## Step 2｜Discovery

Apply rule-based checks to identify missing required sections, task mappings, or executable examples.

Primary outputs:

- `.clarify/overview.md`
- `.clarify/features/*.md`
- `reports/quality-gate-report.json`

## Step 3｜Clarify and Translation

Ask one clarification question at a time. QA decides whether to update the specification, defer a low-priority issue, or reject an unsupported assumption.

## Step 4｜Quality Gate Loop

Re-run the gate after clarification. Continue until no blocking High or Medium issues remain, or until the specification is intentionally withheld from automation.

## Step 5｜Task Mapping and Execution Approval

Map the approved specification to `tasks/*.task.json` and its Playwright test. A passing gate permits execution only after human confirmation.
