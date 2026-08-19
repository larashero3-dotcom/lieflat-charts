# Lieflat Charts 图型目录 · 64 张

> 每张图挂三个标签：**数据形状**（选图的主键）、**场合**、**读者时间**。
> **主力与后备：** 主力是 L1–L15 与 F1–F13，默认从这里出图。L16–L20、F14–F17、G19–G22 是后备，只有主力无法诚实编码这份数据时才用，并要写明理由。例外是 F15、F16、F17、L17、L20 这五张——主力里不存在对应编码，命中相应数据形状时直接用（见 `SKILL.md` 第零节 3.1 / 3.2）。
> **选型优先级以 `SKILL.md` 的硬约束为准：默认先完整审计 Lupi Editorial，再审计 Lupi Basics；只有两组都不适配，或用户明确要求 Glance / dashboard / 三秒快读时，才进入 Glance。**
> 「姊妹」列 = 同题异构对子，只用于比较数据契约和召回候选，不代表两案都要生成，也不能改变上述优先级。
> 参考实现在 `templates/`：Glance 系 `templates/glance-gallery.html`，Lupi 系 `templates/lupi-gallery.html`，基础型组 `templates/basics-gallery.html`，地图 `templates/maps-gallery.html`，大图 `templates/big-*.html`。地图只有在用户明确要求地图或地域分布时才召回。gallery 是多卡合页——查某张图的代码，先按下表「卡内标题」找到卡片，再在 `<script>` 里搜同名 `// ════` 注释块。真实数据成品案例在 `examples/`。

## Glance 系 · 22 张（粗笔画 · 提前聚合 · 3 秒读完）

| # | 名字 | 卡内标题 | 数据形状 | 场合 | 读者时间 | 引擎 | 姊妹 |
|---|------|---------|---------|------|---------|------|------|
| G1 | Range Capsules | Daily active range | 每天一个区间（min–max）的日序列 | 周报 dashboard | <10s | Chart.js* | L3 Barcode Lollipop |
| G2 | Petal Rose | How releases made us feel | 单变量分类计数，≤8 类且近似等分 | 门面/封面 | <10s | ECharts（暗卡） | G13 Big Slice（双变量时升级） |
| G3 | Chunky Bars | Revenue by plan | 少类目排名比较（≤6） | 周报 dashboard | <10s | Chart.js* | L2 Dot Cascade；多选百分比 → L15 Ballot Tally |
| G4 | Dot Waffle | Where sign-ups come from | 100% 构成（占比） | 通用，饼图的默认替代 | <10s | 手写 SVG | L14 Hundred Field |
| G5 | Pictorial Bar | Trees planted, year by year | 逐年计数（一个符号=固定数量） | 对外故事页 | <10s | ECharts | — |
| G6 | Circular Graph（小） | Who works with whom | 网络，≤12 节点 | 快速示意 | <10s | ECharts（暗卡） | 大图 B1 的预览版，节点多用 B1 |
| G7 | Tree LR | Everything the platform ships | 层级结构（2–3 层） | 产品目录/架构页 | ~30s | ECharts | — |
| G8 | Rainfall Dual Area | Campaigns rain down | 双序列因果（投入 vs 产出） | 增长复盘 | ~30s | ECharts | — |
| G9 | Scatter Morph | One dataset, three views | 同一实体集的三个维度轮播 | 短视频/演示 | 动画 | ECharts universalTransition | — |
| G10 | Diverging Bar | Where we gained, where we bled | 有正负的分类数值 | 周报 dashboard | <10s | ECharts | —（Equalizer、Meridian Dots 已删） |
| G11 | Force Graph（小） | Integrations, pulled into orbit | 中心+卫星网络，≤15 节点 | 快速示意，可拖 | <10s | ECharts（暗卡） | 大图 B2 的预览版；静态海报版 L6 |
| G12 | Stagger Wave | Fifty markets, one wave | 多类目分布（30–60 根） | 短视频入场 | 动画 | ECharts | — |
| G13 | Big Slice (Custom Pie) | Big slice, deep engagement | 双编码：占比(角)×强度(径) | 产品分析 | ~30s | ECharts custom | G2 Petal Rose（单变量时降级） |
| G14 | Single Axis | Support load, day by day | 星期×小时×量（punch card 数据） | 支持/运维周报 | ~30s | ECharts | —（Punch Card 已删，此为唯一版本） |
| G15 | Jitter Strip | Response times, spread out | 分组分布，逐条记录（几百点） | SRE/工单分析 | ~30s | ECharts | — |
| G16 | Bar Race | Eight products race | 排名随时间演变 | 短视频 | 动画 | ECharts realtimeSort | — |
| G17 | Dynamic Stream | Concurrent users, streaming | 实时滚动序列 | 直播/大屏 | 动画 | ECharts | — |
| G18 | Draw-in + Counter | H1 revenue, drawn in one stroke | 累计增长（一条线+一个大数） | 短视频/汇报开场 | 动画 | ECharts | —（Release Rings 已删） |
| G19 | Violin | How fast each plan gets an answer | 分组连续分布的密度轮廓 + 中位数 | dashboard/分析汇报 | <10s | SVG | F15 Tick Box；L19 Ridgeline |
| G20 | Matrix Heat (Glance) | Adoption runs hot on the new versions | 两个离散维度 × 数值，≤60 格，每格直接读数 | dashboard/产品分析 | <10s | SVG | L16 Matrix Heat（细读版） |
| G21 | Rank Strip | Flows climbs to the top | 多实体排名随离散时间变化，适合静态印刷 | 汇报/账单复盘 | <10s | SVG | G16 Bar Race（动态演示） |
| G22 | Aggregate Sankey | Channels pour into plans | 两端聚合流量，带宽=数量，不要求逐路径查询 | 归因/转化分析 | ~30s | SVG | B3 Threads（逐路径查询） |

