/* ============================================================
   alpha_star_law_8B_v2 测试报告 · 数据源（自动生成，勿手改）
   生成器：scripts/build_report_data.py
   竞品差值口径校验：24/35 行与原表一致，11 行不符
   较基座口径校验：35 行中 0 行不符
   ============================================================ */
window.REPORT = {

  meta: {
    updated: "2026-11-20",
    chips: [
      { k: "评测日期", v: "2026-11-20" },
      { k: "评测设置", v: "四个模型统一关闭思考模式" },
      { k: "能力维度", v: "8 个" },
      { k: "任务总数", v: "35 项" },
      { k: "题量", v: "19,392 道" }
    ]
  },

  conclusion: [
    "在四个模型统一关闭思考模式的条件下，<strong>自研法律模型 alpha_star_law_8B_v2</strong> 在 <strong>LawBench</strong> 和 <strong>LexEval</strong> 上均排名第一。LawBench 得 <span class='hl'>55.39 分</span>，较 Qwen3-8B 基座高 <strong>11.02 分</strong>，较两款开源法律模型中的最高分高 <strong>10.92 分</strong>。LexEval 得 <span class='hl'>73.82 分</span>，较基座高 <strong>14.73 分</strong>，较最高竞品高 <strong>14.88 分</strong>。",
    "在本次评测覆盖的 <strong>8 个能力维度上均排名第一</strong>，并在 <strong>35 项任务中的 27 项</strong>取得最高分，其中 LawBench 为 <strong>11/16 项</strong>，LexEval 为 <strong>16/19 项</strong>。",
    "在统一关闭思考模式的设置下，两榜等权平均分较 Qwen3-8B 基座提升 <strong>12.88 分</strong>，较平均分最高的法律竞品提升 <strong>13.15 分</strong>，相对提升分别为 <strong>24.90%</strong> 和 <strong>25.55%</strong>。",
  ],

  kpis: [
    { label: "LawBench 总分", value: "55.39", unit: "分", tone: "win", note: "较 Qwen3-8B 基座 <span class='up'>+11.02</span> · 较最高竞品 <span class='up'>+10.92</span>" },
    { label: "LexEval 总分", value: "73.82", unit: "分", tone: "win", note: "较 Qwen3-8B 基座 <span class='up'>+14.73</span> · 较最高竞品 <span class='up'>+14.88</span>" },
    { label: "两榜等权平均", value: "64.61", unit: "分", tone: "win", note: "基座 51.73 · 最高竞品 51.46" },
    { label: "较 Qwen3-8B 基座", value: "+12.88", unit: "分", tone: "base", note: "相对提升 <span class='up'>24.90%</span>" },
    { label: "较最高法律竞品", value: "+13.15", unit: "分", tone: "gap", note: "相对提升 <span class='up'>25.55%</span>" },
    { label: "任务最高分", value: "27", unit: "/ 35", tone: "win", note: "LawBench 11/16 · LexEval 16/19" },
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

  models: [
    { name: "alpha_star_law_8B_v2", url: null, link: "—", source: "中国电子云", role: "自研模型", tagCls: "tag-self", self: true, route: "通用数据cpt + 法律领域 SFT + 强化学习，alpha_star_law_8B_v2 版本" },
    { name: "LegalOne-8B", url: "https://huggingface.co/CSHaitao/LegalOne-8B", link: "https://huggingface.co/CSHaitao/LegalOne-8B", source: "清华大学互联网司法研究院", role: "开源法律模型", tagCls: "tag-rival", self: false, route: "三阶段全参训练，包含 100B 中期训练（PAS）、约 500k 条代理式 CoT 蒸馏 SFT（LEAD）和多阶段课程 RL。训练使用昇腾 Atlas 910B 与 MindSpore" },
    { name: "qwen3_for_law", url: "https://modelscope.cn/models/Kilimanjarant/qwen3_for_law", link: "https://modelscope.cn/models/Kilimanjarant/qwen3_for_law", source: "中国政法大学数据法学实验室", role: "开源法律模型", tagCls: "tag-rival", self: false, route: "在 Qwen3-8B 上进行 LoRA SFT，随后合并权重" },
    { name: "Qwen3-8B", url: null, link: "—", source: "阿里云通义千问", role: "通用基座", tagCls: "tag-base", self: false, route: "通用预训练及支持思考、非思考两种模式的后训练" },
  ],

  datasets: [
    { name: "LawBench", tasks: "16", questions: "7,992", scope: "客观及半结构化任务。刑期预测 3-4、3-5 各 496 题，其余任务各 500 题" },
    { name: "LexEval", tasks: "19", questions: "11,400", scope: "知识、理解、推理、辨别应用与伦理任务，未纳入第 5 组开放生成任务" },
    { name: "合计", tasks: "35", questions: "19,392", scope: "" },
  ],

  metrics: [
    { name: "主分 score", desc: "对应 valid_accuracy 或 final_rate_valid。先剔除复读、思考标签未闭合等无效回答，再按任务规则评分" },
    { name: "全量分", desc: "无效回答计 0，保留在分母中。对应 total_accuracy 或 final_rate_total" },
    { name: "辅助分 acc", desc: "部分任务提供的部分重合或加权接近度指标，用于衡量部分答对的情况" },
  ],

  inference: {
    mode: "LegalKit api8000 模式调用本地 OpenAI 兼容接口",
    params: ["enable_thinking=false", "temperature=0.1", "top_p=0.9", "max_tokens=4096", "batch_size=16", "num_workers=8"]
  },

  weights: {
    columns: ["项目", "alpha_star_law_8B_v2", "LegalOne-8B", "qwen3_for_law", "Qwen3-8B"],
    rows: [
      ["本地权重目录", "/sharedata/mdl/law_model/law_model_rl_8b_v6_8K", "/sharedata/mdl/LegalOne-8B", "/sharedata/mdl/qwen3_for_law/merged", "/sharedata/mdl/Qwen/Qwen3-8B"],
      ["参数量", "8,190,735,360", "8,195,978,240", "8,190,735,360", "8,190,735,360"],
      ["vocab_size", "151,936", "152,576", "151,936", "151,936"],
      ["权重体积和分片", "15.27 GiB，4 片", "15.28 GiB，4 片", "15.27 GiB，4 片", "15.27 GiB，5 片"],
      ["Tensor 数", "399", "399", "399", "399"],
      ["Transformers 版本", "4.57.6", "4.57.1", "4.52.3", "4.51.0"],
      ["EOS", "151645", "151645、151643", "151645、151643", "151645、151643"],
      ["PAD", "151643", "151643", "<|im_end|>", "151643"],
      ["默认采样配置", "仅保留默认 token ID", "do_sample=true，`temperature=0.6`，`top_p=0.95`，`top_k=20`", "同 LegalOne", "同 LegalOne"],
      ["附带文件", "14 个文件，含权重和分词器", "18 个文件，含 README、图示", "根目录另含 3 个 checkpoint、约 87 MB LoRA、`trainer_state.json` 和约 15.26 GiB 的 FP16 GGUF", "16 个文件，含 LICENSE、README"],
    ]
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
    { model: "LegalOne-8B", lawbench: "791 / 7,992（约 9.90%）", lexeval: "28 / 11,400（约 0.25%）", note: "复杂题中出现未闭合 <think>。原报告标记的此类异常包括法条预测 360 例、事件检测 143 例、类案辨别 26 例" },
    { model: "qwen3_for_law", lawbench: "9 / 7,992（0.11%）", lexeval: "0 / 11,400（0.00%）", note: "实体识别模板中重复列出“未明确提及”等表述 4 例，有法条刑期预测异常 3 例" },
    { model: "Qwen3-8B 基座", lawbench: "0.15%", lexeval: "0.00%", note: "原报告给出汇总比例" },
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
        { task: "1-2 知识问答", dim: "L1", self: 74.4, selfAux: null, selfInvalid: "0.0%", rivalOne: 40.2, rivalTwo: 64.0, base: 62.8, deltaBase: 11.6, deltaRival: 10.4, best: "self" },
        { task: "2-1 文件校对", dim: "L2", self: 39.8, selfAux: 77.7, selfInvalid: "0.0%", rivalOne: 37.6, rivalTwo: 47.2, base: 43.4, deltaBase: -3.6, deltaRival: -7.4, best: null },
        { task: "2-2 纠纷焦点识别", dim: "L2", self: 45.16, selfAux: null, selfInvalid: "0.8%", rivalOne: 37.09, rivalTwo: 45.2, base: 45.4, deltaBase: -0.24, deltaRival: -0.04, best: null },
        { task: "2-3 婚姻纠纷鉴定", dim: "L2", self: 63.24, selfAux: 75.5, selfInvalid: "2.6%", rivalOne: 33.2, rivalTwo: 31.6, base: 35.8, deltaBase: 27.44, deltaRival: 30.04, best: "self" },
        { task: "2-4 问题主题识别", dim: "L2", self: 55.8, selfAux: null, selfInvalid: "0.0%", rivalOne: 14.0, rivalTwo: 38.6, base: 38.6, deltaBase: 17.2, deltaRival: 17.2, best: "self" },
        { task: "2-5 阅读理解", dim: "L2", self: 50.0, selfAux: 69.55, selfInvalid: "0.0%", rivalOne: 63.53, rivalTwo: 46.0, base: 49.0, deltaBase: 1.0, deltaRival: -13.53, best: null },
        { task: "2-6 命名实体识别", dim: "L2", self: 62.2, selfAux: 88.21, selfInvalid: "0.0%", rivalOne: 44.0, rivalTwo: 34.07, base: 34.2, deltaBase: 28.0, deltaRival: 18.2, best: "self" },
        { task: "2-8 论点挖掘", dim: "L2", self: 69.6, selfAux: null, selfInvalid: "0.0%", rivalOne: 58.6, rivalTwo: 55.2, base: 51.6, deltaBase: 18.0, deltaRival: 11.0, best: "self" },
        { task: "2-9 事件检测", dim: "L2", self: 78.76, selfAux: 87.35, selfInvalid: "0.2%", rivalOne: 82.7, rivalTwo: 59.92, base: 65.0, deltaBase: 13.76, deltaRival: -3.94, best: null },
        { task: "2-10 触发词提取", dim: "L2", self: 68.34, selfAux: 82.12, selfInvalid: "0.2%", rivalOne: 65.06, rivalTwo: 38.0, base: 48.6, deltaBase: 19.74, deltaRival: 3.28, best: "self" },
        { task: "3-1 法条预测", dim: "L3", self: 45.6, selfAux: 62.92, selfInvalid: "0.0%", rivalOne: 61.43, rivalTwo: 58.0, base: 54.2, deltaBase: -8.6, deltaRival: -15.83, best: null },
        { task: "3-3 罪名预测", dim: "L3", self: 58.8, selfAux: 70.29, selfInvalid: "0.0%", rivalOne: 53.2, rivalTwo: 44.0, base: 47.2, deltaBase: 11.6, deltaRival: 5.6, best: "self" },
        { task: "3-4 刑期预测（无法条）", dim: "L3", self: 20.97, selfAux: 51.16, selfInvalid: "0.0%", rivalOne: 12.1, rivalTwo: 14.95, base: 13.54, deltaBase: 7.43, deltaRival: 6.02, best: "self" },
        { task: "3-5 刑期预测（有法条）", dim: "L3", self: 20.16, selfAux: 49.75, selfInvalid: "0.0%", rivalOne: 11.72, rivalTwo: 9.53, base: 13.31, deltaBase: 6.85, deltaRival: 8.44, best: "self" },
        { task: "3-6 案例分析", dim: "L3", self: 70.2, selfAux: null, selfInvalid: "0.0%", rivalOne: 43.8, rivalTwo: 55.6, base: 53.0, deltaBase: 17.2, deltaRival: 14.6, best: "self" },
        { task: "3-7 犯罪金额计算", dim: "L3", self: 63.25, selfAux: 84.09, selfInvalid: "0.4%", rivalOne: 53.21, rivalTwo: 61.6, base: 54.2, deltaBase: 9.05, deltaRival: 1.65, best: "self" },
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
        { task: "1_1 法律概念", dim: "L1", count: "500", self: 56.0, rivalOne: 29.8, rivalTwo: 40.2, base: 41.0, deltaBase: 15.0, deltaRival: 15.8, best: "self" },
        { task: "1_2 法规查询", dim: "L1", count: "1,000", self: 88.8, rivalOne: 96.4, rivalTwo: 84.8, base: 82.5, deltaBase: 6.3, deltaRival: -7.6, best: null },
        { task: "1_3 法律演进", dim: "L1", count: "300", self: 46.33, rivalOne: 14.0, rivalTwo: 10.67, base: 13.0, deltaBase: 33.33, deltaRival: 32.33, best: "self" },
        { task: "2_1 要素识别", dim: "L2", count: "500", self: 94.4, rivalOne: 89.8, rivalTwo: 91.8, base: 89.6, deltaBase: 4.8, deltaRival: 2.6, best: "self" },
        { task: "2_2 事实验证", dim: "L2", count: "300", self: 57.0, rivalOne: 50.33, rivalTwo: 53.67, base: 52.0, deltaBase: 5.0, deltaRival: 3.33, best: "self" },
        { task: "2_3 阅读理解", dim: "L2", count: "100", self: 97.0, rivalOne: 89.0, rivalTwo: 95.0, base: 94.0, deltaBase: 3.0, deltaRival: 2.0, best: "self" },
        { task: "2_4 关系提取", dim: "L2", count: "500", self: 95.0, rivalOne: 97.4, rivalTwo: 84.2, base: 79.4, deltaBase: 15.6, deltaRival: -2.4, best: null },
        { task: "2_5 实体识别", dim: "L2", count: "500", self: 99.8, rivalOne: 92.0, rivalTwo: 97.8, base: 95.8, deltaBase: 4.0, deltaRival: 2.0, best: "self" },
        { task: "3_1 案由预测", dim: "L3", count: "1,000", self: 89.3, rivalOne: 79.3, rivalTwo: 80.2, base: 78.9, deltaBase: 10.4, deltaRival: 9.1, best: "self" },
        { task: "3_2 法条预测", dim: "L3", count: "1,000", self: 95.1, rivalOne: 95.8, rivalTwo: 91.1, base: 90.7, deltaBase: 4.4, deltaRival: -0.7, best: null },
        { task: "3_3 刑期预测", dim: "L3", count: "1,000", self: 84.9, rivalOne: 47.4, rivalTwo: 28.8, base: 36.6, deltaBase: 48.3, deltaRival: 37.5, best: "self" },
        { task: "3_4 多层推理", dim: "L3", count: "500", self: 45.29, rivalOne: 33.07, rivalTwo: 35.4, base: 34.6, deltaBase: 10.69, deltaRival: 9.89, best: "self" },
        { task: "3_5 法律计算", dim: "L3", count: "400", self: 56.75, rivalOne: 42.86, rivalTwo: 50.25, base: 53.75, deltaBase: 3.0, deltaRival: 6.5, best: "self" },
        { task: "3_6 论辩挖掘", dim: "L3", count: "500", self: 71.0, rivalOne: 53.4, rivalTwo: 60.4, base: 49.2, deltaBase: 21.8, deltaRival: 10.6, best: "self" },
        { task: "4_1 类案辨别", dim: "L4", count: "500", self: 45.0, rivalOne: 13.92, rivalTwo: 19.6, base: 26.6, deltaBase: 18.4, deltaRival: 25.4, best: "self" },
        { task: "4_2 文书质量", dim: "L4", count: "300", self: 47.33, rivalOne: 35.0, rivalTwo: 39.33, base: 39.33, deltaBase: 8.0, deltaRival: 8.0, best: "self" },
        { task: "6_1 偏见歧视", dim: "L6", count: "1,000", self: 74.6, rivalOne: 20.3, rivalTwo: 36.3, base: 41.2, deltaBase: 33.4, deltaRival: 38.3, best: "self" },
        { task: "6_2 道德", dim: "L6", count: "1,000", self: 71.6, rivalOne: 40.0, rivalTwo: 49.6, base: 52.3, deltaBase: 19.3, deltaRival: 22.0, best: "self" },
        { task: "6_3 隐私", dim: "L6", count: "500", self: 87.4, rivalOne: 53.4, rivalTwo: 70.8, base: 72.2, deltaBase: 15.2, deltaRival: 16.6, best: "self" },
      ]
    }
  ],

  verification: {
    rivalTotal: 35,
    rivalMatched: 24,
    rivalMismatched: 11,
    baseChecked: 35,
    baseMismatched: 0,
    rivalFormula: "V6 主分 − max(LegalOne-8B 主分, qwen3_for_law 主分)",
    rivalMismatchedTasks: ["1-2 知识问答", "2-3 婚姻纠纷鉴定", "2-4 问题主题识别", "2-6 命名实体识别", "2-8 论点挖掘", "2-10 触发词提取", "3-3 罪名预测", "3-4 刑期预测（无法条）", "3-5 刑期预测（有法条）", "3-6 案例分析", "3-7 犯罪金额计算"],
    proseCrossCheck: [
      { task: "2-3 婚姻纠纷鉴定", expected: 30.04, computed: 30.04, ok: true, quote: "V6 得 63.24，领先最高竞品 30.04 分" },
      { task: "2-6 命名实体识别", expected: 18.2, computed: 18.2, ok: true, quote: "领先 LegalOne 18.20 分" },
    ],
  },

  strengths: [
    { title: "8 个能力维度全部第一", body: "LawBench L1/L2/L3 与 LexEval L1/L2/L3/L4/L6 上均高于全部三个对手模型。" },
    { title: "35 项任务中 27 项取得最高分", body: "LawBench 11/16 项、LexEval 16/19 项按主分排名第一。" },
    { title: "无效回答率显著更低", body: "LawBench 21/7,992（0.26%）、LexEval 1/11,400（0.01%）；LegalOne-8B 同期为 9.90% 与 0.25%。" },
    { title: "非思考模式下输出稳定", body: "本次评测未记录到 <think> 泄漏。法条预测与事件检测平均输出 15.6 字与 20.7 字，LegalOne-8B 为 903 字与 1,303 字。" },
    { title: "法律伦理与类案辨别优势明显", body: "法律伦理维度 77.87，领先基座 22.63 分、领先 LegalOne-8B 39.97 分；类案辨别 45.00，高于基座 26.60。" },
    { title: "多选子集上全面领先", body: "LexEval 有 7 项任务未明确提示单选或多选，其中多选题占 39.8% 至 78.3%。V6 在全部 7 项的多选子集上均领先两款法律竞品：法律演进（1_3）的 235 道多选题中，V6 多选准确率 43.4%，LegalOne-8B 与 qwen3_for_law 均为 0。" },
  ],

  shortfalls: [
    { title: "文书校对：改动幅度偏大", body: "LawBench 2-1 主分 39.80，低于基座 43.40 与 qwen3_for_law 47.20。严格完全匹配 82/500，两者分别为 140/500 与 143/500。" },
    { title: "开放式法条预测：条号定位偏弱", body: "LawBench 3-1 得 45.60，低于基座 54.20 与 qwen3_for_law 58.00。500 题中完全命中 228 题、部分命中 132 题、零命中 140 题；全任务观察到 14 题误用提示词示例条号 128。" },
    { title: "抽取式阅读理解：信息完整度不足", body: "LawBench 2-5 主分 50.00、辅助分 69.55，低于 LegalOne-8B 的 63.53 与 79.92。在 LegalOne 答对而 V6 答错的 92 题中，V6 平均输出 31.3 字、LegalOne 为 100.6 字。" },
    { title: "指定条号查询：条号与条文错配", body: "LexEval 1_2 得 88.80，低于 LegalOne-8B 的 96.40。原报告抽查到产品责任追偿权（ID 24）、缺陷产品召回（ID 32）、占有保护请求权（ID 56）三题错配。" },
    { title: "开放式刑期预测：精确命中仅约两成", body: "LawBench 3-4 / 3-5 得分 20.97 / 20.16，加权接近度 51.16 / 49.75。3-4 错误样本平均绝对误差 21.8 个月。" },
    { title: "单选题边界：存在多选倾向", body: "法律演进与偏见歧视的部分单选题出现多选一个选项的情况，后续需补充单选边界样本。" },
    { title: "偏见歧视单选子集弱于 qwen3_for_law", body: "偏见歧视（6_1）上 qwen3_for_law 单选准确率 82.3%，高于 V6 的 67.5%；但在该任务的多选子集上 V6 为 77.1%，qwen3_for_law 仅 19.7%。" },
  ],

  errorCases: {
    title: "指定条号查询错例",
    columns: ["题目 ID", "题目涉及的罪名", "标准条号", "V6 输出"],
    rows: [
      ["24", "挪用资金", "272", "274"],
      ["80", "非法采矿", "343", "363、364"],
      ["120", "伪造货币、故意伤害", "170、234", "41、42、144、176"],
      ["112", "盗窃、非法占用农用地", "342、264", "128、342"],
    ]
  },

  extractMisses: {
    title: "信息抽取遗漏案例",
    columns: ["题目 ID", "要求", "V6 遗漏"],
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
      ["LegalOne-8B", "3-4、3-5 分别为 19.0、18.3 个月", "整体偏高，原报告列举了高估 277 例、低估 159 例"],
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

  modelNotes: [
    { model: "alpha_star_law_8B_v2", body: "本地权重目录 /sharedata/mdl/law_model/law_model_rl_8b_v6_8K。原报告中的「V6」指同一模型的内部版本名，本页统一写作 alpha_star_law_8B_v2。" },
    { model: "LegalOne-8B", body: "vocab_size 比标准 Qwen3-8B 多 640 个位置，实际词表与新增 token 文件中没有对应的新 token；按输入嵌入与输出头分别计算，增加参数 640 × 4096 × 2 = 5,242,880，原报告解释为训练平台的维度对齐填充。" },
    { model: "qwen3_for_law", body: "据 adapter_config.json 与 checkpoint-3375/trainer_state.json：PEFT 0.16.0，LoRA 秩 8、alpha 32、dropout 0.05，覆盖注意力与 MLP 中的 7 个线性层；训练 3 个 epoch、3,375 步，batch size 2，学习率 2e-5 余弦衰减，训练 loss 由 0.683 降至 0.380，原报告据此估算训练样本约 2,250 条。pad_token 改为 <|im_end|>。" },
    { model: "Qwen3-8B", body: "通用预训练基座，支持思考与非思考两种模式的后训练；本次评测对四个模型统一关闭思考模式。" },
  ],

  inferenceNote:
  "本报告依据本地模型权重和配置、LegalKit 评分汇总、逐题预测及异常记录整理。四个模型均通过 LegalKit 的 api8000 模式调用本地 OpenAI 兼容接口。\n\nLegalOne-8B 的 README 描述其生成方式为「先思考后回答」，与本次统一关闭思考的评测设置存在适配差异，相关输出问题见第 07 节。",

  fullScoreNote:
  "无效回答计 0 并保留在分母后，LawBench 上自研模型仍以 55.23 领先基座约 10.93 分、领先最高法律竞品 11.29 分；LegalOne-8B 则低于基座约 6.25 分。\n\n按全量分重新比较，自研模型在 LawBench 排名第一的任务由 11/16 增至 12/16 项；LegalOne-8B 仍在阅读理解中领先，qwen3_for_law 在文件校对和法条预测中领先。\n\nLegalOne-8B 在 LawBench 按主分获得第一的 3 项任务中，事件检测与开放式法条预测的无效率分别为 36.4% 和 72.0%，是其在全量分口径下让出第一的主要原因。",

  dimensionNote:
  "表中「较基座」按上表四舍五入后的数值计算，因此法律伦理维度为 22.64；原报告正文给出的表述是「V6 在各维度较基座提升 6.48 至 22.63 分」，差异来自取整。\n\nLegalOne-8B 按全量口径计算时，LawBench L2 和 L3 分别为 42.13 和 31.57，LexEval L3 和 L4 分别为 58.61 和 24.10，其余维度保留两位小数后与上表相同。",

  verifyNote:
  "「较最高竞品」列统一按公式 V6 主分 − max(LegalOne-8B 主分, qwen3_for_law 主分) 重算，通用基座不参与竞品比较。重算结果与原表逐项比对：35 行中 24 行与原表一致，另 11 行原表存的是口径不明的单值，本页不予沿用。\n\n报告正文另有两处原话可交叉验证：「V6 得 63.24，领先最高竞品 30.04 分」与「领先 LegalOne 18.20 分」，本页重算结果分别为 30.04 和 18.20，完全一致。★ 标记该任务四个模型中的最高分。",

  invalidNote:
  "无效回答指复读、思考标签未闭合、答案格式不可解析等无法按任务规则评分的情况，计入全量分时按 0 分处理。\n\n自研模型在 LawBench 的 21 例无效样本中，13 例来自 2-3 婚姻纠纷多标签判断的重复输出标签，占比约 62%；其余为多层推理的星号复读。\n\nLegalOne-8B 的 791 例中包含复杂题里未闭合的 <think> 标签，原报告标记的异常任务包括法条预测 360 例、事件检测 143 例、类案辨别 26 例。",

  lengthNote:
  "本次评测未记录到自研模型泄漏 <think>。较长输出与未闭合标签会增加下游解析负担；实际吞吐、延迟和 token 成本仍需独立测量。",

  notes: [
    { title: "数据来源与整理方式", tone: null, paras: [
      "本报告依据本地模型权重和配置、LegalKit 评分汇总、逐题预测及异常记录整理。",
      "原始文档为飞书云文档《alpha_star_law_8B_v2测试报告》，最近修改 2026-11-20。本页所有数值均取自该文档及其内嵌的 14 张电子表格，未做二次估算。",
    ]},
    { title: "主分与全量分的区别", tone: null, paras: [
      "主分（score）先剔除复读、思考标签未闭合等无效回答，再按任务规则评分；全量分把无效回答计 0 并保留在分母中。",
      "第 04、06 节的条形图与逐项表均为主分口径；全量分口径的对照见第 04 节。",
    ]},
    { title: "竞品差值的计算与核对", tone: "gap", paras: [
      "「较最高竞品」= V6 主分 − max(LegalOne-8B 主分, qwen3_for_law 主分)，通用基座不参与竞品比较。",
      "该公式在 35 行逐项结果中与原表一致的为 24 行；另 11 行原表存的是口径不明的单值，不予沿用。正文两处原话交叉验证一致。",
    ]},
    { title: "四舍五入说明", tone: null, paras: [
      "维度表中的差值按表中已取整的数值计算，法律伦理维度较基座为 22.64；原报告正文表述为「提升 6.48 至 22.63 分」，差异来自取整。",
    ]},
    { title: "评测设置的适配差异", tone: "gap", paras: [
      "LegalOne-8B 的 README 描述其生成方式为「先思考后回答」，与本次统一关闭思考的评测设置存在适配差异。",
      "LegalOne-8B 的 vocab_size 比标准 Qwen3-8B 多 640 个位置，实际词表与新增 token 文件中没有对应的新 token，原报告解释为训练平台的维度对齐填充。",
    ]},
    { title: "边界与未验证事项", tone: "gap", paras: [
      "实际吞吐、延迟与 token 成本未在本次评测中测量。",
      "开放式条号定位的表现是否与后训练阶段的知识漂移有关，需用训练前后的同口径对照验证。",
      "法条提示对刑期预测分数的影响，需控制题目与其他输入条件后单独验证。",
      "任务级分数只反映本次评测在单一设置下的表现，不能外推为模型在其他题型或其他数据集上的结论。",
    ]},
  ],

  metaRows: [
    { k: "报告名称", v: "《alpha_star_law_8B_v2测试报告》" },
    { k: "文档地址", v: "<a href=\"https://vcnvpk28tvue.feishu.cn/wiki/NlBFw1qwGib2GBktzjBcc5FqnLe\" target=\"_blank\" rel=\"noopener\">vcnvpk28tvue.feishu.cn/wiki/NlBFw1qwGib2GBktzjBcc5FqnLe</a>" },
    { k: "最近修改", v: "2026-11-20" },
    { k: "评测框架", v: "LegalKit · api8000 模式 · 本地 OpenAI 兼容接口" },
    { k: "评测集", v: "LawBench（16 项 / 7,992 题）· LexEval（19 项 / 11,400 题）" },
    { k: "参评模型", v: "alpha_star_law_8B_v2 · LegalOne-8B · qwen3_for_law · Qwen3-8B" },
    { k: "推理设置", v: "enable_thinking=false · temperature=0.1 · top_p=0.9 · max_tokens=4096" },
    { k: "页面性质", v: "公开项目主页 · 纯静态站点 · 无第三方依赖" },
  ],

  callout:
  "本页数值为原报告在统一关闭思考模式、单一评测时点下的结果，不构成对其他模型在其他数据集或其他推理设置下的结论。\n\n原始文档为内部飞书云文档，本页为公开转述版本；如遇数值不一致，以原始文档为准。",

  footerNote:
  "中国电子云自研法律大模型 alpha_star_law_8B_v2 的评测结果公开整理页。\n\n数据来源为飞书云文档《alpha_star_law_8B_v2测试报告》，页面所有数值均直接取自该文档及其内嵌表格，未做二次估算。",

};
