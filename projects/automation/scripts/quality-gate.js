const fs = require('fs');
const path = require('path');

function projectRoot() {
  return process.cwd();
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function parseArgs(argv = process.argv.slice(2)) {
  const args = { module: null, silent: false };
  for (let i = 0; i < argv.length; i += 1) {
    const item = argv[i];
    if (item === '--module' || item === '-m') {
      args.module = (argv[i + 1] || '').toUpperCase();
      i += 1;
    } else if (item.startsWith('--module=')) {
      args.module = item.split('=')[1].toUpperCase();
    } else if (item === '--silent') {
      args.silent = true;
    }
  }
  return args;
}

function getTaskFiles(root) {
  const tasksDir = path.join(root, 'tasks');
  if (!fs.existsSync(tasksDir)) return [];
  return fs.readdirSync(tasksDir)
    .filter((name) => name.endsWith('.task.json') && name !== 'ALL.task.json')
    .map((name) => path.join(tasksDir, name));
}

function loadTasks(root, moduleCode) {
  const taskFiles = getTaskFiles(root);
  const tasks = taskFiles.map((file) => readJson(file));
  if (!moduleCode) return tasks;
  return tasks.filter((task) => String(task.code).toUpperCase() === moduleCode);
}

function hasHeading(markdown, heading) {
  const escaped = heading.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const pattern = new RegExp(`^#{1,6}\\s+.*${escaped}.*$`, 'im');
  return pattern.test(markdown);
}

function countListItemsUnderHeading(markdown, heading) {
  const lines = markdown.split(/\r?\n/);
  const start = lines.findIndex((line) => /^#{1,6}\s+/.test(line) && line.toLowerCase().includes(heading.toLowerCase()));
  if (start === -1) return 0;

  let count = 0;
  for (let i = start + 1; i < lines.length; i += 1) {
    const line = lines[i];
    if (/^#{1,6}\s+/.test(line)) break;
    if (/^\s*-\s+.+/.test(line)) count += 1;
  }
  return count;
}

function issue(code, name, priority, type, message, location, suggestion) {
  return {
    id: `${code}-${type}`,
    module: code,
    moduleName: name,
    priority,
    type,
    message,
    location,
    suggestion,
    status: 'Pending'
  };
}

function checkTask(root, task, checklist) {
  const issues = [];
  const code = task.code || 'UNKNOWN';
  const name = task.name || code;

  for (const field of checklist.requiredTaskFields) {
    if (!(field in task) || task[field] === null || task[field] === '' || (Array.isArray(task[field]) && task[field].length === 0)) {
      issues.push(issue(code, name, 'High', `missing-task-field-${field}`, `任務設定檔缺少必要欄位：${field}`, `tasks/${code}.task.json`, `補上 ${field} 欄位後再執行自動化。`));
    }
  }

  if (task.humanReviewRequired !== true) {
    issues.push(issue(code, name, 'Medium', 'human-review-not-required', 'Task 未明確要求 humanReviewRequired: true。', `tasks/${code}.task.json`, '將 humanReviewRequired 設為 true，保留人工審核節點。'));
  }

  const specPath = path.join(root, task.specification || '');
  if (!task.specification || !fs.existsSync(specPath)) {
    issues.push(issue(code, name, 'High', 'missing-spec-file', `找不到對應規格檔：${task.specification || '(empty)'}`, `tasks/${code}.task.json`, '確認 task.specification 指向存在的 specs/*.spec.md 檔案。'));
    return issues;
  }

  const markdown = fs.readFileSync(specPath, 'utf8');
  for (const section of checklist.requiredSpecSections) {
    if (!hasHeading(markdown, section.heading)) {
      issues.push(issue(code, name, section.priority, `missing-section-${section.id}`, `規格缺少章節：${section.heading}`, task.specification, `補充 ${section.heading}，避免自動化建立在不完整規格上。`));
    } else if (['Acceptance Criteria', 'Boundary Conditions', 'Error Cases'].includes(section.heading)) {
      const count = countListItemsUnderHeading(markdown, section.heading);
      if (count === 0) {
        issues.push(issue(code, name, section.priority, `empty-section-${section.id}`, `章節 ${section.heading} 未列出可審核項目。`, task.specification, `在 ${section.heading} 下方至少列出一項可審核內容。`));
      }
    }
  }

  if (!/```gherkin[\s\S]*?(Given|When|Then)/i.test(markdown)) {
    issues.push(issue(code, name, 'High', 'missing-gherkin-example', 'Executable Examples 未包含可轉換為測試的 Gherkin Given / When / Then。', task.specification, '補充至少一個 Gherkin Example，並包含 When 與可驗證 Then。'));
  }

  if (task.grep) {
    const testFile = path.join(root, 'tests', 'web-sc-order.spec.js');
    const testText = fs.existsSync(testFile) ? fs.readFileSync(testFile, 'utf8') : '';
    if (!testText.includes(task.grep)) {
      issues.push(issue(code, name, 'High', 'missing-test-mapping', `找不到對應 Playwright grep：${task.grep}`, 'tests/web-sc-order.spec.js', '確認測試標題包含 task.grep，讓任務可被委派執行。'));
    }
  }

  return issues;
}

function cleanPendingClarifyFiles(root, moduleCodes) {
  const featuresDir = path.join(root, '.clarify', 'features');
  ensureDir(featuresDir);
  for (const file of fs.readdirSync(featuresDir)) {
    if (!file.endsWith('.md')) continue;
    const shouldRemove = moduleCodes.some((code) => file.startsWith(`${code}_`));
    if (shouldRemove) fs.rmSync(path.join(featuresDir, file), { force: true });
  }
}

function clarificationQuestionForIssue(item) {
  if (item.type.includes('boundary')) {
    return {
      question: `${item.moduleName} 是否需要補充邊界條件？`,
      options: [
        ['A', '補充目前模組已明確涵蓋的邊界值'],
        ['B', '標記為本階段不涵蓋，後續另開模組'],
        ['C', '先延後處理，不阻擋本次示範'],
        ['自訂', '提供其他經 QA 審查的答案']
      ]
    };
  }
  if (item.type.includes('error')) {
    return {
      question: `${item.moduleName} 是否需要補充例外或錯誤處理情境？`,
      options: [
        ['A', '補充目前模組已明確涵蓋的錯誤情境'],
        ['B', '標記為本階段不涵蓋，後續另開模組'],
        ['C', '先延後處理，不阻擋本次示範'],
        ['自訂', '提供其他經 QA 審查的答案']
      ]
    };
  }
  if (item.type.includes('example') || item.type.includes('gherkin')) {
    return {
      question: `${item.moduleName} 是否需要補充可執行 Example？`,
      options: [
        ['A', '補充 Gherkin Example'],
        ['B', '先補 TODO，待 QA 審核後再自動化'],
        ['C', '先延後處理，不阻擋本次示範'],
        ['自訂', '提供其他經 QA 審查的答案']
      ]
    };
  }
  return {
    question: `${item.moduleName} 的規格缺口是否要現在處理？`,
    options: [
      ['A', '現在補充規格'],
      ['B', '標記為本階段不涵蓋'],
      ['C', '先延後處理'],
      ['自訂', '提供其他經 QA 審查的答案']
    ]
  };
}

function writeClarifyFiles(root, issues, moduleCodesForCleanup = null) {
  const featuresDir = path.join(root, '.clarify', 'features');
  const overviewPath = path.join(root, '.clarify', 'overview.md');
  ensureDir(featuresDir);
  ensureDir(path.join(root, '.clarify', 'resolved', 'features'));
  ensureDir(path.join(root, '.clarify', 'data'));
  ensureDir(path.join(root, '.clarify', 'resolved', 'data'));

  const moduleCodes = moduleCodesForCleanup || [...new Set(issues.map((item) => item.module))];
  cleanPendingClarifyFiles(root, moduleCodes);

  for (const item of issues) {
    const prompt = clarificationQuestionForIssue(item);
    const filename = `${item.module}_${item.type}.md`.replace(/[\\/:*?"<>|]/g, '_');
    const table = prompt.options.map(([key, value]) => `| ${key} | ${value} |`).join('\n');
    const text = `# 釐清問題\n\n${prompt.question}\n\n# 定位\n\n- Module: ${item.module}｜${item.moduleName}\n- Location: ${item.location}\n- Issue: ${item.message}\n\n# 多選題\n\n| 選項 | 描述 |\n|------|------|\n${table}\n\n# 影響範圍\n\n${item.suggestion}\n\n# 優先級\n\n${item.priority}\n`;
    fs.writeFileSync(path.join(featuresDir, filename), text, 'utf8');
  }

  const high = issues.filter((item) => item.priority === 'High').length;
  const medium = issues.filter((item) => item.priority === 'Medium').length;
  const low = issues.filter((item) => item.priority === 'Low').length;
  const lines = [];
  lines.push('# Clarification Overview');
  lines.push('');
  lines.push(`Total pending items: ${issues.length}`);
  lines.push(`- High: ${high}`);
  lines.push(`- Medium: ${medium}`);
  lines.push(`- Low: ${low}`);
  lines.push('');
  lines.push('## Suggested Order');
  lines.push('');
  issues.forEach((item, index) => {
    lines.push(`${index + 1}. [${item.priority}] ${item.module} - ${item.message}`);
    lines.push(`   - Location: ${item.location}`);
    lines.push(`   - Clarify file: .clarify/features/${item.module}_${item.type}.md`);
  });
  lines.push('');
  lines.push('## Next Command');
  lines.push('');
  lines.push('```powershell');
  lines.push('npm.cmd run quality:clarify');
  lines.push('```');
  fs.writeFileSync(overviewPath, lines.join('\n') + '\n', 'utf8');
}

function writeReport(root, targetModule, issues, tasks) {
  ensureDir(path.join(root, 'reports'));
  const blocking = issues.filter((item) => ['High', 'Medium'].includes(item.priority));
  const report = {
    project: 'Specification-driven QA Automation Orchestrator',
    gate: 'Specification Quality Gate',
    module: targetModule || 'ALL',
    checkedModules: tasks.map((task) => task.code),
    status: blocking.length === 0 ? 'passed' : 'failed',
    allowedToAutomate: blocking.length === 0,
    summary: {
      totalIssues: issues.length,
      high: issues.filter((item) => item.priority === 'High').length,
      medium: issues.filter((item) => item.priority === 'Medium').length,
      low: issues.filter((item) => item.priority === 'Low').length,
      blocking: blocking.length
    },
    issues,
    nextAction: blocking.length === 0
      ? 'Automation may proceed after human confirmation.'
      : 'Run npm.cmd run quality:clarify or update specifications before automation.'
  };
  fs.writeFileSync(path.join(root, 'reports', 'quality-gate-report.json'), JSON.stringify(report, null, 2), 'utf8');
  return report;
}

function runQualityGate(options = {}) {
  const root = options.root || projectRoot();
  const targetModule = options.module ? String(options.module).toUpperCase() : null;
  const checklist = readJson(path.join(root, 'quality-gate', 'checklist.json'));
  const tasks = loadTasks(root, targetModule);

  if (targetModule && tasks.length === 0) {
    const unknown = [issue(targetModule, targetModule, 'High', 'unknown-module', `找不到模組：${targetModule}`, 'tasks/', '確認模組代碼是否存在。')];
    writeClarifyFiles(root, unknown, [targetModule]);
    return writeReport(root, targetModule, unknown, []);
  }

  const issues = [];
  for (const task of tasks) issues.push(...checkTask(root, task, checklist));

  const cleanupCodes = tasks.map((task) => task.code);
  writeClarifyFiles(root, issues, cleanupCodes);

  return writeReport(root, targetModule, issues, tasks);
}

function printReport(report) {
  console.log('\n=== Specification Quality Gate Result ===');
  console.log(`Module: ${report.module}`);
  console.log(`Status: ${report.status.toUpperCase()}`);
  console.log(`Allowed to automate: ${report.allowedToAutomate ? 'YES' : 'NO'}`);
  console.log(`Issues: ${report.summary.totalIssues} (High: ${report.summary.high}, Medium: ${report.summary.medium}, Low: ${report.summary.low})`);

  if (report.issues.length) {
    console.log('\nPending issues:');
    for (const item of report.issues) {
      console.log(`- [${item.priority}] ${item.module} ${item.message}`);
      console.log(`  Location: ${item.location}`);
    }
    console.log('\nNext: npm.cmd run quality:clarify');
  }

  console.log('\nReport: reports/quality-gate-report.json');
}

if (require.main === module) {
  const args = parseArgs();
  const report = runQualityGate({ module: args.module });
  if (!args.silent) printReport(report);
}

module.exports = { runQualityGate, parseArgs, printReport };
