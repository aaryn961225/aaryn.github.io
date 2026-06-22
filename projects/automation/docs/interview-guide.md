# Interview Guide

## 30-second Summary

This portfolio demonstrates a specification-driven QA automation orchestrator. It converts requirement-style inputs into reviewable test specifications, maps them to executable tasks, runs black-box UI tests through Playwright, and generates reports and summaries for human review.

## Key Message

The goal is not to replace QA with AI. The goal is to make QA test intent more structured, traceable, executable, and reviewable.

## How to Explain the Architecture

```text
Prompt
→ Specification
→ Task delegation
→ Playwright UI automation
→ Report and summary
→ Mock AI analysis
→ Human review
```

## Why Black-box UI Automation

In many QA contexts, QA may not require access to application source code. This design allows QA to start automation from the user-facing workflow by using a test environment URL, test accounts, and test data.

## How to Explain Docker

Docker is not used to package the application under test. It only packages the QA automation runtime: Node.js, Playwright, Chromium, and test scripts.

## How to Explain Phase 2

n8n, MCP, and LLM are not part of the executable testing core in this portfolio. They are deterministic mock and contract artifacts showing how test summaries could be safely analyzed or routed in the future.

## Demo Order

1. README overview
2. `npm.cmd test`
3. Select `ORD01`
4. Show Specification Summary
5. Confirm with `Y`
6. Show headed browser execution
7. Show Playwright Report
8. Show `reports/test-summary.json`
9. Show `docs/architecture.html`
10. Show `reports/ai-review.html` and clarify that it is a deterministic mock

## Strong Talking Point

> This design treats QA as an orchestrator. QA defines the specification, reviews the task boundary, executes automation, and decides follow-up actions. Tools assist the workflow, but do not replace human judgment.
