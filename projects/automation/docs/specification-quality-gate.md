# Specification Quality Gate

## Purpose

Before executing UI automation, this project checks whether the selected specification is clear enough to be automated.

The goal is not to let the system decide business rules. The goal is to prevent automation from being built on unclear requirements.

## Flow

```text
Formulation
→ Discovery
→ Clarify and Translation
→ Quality Gate Report
→ Playwright Automation
→ Test Summary
→ Human Review
```

## What the Gate Checks

- Clear objective
- Acceptance criteria
- Risk focus
- Boundary conditions
- Error cases
- Executable Gherkin examples
- Human review point
- Black-box boundary statement
- Task mapping
- Playwright grep mapping

## Blocking Rule

High and Medium issues block automation until QA clarifies or updates the specification. Low-priority issues may be deferred by human decision.

## Commands

```powershell
npm.cmd run quality:check
npm.cmd run quality:check -- --module ORD01
npm.cmd run quality:clarify
npm.cmd test
```