\* G1/G3 仍使用 Chart.js；后续可迁移到 ECharts，以统一渲染栈。

## Lupi 系 · 20 张（发丝线 · 逐记录 · 30 秒阅读）

| # | 名字 | 卡内标题 | 数据形状 | 场合 | 读者时间 | 引擎 | 姊妹 |
|---|------|---------|---------|------|---------|------|------|
| L1 | Launch Fan | Twelve features, fanned out | 多实体各带出生时间+当前规模 | 年报/故事页 | ~30s | SVG | — |
| L2 | Dot Cascade | What breaks, stacked and ranked | 排名比较，可数单位（unit chart） | 年报/故事页 | ~30s | SVG（暗卡） | G3 Chunky Bars |
| L3 | Barcode Lollipop | Ninety days as a barcode | 每天一个读数的日序列（90 天级） | 年报/故事页（配文字栏） | ~30s | SVG（通栏） | G1 Range Capsules |
| L4 | Arc Matrix | Eight products land in twelve cities | 分类×分类+量，小数据（≤100 格） | 轻量矩阵 | ~30s | SVG | L9 Almanac 的轻量版，数据薄用这张 |
| L5 | Radial Convergence | 48 requests pull toward five themes | 多对一归属，不丢明细（≤60 条） | 海报/封面 | ~30s | SVG | L12 Colonnade（两案供选） |
| L6 | Cluster Field | The contributor field | 中心+卫星网络，海报版 | 海报/封面（认形不查数） | ~30s | SVG（通栏） | B2 force-big（要交互/查数用 B2） |
| L7 | Brand Spectrum | Where the brand sits | 双极量表（两端都是合法位置）+ 竞品对照 | 品牌调研报告 | ~30s | SVG | —（Equalizer 已删，唯一保留的量表图） |
| L8 | Dotty Matrix | Four squads, stacked in space | 多组×网格×量，等距堆叠 | 封面/海报（装饰强） | ~30s | SVG | G14 摊平版更易读，要读数用 G14 |
| L9 | Bubble Almanac | Eight years of tickets, one almanac | 分类×年份+量+状态，大跨度（手绘 blob） | 年报（带旁注/大事记） | >30s | SVG（通栏） | L4 Arc Matrix（轻量版） |
| L10 | Radial Patchwork | A quarter of deploys, overlaid | 逐事件叠加：时刻(角)×规模(径)，透明度=密度 | 年报/故事页 | >30s | SVG | —（Polar Line 已删，此为唯一 24h 分布图） |
| L11 | Trend Lineage | Features rise, fall, come back | 事件序列生命史（首发/重做/休眠/存活） | 产品复盘 | >30s | SVG | — |
| L12 | Type Colonnade | Forty-four repos, ten owners | 多对一归属+逐条名单（≤50 条） | 治理/审计报告 | ~30s | SVG | L5 Convergence（两案供选） |
| L13 | Hourglass Stream | The funnel, poured | 分阶段递减人数（漏斗） | 年报/故事页 | ~30s | SVG | — |
| L14 | Hundred Field | A hundred of us, four minds | 100% 构成（占比），≤6 类小数据 | 年报/故事页 | ~30s | SVG | G4 Dot Waffle |
| L15 | Ballot Tally | What they fear, tick by tick | 多选题百分比（各项独立 0–100），≤6 项 | 年报/故事页 | ~30s | SVG | G3 Chunky Bars |
| L16 | Matrix Heat | Which features get used together | 两个离散维度 × 数值，≤100 格，保留矩阵结构与重点格 | 年报/产品分析 | ~30s | SVG | G20 Matrix Heat（快读版） |
| L17 | Calendar Heat | A year of deploys, day by day | 一整年日期 × 数量，52 周 × 7 天 | 年报/运营复盘 | ~30s | SVG（通栏） | F10 Dot Heat（星期×小时） |
| L18 | Beeswarm | A hundred and twenty deals, swarming | 单变量逐条记录的堆积分布，约 40–180 点 | 销售/研究附图 | ~30s | SVG | G15 Jitter Strip；G19 Violin |
| L19 | Ridgeline | Five pipelines, five tempos | 3–8 组连续分布的密度形状比较 | 年报/研究报告 | >30s | SVG | G19 Violin（少组快读） |
| L20 | Parallel Coordinates | Twelve products, four dimensions | 同一实体集跨 3–6 个连续维度，一线一实体 | 产品组合/研究报告 | >30s | SVG | G9 Scatter Morph（演示轮播） |

