# Examples · 真实数据成品案例

templates/ 里的 gallery 是「例句」（演示数据、多卡合页）；这里是「成文」——拿一篇真实文章的公开数据，从判形状到出图走完整个 skill 流程的成品。拿不准交付物该长什么样，先看这里。

## lenny-2026-survey.html

数据来源：Lenny's Newsletter《How tech workers are feeling in 2026》（2026-07-07，年度科技从业者调研）。一篇文章 → 8 张图，全英文，8 个模板不重复：

这是图数规则确定前保留的早期展示案例，用 8 张图覆盖更多模板。当前 skill 处理同类文章时，默认会筛选为 4–6 张，并在超过 6 张时拆页。

| # | 模板 | 数据 |
|---|------|------|
| 1 | Type Colonnade (L12) | AI 身份认同 49/27/14/5/3 |
| 2 | Ballot Tally (L15) | 矛盾三联：享受工作 79 · 显著倦怠 56 · 乐观 49 |
| 3 | Hundred Faces（语义单位·通栏） | 裁员担忧 28/31/21/12/8，嘴角弧度=担忧程度 |
| 4 | Tick Rows (F5) | 四大恐惧 51/46/41/22 |
| 5 | Hourglass Stream (L13) | 矛盾收窄 100 → 77 → 51 |
| 6 | Brand Spectrum (L7) | 分层 NPS −49/−23/−5 |
| 7 | Radial Convergence (L5) | 行业一句话：混乱 30/快 17/泡沫 12/兴奋 11/其他 30 |
| 8 | Ballot Rings（表盘 tick·通栏） | AI 生产力 82 → 49 |

这个文件顺便示范了几条容易忘的规矩：

- **取整要认账**：身份认同取整后只有 98，底注写「rounding ate the other two」，不凑假线。
- **没有的数据不编**：Brand Spectrum 模板原有竞品对照点，Lenny 没这个数据，删空。
- **精确份额关掉随机泄漏**：Radial Convergence 模板的 rnd 泄漏逻辑（约 8% 汇错 hub 制造有机感）在调研数据上要关。
- **同一批多图模板不重复**：8 张图 8 个模板。
- **cascade 竖排类目名只配短标签**——本例曾用 Dot Cascade 画恐惧数据，两轮都被评「看不清」，换成横排 Tick Rows 后解决：标签保持水平永远是更稳的选择。
- **reduced-motion 降级不能漏**（无头截图验证时可用 `--force-prefers-reduced-motion` 绕过动画时序）。
