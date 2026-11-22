# alpha_star_law_8B_v2 评测报告

中国电子云自研法律大模型 **alpha_star_law_8B_v2** 在 **LawBench** 与 **LexEval** 两套中文法律评测集上的评测结果公开整理页。

在线地址：<https://cestc-real.github.io/legal-llm-test-report/>

---

## 核心结论

在四个模型**统一关闭思考模式**的条件下，alpha_star_law_8B_v2 在两套评测集上总分均为第一：

| 评测集 | alpha_star_law_8B_v2 | Qwen3-8B（基座） | LegalOne-8B | qwen3_for_law | 较基座 | 较最高竞品 |
|---|---:|---:|---:|---:|---:|---:|
| LawBench | **55.39** | 44.37 | 44.47 | 43.97 | +11.02（+24.84%） | +10.92（+24.56%） |
| LexEval | **73.82** | 59.09 | 56.48 | 58.94 | +14.73（+24.93%） | +14.88（+25.25%） |
| 两榜等权平均 | **64.61** | 51.73 | 50.48 | 51.46 | +12.88（+24.90%） | +13.15（+25.55%） |

- **8 个能力维度全部第一**（LawBench L1/L2/L3，LexEval L1/L2/L3/L4/L6），较基座提升 6.48 至 22.63 分。
- **35 项任务中 27 项取得最高分**：LawBench 11/16、LexEval 16/19。
- 覆盖 **19,392 道**题目（LawBench 7,992 题 / 16 项任务，LexEval 11,400 题 / 19 项任务）。
- 输出稳定性显著更好：LawBench 无效回答 21/7,992（0.26%）、LexEval 1/11,400（0.01%）；同期 LegalOne-8B 为 9.90% 与 0.25%。

> 「较最高竞品」= V6 主分 − max(LegalOne-8B 主分, qwen3_for_law 主分)，通用基座不参与竞品比较。

## 评测设置

| 项目 | 取值 |
|---|---|
| 评测框架 | LegalKit · api8000 模式 · 本地 OpenAI 兼容接口 |
| 推理设置 | `enable_thinking=false` · `temperature=0.1` · `top_p=0.9` · `max_tokens=4096` · `batch_size=16` · `num_workers=8` |
| 参评模型 | alpha_star_law_8B_v2 · LegalOne-8B · qwen3_for_law · Qwen3-8B |
| 模型架构 | Qwen3-8B 家族：36 层 Decoder-only、hidden_size 4096、intermediate_size 12288、GQA 32Q/8KV、head_dim 128、rope_theta 1e6、原生位置上限 40,960、BF16 权重 |

### 三种评分口径

| 指标 | 含义 |
|---|---|
| **主分 score** | 对应 `valid_accuracy` / `final_rate_valid`。先剔除复读、思考标签未闭合等无效回答，再按任务规则评分 |
| **全量分** | 无效回答计 0 并保留在分母中。对应 `total_accuracy` / `final_rate_total` |
| **辅助分 acc** | 部分任务提供的部分重合或加权接近度指标，用于衡量部分答对的情况 |

## 页面章节导览

| # | 章节 | 内容 |
|---|---|---|
| 01 | 评测结论 | 结论正文 + 6 张 KPI 卡 |
| 02 | 评测范围与评分口径 | 数据集构成、三种口径定义、统一推理设置 |
| 03 | 模型与权重配置 | 四个模型的来源、训练路线、权重与配置对照 |
| 04 | 总分对比 | 三榜条形对比 + 全量分口径对照 |
| 05 | 能力维度 | 八维度雷达图 + 维度明细 |
| 06 | 任务级明细 | 35 项任务逐项得分，★ 标记最高分归属 |
| 07 | 输出稳定性与典型错误 | 无效回答统计、输出长度对比、三类典型错误案例 |
| 08 | 亮点与短板 | 优势项与待改进项 |
| 09 | 说明与边界 | 数据口径、计算方式、边界与未验证事项 |

## 数据来源与可复现性

