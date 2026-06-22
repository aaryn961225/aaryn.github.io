const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { execSync } = require('child_process');
const { runQualityGate, printReport } = require('./quality-gate');

const modules = [
  { code: 'ALL', name: '示範範圍內全部測試', description: '執行目前定義的登入、例外與邊界測試', grep: '' },
  { code: 'ORD01', name: '一般訂貨 Happy Path', description: '登入後設定訂貨資料、加入商品、送出訂貨', grep: 'Happy Path' },
  { code: 'AUTH01', name: '登入例外情境', description: '密碼錯誤時不得進入訂貨流程', grep: 'Exception' },
  { code: 'ORD02', name: '一般訂貨邊界條件', description: '訂貨量為 0 時，驗證摘要總量', grep: 'Boundary' }
];

function createQuestion() {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return (question) => new Promise((resolve) => {
    rl.question(question, (answer) => { rl.close(); resolve(answer); });
  });
}

function getNpmCommand() {
  return process.platform === 'win32' ? 'npm.cmd' : 'npm';
}

function runShell(command) {
  console.log(`> ${command}`);
  try {
    execSync(command, { stdio: 'inherit', env: process.env, windowsHide: false });
    return 0;
  } catch (error) {
    if (typeof error.status === 'number') {
      console.error(`\n指令結束代碼：${error.status}`);
      return error.status;
    }
    console.error('\n指令執行失敗：', error.message);
    return 1;
  }
}

function hasNodeModules() {
  return fs.existsSync(path.join(process.cwd(), 'node_modules', '@playwright', 'test'));
}

function hasChromiumBrowser() {
  try {
    const { chromium } = require('playwright');
    const browserPath = chromium.executablePath();
    return Boolean(browserPath && fs.existsSync(browserPath));
  } catch (_) {
    return false;
  }
}

function getMissingPrerequisites() {
  const missing = [];
  if (!hasNodeModules()) {
    missing.push({ key: 'packages', label: 'npm 套件尚未安裝', command: `${getNpmCommand()} install` });
    missing.push({ key: 'browsers', label: 'Playwright Chromium 尚未確認安裝', command: `${getNpmCommand()} run install:browsers` });
    return missing;
  }
  if (!hasChromiumBrowser()) missing.push({ key: 'browsers', label: 'Playwright Chromium 尚未安裝', command: `${getNpmCommand()} run install:browsers` });
  return missing;
}

async function ensurePrerequisites() {
  console.log('\n=== Specification-driven QA Automation Orchestrator ===');
  console.log(`啟動指令：${getNpmCommand()} test`);

  const missing = getMissingPrerequisites();
  if (missing.length === 0) return true;

  console.log('\n偵測到首次執行或環境尚未完成：');
  for (const item of missing) console.log(`- ${item.label}`);
  console.log('\n需要先執行：');
  const commands = [...new Set(missing.map((item) => item.command))];
  for (const command of commands) console.log(`  ${command}`);

  const ask = createQuestion();
  const answer = await ask('\n是否立即安裝缺少的相依項目？輸入 Y 後按 Enter；輸入其他鍵取消：');
  if (answer.trim().toUpperCase() !== 'Y') {
    console.log('\n已取消安裝。請手動執行下列指令後再重跑：');
    console.log(`  ${getNpmCommand()} install`);
    console.log(`  ${getNpmCommand()} run install:browsers`);
    console.log(`  ${getNpmCommand()} test`);
    return false;
  }
  for (const command of commands) {
    console.log(`\n開始執行：${command}`);
    const status = runShell(command);
    if (status !== 0) return false;
  }
  console.log('\n相依項目安裝完成，重新啟動測試選單...\n');
  const status = runShell(`${getNpmCommand()} test`);
  process.exit(status);
}

function printMenu() {
  console.log('\n=== 測試模組選單 ===');
  console.log('請選擇要委派執行的測試任務：\n');
  for (const item of modules) {
    console.log(`${item.code.padEnd(6)} ${item.name}`);
    console.log(`       ${item.description}`);
  }
  console.log('\n輸入模組代碼後按 Enter，例如：ORD01');
  console.log('輸入 Q 可離開。\n');
}

function quoteForCli(value) {
  return `"${String(value).replace(/"/g, '\\"')}"`;
}

function ensureReportsFolder() {
  fs.mkdirSync(path.join(process.cwd(), 'reports'), { recursive: true });
}

function loadTask(code) {
  const taskPath = path.join(process.cwd(), 'tasks', `${code}.task.json`);
  if (!fs.existsSync(taskPath)) return null;
  try { return JSON.parse(fs.readFileSync(taskPath, 'utf8')); }
  catch (error) {
    console.error(`\n無法讀取任務設定檔：${taskPath}`);
    console.error(error.message);
    return null;
  }
}

function printList(title, items = [], limit = 5) {
  if (!items.length) return;
  console.log(`\n${title}`);
  for (const item of items.slice(0, limit)) console.log(`- ${item}`);
  if (items.length > limit) console.log(`- 另有 ${items.length - limit} 項`);
}

