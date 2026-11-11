# Lieflat Charts

[中文](README.md) | English

**Website & commercial licenses:** [lieflat.work · Lieflat Charts](https://lieflat.work/skills/charts/)

![Lieflat Charts: a data visualization skill with its own visual language](docs/assets/readme-hero-en.png)

Lieflat Charts is an Agent Skills-compatible skill for data visualization, slide decks, and full-page reports. It works with Claude Code, Codex, and other AI agents that support `SKILL.md`. It provides both Presentation Mode and Report Mode but defaults to charts. Explicit slide-deck requests produce an HTML or PDF deck; explicit report, annual report, monthly report, white paper, poster, or brief requests produce a full-page HTML report.

Presentation Mode activates when the user explicitly asks for a chart deck: the agent picks the right chart types and a color system (Mono or one of the three color presets), then generates an HTML deck with entrance animations and left/right keyboard navigation; data and chart choices still come from the user’s materials.

Its visual language is built around consistent typography, spacing, line work, and motion. It includes three main chart families:

- **Lupi Editorial**: fine lines, dot fields, record-level detail, annotations, and generous whitespace for papers, long-form articles, annual reports, and slow-reading data stories.
- **Glance**: bold bars, large numbers, blocks, and clear ranking for reports, dashboards, and situations where readers need the answer in seconds.
- **Lupi Basics**: familiar bar, line, area, donut, and scatter silhouettes rebuilt with countable units, hairlines, and editorial typography.

The skill also includes standalone interactive visualizations for networks, paths, and dense multi-segment flows. Each chart aims to preserve honest data units while treating headlines, annotations, sources, and page structure as part of the visualization.

Mono is the reliable fallback, but color does not require an explicit user request. The agent can choose automatically between Mono, Porcelain, Palm, and Wire based on the data structure and publishing context; when the fit is unclear, it returns to Mono. When users provide brand colors or exact values, the skill can build one custom palette. One HTML file or chart set uses one color system only while preserving structure, contrast, and data meaning.

## Preview

Representative templates from each chart family.

### Lupi Editorial

Detailed, record-level, and editorial. Selected examples from 20 narrative templates.

<table>
  <tr>
    <td width="50%"><img src="docs/assets/preview-lupi-01.png" alt="Lupi Editorial preview one" width="100%"></td>
    <td width="50%"><img src="docs/assets/preview-lupi-02.png" alt="Lupi Editorial preview two" width="100%"></td>
  </tr>
  <tr><td colspan="2"><img src="docs/assets/preview-lupi-03.png" alt="Lupi Editorial preview three" width="100%"></td></tr>
</table>

### Glance

Fast reading, pre-aggregated information, and conclusion-first composition. Selected examples from 21 Glance templates.

<table>
  <tr>
    <td width="50%"><img src="docs/assets/preview-glance-02.png" alt="Glance preview two" width="100%"></td>
    <td width="50%"><img src="docs/assets/preview-glance-03.png" alt="Glance preview three" width="100%"></td>
  </tr>
</table>

Motion preview:

<p align="center"><img src="docs/assets/glance-motion.gif" alt="Glance motion preview" width="82%"></p>

More motion examples:

<table>
  <tr>
    <td width="33%"><img src="docs/assets/glance-wave-motion.gif" alt="Fifty markets motion preview" width="100%"><br><strong>Fifty markets</strong></td>
    <td width="33%"><img src="docs/assets/glance-race-motion.gif" alt="Eight products race motion preview" width="100%"><br><strong>Eight products race</strong></td>
    <td width="33%"><img src="docs/assets/glance-stroke-motion.gif" alt="H1 revenue motion preview" width="100%"><br><strong>H1 revenue</strong></td>
  </tr>
</table>

### Lupi Basics

Familiar chart forms built from countable visual units. Selected examples from 17 foundational templates.

<table>
  <tr>
    <td width="50%"><img src="docs/assets/preview-basics-01.png" alt="Lupi Basics preview one" width="100%"></td>
    <td width="50%"><img src="docs/assets/preview-basics-02.png" alt="Lupi Basics preview two" width="100%"></td>
  </tr>
</table>

### Interactive

For networks, paths, and high-density relationship data.

Motion preview:

<p align="center"><img src="docs/assets/interactive-motion.gif" alt="Interactive visualization preview" width="82%"></p>

[Open the Force Graph template to try dragging and zooming](https://larashero3-dotcom.github.io/lieflat-charts/templates/big-force.html)

## Added Color Mode

The skill can automatically choose Mono or one color preset from the data structure and publishing context; users do not need to request color first. Porcelain suits ordered or single-series data, Palm suits a small number of unordered categories, and Wire suits a restrained composition with one focal point. When the fit is unclear, the skill returns to Mono. Users who provide brand colors or exact values can use one custom palette. Each HTML file or chart set still locks one color system, with contrast, hierarchy, and data meaning checked after every change.

#### Porcelain

A single-hue blue scale for ordered data and single-series charts.

<p align="center"><img src="docs/assets/color-porcelain-motion.gif" alt="Porcelain Barcode Lollipop motion preview" width="100%"></p>

<p align="center"><img src="docs/assets/color-porcelain-almanac-motion.gif" alt="Porcelain Eight Years of Tickets, One Almanac motion preview" width="100%"></p>

<table>
  <tr>
    <td width="100%"><img src="docs/assets/preview-color-porcelain-basics.png" alt="Porcelain Basics color preview" width="100%"><br><strong>Basics</strong></td>
  </tr>
  <tr><td colspan="2"><img src="docs/assets/preview-color-porcelain.png" alt="Porcelain Lupi Editorial color preview" width="100%"><br><strong>Lupi Editorial</strong></td></tr>
</table>

#### Palm

A low-saturation green and yellow family for a small number of unordered categories.

<p align="center"><img src="docs/assets/color-palm-wave-motion.gif" alt="Palm Fifty Markets, One Wave motion preview" width="100%"></p>

<p align="center"><img src="docs/assets/color-palm-support-motion.gif" alt="Palm Support Load, Day by Day motion preview" width="100%"></p>

<table>
  <tr>
    <td width="100%"><img src="docs/assets/preview-color-palm-basics.png" alt="Palm Basics color preview" width="100%"><br><strong>Basics</strong></td>
  </tr>
  <tr><td colspan="2"><img src="docs/assets/preview-color-palm.png" alt="Palm Lupi Editorial color preview" width="100%"><br><strong>Lupi Editorial</strong></td></tr>
</table>

#### Wire

A black and gray palette with one fluorescent orange focal point.

<p align="center"><img src="docs/assets/color-wire-patchwork-motion.gif" alt="Wire A Quarter of Deploys, Overlaid motion preview" width="100%"></p>

<p align="center"><img src="docs/assets/color-wire-hourglass-motion.gif" alt="Wire The Funnel, Poured motion preview" width="100%"></p>

<table>
  <tr>
    <td width="100%"><img src="docs/assets/preview-color-wire-basics.png" alt="Wire Basics color preview" width="100%"><br><strong>Basics</strong></td>
  </tr>
  <tr><td colspan="2"><img src="docs/assets/preview-color-wire.png" alt="Wire Lupi Editorial color preview" width="100%"><br><strong>Lupi Editorial</strong></td></tr>
</table>

## Latest Update

### Added Presentation Mode

16:9 single-file HTML decks with left/right keyboard navigation, an overview grid, and per-page printing. When the user explicitly asks for a chart deck, the agent picks chart types from `catalog.md` based on data shape, locks one global color system — Mono or one of the three color presets (Porcelain blue, Palm green, Wire editorial red) — and generates the deck with entrance animations (pop, fade, draw; respects `prefers-reduced-motion`).

Every color system ships as a complete 19-page bilingual template pair (cover, contents, chapter pages, chart pages, big-number takeaways, and reading notes). The template supplies the canvas, typography, spacing, navigation, and print behavior; the screenshots below are layout references only.

<table>
  <tr>
    <td width="50%"><img src="docs/assets/presentations/presentation-en-cover.png" alt="Presentation Mode cover preview" width="100%"></td>
    <td width="50%"><img src="docs/assets/presentations/presentation-en-metrics.png" alt="Presentation Mode metrics preview" width="100%"></td>
  </tr>
  <tr><td colspan="2"><img src="docs/assets/presentations/presentation-en-dark.png" alt="Presentation Mode dark chart preview" width="100%"></td></tr>
</table>

See [`presentation-catalog.md`](presentation-catalog.md) and [`templates/presentations/index.html`](templates/presentations/index.html).

Complete color templates (19 pages, EN/ZH per color system):

- [`complete-porcelain.html`](templates/presentations/complete-porcelain.html) / [`complete-porcelain-zh.html`](templates/presentations/complete-porcelain-zh.html) — Porcelain blue
- [`complete-palm.html`](templates/presentations/complete-palm.html) / [`complete-palm-zh.html`](templates/presentations/complete-palm-zh.html) — Palm green
- [`complete-wire.html`](templates/presentations/complete-wire.html) / [`complete-wire-zh.html`](templates/presentations/complete-wire-zh.html) — Wire editorial red

Plus the Mono base pair: [`presentation.en.html`](templates/presentations/presentation.en.html) / [`presentation.zh.html`](templates/presentations/presentation.zh.html).

### Added Report Mode

Lieflat Charts can now generate complete HTML reports in addition to individual charts. The 12 full-page templates are available in Chinese and English for research reports, research briefs, business data reports, financial and economic analysis, product records, dashboards, posters, and personal datasets such as sports, travel, and yearly life logs. Template names describe the layout's character, not a hard use-case restriction; the same layout can move across report types when the information structure fits.

Report mode keeps chart selection data-driven; browse the report templates in [`report-catalog.md`](report-catalog.md) and [`templates/reports/index.html`](templates/reports/index.html).

## Quick Start

### Install in an Agent

Install with one command:

```bash
npx skills add https://github.com/larashero3-dotcom/lieflat-charts --skill lieflat-charts
```

You can also send the following instruction to an AI agent with shell access:

```text
Install lieflat-charts. Clone https://github.com/larashero3-dotcom/lieflat-charts
to ~/.claude/skills/lieflat-charts, then verify that SKILL.md, templates/,
catalog.md, and mono-tokens.js are present.
```

For Codex, replace the installation path with `~/.codex/skills/lieflat-charts`.

To update an existing installation:

```text
Update lieflat-charts. Enter ~/.claude/skills/lieflat-charts, run git pull,
and report the latest commit.
```

After installation, ask your agent:

```text
Turn this research dataset into five charts for a long-form article.
Compare Lupi Editorial and Lupi Basics first. Use Glance only if neither group fits.
```

More prompt examples:

```text
Use lieflat-charts to turn this dataset into a color chart.
```

```text
Read this paper, identify the strongest data findings, and build a complete HTML chart page.
```

```text
This is weekly reporting data. Make the ranking, changes, and anomalies readable within ten seconds.
```

```text
Turn this CSV into a Glance chart suitable for a presentation.
```

```text
Redesign this dataset in the Lupi style, preserving every real record and adding useful annotations.
```

```text
Rebuild this chart with the Porcelain preset. Use lightness to represent value without changing the structure.
```

The number of charts follows the number of independent findings: one chart for one question, two or three charts for two or three findings, and four to six charts for a complete article or paper. A single page defaults to no more than six charts, and repeated conclusions are removed rather than added to meet a quota.

## Templates

| Family | Count | Best for | Implementation |
|---|---:|---|---|
| **Lupi Editorial** | 15 | Annual reports, papers, long-form articles, posters, portfolios, and readers willing to inspect detail | Handwritten SVG |
| **Lupi Basics** | 13 | Bars, lines, areas, donuts, scatterplots, waterfalls, heatmaps, progress, treemaps, and other foundational data shapes | Handwritten SVG / ECharts |
| **Glance** | 18 | Weekly reports, dashboards, monitoring, and presentations that require fast comparison | Chart.js / ECharts |
| **Interactive** | 3 | Networks, paths, multi-segment flows, and high-density relationship data | ECharts / SVG |
| **Color Presets** | 3 families / 15 samples | Distinguishing real data dimensions or adding one controlled focal point to monochrome charts | Restyled original templates |
| **Presentation Mode** | 4 bilingual sets | 16:9 navigable decks with entrance animations (Mono + 3 color presets); layout comes from the template, charts and color system come from user data | Single-file HTML |
| **Report Templates** | 12 templates / two languages | Research, annual, monthly, dashboard, poster, brief, and notebook-style full-page reports | Single-file HTML |

### Lupi Editorial

Each point, line, and annotation should map to a real unit whenever possible. Lupi Editorial does not rush to aggregate the evidence into a single number. It lays out records, distributions, structures, and exceptions through hairlines, whitespace, ledger-like guides, annotations, and low-contrast value scales.

### Lupi Basics

Lupi Basics retains familiar chart silhouettes while rebuilding them inside the same editorial language. A cell can represent one percentage point, a tick can represent one person, a hairline can represent one day, and a treemap rectangle can represent one honest weight. It is suited to smaller datasets that still need density and countable visual units.

### Glance

Glance pre-aggregates information, strengthens the main forms, and places the key ranking or change in the first visual pass. It is not a simplified Lupi mode. It serves a different reading speed: readers can identify what is higher, what changed most, and what needs attention within seconds.

### Interactive

Interactive templates handle relationship data that ordinary static charts cannot carry. Hover, focus, dragging, pinned paths, and status readouts turn complex networks into records that can be queried one by one. Interaction is reserved for real data, not decorative elements.

## Design

Every family shares the same core visual language: paper gray and charcoal at the extremes, a controlled grayscale ladder between them, and data encoded through lightness, position, length, density, and structure. The three color presets provide stable starting points. Explicit brand colors can also become one role-based custom palette. When users refine the palette, contrast, hierarchy, and data meaning still need to remain clear.

Lieflat Charts differs from a conventional chart generator in more than color:

- It identifies the data contract before choosing a chart.
- Each chart carries one independent conclusion before charts are assembled into a page.
- Real data units become visual atoms instead of using decorative noise to imitate density.
- Headlines, annotations, sources, spacing, and motion are treated as part of the chart.
- Lupi and Glance represent different reading speeds, not simply static versus interactive output.

## Structure

```text
.
├── README.md                # Chinese project guide
├── README.en.md             # English project guide
├── SKILL.md                 # Agent workflow and design rules
├── catalog.md               # Data-contract index for 49 chart types
├── report-catalog.md        # Scenario index for 12 report templates
├── presentation-catalog.md  # P01–P10 presentation layout index
├── mono-tokens.js           # Shared monochrome design tokens
├── color-presets.js         # Three built-in color presets
├── templates/               # Lupi, Basics, Glance, interactive, and report templates
│   ├── color/               # Color-restyled samples
│   ├── presentations/       # 16:9 deck templates: Mono base + 3 complete color sets, EN/ZH
│   └── reports/             # 12 report templates, each in Chinese and English
├── examples/                # Examples based on public datasets
├── docs/assets/             # README screenshots and motion previews
└── scripts/validate.mjs     # Pre-release validation
```

Open the HTML files under `templates/` directly to inspect the galleries. Open `templates/presentations/index.html` to browse the deck templates (Mono base + three complete color sets). Open `templates/reports/index.html` to browse the report templates and their Chinese/English variants. Report mode chooses a full-page skeleton from `report-catalog.md`, then reuses the real chart implementations indexed in `catalog.md` for each chart slot. Lupi and Basics mainly use native SVG, while F13 Treemap uses ECharts. Glance, Circular, Force, and report templates R11/R12 also load Chart.js or ECharts from a CDN and require an internet connection unless those dependencies are inlined.

## License

This project is licensed under the [PolyForm Noncommercial License 1.0.0](LICENSE). Learning, modification, sharing, and noncommercial use are allowed. Commercial use requires separate permission. [Choose and purchase a Commercial Use or Product Integration license on lieflat.work](https://lieflat.work/skills/charts/#pricing).

Chart.js, Apache ECharts, and the Inter typeface remain subject to their original licenses. See [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).
