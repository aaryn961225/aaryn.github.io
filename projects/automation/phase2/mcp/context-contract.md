# MCP Context Contract｜Mock Design

This file defines the intended context boundary for future AI-assisted analysis.

## Purpose

MCP is treated as a controlled context-passing layer, not a test execution engine.

## Allowed Context

- Project name
- Selected module code
- Specification objective
- Acceptance criteria
- Risk focus
- Test status
- Total / passed / failed counts
- Failure title and message
- Playwright report path
- Human review requirement

## Restricted Context

- Application source code
- Database access
- Credentials or secrets
- Production data
- Internal system commands
- Unmasked business data
- Direct defect creation rights

## Sample Data Source

The intended source is:

```text
reports/test-summary.json
```

The AI layer should receive summarized, sanitized data only.
