function classifyStatus(context) {
  const qg = context?.artifacts?.qualityGateReport || {};
  const ts = context?.artifacts?.testSummary || {};
  if (qg.allowedToAutomate === false) return 'needs_review';
  if (ts.failed && ts.failed > 0) return 'needs_review';
  return 'ok';
}

function runMockLlmAnalysis(context, promptId = '07-failure-analysis') {
  const status = classifyStatus(context);
  const qg = context?.artifacts?.qualityGateReport || {};
  const ts = context?.artifacts?.testSummary || {};
  const findings = [];

  if (qg.allowedToAutomate === false) {
    findings.push({
      severity: 'High',
      category: 'Specification Quality Gate',
      message: 'Quality Gate is not passed. Automation should not proceed without QA review.',
      suggestedAction: 'Run quality:clarify or update specs/tasks before executing tests.'
    });
  }

  if (ts.failed && ts.failed > 0) {
    findings.push({
      severity: 'Medium',
      category: 'Test Execution',
      message: `${ts.failed} test(s) failed in the latest summary.`,
      suggestedAction: 'Check Playwright report and compare failure with the related specification.'
    });
  }

  if (findings.length === 0) {
    findings.push({
      severity: 'Low',
      category: 'Follow-up Testing',
      message: 'The retained demonstration artifacts contain no blocking issue. Additional boundary conditions should still be reviewed according to current business risk.',
      suggestedAction: 'QA should add or reprioritize boundary cases when the business risk or specification changes.'
    });
  }

  return {
    status,
    promptId,
    generatedAt: new Date().toISOString(),
    summary: status === 'ok'
      ? 'The deterministic mock review identified no blocking issue in the available demonstration reports.'
      : 'The deterministic mock review identified items that require QA review.',
    findings,
    humanReviewRequired: true,
    disclaimer: 'This is a deterministic local mock response. No external LLM was called, and human review remains required.'
  };
}

module.exports = { runMockLlmAnalysis };
