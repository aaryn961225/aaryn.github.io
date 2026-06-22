# Integration Contracts

This folder defines the intended JSON boundaries between the Specification Quality Gate, Playwright summary generation, MCP context, LLM review, and n8n notification layers.

## Current Status

- Schemas document the fields and constraints expected by the local mock workflow.
- Current scripts generate artifacts that are validated against the same conceptual boundaries.
- No external service is called by the portfolio demonstration.

## Change Management

When a future adapter is introduced, keep existing contracts stable where possible. If a breaking field change is required, version the schema and update producers and consumers together.
