# MCP Context Design

MCP is treated as a controlled context boundary rather than an execution channel.

## Allowed Context

- Quality Gate report
- Test summary
- Playwright report path
- Sanitized specification summary
- Prompt Library reference

## Restricted Context

- Application source code
- Database content
- Credentials or secrets
- Production data
- System-command execution capability

## Current Status

`adapters/mcp/mock-mcp-context-builder.js` generates `reports/mcp-context.json` locally. No live MCP server is started.
