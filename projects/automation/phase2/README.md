# Phase 2 Deterministic Mock Integration

This folder contains design artifacts and locally executable deterministic mocks for the proposed Phase 2 integration layer.

Run the mock workflow with:

```powershell
npm.cmd run integration:mock
```

Generated outputs include:

- `reports/mcp-context.json`
- `reports/ai-review.json`
- `reports/ai-review.md`
- `reports/n8n-payload.json`
- `reports/mock-notification.md`

No external AI service, live MCP server, n8n webhook, or external notification is used.
