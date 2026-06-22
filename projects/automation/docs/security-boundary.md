# Security Boundary

This portfolio follows a low-permission QA automation model.

## Core Security Principle

```text
Automation validates observable UI behavior.
It does not require application source code, database content, production credentials, or internal system logic.
```

## Allowed Data for Automation and Phase 2 Mock Processing

- Test specification objective
- Acceptance criteria
- Risk focus
- Module code and module name
- Test execution status
- Failure title and failure message
- Playwright report path
- Human review notes

## Restricted Data

- Application or engineering source code
- Database tables, dumps, or production data
- Credentials, secrets, tokens, cookies, or private keys
- Production environment access
- Internal business data that has not been masked
- System-command execution initiated by AI
- Automatic defect creation without human review

## Docker Boundary

Docker packages only the QA automation runtime.

```text
Included:
- Node.js
- Playwright
- Chromium
- QA test scripts
- Local mock application for portfolio use

Excluded:
- Company application source code
- Company deployment packages
- Database dumps
- Production credentials
```

## Phase 2 Boundary

Phase 2 is implemented with deterministic mock outputs and data contracts only.

- MCP defines the approved context boundary; it does not grant execution authority.
- The LLM prompt processes summary-level test data only.
- The n8n workflow sample represents routing and notification design only.
- Human review remains mandatory before any follow-up action.
