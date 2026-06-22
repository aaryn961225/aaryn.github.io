const fs = require('fs');
const path = require('path');

const MODULES = {
  ALL: '示範範圍內全部測試',
  ORD01: '一般訂貨 Happy Path',
  AUTH01: '登入例外情境',
  ORD02: '一般訂貨邊界條件'
};

function getArgValue(flag) {
  const index = process.argv.indexOf(flag);
  if (index >= 0 && process.argv[index + 1]) {
    return process.argv[index + 1];
  }
  return undefined;
}

function walkSuites(suite, tests = []) {
  if (!suite) return tests;

  if (Array.isArray(suite.specs)) {
    for (const spec of suite.specs) {
      for (const test of spec.tests || []) {
        tests.push({ spec, test });
      }
    }
  }

  if (Array.isArray(suite.suites)) {
    for (const child of suite.suites) {
      walkSuites(child, tests);
    }
  }

  return tests;
}

function getWorstStatus(results = []) {
  if (results.some((result) => result.status === 'failed' || result.status === 'timedOut' || result.status === 'interrupted')) {
    return 'failed';
  }
  if (results.some((result) => result.status === 'skipped')) {
    return 'skipped';
  }
  return 'passed';
}

function readPlaywrightResults(filePath) {
  if (!fs.existsSync(filePath)) {
    return null;
  }

  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (error) {
    return { parseError: error.message };
  }
}

function buildSummary() {
  const root = process.cwd();
  const reportsDir = path.join(root, 'reports');
  fs.mkdirSync(reportsDir, { recursive: true });

  const resultPath = path.join(reportsDir, 'playwright-results.json');
  const raw = readPlaywrightResults(resultPath);
  const moduleCode = (getArgValue('--module') || process.env.QA_SELECTED_MODULE_CODE || 'UNKNOWN').toUpperCase();
  const moduleName = MODULES[moduleCode] || process.env.QA_SELECTED_MODULE_NAME || 'Unknown Module';
  const generatedAt = new Date().toISOString();

  const summary = {
    project: 'Specification-driven QA Automation Orchestrator',
    module: moduleCode,
    moduleName,
    testType: process.env.QA_TEST_TYPE || 'Specification-driven Black-box UI Automation',
    specification: process.env.QA_SPEC_PATH || null,
    task: process.env.QA_TASK_PATH || null,
    orchestrationFlow: [
      'Prompt / requirement input',
      'Specification',
      'Task delegation',
      'Specification Quality Gate',
      'Playwright black-box UI execution',
      'Report and summary generation',
      'Phase 2 deterministic mock review',
      'Human review'
    ],
    generatedAt,
    sourceReport: 'reports/playwright-results.json',
    playwrightReport: 'playwright-report/index.html',
    status: 'unknown',
    total: 0,
    passed: 0,
    failed: 0,
    skipped: 0,
    durationMs: 0,
    failedCases: [],
    aiAccessScope: [
      'test summary',
      'quality gate result',
      'module result',
      'specification objective',
      'acceptance criteria',
      'failure title',
      'failure message',
      'report path'
    ],
    restrictedScope: [
      'system-under-test source code',
      'database access',
      'credentials or secrets',
      'production system',
      'unmasked business data',
      'automatic defect creation without human review'
    ],
    humanReviewRequired: true,
    note: 'This summary is intended for the local Phase 2 deterministic mock review. It contains specification-level context and execution results only; it excludes source code, credentials, database content, and internal system details.'
  };

  if (!raw) {
    summary.status = 'no-result-file';
    summary.note = 'Playwright JSON result was not found. Run npm.cmd test first.';
    return summary;
  }

  if (raw.parseError) {
    summary.status = 'result-parse-error';
    summary.failedCases.push({ title: 'Unable to parse Playwright JSON result', error: raw.parseError });
    return summary;
  }

  const tests = [];
  for (const suite of raw.suites || []) {
    walkSuites(suite, tests);
  }

  summary.total = tests.length;

  for (const { spec, test } of tests) {
    const status = getWorstStatus(test.results || []);
    const duration = (test.results || []).reduce((sum, result) => sum + (result.duration || 0), 0);
    summary.durationMs += duration;

    if (status === 'passed') summary.passed += 1;
    else if (status === 'skipped') summary.skipped += 1;
    else summary.failed += 1;

    if (status === 'failed') {
      const firstError = (test.results || []).flatMap((result) => result.errors || [result.error].filter(Boolean))[0];
      summary.failedCases.push({
        title: spec.title,
        status,
        error: firstError ? String(firstError.message || firstError.value || firstError) : 'No error details available'
      });
    }
  }

  if (summary.failed > 0) summary.status = 'failed';
  else if (summary.total > 0 && summary.passed === summary.total) summary.status = 'passed';
  else if (summary.skipped > 0) summary.status = 'partial';
  else summary.status = 'unknown';

  return summary;
}

const summary = buildSummary();
const outputPath = path.join(process.cwd(), 'reports', 'test-summary.json');
fs.writeFileSync(outputPath, `${JSON.stringify(summary, null, 2)}\n`, 'utf8');
console.log(`已產生：${outputPath}`);
console.log(`狀態：${summary.status}，Total=${summary.total}，Passed=${summary.passed}，Failed=${summary.failed}`);
