const fs = require('fs');
const path = require('path');
const { buildMcpContext } = require('../adapters/mcp/mock-mcp-context-builder');
const { runMockLlmAnalysis } = require('../adapters/llm/mock-llm-client');

const root = process.cwd();
const reportsDir = path.join(root, 'reports');
fs.mkdirSync(reportsDir, { recursive: true });

const contextPath = path.join(reportsDir, 'mcp-context.json');
let context;
if (fs.existsSync(contextPath)) {
  context = JSON.parse(fs.readFileSync(contextPath, 'utf8'));
} else {
  context = buildMcpContext({ root });
  fs.writeFileSync(contextPath, JSON.stringify(context, null, 2), 'utf8');
}

const review = runMockLlmAnalysis(context, '07-failure-analysis');
fs.writeFileSync(path.join(reportsDir, 'ai-review.json'), JSON.stringify(review, null, 2), 'utf8');

const md = `# Deterministic Mock AI Review\n\n` +
  `Generated at: ${review.generatedAt}\n\n` +
  `## Summary\n\n${review.summary}\n\n` +
  `## Findings\n\n` +
  review.findings.map((f, i) => `${i + 1}. **${f.severity}｜${f.category}**：${f.message}\n   - Suggested action: ${f.suggestedAction}`).join('\n\n') +
  `\n\n## Scope and Safety\n\n${review.disclaimer}\n`;
fs.writeFileSync(path.join(reportsDir, 'ai-review.md'), md, 'utf8');
console.log('Deterministic mock AI review generated: reports/ai-review.json');
console.log('Deterministic mock AI review markdown generated: reports/ai-review.md');