function printSpecificationSummary(task, selected) {
  console.log('\n=== Specification Summary ===');
  console.log(`${selected.code}｜${selected.name}`);
  console.log(`\nSpecification file: ${task?.specification || 'N/A'}`);
  console.log(`Task type: ${task?.testType || 'Black-box UI Automation'}`);
  console.log(`\nObjective:\n${task?.objective || selected.description}`);
  printList('Acceptance Criteria:', task?.acceptanceCriteria || []);
  printList('Risk Focus:', task?.riskFocus || []);
  console.log('\nDelegation Boundary:');
  console.log('- This task executes observable UI behavior through Playwright.');
  console.log('- It does not require application source code, database access, production credentials, or internal system logic.');
  console.log('- Phase 2 AI, n8n, and MCP artifacts are deterministic mocks or contracts and require human review.');
}

async function runQualityGateBeforeAutomation(selected) {
  console.log('\n=== Specification Quality Gate ===');
  console.log('自動化測試執行前，先檢查規格是否足夠明確且可驗證。');
  const moduleForGate = selected.code === 'ALL' ? null : selected.code;
  const report = runQualityGate({ module: moduleForGate });
  printReport(report);

  if (report.allowedToAutomate) return true;

  console.log('\nQuality Gate 未通過，系統不會直接執行自動化測試。');
  console.log('你可以先進入互動式釐清流程，或自行調整規格後再重跑。');
  const ask = createQuestion();
  const answer = await ask('\n是否進入釐清流程？輸入 Y 釐清；輸入其他鍵取消：');
  if (answer.trim().toUpperCase() === 'Y') {
    const clarifyCommand = moduleForGate
      ? `node scripts/clarify-spec.js --module ${selected.code}`
      : 'node scripts/clarify-spec.js';
    runShell(clarifyCommand);
    const refreshed = runQualityGate({ module: moduleForGate });
    if (refreshed.allowedToAutomate) return true;
    console.log('\n釐清後仍有阻擋項目，暫不執行自動化測試。');
  }

  console.log('\n後續可用命令：');
  console.log(`  ${getNpmCommand()} run quality:check`);
  console.log(`  ${getNpmCommand()} run quality:clarify`);
  console.log(`  ${getNpmCommand()} test`);
  console.log('\n若只想檢查單一模組，可使用：');
  console.log(`  ${getNpmCommand()} run quality:check -- --module ${selected.code}`);
  return false;
}

async function confirmExecution(selected, task) {
  printSpecificationSummary(task, selected);
  const gateOk = await runQualityGateBeforeAutomation(selected);
  if (!gateOk) return false;
  const ask = createQuestion();
  const answer = await ask('\nQuality Gate 已通過。是否執行此測試任務？輸入 Y 執行；輸入其他鍵取消：');
  return answer.trim().toUpperCase() === 'Y';
}

function runSelectedModule(selected) {
  ensureReportsFolder();
  process.env.QA_SELECTED_MODULE_CODE = selected.code;
  process.env.QA_SELECTED_MODULE_NAME = selected.name;
  process.env.QA_TEST_TYPE = 'Specification-driven Black-box UI Automation';
  const task = loadTask(selected.code);
  if (task) {
    process.env.QA_SPEC_PATH = task.specification || '';
    process.env.QA_TASK_PATH = `tasks/${selected.code}.task.json`;
  }
  const testCommandParts = ['npx playwright test --headed'];
  if (selected.grep) testCommandParts.push(`--grep ${quoteForCli(selected.grep)}`);
  const testCommand = testCommandParts.join(' ');
  const summaryCommand = `node scripts/generate-summary.js --module ${selected.code}`;
  const reportCommand = 'npx playwright show-report';

  console.log(`\n準備委派執行：${selected.code}｜${selected.name}`);
  console.log('執行模式：headed（可視化模式），瀏覽器會顯示自動化操作。');
  console.log('測試結束後瀏覽器視窗會自動關閉；請以終端結果與 Playwright Report 判定執行結果。');
  console.log('測試完成後會產出 reports/test-summary.json，供 Phase 2 mock 使用。\n');
  const testStatus = runShell(testCommand);
  console.log('\n產生測試摘要 reports/test-summary.json...\n');
  runShell(summaryCommand);
  console.log('\n測試執行結束，準備開啟 Playwright Report...');
  console.log('若瀏覽器未自動開啟，請手動打開：http://localhost:9323');
  console.log('查看完畢後，可在 PowerShell 按 Ctrl + C 關閉報告伺服器。\n');
  runShell(reportCommand);
  process.exit(testStatus);
}

async function main() {
  const ready = await ensurePrerequisites();
  if (!ready) process.exit(1);
  printMenu();
  const ask = createQuestion();
  const answer = await ask('請輸入模組代碼：');
  const code = answer.trim().toUpperCase();
  if (code === 'Q' || code === 'QUIT' || code === 'EXIT') {
    console.log('已取消執行。'); process.exit(0);
  }
  const selected = modules.find((item) => item.code === code);
  if (!selected) {
    console.error(`\n找不到模組代碼：${answer}`);
    console.error(`請重新執行 ${getNpmCommand()} test，並輸入選單中的代碼。`);
    process.exit(1);
  }
  const task = loadTask(selected.code);
  const confirmed = await confirmExecution(selected, task);
  if (!confirmed) {
    console.log('\n已取消委派執行。');
    process.exit(0);
  }
  runSelectedModule(selected);
}

main().catch((error) => {
  console.error('\n發生未預期錯誤：', error.message);
  process.exit(1);
});
