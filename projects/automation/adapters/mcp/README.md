# Deterministic Mock MCP Context Builder

This adapter assembles a sanitized context object for demonstrating a future MCP integration boundary.

It does not:

- start a live MCP server;
- read application source code or databases;
- access credentials or production data;
- execute system commands.

It writes approved QA artifacts to `reports/mcp-context.json` for local review.
