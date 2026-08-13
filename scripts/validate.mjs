import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const requiredColorTemplates = [
  'templates/color/README.md',
  'templates/color/basics-palm.html',
  'templates/color/basics-porcelain.html',
  'templates/color/basics-wire.html',
  'templates/color/big-circular-palm.html',
  'templates/color/big-circular-porcelain.html',
  'templates/color/big-force-palm.html',
  'templates/color/big-force-porcelain.html',
  'templates/color/big-threads-palm.html',
  'templates/color/big-threads-porcelain.html',
  'templates/color/glance-palm.html',
  'templates/color/glance-porcelain.html',
  'templates/color/glance-wire.html',
  'templates/color/lupi-palm.html',
  'templates/color/lupi-porcelain.html',
  'templates/color/lupi-wire.html',
];
const required = [
  'README.md',
  'LICENSE',
  'SKILL.md',
  'catalog.md',
  'mono-tokens.js',
  'color-presets.js',
  'agents/openai.yaml',
  ...requiredColorTemplates,
];

const failures = [];
const htmlFiles = [];
const ignoredDirectories = new Set(['.git', '.playwright-cli', 'node_modules', 'output']);
const treemapTemplates = [
  'templates/basics-gallery.html',
  'templates/color/basics-porcelain.html',
  'templates/color/basics-palm.html',
  'templates/color/basics-wire.html',
];
const glanceMotionTemplates = [
  'templates/glance-gallery.html',
  'templates/color/glance-porcelain.html',
  'templates/color/glance-palm.html',
  'templates/color/glance-wire.html',
];

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (ignoredDirectories.has(entry.name)) continue;
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

function colorChannels(literal) {
  if (literal.startsWith('#')) {
    const hex = literal.slice(1);
    const full = hex.length === 3
      ? [...hex].map(channel => channel + channel).join('')
      : hex.slice(0, 6);
    return [0, 2, 4].map(index => Number.parseInt(full.slice(index, index + 2), 16)).join(',');
  }

  const channels = literal.match(/\d+/g);
  return channels?.slice(0, 3).join(',') ?? null;
}

function collectPresetChannels(value, channels = new Set()) {
  if (typeof value === 'string') {
    const literalPattern = /#(?:[0-9a-fA-F]{6}|[0-9a-fA-F]{3})\b|rgba?\(\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}(?:\s*,\s*(?:0|1|0?\.\d+))?\s*\)/g;
    for (const match of value.matchAll(literalPattern)) {
      const parsed = colorChannels(match[0]);
      if (parsed) channels.add(parsed);
    }
  } else if (Array.isArray(value)) {
    for (const item of value) collectPresetChannels(item, channels);
  } else if (value && typeof value === 'object') {
    for (const item of Object.values(value)) collectPresetChannels(item, channels);
  }
  return channels;
}

