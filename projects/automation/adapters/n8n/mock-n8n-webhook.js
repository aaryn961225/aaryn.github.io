function buildMockN8nPayload(context, aiReview) {
  const qg = context?.artifacts?.qualityGateReport || {};
  const ts = context?.artifacts?.testSummary || {};
  const status = aiReview?.status || qg.status || ts.status || 'unknown';
  return {
    event: 'qa.automation.review.completed',
    project: context?.project || 'Specification-driven QA Automation Orchestrator',
    status,
    generatedAt: new Date().toISOString(),
    message: status === 'ok'
      ? 'The deterministic mock review completed with no blocking issue in the retained demonstration artifacts.'
      : 'QA automation review completed. Human review is required before proceeding.',
    artifacts: {
      qualityGateReport: 'reports/quality-gate-report.json',
      testSummary: 'reports/test-summary.json',
      mcpContext: 'reports/mcp-context.json',
      aiReview: 'reports/ai-review.json',
      playwrightReport: 'playwright-report/index.html'
    },
    requiresHumanReview: true,
    note: 'This is a deterministic local mock payload. No n8n webhook or external notification was called.'
  };
}

module.exports = { buildMockN8nPayload };
