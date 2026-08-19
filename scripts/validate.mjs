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
  'templates/color/maps-palm.html',
  'templates/color/maps-porcelain.html',
  'templates/color/maps-wire.html',
];
const required = [
  'README.md',
  'LICENSE',
  'SKILL.md',
  'catalog.md',
  'mono-tokens.js',
  'color-presets.js',
  'agents/openai.yaml',
  'report-catalog.md',
  'templates/reports/index.html',
  ...requiredColorTemplates,
];
for (let i = 1; i <= 12; i += 1) {
  const n = String(i).padStart(2, '0');
  required.push(`templates/reports/report-${n}.zh.html`);
  required.push(`templates/reports/report-${n}.en.html`);
  required.push(`docs/assets/reports/report-${n}.png`);
}

const failures = [];
const htmlFiles = [];
const ignoredDirectories = new Set(['.git', '.playwright-cli', 'node_modules', 'output']);
const paletteSuffixes = ['gallery', 'porcelain', 'palm', 'wire'];

// 每组 gallery 必须带齐本组图型容器与编号区间；四个色板各一份。
const galleryGroups = {
  basics: {
    label: 'Basics',
    range: /F1–F17|17 张/,
    ids: ['treemap', 'histo', 'boxplot', 'stream', 'candle'],
  },
  lupi: {
    label: 'Lupi',
    // mono gallery 用「20 张」，色板版用「L1–L20」，两种写法都算已更新。
    range: /L1–L20|20 张/,
    ids: ['matheat', 'calheat', 'beeswarm', 'ridge', 'parallel'],
  },
  glance: {
    label: 'Glance',
    range: /22 张|Glance 22/,
    ids: ['violin', 'gheat', 'rankstrip', 'sankey'],
  },
  maps: {
    label: 'Maps',
    ids: ['mapus', 'mapworld'],
  },
};

function galleryPath(group, suffix) {
  return suffix === 'gallery'
    ? `templates/${group}-gallery.html`
    : `templates/color/${group}-${suffix}.html`;
}

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

for (const file of required) {
  if (!fs.existsSync(path.join(root, file))) failures.push(`缺少发布文件：${file}`);
}

for (const [group, spec] of Object.entries(galleryGroups)) {
  for (const suffix of paletteSuffixes) {
    const file = galleryPath(group, suffix);
    const full = path.join(root, file);
    if (!fs.existsSync(full)) {
      failures.push(`缺少 gallery 模板：${file}`);
      continue;
    }
    const source = fs.readFileSync(full, 'utf8');
    for (const id of spec.ids) {
      if (!source.includes(`id="${id}"`)) failures.push(`${file} 缺少图型容器 id="${id}"`);
    }
    if (spec.range && !spec.range.test(source)) {
      failures.push(`${file} 的 ${spec.label} 编号未更新（应匹配 ${spec.range}）`);
    }
  }
}

const catalogSource = fs.readFileSync(path.join(root, 'catalog.md'), 'utf8');
const catalogRows = [
  '| F13 | Nested Treemap |',
  '| F14 | Rung Histogram |',
  '| F15 | Tick Box |',
  '| F16 | Stream Ribbon |',
  '| F17 | Candlestick |',
  '| L16 | Matrix Heat |',
  '| L17 | Calendar Heat |',
  '| L18 | Beeswarm |',
  '| L19 | Ridgeline |',
  '| L20 | Parallel Coordinates |',
  '| G19 | Violin |',
  '| G20 | Matrix Heat (Glance) |',
  '| G21 | Rank Strip |',
  '| G22 | Aggregate Sankey |',
  '| M1 | US Choropleth |',
  '| M2 | World Choropleth |',
];
for (const row of catalogRows) {
  if (!catalogSource.includes(row)) failures.push(`catalog.md 缺少条目 ${row.replaceAll('|', '').trim()}`);
}

const skillSource = fs.readFileSync(path.join(root, 'SKILL.md'), 'utf8');
// 主力/后备分档是硬约束，别在后续改动里被顺手删掉。
if (!skillSource.includes('L1–L15 与 F1–F13')) {
  failures.push('SKILL.md 缺少主力（L1–L15 / F1–F13）优先规则');
}
for (const backup of ['F17 Candlestick', 'F15 Tick Box', 'L20 Parallel Coordinates', 'L17 Calendar Heat', 'F16 Stream Ribbon']) {
  if (!skillSource.includes(backup)) failures.push(`SKILL.md 缺少后备图例外说明：${backup}`);
}
if (!catalogSource.includes('主力与后备')) failures.push('catalog.md 缺少主力/后备说明');
for (const role of ['`BG`', '`TXT`', '`MUT`', '`GRID`', '`DATA`']) {
  if (!skillSource.includes(role)) failures.push(`SKILL.md 的 custom 色板规则缺少角色 ${role}`);
}

const reportCatalogSource = fs.readFileSync(path.join(root, 'report-catalog.md'), 'utf8');
for (let i = 1; i <= 12; i += 1) {
  const n = String(i).padStart(2, '0');
  if (!reportCatalogSource.includes(`| R${n} |`)) failures.push(`report-catalog.md 缺少 R${n}`);
  for (const language of ['zh', 'en']) {
    const file = path.join(root, `templates/reports/report-${n}.${language}.html`);
    const source = fs.readFileSync(file, 'utf8');
    if (!source.includes('<!doctype html>')) failures.push(`${rel(file)} 不是完整 HTML 文档`);
    if (!source.match(/<title>[\s\S]+<\/title>/i)) failures.push(`${rel(file)} 缺少 title`);
  }
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
  } else if (relative !== 'color-presets.js' && !relative.startsWith('templates/reports/')) {
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
