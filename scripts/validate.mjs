import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const required = [
  'README.md',
  'LICENSE',
  'SKILL.md',
  'catalog.md',
  'mono-tokens.js',
  'agents/openai.yaml',
];

const failures = [];
const htmlFiles = [];

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === '.git' || entry.name === 'node_modules') continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (entry.name.endsWith('.html')) htmlFiles.push(full);
  }
}

function rel(file) {
  return path.relative(root, file);
}

function lineNumber(source, index) {
  return source.slice(0, index).split('\n').length;
}

for (const file of required) {
  if (!fs.existsSync(path.join(root, file))) failures.push(`缺少发布文件：${file}`);
}

walk(root);

for (const file of htmlFiles) {
  const source = fs.readFileSync(file, 'utf8');
  const scriptPattern = /<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi;
  let match;
  let scriptIndex = 0;

  while ((match = scriptPattern.exec(source))) {
    scriptIndex += 1;
    if (!match[1].trim()) continue;
    try {
      new vm.Script(match[1], { filename: `${rel(file)}#script-${scriptIndex}` });
    } catch (error) {
      failures.push(error.message);
    }
  }

  const seenIds = new Map();
  const idPattern = /\sid=(["'])([^"']+)\1/g;
  while ((match = idPattern.exec(source))) {
    const id = match[2];
    const line = lineNumber(source, match.index);
    if (seenIds.has(id)) {
      failures.push(`${rel(file)}:${line} 重复 id="${id}"（首次出现于第 ${seenIds.get(id)} 行）`);
    } else {
      seenIds.set(id, line);
    }
  }
}

const textFiles = [];
function collectText(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === '.git' || entry.name === 'node_modules' || entry.name === 'LICENSE') continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) collectText(full);
    else if (/\.(?:html|js|mjs)$/.test(entry.name)) textFiles.push(full);
  }
}
collectText(root);

for (const file of textFiles) {
  const source = fs.readFileSync(file, 'utf8');
  const executableSource = rel(file) === 'scripts/validate.mjs'
    ? ''
    : source.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');

  for (const match of executableSource.matchAll(/Math\.random\s*\(/g)) {
    failures.push(`${rel(file)} 检测到 Math.random()，请改用确定性 rnd()`);
  }

  for (const match of source.matchAll(/#[0-9a-fA-F]{6}\b/g)) {
    const hex = match[0];
    const channels = [
      Number.parseInt(hex.slice(1, 3), 16),
      Number.parseInt(hex.slice(3, 5), 16),
      Number.parseInt(hex.slice(5, 7), 16),
    ];
    if (Math.max(...channels) - Math.min(...channels) > 18) {
      failures.push(`${rel(file)}:${lineNumber(source, match.index)} 检测到明显彩色值 ${hex}`);
    }
  }
}

try {
  new vm.Script(fs.readFileSync(path.join(root, 'mono-tokens.js'), 'utf8'), {
    filename: 'mono-tokens.js',
  });
} catch (error) {
  failures.push(error.message);
}

if (failures.length) {
  console.error(`检查失败（${failures.length} 项）：`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`检查通过：${htmlFiles.length} 个 HTML 文件，${textFiles.length} 个文本文件。`);
