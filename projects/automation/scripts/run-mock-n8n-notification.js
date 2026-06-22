const fs = require('fs');
const path = require('path');
const { buildMcpContext } = require('../adapters/mcp/mock-mcp-context-builder');
const { buildMockN8nPayload } = require('../adapters/n8n/mock-n8n-webhook');

const root = process.cwd();
const reportsDir = path.join(root, 'reports');
fs.mkdirSync(reportsDir, { recursive: true });

function readJson(file, fallback) {
  if (!fs.existsSync(file)) return fallback;
  try { return JSON.parse(fs.readFileSync(file, 'utf8')); }
  catch (_) { return fallback; }
}

const context = readJson(path.join(reportsDir, 'mcp-context.json'), buildMcpContext({ root }));
const aiReview = readJson(path.join(reportsDir, 'ai-review.json'), { status: 'unknown' });
const payload = buildMockN8nPayload(context, aiReview);

fs.writeFileSync(path.join(reportsDir, 'n8n-payload.json'), JSON.stringify(payload, null, 2), 'utf8');
const md = `# Deterministic Mock n8n Notification\n\n` +
  `Event: ${payload.event}\n\n` +
  `Status: ${payload.status}\n\n` +
  `${payload.message}\n\n` +
  `Human review required: ${payload.requiresHumanReview}\n\n` +
  `No n8n webhook or external notification was called.\n`;
fs.writeFileSync(path.join(reportsDir, 'mock-notification.md'), md, 'utf8');
console.log('Deterministic mock n8n payload generated: reports/n8n-payload.json');
console.log('Deterministic mock notification preview generated: reports/mock-notification.md');
