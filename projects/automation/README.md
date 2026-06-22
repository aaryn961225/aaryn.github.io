# Specification-driven QA Automation Orchestrator

A portfolio prototype for **specification-driven black-box UI automation**.

The project demonstrates how QA can organize requirements into reviewable specifications, apply a rule-based Specification Quality Gate, execute Playwright UI tests, and define controlled extension points for future AI-assisted analysis, MCP context exchange, n8n notifications, and Docker-based execution.

## Core Positioning

The workflow does **not** require access to the application source code. It operates through observable UI behavior in an approved test environment.

```text
Requirement-style input
→ Reviewable specification
→ Task delegation
→ Specification Quality Gate
→ Playwright black-box UI test
→ Report and test summary
→ Phase 2 deterministic mock integration
→ Human review
```

## Current Capability

| Area | Status |
|---|---|
| Interactive module selection | Implemented |
| Specification summary before execution | Implemented |
| Rule-based Specification Quality Gate | Implemented |
| Playwright visible-browser execution | Implemented |
| Playwright HTML Report | Implemented |
| Test-summary generation script | Implemented |
| Prompt Library | Prepared templates |
| JSON contracts | Prepared schemas |
| MCP context builder | Deterministic mock |
| LLM review | Deterministic mock |
| n8n notification payload | Deterministic mock |
| Docker runtime configuration | Prepared and optional |

## Quick Start

From the portfolio root, enter the Automation project first:

```powershell
cd .\projects\automation
npm.cmd install
npm.cmd run install:browsers
npm.cmd run quality:check
npm.cmd test
```

`install:browsers` is required only during the first local setup. If the terminal shows `user@1.0.0` or `Error: no test specified`, the command is being run from the portfolio root rather than `projects\automation`.

See `RUN_GUIDE.html` for the complete local and Docker workflows.

## Useful Commands

```powershell
npm.cmd test
npm.cmd run quality:check
npm.cmd run quality:clarify
npm.cmd run integration:mock
npm.cmd run report:playwright
```

## Phase 2 Mock Integration

```powershell
npm.cmd run integration:mock
```

The command generates:

```text
reports/mcp-context.json
reports/ai-review.json
reports/ai-review.md
reports/n8n-payload.json
reports/mock-notification.md
```

The mock workflow is deterministic and makes no external LLM, MCP-server, or n8n-webhook calls.

## Folder Highlights

```text
specs/          Human-readable test specifications
tasks/          Machine-readable task delegation files
quality-gate/   Rule-based specification quality checks
prompts/        Templates for future AI-assisted review
contracts/      JSON schemas for integration boundaries
adapters/       Deterministic mock LLM, MCP, and n8n adapters
scripts/        CLI, quality-gate, summary, and mock-integration scripts
reports/        Generated summaries and integration outputs
docs/           Architecture, roadmap, safety, and operation documents
```

## Safety Boundary

The project does not:

- access application source code or databases;
- use production credentials or production data;
- call external AI services or n8n webhooks;
- start a live MCP server;
- create defects or change specifications without human review.

All AI-related outputs in this portfolio are mock and advisory. Human review remains mandatory.
