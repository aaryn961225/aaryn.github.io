const fs = require('fs');
const path = require('path');
const { buildMcpContext } = require('../adapters/mcp/mock-mcp-context-builder');

const root = process.cwd();
const output = path.join(root, 'reports', 'mcp-context.json');
fs.mkdirSync(path.dirname(output), { recursive: true });
const context = buildMcpContext({ root });
fs.writeFileSync(output, JSON.stringify(context, null, 2), 'utf8');
console.log('Deterministic mock MCP context generated: reports/mcp-context.json');
