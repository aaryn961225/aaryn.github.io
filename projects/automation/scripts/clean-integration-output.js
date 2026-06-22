const fs = require('fs');
const path = require('path');
const files = [
  'reports/mcp-context.json',
  'reports/ai-review.json',
  'reports/ai-review.md',
  'reports/n8n-payload.json',
  'reports/mock-notification.md'
];
for (const file of files) {
  const full = path.join(process.cwd(), file);
  if (fs.existsSync(full)) {
    fs.unlinkSync(full);
    console.log(`Removed ${file}`);
  }
}
