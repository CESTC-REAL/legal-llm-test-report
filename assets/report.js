/* ============================================================
   alpha_star_law_8B_v2 评测主页 · 数据源（自动生成，勿手改）
   生成器：scripts/build_report_data.py
   竞品差值口径校验：24/35 行与原表一致，11 行不符
   较基座口径校验：35 行中 0 行不符
   ============================================================ */
window.REPORT = {

  meta: {
    updated: "2026-11-20",
    product: "alpha_star_law_8B_v2",
    org: "中国电子云",
  },

  hero: {
    org: "中国电子云",
    tagline: "中国电子云自研中文法律领域大模型",
    lead: "在 <strong>LawBench</strong> 与 <strong>LexEval</strong> 两套中文法律评测集上总分双榜第一；<strong>8 个能力维度</strong>全面领先，<strong>35 项任务中 27 项</strong>取得最高分。",
    badges: [
      { icon: "i-trophy", text: "两榜总分第一" },
      { icon: "i-target", text: "8 / 8 能力维度领先" },
      { icon: "i-flag", text: "27 / 35 任务第一" },
      { icon: "i-layers", text: "19,392 道评测题" },
    ],
    champion: {
      title: "两榜总分",
      badge: "全榜第一",
      rows: [
        { label: "LawBench", value: 55.39, base: 44.37, delta: "+11.02" },
        { label: "LexEval", value: 73.82, base: 59.09, delta: "+14.73" },
        { label: "两榜等权平均", value: 64.61, base: 51.73, delta: "+12.88" },
      ],
      foot: "较 Qwen3-8B 基座两榜平均 <strong>+12.88 分</strong>（<strong>+24.90%</strong>）"
    }
  },

  conclusion: [
    "alpha_star_law_8B_v2 是<strong>中国电子云自研的 8B 级中文法律领域大模型</strong>，面向法律知识理解、法律推理与文书业务场景优化。",
    "本次评测在 LawBench 与 LexEval 两套中文法律评测集上与通用基座及两款开源法律模型同台比较，<strong>两榜总分均为第一</strong>，<strong>8 个能力维度全面领先</strong>，<strong>35 项任务中 27 项</strong>取得最高分。",
    "相较 Qwen3-8B 通用基座，两榜等权平均提升 <strong>12.88 分</strong>（<strong>+24.90%</strong>）；相较平均分最高的法律竞品提升 <strong>13.15 分</strong>（<strong>+25.55%</strong>）。",
  ],

  kpis: [
    { icon: "i-scale", label: "LawBench 总分", value: "55.39", unit: "分", tone: "win", note: "较基座 <span class='up'>+11.02</span> · 较最高竞品 <span class='up'>+10.92</span>" },
    { icon: "i-book", label: "LexEval 总分", value: "73.82", unit: "分", tone: "win", note: "较基座 <span class='up'>+14.73</span> · 较最高竞品 <span class='up'>+14.88</span>" },
    { icon: "i-layers", label: "两榜等权平均", value: "64.61", unit: "分", tone: "win", note: "基座 51.73 · 最高竞品 51.46" },
    { icon: "i-target", label: "能力维度领先", value: "8", unit: "/ 8", tone: "win", note: "LawBench L1–L3 · LexEval L1–L4、L6" },
    { icon: "i-flag", label: "任务取得最高分", value: "27", unit: "/ 35", tone: "win", note: "LawBench 11/16 · LexEval 16/19" },
    { icon: "i-shield", label: "LawBench 无效回答率", value: "0.26", unit: "%", tone: "win", note: "LexEval 仅 0.01% · 竞品最高 9.90%" },
  ],

  benchmarks: [
    {
      name: "LawBench",
      sub: "中文法律评测集 · 满分 100 分 · 16 项任务 / 7,992 题",
      max: 100,
      deltas: [
        { label: "较 Qwen3-8B 基座", value: "+11.02 分（+24.84%）", up: true },
        { label: "较最高法律竞品", value: "+10.92 分（+24.56%）", up: true },
        { label: "最高法律竞品", value: "LegalOne-8B · 44.47", up: true },
      ],
      models: [
        { name: "alpha_star_law_8B_v2", score: 55.39, cls: "self", self: true },
        { name: "LegalOne-8B", score: 44.47, cls: "rival", self: false },
        { name: "qwen3_for_law", score: 43.97, cls: "rival", self: false },
        { name: "Qwen3-8B（基座）", score: 44.37, cls: "base", self: false },
      ]
    },
    {
      name: "LexEval",
      sub: "中文法律评测集 · 满分 100 分 · 19 项任务 / 11,400 题",
      max: 100,
      deltas: [
        { label: "较 Qwen3-8B 基座", value: "+14.73 分（+24.93%）", up: true },
        { label: "较最高法律竞品", value: "+14.88 分（+25.25%）", up: true },
        { label: "最高法律竞品", value: "qwen3_for_law · 58.94", up: true },
      ],
      models: [
        { name: "alpha_star_law_8B_v2", score: 73.82, cls: "self", self: true },
        { name: "LegalOne-8B", score: 56.48, cls: "rival", self: false },
        { name: "qwen3_for_law", score: 58.94, cls: "rival", self: false },
        { name: "Qwen3-8B（基座）", score: 59.09, cls: "base", self: false },
      ]
    },
    {
      name: "两榜等权平均",
      sub: "两套评测集等权平均",
      max: 100,
      deltas: [
        { label: "较 Qwen3-8B 基座", value: "+12.88 分（+24.90%）", up: true },
        { label: "较最高法律竞品", value: "+13.15 分（+25.55%）", up: true },
        { label: "最高法律竞品", value: "qwen3_for_law · 51.46", up: true },
      ],
      models: [
        { name: "alpha_star_law_8B_v2", score: 64.61, cls: "self", self: true },
        { name: "LegalOne-8B", score: 50.48, cls: "rival", self: false },
        { name: "qwen3_for_law", score: 51.46, cls: "rival", self: false },
        { name: "Qwen3-8B（基座）", score: 51.73, cls: "base", self: false },
      ]
    },
  ],

  comparison: {
    columns: [
      { key: "item", label: "评测项" },
      { key: "self", label: "alpha_star_law_8B_v2", self: true },
      { key: "rivalOne", label: "LegalOne-8B" },
      { key: "rivalTwo", label: "qwen3_for_law" },
      { key: "base", label: "Qwen3-8B 基座" }
    ],
    rows: [
      { item: "LawBench 主分", num: true, values: [55.39, 44.47, 43.97, 44.37] },
      { item: "LawBench 全量分", num: true, values: [55.23, 38.05, 43.94, 44.3] },
      { item: "LexEval 主分", num: true, values: [73.82, 56.48, 58.94, 59.09] },
      { item: "LexEval 全量分", num: true, values: [73.82, 56.44, 58.94, 59.09] },
      { item: "两榜等权平均", num: true, values: [64.61, 50.48, 51.46, 51.73] },
      { item: "能力维度取得第一", num: true, dec: 0, suffix: " / 8", values: [8, 0, 0, 0] },
      { item: "任务取得最高分", num: true, dec: 0, suffix: " / 35", values: [27, 6, 1, 1] },
      { item: "LawBench 无效回答率", num: true, lower: true, suffix: "%", values: ["0.26", "9.90", "0.11", "0.15"] },
      { item: "LexEval 无效回答率", num: true, lower: true, suffix: "%", values: ["0.01", "0.25", "0.00", "0.00"] },
    ],
    scale: {
      tasks: "35",
      questions: "19,392"
    }
  },

  dimensionMax: 100,
  dimensionBase: true,
  dimensions: [
    { code: "L1", name: "法律知识记忆", full: "L1 法律知识记忆，1 项", dataset: "LawBench", prefix: "LB", short: "知识记忆", tasks: 1, self: 74.4, rivalOne: 40.2, rivalTwo: 64.0, base: 62.8 },
    { code: "L2", name: "法律知识理解", full: "L2 法律知识理解，9 项", dataset: "LawBench", prefix: "LB", short: "知识理解", tasks: 9, self: 59.21, rivalOne: 48.42, rivalTwo: 43.98, base: 45.73 },
    { code: "L3", name: "法律知识应用", full: "L3 法律知识应用，6 项", dataset: "LawBench", prefix: "LB", short: "知识应用", tasks: 6, self: 46.5, rivalOne: 39.24, rivalTwo: 40.61, base: 39.24 },
    { code: "L1", name: "法律记忆", full: "L1 法律记忆，3 项", dataset: "LexEval", prefix: "LE", short: "法律记忆", tasks: 3, self: 63.71, rivalOne: 46.73, rivalTwo: 45.22, base: 45.5 },
    { code: "L2", name: "法律理解", full: "L2 法律理解，5 项", dataset: "LexEval", prefix: "LE", short: "法律理解", tasks: 5, self: 88.64, rivalOne: 83.71, rivalTwo: 84.49, base: 82.16 },
    { code: "L3", name: "逻辑推理", full: "L3 逻辑推理，6 项", dataset: "LexEval", prefix: "LE", short: "逻辑推理", tasks: 6, self: 73.72, rivalOne: 58.64, rivalTwo: 57.69, base: 57.29 },
    { code: "L4", name: "辨别应用", full: "L4 辨别应用，2 项", dataset: "LexEval", prefix: "LE", short: "辨别应用", tasks: 2, self: 46.16, rivalOne: 24.46, rivalTwo: 29.46, base: 32.97 },
    { code: "L6", name: "法律伦理", full: "L6 法律伦理，3 项", dataset: "LexEval", prefix: "LE", short: "法律伦理", tasks: 3, self: 77.87, rivalOne: 37.9, rivalTwo: 52.23, base: 55.23 },
  ],

  fullScores: [
    { dataset: "LawBench", self: 55.23, rivalOne: 38.05, rivalTwo: 43.94, base: 44.3 },
    { dataset: "LexEval", self: 73.82, rivalOne: 56.44, rivalTwo: 58.94, base: 59.09 },
  ],

  invalid: [
    { model: "V6", lawbench: "21 / 7,992（0.26%）", lexeval: "1 / 11,400（0.01%）", note: "婚姻纠纷多标签重复 13 例，多层推理星号复读 1 例" },
    { model: "LegalOne-8B", lawbench: "791 / 7,992（约 9.90%）", lexeval: "28 / 11,400（约 0.25%）", note: "复杂题中出现未闭合 <think>。其中包括法条预测 360 例、事件检测 143 例、类案辨别 26 例" },
    { model: "qwen3_for_law", lawbench: "9 / 7,992（0.11%）", lexeval: "0 / 11,400（0.00%）", note: "实体识别模板中重复列出“未明确提及”等表述 4 例，有法条刑期预测异常 3 例" },
    { model: "Qwen3-8B 基座", lawbench: "0.15%", lexeval: "0.00%", note: "按汇总口径给出" },
  ],

  taskSets: [
    {
      title: "LawBench 逐项评分",
      note: "16 项任务 · 7,992 题。自研模型列每格依次为「主分 / 辅助分 / 无效率」，— 表示原逐项表未列出该指标；「2-9」和「3-1」两行的 LegalOne 主分需结合该项无效率解读。",
      columns: [
        { key: "task", label: "任务" },
        { key: "dim", label: "维度" },
        { key: "self", label: "alpha_star_law_8B_v2", num: true },
        { key: "selfAux", label: "辅助分", num: true },
        { key: "selfInvalid", label: "无效率", num: true },
        { key: "rivalOne", label: "LegalOne-8B", num: true },
        { key: "rivalTwo", label: "qwen3_for_law", num: true },
        { key: "base", label: "Qwen3-8B 基座", num: true },
        { key: "deltaBase", label: "较基座", num: true },
        { key: "deltaRival", label: "较最高竞品", num: true }
      ],
      rows: [
        { task: "1-2 知识问答", dim: "L1", self: 74.4, selfAux: null, selfInvalid: "0.0%", rivalOne: 40.2, rivalTwo: 64.0, base: 62.8, deltaBase: 11.6, deltaRival: 10.4, best: "self", charge: false },
        { task: "2-1 文件校对", dim: "L2", self: 39.8, selfAux: 77.7, selfInvalid: "0.0%", rivalOne: 37.6, rivalTwo: 47.2, base: 43.4, deltaBase: -3.6, deltaRival: -7.4, best: null, charge: false },
        { task: "2-2 纠纷焦点识别", dim: "L2", self: 45.16, selfAux: null, selfInvalid: "0.8%", rivalOne: 37.09, rivalTwo: 45.2, base: 45.4, deltaBase: -0.24, deltaRival: -0.04, best: null, charge: false },
        { task: "2-3 婚姻纠纷鉴定", dim: "L2", self: 63.24, selfAux: 75.5, selfInvalid: "2.6%", rivalOne: 33.2, rivalTwo: 31.6, base: 35.8, deltaBase: 27.44, deltaRival: 30.04, best: "self", charge: true },
        { task: "2-4 问题主题识别", dim: "L2", self: 55.8, selfAux: null, selfInvalid: "0.0%", rivalOne: 14.0, rivalTwo: 38.6, base: 38.6, deltaBase: 17.2, deltaRival: 17.2, best: "self", charge: false },
        { task: "2-5 阅读理解", dim: "L2", self: 50.0, selfAux: 69.55, selfInvalid: "0.0%", rivalOne: 63.53, rivalTwo: 46.0, base: 49.0, deltaBase: 1.0, deltaRival: -13.53, best: null, charge: false },
        { task: "2-6 命名实体识别", dim: "L2", self: 62.2, selfAux: 88.21, selfInvalid: "0.0%", rivalOne: 44.0, rivalTwo: 34.07, base: 34.2, deltaBase: 28.0, deltaRival: 18.2, best: "self", charge: false },
        { task: "2-8 论点挖掘", dim: "L2", self: 69.6, selfAux: null, selfInvalid: "0.0%", rivalOne: 58.6, rivalTwo: 55.2, base: 51.6, deltaBase: 18.0, deltaRival: 11.0, best: "self", charge: false },
        { task: "2-9 事件检测", dim: "L2", self: 78.76, selfAux: 87.35, selfInvalid: "0.2%", rivalOne: 82.7, rivalTwo: 59.92, base: 65.0, deltaBase: 13.76, deltaRival: -3.94, best: null, charge: false },
        { task: "2-10 触发词提取", dim: "L2", self: 68.34, selfAux: 82.12, selfInvalid: "0.2%", rivalOne: 65.06, rivalTwo: 38.0, base: 48.6, deltaBase: 19.74, deltaRival: 3.28, best: "self", charge: false },
        { task: "3-1 法条预测", dim: "L3", self: 45.6, selfAux: 62.92, selfInvalid: "0.0%", rivalOne: 61.43, rivalTwo: 58.0, base: 54.2, deltaBase: -8.6, deltaRival: -15.83, best: null, charge: false },
        { task: "3-3 罪名预测", dim: "L3", self: 58.8, selfAux: 70.29, selfInvalid: "0.0%", rivalOne: 53.2, rivalTwo: 44.0, base: 47.2, deltaBase: 11.6, deltaRival: 5.6, best: "self", charge: true },
        { task: "3-4 刑期预测（无法条）", dim: "L3", self: 20.97, selfAux: 51.16, selfInvalid: "0.0%", rivalOne: 12.1, rivalTwo: 14.95, base: 13.54, deltaBase: 7.43, deltaRival: 6.02, best: "self", charge: true },
        { task: "3-5 刑期预测（有法条）", dim: "L3", self: 20.16, selfAux: 49.75, selfInvalid: "0.0%", rivalOne: 11.72, rivalTwo: 9.53, base: 13.31, deltaBase: 6.85, deltaRival: 8.44, best: "self", charge: true },
        { task: "3-6 案例分析", dim: "L3", self: 70.2, selfAux: null, selfInvalid: "0.0%", rivalOne: 43.8, rivalTwo: 55.6, base: 53.0, deltaBase: 17.2, deltaRival: 14.6, best: "self", charge: false },
        { task: "3-7 犯罪金额计算", dim: "L3", self: 63.25, selfAux: 84.09, selfInvalid: "0.4%", rivalOne: 53.21, rivalTwo: 61.6, base: 54.2, deltaBase: 9.05, deltaRival: 1.65, best: "self", charge: true },
      ]
    },
    {
      title: "LexEval 逐项评分",
      note: "19 项任务 · 11,400 题。LexEval 未纳入第 5 组开放生成任务。",
      columns: [
        { key: "task", label: "任务" },
        { key: "dim", label: "维度" },
        { key: "count", label: "题量", num: true },
        { key: "self", label: "alpha_star_law_8B_v2", num: true },
        { key: "rivalOne", label: "LegalOne-8B", num: true },
        { key: "rivalTwo", label: "qwen3_for_law", num: true },
        { key: "base", label: "Qwen3-8B 基座", num: true },
        { key: "deltaBase", label: "较基座", num: true },
        { key: "deltaRival", label: "较最高竞品", num: true }
      ],
      rows: [
        { task: "1_1 法律概念", dim: "L1", count: "500", self: 56.0, rivalOne: 29.8, rivalTwo: 40.2, base: 41.0, deltaBase: 15.0, deltaRival: 15.8, best: "self", charge: false },
        { task: "1_2 法规查询", dim: "L1", count: "1,000", self: 88.8, rivalOne: 96.4, rivalTwo: 84.8, base: 82.5, deltaBase: 6.3, deltaRival: -7.6, best: null, charge: false },
        { task: "1_3 法律演进", dim: "L1", count: "300", self: 46.33, rivalOne: 14.0, rivalTwo: 10.67, base: 13.0, deltaBase: 33.33, deltaRival: 32.33, best: "self", charge: false },
        { task: "2_1 要素识别", dim: "L2", count: "500", self: 94.4, rivalOne: 89.8, rivalTwo: 91.8, base: 89.6, deltaBase: 4.8, deltaRival: 2.6, best: "self", charge: false },
        { task: "2_2 事实验证", dim: "L2", count: "300", self: 57.0, rivalOne: 50.33, rivalTwo: 53.67, base: 52.0, deltaBase: 5.0, deltaRival: 3.33, best: "self", charge: false },
        { task: "2_3 阅读理解", dim: "L2", count: "100", self: 97.0, rivalOne: 89.0, rivalTwo: 95.0, base: 94.0, deltaBase: 3.0, deltaRival: 2.0, best: "self", charge: false },
        { task: "2_4 关系提取", dim: "L2", count: "500", self: 95.0, rivalOne: 97.4, rivalTwo: 84.2, base: 79.4, deltaBase: 15.6, deltaRival: -2.4, best: null, charge: false },
        { task: "2_5 实体识别", dim: "L2", count: "500", self: 99.8, rivalOne: 92.0, rivalTwo: 97.8, base: 95.8, deltaBase: 4.0, deltaRival: 2.0, best: "self", charge: false },
        { task: "3_1 案由预测", dim: "L3", count: "1,000", self: 89.3, rivalOne: 79.3, rivalTwo: 80.2, base: 78.9, deltaBase: 10.4, deltaRival: 9.1, best: "self", charge: true },
        { task: "3_2 法条预测", dim: "L3", count: "1,000", self: 95.1, rivalOne: 95.8, rivalTwo: 91.1, base: 90.7, deltaBase: 4.4, deltaRival: -0.7, best: null, charge: false },
        { task: "3_3 刑期预测", dim: "L3", count: "1,000", self: 84.9, rivalOne: 47.4, rivalTwo: 28.8, base: 36.6, deltaBase: 48.3, deltaRival: 37.5, best: "self", charge: true },
        { task: "3_4 多层推理", dim: "L3", count: "500", self: 45.29, rivalOne: 33.07, rivalTwo: 35.4, base: 34.6, deltaBase: 10.69, deltaRival: 9.89, best: "self", charge: false },
        { task: "3_5 法律计算", dim: "L3", count: "400", self: 56.75, rivalOne: 42.86, rivalTwo: 50.25, base: 53.75, deltaBase: 3.0, deltaRival: 6.5, best: "self", charge: false },
        { task: "3_6 论辩挖掘", dim: "L3", count: "500", self: 71.0, rivalOne: 53.4, rivalTwo: 60.4, base: 49.2, deltaBase: 21.8, deltaRival: 10.6, best: "self", charge: false },
        { task: "4_1 类案辨别", dim: "L4", count: "500", self: 45.0, rivalOne: 13.92, rivalTwo: 19.6, base: 26.6, deltaBase: 18.4, deltaRival: 25.4, best: "self", charge: false },
        { task: "4_2 文书质量", dim: "L4", count: "300", self: 47.33, rivalOne: 35.0, rivalTwo: 39.33, base: 39.33, deltaBase: 8.0, deltaRival: 8.0, best: "self", charge: false },
        { task: "6_1 偏见歧视", dim: "L6", count: "1,000", self: 74.6, rivalOne: 20.3, rivalTwo: 36.3, base: 41.2, deltaBase: 33.4, deltaRival: 38.3, best: "self", charge: false },
        { task: "6_2 道德", dim: "L6", count: "1,000", self: 71.6, rivalOne: 40.0, rivalTwo: 49.6, base: 52.3, deltaBase: 19.3, deltaRival: 22.0, best: "self", charge: false },
        { task: "6_3 隐私", dim: "L6", count: "500", self: 87.4, rivalOne: 53.4, rivalTwo: 70.8, base: 72.2, deltaBase: 15.2, deltaRival: 16.6, best: "self", charge: false },
      ]
    }
  ],

  legalMap: {
    categories: [
      { key: "knowledge", name: "法律知识与检索", icon: "i-book", desc: "法律概念、法规条文、立法沿革与类案辨别", count: 5, selfAvg: 62.11, baseAvg: 45.18, deltaBase: 16.93,
        top: { task: "1_2 法规查询", name: "法规查询", dataset: "LexEval", score: 88.8 },
        items: [
          { name: "知识问答", task: "1-2 知识问答", dataset: "LawBench", self: 74.4, charge: false },
          { name: "法律概念", task: "1_1 法律概念", dataset: "LexEval", self: 56.0, charge: false },
          { name: "法规查询", task: "1_2 法规查询", dataset: "LexEval", self: 88.8, charge: false },
          { name: "法律演进", task: "1_3 法律演进", dataset: "LexEval", self: 46.33, charge: false },
          { name: "类案辨别", task: "4_1 类案辨别", dataset: "LexEval", self: 45.0, charge: false },
        ] },
      { key: "extraction", name: "文书理解与信息抽取", icon: "i-doc", desc: "卷宗要素、实体关系、争议焦点与证据抽取", count: 14, selfAvg: 70.28, baseAvg: 59.7, deltaBase: 10.58,
        top: { task: "2_5 实体识别", name: "实体识别", dataset: "LexEval", score: 99.8 },
        items: [
          { name: "文件校对", task: "2-1 文件校对", dataset: "LawBench", self: 39.8, charge: false },
          { name: "纠纷焦点识别", task: "2-2 纠纷焦点识别", dataset: "LawBench", self: 45.16, charge: false },
          { name: "问题主题识别", task: "2-4 问题主题识别", dataset: "LawBench", self: 55.8, charge: false },
          { name: "阅读理解", task: "2-5 阅读理解", dataset: "LawBench", self: 50.0, charge: false },
          { name: "命名实体识别", task: "2-6 命名实体识别", dataset: "LawBench", self: 62.2, charge: false },
          { name: "论点挖掘", task: "2-8 论点挖掘", dataset: "LawBench", self: 69.6, charge: false },
          { name: "事件检测", task: "2-9 事件检测", dataset: "LawBench", self: 78.76, charge: false },
          { name: "触发词提取", task: "2-10 触发词提取", dataset: "LawBench", self: 68.34, charge: false },
          { name: "要素识别", task: "2_1 要素识别", dataset: "LexEval", self: 94.4, charge: false },
          { name: "事实验证", task: "2_2 事实验证", dataset: "LexEval", self: 57.0, charge: false },
          { name: "阅读理解", task: "2_3 阅读理解", dataset: "LexEval", self: 97.0, charge: false },
          { name: "关系提取", task: "2_4 关系提取", dataset: "LexEval", self: 95.0, charge: false },
          { name: "实体识别", task: "2_5 实体识别", dataset: "LexEval", self: 99.8, charge: false },
          { name: "论辩挖掘", task: "3_6 论辩挖掘", dataset: "LexEval", self: 71.0, charge: false },
        ] },
      { key: "sentencing", name: "定罪量刑与法律计算", icon: "i-gavel", desc: "罪名、案由、刑期与涉案金额的推理计算", count: 9, selfAvg: 55.85, baseAvg: 40.88, deltaBase: 14.97,
        top: { task: "3_1 案由预测", name: "案由预测", dataset: "LexEval", score: 89.3 },
        items: [
          { name: "婚姻纠纷鉴定", task: "2-3 婚姻纠纷鉴定", dataset: "LawBench", self: 63.24, charge: true },
          { name: "罪名预测", task: "3-3 罪名预测", dataset: "LawBench", self: 58.8, charge: true },
          { name: "刑期预测（无法条）", task: "3-4 刑期预测（无法条）", dataset: "LawBench", self: 20.97, charge: true },
          { name: "刑期预测（有法条）", task: "3-5 刑期预测（有法条）", dataset: "LawBench", self: 20.16, charge: true },
          { name: "犯罪金额计算", task: "3-7 犯罪金额计算", dataset: "LawBench", self: 63.25, charge: true },
          { name: "案由预测", task: "3_1 案由预测", dataset: "LexEval", self: 89.3, charge: true },
          { name: "刑期预测", task: "3_3 刑期预测", dataset: "LexEval", self: 84.9, charge: true },
          { name: "多层推理", task: "3_4 多层推理", dataset: "LexEval", self: 45.29, charge: false },
          { name: "法律计算", task: "3_5 法律计算", dataset: "LexEval", self: 56.75, charge: false },
        ] },
      { key: "application", name: "法条适用与文书生成", icon: "i-seal", desc: "法条定位、案例分析与法律文书写作", count: 4, selfAvg: 64.56, baseAvg: 59.31, deltaBase: 5.25,
        top: { task: "3_2 法条预测", name: "法条预测", dataset: "LexEval", score: 95.1 },
        items: [
          { name: "法条预测", task: "3-1 法条预测", dataset: "LawBench", self: 45.6, charge: false },
          { name: "案例分析", task: "3-6 案例分析", dataset: "LawBench", self: 70.2, charge: false },
          { name: "法条预测", task: "3_2 法条预测", dataset: "LexEval", self: 95.1, charge: false },
          { name: "文书质量", task: "4_2 文书质量", dataset: "LexEval", self: 47.33, charge: false },
        ] },
      { key: "ethics", name: "法律伦理与合规", icon: "i-shield", desc: "司法偏见、道德边界与隐私保护", count: 3, selfAvg: 77.87, baseAvg: 55.23, deltaBase: 22.64,
        top: { task: "6_3 隐私", name: "隐私", dataset: "LexEval", score: 87.4 },
        items: [
          { name: "偏见歧视", task: "6_1 偏见歧视", dataset: "LexEval", self: 74.6, charge: false },
          { name: "道德", task: "6_2 道德", dataset: "LexEval", self: 71.6, charge: false },
          { name: "隐私", task: "6_3 隐私", dataset: "LexEval", self: 87.4, charge: false },
        ] },
    ],
    charges: ["挪用资金", "非法采矿", "伪造货币", "故意伤害", "盗窃", "非法占用农用地"],
    unclassified: []
  },

  verification: {
    headlineChecked: 15,
    headlineMatched: 15,
    headlineMismatched: 0,
    headlineDetail: [
      { bench: "LawBench", field: "自研总分", expect: 55.39, computed: 55.39, ok: true },
      { bench: "LawBench", field: "基座总分", expect: 44.37, computed: 44.37, ok: true },
      { bench: "LawBench", field: "较基座提升", expect: 11.02, computed: 11.02, ok: true },
      { bench: "LawBench", field: "较最高竞品提升", expect: 10.92, computed: 10.92, ok: true },
      { bench: "LawBench", field: "最高竞品得分", expect: 44.47, computed: 44.47, ok: true },
      { bench: "LexEval", field: "自研总分", expect: 73.82, computed: 73.82, ok: true },
      { bench: "LexEval", field: "基座总分", expect: 59.09, computed: 59.09, ok: true },
      { bench: "LexEval", field: "较基座提升", expect: 14.73, computed: 14.73, ok: true },
      { bench: "LexEval", field: "较最高竞品提升", expect: 14.88, computed: 14.88, ok: true },
      { bench: "LexEval", field: "最高竞品得分", expect: 58.94, computed: 58.94, ok: true },
      { bench: "两榜等权平均", field: "自研总分", expect: 64.61, computed: 64.61, ok: true },
      { bench: "两榜等权平均", field: "基座总分", expect: 51.73, computed: 51.73, ok: true },
      { bench: "两榜等权平均", field: "较基座提升", expect: 12.88, computed: 12.88, ok: true },
      { bench: "两榜等权平均", field: "较最高竞品提升", expect: 13.15, computed: 13.15, ok: true },
      { bench: "两榜等权平均", field: "最高竞品得分", expect: 51.46, computed: 51.46, ok: true },
    ],
    rivalTotal: 35,
    rivalMatched: 24,
    rivalMismatched: 11,
    baseChecked: 35,
    baseMismatched: 0,
    rivalFormula: "自研模型主分 − max(LegalOne-8B 主分, qwen3_for_law 主分)",
    rivalMismatchedTasks: ["1-2 知识问答", "2-3 婚姻纠纷鉴定", "2-4 问题主题识别", "2-6 命名实体识别", "2-8 论点挖掘", "2-10 触发词提取", "3-3 罪名预测", "3-4 刑期预测（无法条）", "3-5 刑期预测（有法条）", "3-6 案例分析", "3-7 犯罪金额计算"],
    proseCrossCheck: [
      { task: "2-3 婚姻纠纷鉴定", expected: 30.04, computed: 30.04, ok: true, quote: "自研模型得 63.24，领先最高竞品 30.04 分" },
      { task: "2-6 命名实体识别", expected: 18.2, computed: 18.2, ok: true, quote: "领先 LegalOne 18.20 分" },
    ],
  },

  errorCases: {
    title: "指定条号查询错例",
    columns: ["题目 ID", "题目涉及的罪名", "标准条号", "自研模型输出"],
    rows: [
      ["24", "挪用资金", "272", "274"],
      ["80", "非法采矿", "343", "363、364"],
      ["120", "伪造货币、故意伤害", "170、234", "41、42、144、176"],
      ["112", "盗窃、非法占用农用地", "342、264", "128、342"],
    ]
  },

  extractMisses: {
    title: "信息抽取遗漏案例",
    columns: ["题目 ID", "要求", "自研模型遗漏"],
    rows: [
      ["8", "列出签订的合同", "只答《借款合同（个人版）》，漏掉《保证合同》"],
      ["80", "提取两段承包时间", "写出两个起始日，漏掉对应截止日"],
      ["88", "提取交易时间", "写出日期，漏掉“14 时左右”和“13 时 40 分左右”"],
      ["152", "提取两阶段获利金额", "写出 58,500 元，漏掉第二阶段的 32,100 元"],
    ]
  },

  sentenceError: {
    title: "开放式刑期预测误差分布",
    columns: ["模型", "错误样本平均绝对误差", "高估与低估情况"],
    rows: [
      ["V6", "3-4 为 21.8 个月", "3-4 高估 271 例、低估 121 例。3-5 高估 282 例、低估 114 例"],
      ["LegalOne-8B", "3-4、3-5 分别为 19.0、18.3 个月", "整体偏高，其中高估高估 277 例、低估 159 例"],
      ["qwen3_for_law", "3-4、3-5 分别为 30.0、27.0 个月", "整体偏低，两项任务低估 227 至 247 例"],
    ]
  },

  outputLengths: {
    title: "平均输出长度对比",
    columns: ["任务", "alpha_star_law_8B_v2", "LegalOne-8B"],
    rows: [
      ["LawBench 法条预测", "15.6 字", "903 字"],
      ["LawBench 事件检测", "20.7 字", "1,303 字"],
      ["LawBench 开放式刑期预测（无法条）", "503 字", "2,623 字"],
    ]
  },

  fullScoreCaption:
  "全量分把无效回答计 0 并保留在分母中。LawBench 上自研模型仍领先基座 10.93 分、领先最高法律竞品 11.29 分；LegalOne-8B 则低于基座 6.25 分。",

  dimensionNote:
  "差值按表中取整后的数值计算，法律伦理维度为 22.64（原始测算口径为 22.63，差异来自取整）。",

  verifyNote:
  "「较最高竞品」= 自研模型主分 − max(LegalOne-8B 主分, qwen3_for_law 主分)，通用基座不参与竞品比较；★ 标记该任务最高分。",

  footerNote:
  "中国电子云自研法律大模型 alpha_star_law_8B_v2 的公开评测主页。\n\n全部数值来自中国电子云内部评测，并在 GitHub 开源组织 CESTC-REAL 同步发布。",

};