- **原始文档**：飞书云文档《alpha_star_law_8B_v2测试报告》，最近修改 2026-11-20。
- **原始数据**：该文档内嵌的 14 张电子表格，逐表导出为 CSV 存放于 [`data/`](./data)，即本仓库页面数值的唯一来源。
- **页面数值全部由脚本从 CSV 生成**，不手工转录。重新生成：

  ```bash
  python3 scripts/build_report_data.py data > assets/report.js
  ```

  该命令同时会在 stderr 输出口径自校验结果（见下）。

`data/` 中的 CSV 是 `lark-cli sheets +csv-get` 的原始导出，文件名前缀为文档内表格顺序，后缀为飞书表格 token：

```
00_models_MXFZxz.csv              08_error_cases_Nh1Sfv.csv
01_conclusion_wfphnF.csv          09_extract_misses_gqKZJp.csv
02_datasets_edhldx.csv             10_sentence_error_s4hPLc.csv
03_metrics_Gc3p90.csv             11_invalid_0KX5F3.csv
04_weights_AkAs4w.csv             12_lawbench_tasks_poLYUD.csv
05_total_main_hEB5n4.csv          13_lexeval_tasks_QbhYF4.csv
06_total_full_bh8hVP.csv
07_dimensions_8tOfy6.csv
```

### 口径自校验

生成器每次运行都会做三项校验，并把结果写进 `assets/report.js` 头部注释：

| 校验项 | 结果 |
|---|---|
| 「较基座」= V6 主分 − 基座主分 | 35 行中 **0 行**与原表不符 |
| 「较最高竞品」= V6 主分 − max(LegalOne, qwen3_for_law) | 35 行中 **24 行**与原表一致，另 **11 行**原表存的是口径不明的单值（见下） |
| 正文原话交叉验证 | 2/2 一致（「2-3 婚姻纠纷鉴定」30.04、「2-6 命名实体识别」18.20） |

**关于那 11 行**：附录 B 的「V6 较最高竞品」列存在两种形态——部分行是「主分 / 全量」双值，部分行只存了一个数值（`1`、`1.021768707`、`0.1312` 等）。后者口径不明，本页**不予沿用**，统一按公式重算，并在第 06 节页面末尾明确标注。

## 技术说明

- **纯静态站点**：无构建步骤、无第三方依赖，图表为原生 SVG 手绘，可直接用浏览器打开 `index.html`。
- 页面数据与渲染分离：`assets/report.js`（数据，自动生成）+ `assets/render.js`（渲染逻辑）。
- 部署：GitHub Actions（`.github/workflows/pages.yml`）在 `main` 分支推送后自动发布到 GitHub Pages。

```
.
├── index.html                 页面骨架
├── assets/
│   ├── style.css              样式（配色按功能分工：结构/自研/基座/竞品/语义）
│   ├── report.js              页面数据（自动生成，勿手改）
│   └── render.js              渲染层（原生 JS）
├── data/                      原始表格导出（CSV，页面数值的唯一来源）
├── scripts/
│   └── build_report_data.py   数据生成器（含口径自校验）
└── .github/workflows/pages.yml
```

## 边界与未验证事项

- 本页数值是原报告在**统一关闭思考模式、单一评测时点**下的结果，不构成对其他模型在其他数据集或其他推理设置下的结论。
- 实际吞吐、延迟与 token 成本**未在本次评测中测量**。
- 开放式条号定位的表现是否与后训练阶段的知识漂移有关，需用训练前后的同口径对照验证。
- 法条提示对刑期预测分数的影响，需控制题目与其他输入条件后单独验证。
- 任务级分数只反映本次评测在单一设置下的表现，不能外推为模型在其他题型或其他数据集上的结论。
- LegalOne-8B 的 README 描述其生成方式为「先思考后回答」，与本次统一关闭思考的评测设置存在适配差异。
- 原报告附录 B 中部分竞品差值单元格为口径不明的单值，本页按已验证公式统一重算并标注，不沿用原值。

## License

MIT，见 [LICENSE](./LICENSE)。
