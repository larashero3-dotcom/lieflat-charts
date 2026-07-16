/* ═══════════════════════════════════════════════════════════════
   MONO TOKENS — 风格的唯一正本
   所有 mono 图表（Chart.js / ECharts / 手写 SVG）共享这一份。
   任何文件里出现与本文件冲突的颜色、字体、动画参数，以本文件为准。
   用法：<script src="mono-tokens.js"></script>，全部挂在 window.MONO 上；
   也可以直接把本文件内容内联进单文件 HTML（开源分发时推荐内联）。
   ═══════════════════════════════════════════════════════════════ */
(function (global) {
  'use strict';

  /* ── 1 · 色板 ──────────────────────────────────────────────
     纸灰底 + 炭黑墨。没有彩色。明度即数据：最重要 = 最黑。   */
  const INK   = '#1C1C1A';   // 墨：主数据、标题、强调
  const PAPER = '#F0EFEB';   // 纸：页面底色 = 浅卡底色（卡片无边框，靠留白分卡）
  const MUTED = '#8F8E88';   // 次级文字、副标题
  const FAINT = '#C6C5BF';   // 来源行、辅助刻度
  const GRID  = '#DEDDD6';   // 网格线、发丝线

  // 7 级灰阶 ladder：多系列时按重要性从黑到浅分配
  const L   = ['#1C1C1A', '#4A4944', '#6A6963', '#8F8E88', '#B0AFA9', '#C6C5BF', '#D8D7D1'];
  // 5 级简版（waffle 等少系列场景）
  const LAD = ['#1C1C1A', '#4A4944', '#8F8E88', '#B0AFA9', '#D8D7D1'];

  // 暗卡（dark card）专用：底 #1C1C1A，其上的"墨"反转为纸色
  const DARK = {
    bg: '#1C1C1A',
    ink: '#F0EFEB',          // 暗卡上的主数据色
    muted: '#8F8E88',
    faint: '#55554F',        // 暗卡来源行
    grid: '#2E2D29',         // 暗卡网格 / 发丝线
    gridSoft: '#2A2925',
    ladder: ['#F0EFEB', '#DCDAD2', '#C9C7BD', '#B3B0A4', '#8F8E88', '#6A6963', '#4A4944'],
  };

  /* ── 2 · 字体 ────────────────────────────────────────────── */
  const FONT = {
    family: 'Inter',
    // Google Fonts 引入行（放 <head>）：
    link: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap',
    title:    { size: 16.5, weight: 700, spacing: '-.02em' },  // 卡内 h2
    titleBig: { size: 19,   weight: 700, spacing: '-.02em' },  // 独立大图 h2
    sub:      { size: 11.5, weight: 400 },                     // 副标题（图例说明写在这里）
    src:      { size: 9.5,  weight: 500, spacing: '.08em' },   // 来源行，全大写
    value:    { weight: 800 },                                 // 图内数值一律 800
    axis:     { size: 9.5,  weight: 600 },                     // 轴标签
    // SVG 内最小字号下限：半宽卡 6.5px，通栏/大图 5.5px。低于下限改 hover 出。
    minHalf: 6.5, minWide: 5.5,
  };

  /* ── 3 · 形状 ────────────────────────────────────────────── */
  const SHAPE = {
    cardRadius: 24,          // 卡片圆角
    cardPad: '28px 28px 20px',
    barRadius: 99,           // 柱端胶囊圆角（竖柱只圆上端，横柱只圆外端）
    tooltipRadius: 12,
  };

  /* ── 4 · 动画性格 ────────────────────────────────────────
     快进快停，quarticOut / cubicOut，不弹跳（elasticOut 只给波浪入场）。 */
  const MOTION = {
    enter: 900,              // 常规入场 ms
    enterSlow: 1200,         // 大元素 / 关系图
    easing: 'quarticOut',
    staggerDot: 12,          // 点阵逐个延迟 ms（8–15 区间）
    staggerBar: 100,         // 条形逐根延迟 ms（80–130 区间）
    // CSS 动画类（手写 SVG 用）：pop 缩放入场 / fade 淡入 / draw 描线
    css: `
  .pop{transform-box:fill-box;transform-origin:center;animation:pop .5s cubic-bezier(.2,.7,.3,1.3) both}
  @keyframes pop{from{transform:scale(0)}to{transform:none}}
  .fade{animation:fade .9s ease both}
  @keyframes fade{from{opacity:0}}
  .draw{stroke-dasharray:1;stroke-dashoffset:1;animation:draw 1s cubic-bezier(.4,0,.2,1) both}
  @keyframes draw{to{stroke-dashoffset:0}}
  @media (prefers-reduced-motion:reduce){
    .pop,.fade{animation:none}
    .draw{animation:none;stroke-dasharray:none;stroke-dashoffset:0}
  }`,
  };

  /* ── 5 · Tooltip ─────────────────────────────────────────
     浅卡用黑底纸字，暗卡用纸底黑字。ECharts 直接展开这两个对象。 */
  const tipLight = { backgroundColor: INK, borderWidth: 0, padding: [10, 14],
    textStyle: { color: PAPER, fontFamily: 'Inter', fontSize: 12 } };
  const tipDark  = { backgroundColor: PAPER, borderWidth: 0, padding: [10, 14],
    textStyle: { color: INK, fontFamily: 'Inter', fontSize: 12 } };

  /* ── 6 · 确定性伪随机 ────────────────────────────────────
     演示数据一律用它，不用 Math.random()——刷新必须长一样，
     否则截图 / 录屏 / 回归对比全部失效。                       */
  const rnd = (i, k) => Math.abs(((i * 73856093) ^ (k * 19349663)) % 1000) / 1000;

  /* ── 7 · 几何 ────────────────────────────────────────────── */
  const D2R = Math.PI / 180;
  const pol = (cx, cy, r, deg) => [cx + r * Math.cos(deg * D2R), cy + r * Math.sin(deg * D2R)];
  // 环形扇区 path（cornerRadius 自己在调用处用 ECharts sector 或手动倒角）
  const sect = (cx, cy, r0, r1, a0, a1) => {
    const big = a1 - a0 > 180 ? 1 : 0;
    const [xa, ya] = pol(cx, cy, r1, a0), [xb, yb] = pol(cx, cy, r1, a1);
    const [xc, yc] = pol(cx, cy, r0, a1), [xd, yd] = pol(cx, cy, r0, a0);
    return `M${xa} ${ya} A${r1} ${r1} 0 ${big} 1 ${xb} ${yb} L${xc} ${yc} A${r0} ${r0} 0 ${big} 0 ${xd} ${yd} Z`;
  };
  // 手绘感圆（editorial 系气泡用）：圆周叠两个慢波 + 噪声，seed 定形
  const blob = (x, y, r, seed) => {
    const n = Math.max(14, Math.round(r * 1.6)), pts = [];
    for (let t = 0; t < n; t++) {
      const a = t / n * Math.PI * 2;
      const w = 1 + .055 * Math.sin(a * 2 + seed * 7) + .04 * Math.sin(a * 3 + seed * 13)
              + (rnd(seed + t, 3) - .5) * .03;
      pts.push([x + Math.cos(a) * r * w, y + Math.sin(a) * r * w]);
    }
    let d = `M${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;
    for (let t = 0; t < n; t++) {
      const p = pts[t], q = pts[(t + 1) % n];
      d += ` Q${p[0].toFixed(1)} ${p[1].toFixed(1)} ${((p[0]+q[0])/2).toFixed(1)} ${((p[1]+q[1])/2).toFixed(1)}`;
    }
    return d + ' Z';
  };

  /* ── 8 · SVG 快捷 ────────────────────────────────────────── */
  const NS = 'http://www.w3.org/2000/svg';
  const el  = (p, t, a) => { const n = document.createElementNS(NS, t);
    for (const k in a) n.setAttribute(k, a[k]); p.appendChild(n); return n; };
  const txt = (p, a, s) => { const n = el(p, 'text', a); n.textContent = s; return n; };
  const tip = (n, s) => { const t = document.createElementNS(NS, 'title');
    t.textContent = s; n.appendChild(t); };

  /* ── 9 · 统一 reveal：滚入视野才播，点击重播 ──────────────
     带 timer 登记（keep），重播前清干净，防动画叠加。          */
  const timers = {};
  const keep = (id, t) => { (timers[id] = timers[id] || []).push(t); };
  const obsReveal = (id, fn) => {
    const n = document.getElementById(id);
    const go = () => {
      (timers[id] || []).forEach(clearInterval); timers[id] = [];
      if (n.tagName === 'svg' || n.tagName === 'SVG') n.innerHTML = '';
      fn(n);
    };
    const io = new IntersectionObserver(es => {
      if (es[0].isIntersecting) { go(); io.disconnect(); }
    }, { threshold: .3 });
    io.observe(n);
    n.style.cursor = 'pointer';
    n.addEventListener('click', go);
  };
  // ECharts 版 reveal
  const eReveal = (id, opt) => obsReveal(id, elDom => {
    const g = echarts.getInstanceByDom(elDom) || echarts.init(elDom);
    g.clear(); g.setOption(opt);
  });

  /* ── 10 · 卡片骨架（生成新图时照抄这个结构） ──────────────
     <div class="card [dark] [wide]">
       <h2>结论式标题</h2>
       <div class="sub">副标题 · 图例说明 · 时间范围</div>
       <div class="ch" id="xx"></div>  或  <svg id="xx" viewBox="0 0 400 320">
       <div class="src">图型名 · 系列名 · 数据来源（全大写）</div>
     </div>                                                        */
  const CARD_CSS = `
  :root{--bg:${PAPER};--dark:${DARK.bg};--ink:${INK};--muted:${MUTED};--faint:${FAINT};--grid:${GRID}}
  *{margin:0;padding:0;box-sizing:border-box}
  body{background:var(--bg);font-family:'Inter',sans-serif;color:var(--ink);padding:40px;-webkit-font-smoothing:antialiased}
  .grid2{display:grid;grid-template-columns:1fr 1fr;gap:22px;max-width:1400px;margin:0 auto}
  .card{background:var(--bg);border-radius:${SHAPE.cardRadius}px;padding:${SHAPE.cardPad}}
  .card.dark{background:var(--dark);color:${PAPER}}
  .card.dark .sub{color:${MUTED}}
  .card.dark .src{color:${DARK.faint}}
  .card.wide{grid-column:1/-1}
  h2{font-weight:${FONT.title.weight};font-size:${FONT.title.size}px;letter-spacing:${FONT.title.spacing};margin-bottom:3px}
  .sub{font-size:${FONT.sub.size}px;color:var(--muted);margin-bottom:14px}
  .src{font-size:${FONT.src.size}px;color:var(--faint);margin-top:10px;letter-spacing:${FONT.src.spacing};font-weight:${FONT.src.weight}}
  .ch{height:320px}
  svg text{font-family:'Inter',sans-serif}` + MOTION.css;

  global.MONO = { INK, PAPER, MUTED, FAINT, GRID, L, LAD, DARK,
    FONT, SHAPE, MOTION, tipLight, tipDark,
    rnd, pol, sect, blob, el, txt, tip, obsReveal, eReveal, keep, CARD_CSS };
})(typeof window !== 'undefined' ? window : globalThis);
