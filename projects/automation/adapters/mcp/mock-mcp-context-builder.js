const fs = require('fs');
const path = require('path');

function readJsonIfExists(filePath, fallback = null) {
  if (!fs.existsSync(filePath)) return fallback;
  try { return JSON.parse(fs.readFileSync(filePath, 'utf8')); }
  catch (_) { return fallback; }
}

function buildMcpContext(options = {}) {
  const root = options.root || process.cwd();
  const qualityGateReport = readJsonIfExists(path.join(root, 'reports', 'quality-gate-report.json'), {});
  const testSummary = readJsonIfExists(path.join(root, 'reports', 'test-summary.json'), {});

  return {
    project: 'Specification-driven QA Automation Orchestrator',
    contextType: 'qa-automation-review',
    generatedAt: new Date().toISOString(),
    allowedContext: [
      'specification summary',
      'quality gate status',
      'clarification issue summary',
      'test summary',
      'report path',
      'deterministic mock review inputs only'
    ],
    restrictedContext: [
      'application source code',
      'database content',
      'credentials',
      'production data',
      'system command execution',
      'unmasked internal business data'
    ],
    artifacts: {
      qualityGateReport,
      testSummary,
      promptLibrary: 'prompts/',
      contracts: 'contracts/',
      playwrightReport: 'playwright-report/index.html'
    },
    humanReviewRequired: true,
    note: 'This deterministic mock MCP context is intended for local review and does not connect to a live MCP server.'
  };
}

module.exports = { buildMcpContext };
