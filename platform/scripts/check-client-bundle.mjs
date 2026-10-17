import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(process.cwd(), '.next', 'static');
const needles = ['AUTH_SECRET', 'DATABASE_URL', 'postgresql://', 'ADMIN_EMAILS', 'SMTP_PASSWORD', 'SMTP_USER'];

function files(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? files(full) : [full];
  });
}

const hits = [];
for (const file of files(root)) {
  if (!/\.(js|css|json|html|txt)$/.test(file)) continue;
  const text = fs.readFileSync(file, 'utf8');
  for (const needle of needles) {
    if (text.includes(needle)) hits.push(`${path.relative(process.cwd(), file)} contains ${needle}`);
  }
}

if (hits.length) {
  console.error(hits.join('\n'));
  process.exit(1);
}

console.log(`Client bundle does not contain privileged configuration names (${files(root).length} files).`);
