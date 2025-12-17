const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '..', 'data', 'fs.json');

function dedupe(node) {
  if (!node || !node.children || !Array.isArray(node.children)) return;
  const seen = new Set();
  const unique = [];
  for (const child of node.children) {
    const key = `${child.type}::${child.name}`;
    if (!seen.has(key)) {
      seen.add(key);
      unique.push(child);
    } else {
      console.log('Removing duplicate child:', key);
    }
  }
  node.children = unique;
  for (const child of node.children) dedupe(child);
}

try {
  const raw = fs.readFileSync(dataPath, 'utf8');
  const data = JSON.parse(raw);
  dedupe(data);
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), 'utf8');
  console.log('Deduplication complete.');
} catch (err) {
  console.error('Error deduping fs.json:', err.message);
  process.exit(1);
}
