# Architecture｜Specification-driven QA Automation Orchestrator

This project demonstrates a QA-owned automation architecture that transforms requirement-style inputs into reviewable specifications and executable test tasks.

## Core Flow

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
Report and test summary
        ↓
Phase 2 deterministic mock integration
        ↓
Human review
```

## Phase 1｜Local Execution

Phase 1 provides a locally executable automation demonstration.

```text
specs/*.spec.md
        ↓
tasks/*.task.json
        ↓
scripts/select-module.js
        ↓
Rule-based Quality Gate
        ↓
Playwright tests
        ↓
Playwright HTML Report
        ↓
reports/test-summary.json
```

Before execution, the interactive CLI displays the selected module's objective, acceptance criteria, risk focus, and test boundary.

## Phase 1+｜Optional Docker Runtime

Docker packages only the QA automation runtime:

```text
Docker image
├─ Node.js
├─ Playwright
├─ Chromium
└─ QA automation scripts
```

The application under test remains external. The image does not contain application source code, database content, production credentials, or production configuration.

## Phase 2｜Deterministic Mock and Contract Layer

Phase 2 is intentionally implemented with local deterministic mocks and data contracts:

```text
reports/test-summary.json
        ↓
phase2/mcp/context-contract.md
        ↓
phase2/llm/failure-analysis-prompt.md
        ↓
phase2/llm/mock-ai-analysis.md
        ↓
phase2/n8n/workflow.sample.json
```

This layer demonstrates how AI-assisted analysis and workflow routing could be introduced without giving external tools direct control of the system under test.

## Design Rationale

The architecture is suitable when QA has access to an approved test environment and observable UI behavior, but does not have or require application source-code access. It prioritizes stable, high-value regression scenarios and keeps specification approval and follow-up decisions under human control.