> L14–L15 是**小数据组**：数据只有几个百分比时靠单位分解拿回 Lupi 密度——1 点 = 1 人 / 1 百分点，密度来自单位而不是记录数。单位含义必须写进副标题（如 "one dot = one person in a hundred"），且只摊诚实单位，不编造个体。

## 基础型组 · 17 张（F1–F17 · Lupi 语法 × 基础图型剪影，为稀疏数据而设）

远看认得出基础图型（柱/折线/环形…），近看每个单位可数。数据只有几个类目或几十天时的 Lupi 首选——先来这里找，找不到再走库外翻译。参考实现 `templates/basics-gallery.html`。

| # | 名字 | 卡内标题 | 数据形状 | 场合 | 读者时间 | 引擎 | 姊妹 |
|---|------|---------|---------|------|---------|------|------|
| F1 | Rung Bars | Revenue by plan, rung by rung | 少类目比较（≤8），单位可数 | 年报/故事页 | ~30s | SVG | G3 Chunky Bars |
| F2 | Hairline Line | Thirty days of sign-ups | 日序列（≤30 天，逐日读数） | 年报/故事页 | ~30s | SVG | G1 Range Capsules |
| F3 | Hairline Area | Concurrent users, filled with days | 日序列（30–60 天，看形态） | 年报/故事页 | ~30s | SVG | L3 Barcode Lollipop |
| F4 | Tick Donut | Where the traffic comes from | 100% 构成（≤6 段） | 年报/故事页 | ~30s | SVG | G4 Dot Waffle ⇄ L14 Hundred Field |
| F5 | Tick Rows | Six teams, shipped and counted | 横向排名比较，单位可数（≤8 行） | 年报/故事页 | ~30s | SVG | L2 Dot Cascade |
| F6 | Paired Rungs | This year against last, plan by plan | 分组对比（每类 2 系列，如今昔） | 年报/复盘 | ~30s | SVG | — |
| F7 | Stacked Rungs | Where each region's revenue sits | 堆叠构成（≤4 类 × ≤3 段） | 年报/复盘 | ~30s | SVG | — |
| F8 | Plumb Scatter | Price against satisfaction | 二维散点（≤20 点） | 产品分析 | ~30s | SVG | G15 Jitter Strip（分布用） |
| F9 | Rung Waterfall | From gross to net, step by step | 瀑布 / 增减分解（≤6 级） | 财务/复盘 | ~30s | SVG | — |
| F10 | Dot Heat | When support gets loud | 星期×小时×量（小热力） | 支持/运维 | ~30s | SVG | G14 Single Axis |
| F11 | Tick Gauge | How far to the quarter's goal | 单值进度（0–100%） | 汇报开场 | <10s | SVG | G18 Draw-in + Counter |
| F12 | Dumbbell Queue | Onboarding, before and after | 类目级前后对比（≤6 类，串珠=真单位） | 年报/复盘 | ~30s | SVG | —（两点趋势的 Lupi 位，替代已删 Slope Beads） |
| F13 | Nested Treemap | Where the work went | 两层层级 + 正数权重，矩形面积=数值 | 预算/产品组合/空间占用 | ~30s | ECharts（SVG） | G7 Tree LR（只看从属关系、不看份额时） |
| F14 | Rung Histogram | Most tickets resolve within six hours | 单变量分箱频数，bin 有业务含义且单位可数 | 支持/运营分析 | ~30s | SVG | G19 Violin；F15 Tick Box |
| F15 | Tick Box | Reply times, boxed by plan | 分组五数概括 + 异常值，原始分布可被汇总 | 支持/实验分析 | ~30s | SVG | G19 Violin；F14 Histogram |
| F16 | Stream Ribbon | Three products trade the same river | 2–5 个系列的构成随连续时间变化，同时看总量 | 产品/流量复盘 | ~30s | SVG（通栏） | F7 Stacked Rungs（静态类目） |
| F17 | Candlestick | Six weeks of the token, candle by candle | OHLC 四值时间序列，空心=涨、实心=跌 | 行情/价格复盘 | ~30s | SVG | G1 Range Capsules（只有区间时） |

