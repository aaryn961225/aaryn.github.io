const { execSync } = require('child_process');

function run(command) {
  console.log(`\n> ${command}`);
  execSync(command, { stdio: 'inherit', env: process.env, windowsHide: false });
}

console.log('=== Phase 2 Deterministic Mock Integration ===');
console.log('This local flow does not call external AI services, a live MCP server, or an n8n webhook.');
run('node scripts/build-mcp-context.js');
run('node scripts/run-mock-llm-analysis.js');
run('node scripts/run-mock-n8n-notification.js');
console.log('\nDeterministic mock integration completed. Review reports/mcp-context.json, reports/ai-review.json, and reports/n8n-payload.json.');
