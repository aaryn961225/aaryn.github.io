# QA as Orchestrator

This project positions QA not only as a test executor, but also as the owner of test intent, task boundaries, execution review, and follow-up decisions.

## Role Model

```text
Repeated manual regression
  → execute predefined checks

Specification-driven QA orchestration
  → define test intent
  → formalize a reviewable specification
  → map the specification to an executable task
  → review automation results
  → decide follow-up coverage and maintenance
```

## What QA Owns

- Test scope and risk prioritization
- Acceptance criteria and observable expected results
- Test-data definition
- Module selection and execution approval
- Review of reports and AI-assisted suggestions
- Maintenance decisions after UI or business-flow changes

## What This Design Does Not Require

- Application source-code access
- Production access
- Database credentials
- Direct system-command execution by AI
- Automatic defect creation without review

## Interview Positioning

The design demonstrates that automation can begin from QA-owned black-box workflows when an approved test environment and observable UI behavior are available. Its value is not limited to script execution; it establishes a controlled path from specification to evidence and human review.
