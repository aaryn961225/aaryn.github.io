# Workflow Map｜Requirement → Specification → Task → Execution → Review

This portfolio demonstrates a specification-driven QA automation workflow.

```text
Requirement-style input
        ↓
Reviewable specification
        ↓
Task delegation
        ↓
Specification Quality Gate
        ↓
Playwright black-box UI test
        ↓
Playwright Report + test-summary.json
        ↓
Phase 2 deterministic mock analysis
        ↓
Human review
```

## Workflow Responsibilities

| Layer | Responsibility | Owner |
|---|---|---|
| Requirement input | Describe the testing intent | QA or stakeholder |
| Specification | Define acceptance criteria, scope, risks, and boundaries | QA |
| Task mapping | Map the specification to executable module metadata | QA |
| Execution | Run Playwright and generate reports | Automation framework |
| Analysis | Summarize results and draft follow-up suggestions | Deterministic Phase 2 mock layer |
| Review | Accept, revise, or expand the testing scope | QA or designated human reviewer |

## Design Boundary

The workflow does not require application source-code access. It treats the system under test as a black box and validates observable browser behavior in an approved test environment.
