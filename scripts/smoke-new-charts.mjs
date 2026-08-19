// 运行期烟测：打开每个 gallery，确认新增图型真的画出了内容，且控制台无报错。
// 用法：node scripts/smoke-new-charts.mjs
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

// playwright 只装在全局，ESM 不认 NODE_PATH，这里显式解析全局路径。
const globalRoot = execFileSync('npm', ['root', '-g'], { encoding: 'utf8' }).trim();
const playwrightModule = await import(path.join(globalRoot, 'playwright', 'index.js'));
const { chromium } = playwrightModule.chromium ? playwrightModule : playwrightModule.default;

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const groups = {
  basics: ['treemap', 'histo', 'boxplot', 'stream', 'candle'],
  lupi: ['matheat', 'calheat', 'beeswarm', 'ridge', 'parallel'],
  glance: ['violin', 'gheat', 'rankstrip', 'sankey'],
};
const suffixes = ['gallery', 'porcelain', 'palm', 'wire'];

const filePath = (group, suffix) =>
  suffix === 'gallery'
    ? `templates/${group}-gallery.html`
    : `templates/color/${group}-${suffix}.html`;

const browser = await chromium.launch();
const failures = [];

for (const [group, ids] of Object.entries(groups)) {
  for (const suffix of suffixes) {
    const relative = filePath(group, suffix);
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
    const errors = [];
    page.on('console', message => {
      if (message.type() === 'error') errors.push(message.text());
    });
    page.on('pageerror', error => errors.push(String(error)));

    await page.goto(`file://${path.join(root, relative)}`);
    // 等布局与 ECharts/SVG 绘制完成
    await page.waitForTimeout(2500);

    for (const id of ids) {
      // gallery 用 IntersectionObserver 懒渲染，必须滚进视口才会画。
      await page.evaluate(chartId => {
        document.getElementById(chartId)?.scrollIntoView({ block: 'center' });
      }, id);
      await page.waitForTimeout(1200);

      const report = await page.evaluate(chartId => {
        const node = document.getElementById(chartId);
        if (!node) return { missing: true };
        const box = node.getBoundingClientRect();
        // SVG 手写图看子节点数，ECharts 看是否注入 canvas/svg
        const drawn = node.querySelectorAll('path,rect,circle,line,polygon,canvas,svg,text').length;
        return { missing: false, w: Math.round(box.width), h: Math.round(box.height), drawn };
      }, id);

      if (report.missing) failures.push(`${relative} #${id} 容器不存在`);
      else if (report.w < 50 || report.h < 30) failures.push(`${relative} #${id} 尺寸异常 ${report.w}×${report.h}`);
      else if (report.drawn < 3) failures.push(`${relative} #${id} 未绘制内容（子元素 ${report.drawn}）`);
    }

    // 地图依赖联网 GeoJSON，离线时报错属预期，这里只测非地图组
    for (const error of errors) failures.push(`${relative} 控制台错误：${error}`);
    await page.close();
  }
}

await browser.close();

if (failures.length) {
  console.error(`烟测失败（${failures.length} 项）：`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}
console.log('烟测通过：12 个 gallery 的新增图型均已绘制，无控制台错误。');