## 地图 · 2 张（仅在用户明确要求地图时召回）

数据里出现国家、州省或地区字段，**不等于自动使用地图**。只有用户明确提出“地图”“地域分布”“按国家/州着色”等要求时，才从 `templates/maps-gallery.html` 选择。地图通过 ECharts 与在线 GeoJSON 渲染，需要联网。

| # | 名字 | 卡内标题 | 数据形状 | 场合 | 读者时间 | 引擎 | 限制 |
|---|------|---------|---------|------|---------|------|------|
| M1 | US Choropleth | Sign-ups across the states | 美国州级区域 + 非负数值，明度=数值 | 美国市场/运营报告 | ~30s | ECharts + GeoJSON | 仅用户明确要求；州面积不表示数值 |
| M2 | World Choropleth | Where the users are | 世界国家级区域 + 非负数值，明度=数值 | 全球市场/运营报告 | ~30s | ECharts + GeoJSON | 仅用户明确要求；不用于点位或路径 |

## 独立交互大图 · 3 张（一图一文件，整页幅面）

| # | 文件 | 数据形状 | 交互 | 什么时候用 |
|---|------|---------|------|-----------|
| B1 | `templates/big-circular.html` | 网络 60 节点环形弦膜 | hover 聚焦邻接，点击重播 | 节点 >15 的关系数据 |
| B2 | `templates/big-force.html` | 网络 180 节点力导向星系 | 拖拽回弹、hover 聚焦 | 大网络要逐节点查 |
| B3 | `templates/big-threads.html` | 三段路径 100+ 条丝线 | hover 单线/整束，点击钉住，状态栏读数 | 多段流向要逐路径查 |

## 已移除图型（已有更合适的替代）

Polar Line（24h 分布 → L10）、Punch Card（→ G14）、Release Rings（风格不属于任何一系）、静态 Thread Triptych（→ B3）、Profile Equalizer（→ G10）、Slope Beads（交叉斜线的可读性不足，斜率图仍待重新设计）、Meridian Dots（正负分类改用 G10）。后两张源自未采用的 Lenny 案例草稿，不建议按原样恢复。
