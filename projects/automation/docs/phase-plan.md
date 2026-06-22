# Phase Plan

## Phase 1｜Specification-driven Local MVP

Goal: Build an executable black-box UI automation prototype that starts from QA-owned specifications.

Includes:

- Human-readable specifications in `specs/`
- Task delegation metadata in `tasks/`
- Interactive module selector
- Specification summary before execution
- Playwright headed execution
- Playwright HTML Report
- `reports/test-summary.json`

Does not include:

- Application source code
- Database access
- Production environment access
- AI agent execution
- Automatic defect creation

## Phase 1+｜Optional Docker Runtime

Goal: Provide an optional, isolated, and reproducible test runtime that can support a future CI environment.

Includes:

- Dockerfile
- Playwright and Chromium runtime
- QA automation scripts

Does not include:

- System-under-test source code
- Company deployment packages
- Production credentials

## Phase 2｜AI-assisted Workflow Mock Design

Goal: Demonstrate future integration design while keeping security boundaries clear.

Includes:

- MCP context contract
- LLM analysis prompt
- Mock AI analysis
- n8n workflow sample
- Human review checklist

Does not include:

- Live n8n server
- Real MCP server
- External LLM connection
- Direct system command execution
- Automatic decision-making