function checkGlanceMotion(file, source) {
  const fail = message => failures.push(`${file} ${message}`);
  const script = [...source.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi)]
    .map(match => match[1])
    .join('\n');

  if (!/@media\s*\(\s*prefers-reduced-motion\s*:\s*reduce\s*\)[\s\S]*?animation\s*:\s*none/.test(source)) {
    fail('缺少 CSS reduced-motion 降级');
  }
  if (!/matchMedia\s*\(\s*['"]\(prefers-reduced-motion\s*:\s*reduce\)['"]\s*\)/.test(script)) {
    fail('缺少 JS reduced-motion 检测');
  }
  if (!/reduceMotion[\s\S]*?animation\s*:\s*false[\s\S]*?new\s+Chart/.test(script)) {
    fail('Chart.js 未关闭 reduced-motion 动画');
  }
  if (!/getInstanceByDom[\s\S]*?reduceMotion[\s\S]*?animation\s*:\s*false/.test(script)) {
    fail('ECharts 未关闭 reduced-motion 动画');
  }

  for (const match of script.matchAll(/setInterval\s*\(/g)) {
    const context = script.slice(Math.max(0, match.index - 180), match.index);
    if (!/if\s*\(\s*!\s*reduceMotion\s*\)/.test(context)) {
      fail('存在未受 reduced-motion 保护的 interval');
    }
  }
  for (const match of script.matchAll(/requestAnimationFrame\s*\(/g)) {
    const context = script.slice(Math.max(0, match.index - 900), match.index);
    if (!/if\s*\(\s*reduceMotion\s*\)[\s\S]*?return\s*;/.test(context)) {
      fail('存在未受 reduced-motion 保护的 RAF');
    }
  }

  if (!/VIEWS\.length\s*-\s*1/.test(script) || !/VIEWS\[\s*vi\s*\]\.opt/.test(script)) {
    fail('morph 未在 reduced-motion 下选择稳定最终视图');
  }
  if (!/YEARS\.length\s*-\s*1/.test(script) || !/vals\[\s*step\s*\]/.test(script)) {
    fail('bar race 未在 reduced-motion 下选择稳定最终状态');
  }
  if (!/obsReveal\(\s*['"]stream['"][\s\S]*?draw\(\);[\s\S]*?if\s*\(\s*!\s*reduceMotion\s*\)/.test(script)) {
    fail('stream 未在 reduced-motion 下先绘制稳定快照');
  }
  if (!/if\s*\(\s*reduceMotion\s*\)[\s\S]*?TOTAL\s*\/\s*1000/.test(script)) {
    fail('counter 未在 reduced-motion 下写入最终 KPI');
  }
}

for (const file of required) {
  if (!fs.existsSync(path.join(root, file))) failures.push(`缺少发布文件：${file}`);
}

for (const file of treemapTemplates) {
  const full = path.join(root, file);
  if (!fs.existsSync(full)) continue;
  const source = fs.readFileSync(full, 'utf8');
  if (!source.includes('id="treemap"')) failures.push(`${file} 缺少 F13 treemap 容器`);
  if (!source.includes("type:'treemap'")) failures.push(`${file} 缺少 F13 treemap 渲染代码`);
  if (!source.includes('F1–F13')) failures.push(`${file} 的 Basics 编号未更新为 F1–F13`);
}

for (const file of glanceMotionTemplates) {
  const full = path.join(root, file);
  if (!fs.existsSync(full)) {
    failures.push(`缺少 Glance reduced-motion 模板：${file}`);
    continue;
  }
  checkGlanceMotion(file, fs.readFileSync(full, 'utf8'));
}

const catalogSource = fs.readFileSync(path.join(root, 'catalog.md'), 'utf8');
if (!catalogSource.includes('| F13 | Nested Treemap |')) failures.push('catalog.md 缺少 F13 Nested Treemap');

const skillSource = fs.readFileSync(path.join(root, 'SKILL.md'), 'utf8');
for (const role of ['`BG`', '`TXT`', '`MUT`', '`GRID`', '`DATA`']) {
  if (!skillSource.includes(role)) failures.push(`SKILL.md 的 custom 色板规则缺少角色 ${role}`);
}

const presetChannels = new Map();
const colorPresetsPath = path.join(root, 'color-presets.js');
if (fs.existsSync(colorPresetsPath)) {
  try {
    const context = vm.createContext({});
    new vm.Script(fs.readFileSync(colorPresetsPath, 'utf8'), {
      filename: 'color-presets.js',
    }).runInContext(context);

    const presets = context.PRESETS;
    const expected = [
      ['porcelain', 'PORCELAIN'],
      ['palm', 'PALM'],
      ['wire', 'WIRE'],
    ];
    if (!presets || typeof presets.get !== 'function') {
      failures.push('color-presets.js 未正确暴露 PRESETS.get()');
    } else {
      for (const [name, key] of expected) {
        const preset = presets[key];
        if (!preset || presets.get(name) !== preset) {
          failures.push(`color-presets.js 缺少可用预设：${name}`);
          continue;
        }
        presetChannels.set(name, collectPresetChannels(preset));
      }
    }
  } catch (error) {
    failures.push(error.message);
  }
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
    if (ignoredDirectories.has(entry.name) || entry.name === 'LICENSE') continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) collectText(full);
    else if (/\.(?:html|js|mjs)$/.test(entry.name)) textFiles.push(full);
  }
}
collectText(root);

for (const file of textFiles) {
  const source = fs.readFileSync(file, 'utf8');
  const relative = rel(file);
  const executableSource = relative === 'scripts/validate.mjs'
    ? ''
    : source.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');

  for (const match of executableSource.matchAll(/Math\.random\s*\(/g)) {
    failures.push(`${rel(file)} 检测到 Math.random()，请改用确定性 rnd()`);
  }

  const colorTemplate = relative.match(/^templates\/color\/.+-(porcelain|palm|wire)\.html$/);
  if (colorTemplate) {
    const allowed = presetChannels.get(colorTemplate[1]);
    const literalPattern = /#(?:[0-9a-fA-F]{6}|[0-9a-fA-F]{3})\b|rgba?\(\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}(?:\s*,\s*(?:0|1|0?\.\d+))?\s*\)/g;
    for (const match of source.matchAll(literalPattern)) {
      const channels = colorChannels(match[0]);
      const transparentHitTarget = channels === '0,0,0';
      if (allowed && channels && !allowed.has(channels) && !transparentHitTarget) {
        failures.push(`${relative}:${lineNumber(source, match.index)} 颜色 ${match[0]} 不属于 ${colorTemplate[1]} 预设`);
      }
    }
  } else if (relative !== 'color-presets.js') {
    for (const match of source.matchAll(/#[0-9a-fA-F]{6}\b/g)) {
      const hex = match[0];
      const channels = [
        Number.parseInt(hex.slice(1, 3), 16),
        Number.parseInt(hex.slice(3, 5), 16),
        Number.parseInt(hex.slice(5, 7), 16),
      ];
      if (Math.max(...channels) - Math.min(...channels) > 18) {
        failures.push(`${relative}:${lineNumber(source, match.index)} 检测到明显彩色值 ${hex}`);
      }
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
