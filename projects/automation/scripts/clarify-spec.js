const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { runQualityGate, parseArgs, printReport } = require('./quality-gate');

function ask(question) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => rl.question(question, (answer) => {
    rl.close();
    resolve(answer);
  }));
}

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function readPendingClarifyFiles(root, moduleCode) {
  const dir = path.join(root, '.clarify', 'features');
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir)
    .filter((name) => name.endsWith('.md'))
    .filter((name) => !moduleCode || name.startsWith(`${moduleCode}_`))
    .map((name) => path.join(dir, name));
}

function parseClarifyFile(filePath) {
  const text = fs.readFileSync(filePath, 'utf8');
  const moduleMatch = text.match(/- Module:\s*([A-Z0-9]+)｜(.+)/);
  const locationMatch = text.match(/- Location:\s*(.+)/);
  const priorityMatch = text.match(/# 優先級\s*\n\s*(High|Medium|Low)/i);
  const questionMatch = text.match(/# 釐清問題\s*\n\s*([\s\S]*?)\n\s*# 定位/);
  return {
    filePath,
    text,
    module: moduleMatch ? moduleMatch[1].trim() : null,
    moduleName: moduleMatch ? moduleMatch[2].trim() : null,
    location: locationMatch ? locationMatch[1].trim() : null,
    priority: priorityMatch ? priorityMatch[1].trim() : 'Medium',
    question: questionMatch ? questionMatch[1].trim() : '是否處理此釐清項目？'
  };
}

function insertBeforeHumanReview(markdown, sectionText) {
  const marker = /^##\s+\d+\.\s+Human Review Point.*$/im;
  if (marker.test(markdown)) {
    return markdown.replace(marker, `${sectionText}\n\n$&`);
  }
  return `${markdown.trim()}\n\n${sectionText}\n`;
}

function resolveSectionTitle(fileName) {
  if (fileName.includes('boundary')) return 'Boundary Conditions';
  if (fileName.includes('error')) return 'Error Cases';
  if (fileName.includes('example') || fileName.includes('gherkin')) return 'Executable Examples';
  if (fileName.includes('acceptance')) return 'Acceptance Criteria';
  return 'Clarified Specification Note';
}

function defaultContentFor(sectionTitle, moduleCode, answer) {
  if (sectionTitle === 'Boundary Conditions') {
    return `## Boundary Conditions\n\n- Clarified by QA: ${answer}\n- Any boundary not explicitly defined remains out of automation scope until reviewed.\n`;
  }
  if (sectionTitle === 'Error Cases') {
    return `## Error Cases\n\n- Clarified by QA: ${answer}\n- Any error behavior not explicitly defined remains out of automation scope until reviewed.\n`;
  }
  if (sectionTitle === 'Executable Examples') {
    return `## Executable Examples\n\n\`\`\`gherkin\nFeature: ${moduleCode} clarified behavior\n\n  Rule: Clarified behavior must be observable through UI\n    Example: QA-reviewed clarified scenario\n      When 使用者執行 ${moduleCode} 對應操作\n      Then 畫面顯示 QA 已確認的預期結果\n\`\`\`\n`;
  }
  if (sectionTitle === 'Acceptance Criteria') {
    return `## Acceptance Criteria\n\n- Clarified by QA: ${answer}\n`;
  }
  return `## Clarified Specification Note\n\n- Clarified by QA: ${answer}\n`;
}

function hasSection(markdown, sectionTitle) {
  const escaped = sectionTitle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(`^#{1,6}\\s+.*${escaped}.*$`, 'im').test(markdown);
}

function updateSpecification(item, answer) {
  if (!item.location || !item.location.startsWith('specs/')) return null;
  const root = process.cwd();
  const specPath = path.join(root, item.location);
  if (!fs.existsSync(specPath)) return null;
  let markdown = fs.readFileSync(specPath, 'utf8');
  const sectionTitle = resolveSectionTitle(path.basename(item.filePath));
  const sectionText = defaultContentFor(sectionTitle, item.module || 'MODULE', answer);

  if (hasSection(markdown, sectionTitle)) {
    const escaped = sectionTitle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const pattern = new RegExp(`(^#{1,6}\\s+.*${escaped}.*$)([\\s\\S]*?)(?=^#{1,6}\\s+|$)`, 'im');
    markdown = markdown.replace(pattern, sectionText.trim() + '\n\n');
  } else {
    markdown = insertBeforeHumanReview(markdown, sectionText.trim());
  }

  fs.writeFileSync(specPath, markdown.trim() + '\n', 'utf8');
  return specPath;
}

function archiveClarifyFile(item, answer, updatedSpecPath) {
  const root = process.cwd();
  const resolvedDir = path.join(root, '.clarify', 'resolved', 'features');
  ensureDir(resolvedDir);
  const resolvedText = `${item.text.trim()}\n\n---\n# 解決記錄\n\n- **回答**：${answer}\n- **更新的規格檔**：${updatedSpecPath ? path.relative(root, updatedSpecPath) : '未更新，使用者選擇延後或取消'}\n- **變更內容**：依 QA 審查回答更新或標記釐清結果。\n`;
  fs.writeFileSync(path.join(resolvedDir, path.basename(item.filePath)), resolvedText, 'utf8');
  fs.rmSync(item.filePath, { force: true });
}

async function clarify(options = {}) {
  const moduleCode = options.module ? String(options.module).toUpperCase() : null;
  const root = process.cwd();
  const report = runQualityGate({ module: moduleCode });
  if (report.allowedToAutomate) {
    console.log('\n目前沒有阻擋自動化的規格缺口。');
    printReport(report);
    return report;
  }

  const files = readPendingClarifyFiles(root, moduleCode);
  if (files.length === 0) {
    console.log('\n沒有找到待釐清檔案。請先執行 npm.cmd run quality:check');
    return report;
  }

  console.log('\n=== Interactive Clarification ===');
  console.log('一次處理一個釐清項目。輸入 Q 可中止。');

  for (let i = 0; i < files.length; i += 1) {
    const item = parseClarifyFile(files[i]);
    console.log(`\n---\n[釐清進度：第 ${i + 1} / ${files.length} 題] [優先級：${item.priority}]`);
    console.log(`\n# 問題\n${item.question}`);
    console.log(`\n# 定位\n${item.module || ''} ${item.moduleName || ''}\n${item.location || ''}`);
    const answer = await ask('\n請輸入 A、B、C 或自訂答案；輸入 Q 中止：');
    const normalized = answer.trim();
    if (['Q', 'QUIT', 'EXIT'].includes(normalized.toUpperCase())) {
      console.log('\n已中止釐清流程。未處理項目保留在 .clarify/features/。');
      break;
    }
    if (!normalized) {
      console.log('未輸入答案，此題略過。');
      continue;
    }
    const updated = updateSpecification(item, normalized);
    archiveClarifyFile(item, normalized, updated);
    console.log('已記錄答案並歸檔釐清項目。');
  }

  console.log('\n重新執行 Quality Gate...');
  const finalReport = runQualityGate({ module: moduleCode });
  printReport(finalReport);
  return finalReport;
}

if (require.main === module) {
  const args = parseArgs();
  clarify({ module: args.module }).catch((error) => {
    console.error('\n釐清流程發生錯誤：', error.message);
    process.exit(1);
  });
}

module.exports = { clarify };
