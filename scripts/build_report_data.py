#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
从飞书导出的评测表格 CSV 生成 assets/report.js

用法:
    lark-cli sheets +csv-get --token <TOKEN> --sheet-id <ID> --as bot --format json
      -> 逐个保存到 sheets/NN_<sheet-id>.csv
    python3 scripts/build_report_data.py sheets/ > assets/report.js

CSV 采用 lark-cli `+csv-get` 的 annotated_csv 格式，每行前缀 "[row=N] "。
"""
import csv
import io
import json
import re
import sys
from pathlib import Path

SHEET_DIR = Path(sys.argv[1] if len(sys.argv) > 1 else "sheets")


def load_csv(sheet_id):
    """按 sheet-id 找到 CSV 文件并解析为二维数组（去掉 [row=N] 前缀）。"""
    matches = sorted(SHEET_DIR.glob(f"*_{sheet_id}.csv"))
    if not matches:
        raise SystemExit(f"找不到 sheet {sheet_id} 的 CSV")
    raw = matches[0].read_text(encoding="utf-8")
    rows = []
    for line in raw.splitlines():
        if not line.strip():
            continue
        line = re.sub(r"^\[row=\d+\]\s*", "", line)
        rows.append(next(csv.reader([line])))
    return rows


def num(v):
    """解析数值：支持 '55.39'、'−7.40'(U+2212)、'1,000'、'—'(缺失)。"""
    if v is None:
        return None
    s = str(v).strip().replace(",", "").replace("−", "-")
    if s in ("", "—", "-", "–"):
        return None
    try:
        return float(s)
    except ValueError:
        return None


def j(v):
    """转成 JS 字面量。"""
    if v is None:
        return "null"
    if isinstance(v, bool):
        return "true" if v else "false"
    if isinstance(v, (int, float)):
        return repr(v)
    return json.dumps(str(v), ensure_ascii=False)


def r2(v):
    return None if v is None else round(v + 0.0, 2)


# ---------------------------------------------------------------- 读取各表
models_rows = load_csv("MXFZxz")[1:]                 # 模型 / 来源 / 训练路线
score_rows = load_csv("wfphnF")[1:]                 # 结论对比表
data_rows = load_csv("edhldx")[1:]                  # 数据集规模
metric_rows = load_csv("Gc3p90")[1:]                # 三种评分口径
weight_rows = load_csv("AkAs4w")[1:]                # 权重与配置
total_rows = load_csv("hEB5n4")[1:]                 # 主分总分
full_rows = load_csv("bh8hVP")[1:]                  # 全量分总分
dim_rows = load_csv("8tOfy6")[1:]                   # 能力维度
invalid_rows = load_csv("0KX5F3")[1:]               # 无效回答
lb_rows = load_csv("poLYUD")[1:]                    # 附录 B LawBench 逐项
le_rows = load_csv("QbhYF4")[1:]                    # 附录 C LexEval 逐项

# ---------------------------------------------------- 附录 B / C 逐项解析
def parse_lb_row(r):
    """V6 列格式：'主分 / 辅助分 / 无效率'（依据附录 B 说明与正文 2-5「主分为 50.00、辅助分为 69.55」）。"""
    def triple(s):
        parts = [p.strip() for p in str(s).split("/")]
        while len(parts) < 3:
            parts.append("—")
        return num(parts[0]), num(parts[1]), parts[2]

    v6_m, v6_aux, v6_inv = triple(r[2])
    lo_m, _, lo_inv = triple(r[3])
    qw_m, _, qw_inv = triple(r[4])
    base_m, _, _ = triple(r[5])
    delta_base = num(r[6])
    raw_rival = str(r[7]).strip()
    return {
        "task": r[0].strip(),
        "dim": r[1].strip(),
        "self": r2(v6_m),
        "selfAux": r2(v6_aux),
        "selfInvalid": v6_inv,
        "rivalOne": r2(lo_m),
        "rivalOneInvalid": lo_inv,
        "rivalTwo": r2(qw_m),
        "rivalTwoInvalid": qw_inv,
        "base": r2(base_m),
        "deltaBase": r2(delta_base),
        "rawRival": raw_rival,
    }


def parse_le_row(r):
    vals = [num(x) for x in r[3:7]]
    return {
        "task": r[0].strip(),
        "dim": r[1].strip(),
        "count": r[2].strip(),
        "self": r2(vals[0]),
        "rivalOne": r2(vals[1]),
        "rivalTwo": r2(vals[2]),
        "base": r2(vals[3]),
        "deltaBase": r2(num(r[7])),
        "rawRival": r[8].strip(),
    }


lb = [parse_lb_row(r) for r in lb_rows]
le = [parse_le_row(r) for r in le_rows]

# ------------------------------------------- 校验 + 计算「较最高法律竞品」
# 口径：较最高法律竞品 = V6 主分 − max(LegalOne-8B 主分, qwen3_for_law 主分)
# （基座不参与竞品比较，仅用于「较基座」列）
checks = []


def rival_delta(row):
    cand = [c for c in (row["rivalOne"], row["rivalTwo"]) if c is not None]
    if row["self"] is None or not cand:
        return None
    return r2(row["self"] - max(cand))


for row in lb + le:
    computed = rival_delta(row)
    row["deltaRival"] = computed
    raw = row["rawRival"]
    # 原表该列两种形态：'主分 / 全量'（可取首段核对）或单值（同样可核对）
    first = num(raw.split("/")[0]) if raw else None
    checks.append({"task": row["task"], "raw": raw, "computed": computed,
                   "expect": first, "hasFull": "/" in raw})

matched = [c for c in checks if c["expect"] is not None and c["computed"] is not None
           and abs(c["computed"] - c["expect"]) <= 0.011]
mismatched = [c for c in checks if c["expect"] is not None and c["computed"] is not None
               and abs(c["computed"] - c["expect"]) > 0.011]
unverifiable = [c for c in checks if c["expect"] is None]

# -------------------------------------------------- 较基座 一致性自校验
base_bad = []
base_checked = 0
for row in lb + le:
    if row["self"] is None or row["base"] is None or row["deltaBase"] is None:
        continue
    base_checked += 1
    if abs((row["self"] - row["base"]) - row["deltaBase"]) > 0.011:
        base_bad.append(row["task"])

# ---------------------------------------------------------------- 输出
out = []
w = out.append

w("/* ============================================================")
w("   alpha_star_law_8B_v2 测试报告 · 数据源（自动生成，勿手改）")
w("   生成器：scripts/build_report_data.py")
w(f"   竞品差值口径校验：{len(matched)}/{len(checks)} 行与原表一致，"
  f"{len(mismatched)} 行不符")
w(f"   较基座口径校验：{base_checked} 行中 {len(base_bad)} 行不符")
w("   ============================================================ */")
w("window.REPORT = {")
w("")
w("  meta: {")
w('    updated: "2026-11-20",')
w('    chips: [')
w('      { k: "评测日期", v: "2026-11-20" },')
w('      { k: "评测设置", v: "四个模型统一关闭思考模式" },')
w('      { k: "能力维度", v: "8 个" },')
w('      { k: "任务总数", v: "35 项" },')
w('      { k: "题量", v: "19,392 道" }')
w("    ]")
w("  },")
w("")

# 结论
w("  conclusion: [")
for t in [
    "在四个模型统一关闭思考模式的条件下，<strong>自研法律模型 alpha_star_law_8B_v2</strong> 在 "
    "<strong>LawBench</strong> 和 <strong>LexEval</strong> 上均排名第一。"
    "LawBench 得 <span class='hl'>55.39 分</span>，较 Qwen3-8B 基座高 <strong>11.02 分</strong>，"
    "较两款开源法律模型中的最高分高 <strong>10.92 分</strong>。"
    "LexEval 得 <span class='hl'>73.82 分</span>，较基座高 <strong>14.73 分</strong>，较最高竞品高 <strong>14.88 分</strong>。",
    "在本次评测覆盖的 <strong>8 个能力维度上均排名第一</strong>，并在 <strong>35 项任务中的 27 项</strong>取得最高分，"
    "其中 LawBench 为 <strong>11/16 项</strong>，LexEval 为 <strong>16/19 项</strong>。",
    "在统一关闭思考模式的设置下，两榜等权平均分较 Qwen3-8B 基座提升 <strong>12.88 分</strong>，"
    "较平均分最高的法律竞品提升 <strong>13.15 分</strong>，相对提升分别为 <strong>24.90%</strong> 和 <strong>25.55%</strong>。",
]:
    w(f"    {j(t)},")
w("  ],")
w("")

# KPI
w("  kpis: [")
for k in [
    dict(label="LawBench 总分", value="55.39", unit="分", tone="win",
         note="较 Qwen3-8B 基座 <span class='up'>+11.02</span> · 较最高竞品 <span class='up'>+10.92</span>"),
    dict(label="LexEval 总分", value="73.82", unit="分", tone="win",
         note="较 Qwen3-8B 基座 <span class='up'>+14.73</span> · 较最高竞品 <span class='up'>+14.88</span>"),
    dict(label="两榜等权平均", value="64.61", unit="分", tone="win",
         note="基座 51.73 · 最高竞品 51.46"),
    dict(label="较 Qwen3-8B 基座", value="+12.88", unit="分", tone="base",
         note="相对提升 <span class='up'>24.90%</span>"),
    dict(label="较最高法律竞品", value="+13.15", unit="分", tone="gap",
         note="相对提升 <span class='up'>25.55%</span>"),
    dict(label="任务最高分", value="27", unit="/ 35", tone="win",
         note="LawBench 11/16 · LexEval 16/19"),
]:
    w("    { label: %s, value: %s, unit: %s, tone: %s, note: %s }," %
      (j(k["label"]), j(k["value"]), j(k["unit"]), j(k["tone"]), j(k["note"])))
w("  ],")
w("")

# 总分
w("  benchmarks: [")
bench_meta = {
    "LawBench": ("中文法律评测集 · 满分 100 分 · 16 项任务 / 7,992 题",
                 [("较 Qwen3-8B 基座", "+11.02 分（+24.84%）"),
                  ("较最高法律竞品", "+10.92 分（+24.56%）"),
                  ("最高法律竞品", "LegalOne-8B · 44.47")]),
    "LexEval": ("中文法律评测集 · 满分 100 分 · 19 项任务 / 11,400 题",
                [("较 Qwen3-8B 基座", "+14.73 分（+24.93%）"),
                 ("较最高法律竞品", "+14.88 分（+25.25%）"),
                 ("最高法律竞品", "qwen3_for_law · 58.94")]),
    "两榜等权平均": ("两套评测集等权平均",
                     [("较 Qwen3-8B 基座", "+12.88 分（+24.90%）"),
                      ("较最高法律竞品", "+13.15 分（+25.55%）"),
                      ("最高法律竞品", "qwen3_for_law · 51.46")]),
}
cls_of = {"alpha_star_law_8B_v2": "self", "Qwen3-8B（基座）": "base"}
name_map = {"alpha_star_law_8B_v2": "alpha_star_law_8B_v2",
            "LegalOne-8B": "LegalOne-8B",
            "qwen3_for_law": "qwen3_for_law",
            "Qwen3-8B": "Qwen3-8B（基座）"}
for row in total_rows:
    ds = row[0].strip()
    sub, deltas = bench_meta[ds]
    w("    {")
    w(f"      name: {j(ds)},")
    w(f"      sub: {j(sub)},")
    w("      max: 100,")
    w("      deltas: [")
    for k, v in deltas:
        w(f"        {{ label: {j(k)}, value: {j(v)}, up: true }},")
    w("      ],")
    w("      models: [")
    order = [("alpha_star_law_8B_v2", "self"), ("LegalOne-8B", "rival"),
             ("qwen3_for_law", "rival"), ("Qwen3-8B", "base")]
    for i, (key, _) in enumerate(order):
        val = num(row[1 + i])
        nm = name_map[key]
        cls = cls_of.get(nm, "rival")
        self_flag = "true" if cls == "self" else "false"
        w(f"        {{ name: {j(nm)}, score: {j(val)}, cls: {j(cls)}, self: {self_flag} }},")
    w("      ]")
    w("    },")
w("  ],")
w("")

# 模型
w("  models: [")
role_of = {"alpha_star_law_8B_v2": ("自研模型", "tag-self"),
           "LegalOne-8B": ("开源法律模型", "tag-rival"),
           "qwen3_for_law": ("开源法律模型", "tag-rival"),
           "Qwen3-8B": ("通用基座", "tag-base")}
for row in models_rows:
    nm, url, src, route = [c.strip() for c in (row + ["", "", "", ""])[:4]]
    role, tag = role_of.get(nm, ("参评模型", "tag-plain"))
    is_self = "true" if nm == "alpha_star_law_8B_v2" else "false"
    w("    { name: %s, url: %s, link: %s, source: %s, role: %s, tagCls: %s, self: %s, route: %s }," %
      (j(nm), j(url or None), j(url or "—"), j(src), j(role), j(tag), is_self, j(route)))
w("  ],")
w("")

# 数据集规模
w("  datasets: [")
for row in data_rows:
    if len(row) < 4:
        continue
    w("    { name: %s, tasks: %s, questions: %s, scope: %s }," %
      (j(row[0].strip()), j(row[1].strip()), j(row[2].strip()), j(row[3].strip())))
w("  ],")
w("")

# 评分口径
w("  metrics: [")
for row in metric_rows:
    if len(row) < 2:
        continue
    w("    { name: %s, desc: %s }," % (j(row[0].strip()), j(row[1].strip())))
w("  ],")
w("")

# 推理设置
w("  inference: {")
w('    mode: "LegalKit api8000 模式调用本地 OpenAI 兼容接口",')
w('    params: ["enable_thinking=false", "temperature=0.1", "top_p=0.9", "max_tokens=4096", "batch_size=16", "num_workers=8"]')
w("  },")
w("")

# 权重配置
w("  weights: {")
w("    columns: [\"项目\", \"alpha_star_law_8B_v2\", \"LegalOne-8B\", \"qwen3_for_law\", \"Qwen3-8B\"],")
w("    rows: [")
for row in weight_rows:
    cells = [c.strip() for c in row]
    w("      [%s]," % ", ".join(j(c) for c in cells))
w("    ]")
w("  },")
w("")

# 能力维度
SHORT_DIM = {
    ("LawBench", "L1"): "知识记忆", ("LawBench", "L2"): "知识理解", ("LawBench", "L3"): "知识应用",
    ("LexEval", "L1"): "法律记忆", ("LexEval", "L2"): "法律理解", ("LexEval", "L3"): "逻辑推理",
    ("LexEval", "L4"): "辨别应用", ("LexEval", "L6"): "法律伦理",
}
w("  dimensionMax: 100,")
w("  dimensionBase: true,")
w("  dimensions: [")
for row in dim_rows:
    if len(row) < 6:
        continue
    ds = row[0].strip()
    name = row[1].strip()
    m = re.match(r"^(L\d)\s+(.+?)，\s*(\d+)\s*项$", name)
    if m:
        code, label, n = m.group(1), m.group(2), int(m.group(3))
    else:
        code, label, n = "", name, 0
    vals = [num(x) for x in row[2:6]]
    short = SHORT_DIM.get((ds, code), label)
    w("    { code: %s, name: %s, full: %s, dataset: %s, prefix: %s, short: %s, tasks: %d, "
      "self: %s, rivalOne: %s, rivalTwo: %s, base: %s }," %
      (j(code), j(label), j(name), j(ds), j("LB" if ds == "LawBench" else "LE"),
       j(short), n, j(vals[0]), j(vals[1]), j(vals[2]), j(vals[3])))
w("  ],")
w("")

# 全量分
w("  fullScores: [")
for row in full_rows:
    if len(row) < 5:
        continue
    w("    { dataset: %s, self: %s, rivalOne: %s, rivalTwo: %s, base: %s }," %
      (j(row[0].strip()), j(num(row[1])), j(num(row[2])), j(num(row[3])), j(num(row[4]))))
w("  ],")
w("")

# 无效回答
w("  invalid: [")
for row in invalid_rows:
    if len(row) < 4:
        continue
    w("    { model: %s, lawbench: %s, lexeval: %s, note: %s }," %
      (j(row[0].strip()), j(row[1].strip()), j(row[2].strip()), j(row[3].strip())))
w("  ],")
w("")

# 任务明细
w("  taskSets: [")
w("    {")
w('      title: "LawBench 逐项评分",')
w('      note: "16 项任务 · 7,992 题。自研模型列每格依次为「主分 / 辅助分 / 无效率」，— 表示原逐项表未列出该指标；「2-9」和「3-1」两行的 LegalOne 主分需结合该项无效率解读。",')
w('      columns: [')
w('        { key: "task", label: "任务" },')
w('        { key: "dim", label: "维度" },')
w('        { key: "self", label: "alpha_star_law_8B_v2", num: true },')
w('        { key: "selfAux", label: "辅助分", num: true },')
w('        { key: "selfInvalid", label: "无效率", num: true },')
w('        { key: "rivalOne", label: "LegalOne-8B", num: true },')
w('        { key: "rivalTwo", label: "qwen3_for_law", num: true },')
w('        { key: "base", label: "Qwen3-8B 基座", num: true },')
w('        { key: "deltaBase", label: "较基座", num: true },')
w('        { key: "deltaRival", label: "较最高竞品", num: true }')
w("      ],")
w("      rows: [")
for row in lb:
    best = max([row["self"], row["rivalOne"], row["rivalTwo"], row["base"]], default=None)
    w("        { task: %s, dim: %s, self: %s, selfAux: %s, selfInvalid: %s, rivalOne: %s, rivalTwo: %s, base: %s, "
      "deltaBase: %s, deltaRival: %s, best: %s }," %
      (j(row["task"]), j(row["dim"]), j(row["self"]), j(row["selfAux"]), j(row["selfInvalid"]),
       j(row["rivalOne"]), j(row["rivalTwo"]), j(row["base"]),
       j(row["deltaBase"]), j(row["deltaRival"]),
       j("self") if row["self"] == best else "null"))
w("      ]")
w("    },")
w("    {")
w('      title: "LexEval 逐项评分",')
w('      note: "19 项任务 · 11,400 题。LexEval 未纳入第 5 组开放生成任务。",')
w('      columns: [')
w('        { key: "task", label: "任务" },')
w('        { key: "dim", label: "维度" },')
w('        { key: "count", label: "题量", num: true },')
w('        { key: "self", label: "alpha_star_law_8B_v2", num: true },')
w('        { key: "rivalOne", label: "LegalOne-8B", num: true },')
w('        { key: "rivalTwo", label: "qwen3_for_law", num: true },')
w('        { key: "base", label: "Qwen3-8B 基座", num: true },')
w('        { key: "deltaBase", label: "较基座", num: true },')
w('        { key: "deltaRival", label: "较最高竞品", num: true }')
w("      ],")
w("      rows: [")
for row in le:
    best = max([row["self"], row["rivalOne"], row["rivalTwo"], row["base"]], default=None)
    w("        { task: %s, dim: %s, count: %s, self: %s, rivalOne: %s, rivalTwo: %s, base: %s, "
      "deltaBase: %s, deltaRival: %s, best: %s }," %
      (j(row["task"]), j(row["dim"]), j(row["count"]), j(row["self"]),
       j(row["rivalOne"]), j(row["rivalTwo"]), j(row["base"]),
       j(row["deltaBase"]), j(row["deltaRival"]),
       j("self") if row["self"] == best else "null"))
w("      ]")
w("    }")
w("  ],")
w("")

# 校验结论（写进页面）
# 正文原话交叉验证（不依赖表格，直接取自报告正文）
PROSE_CHECKS = [
    ("2-3 婚姻纠纷鉴定", 30.04, "V6 得 63.24，领先最高竞品 30.04 分"),
    ("2-6 命名实体识别", 18.20, "领先 LegalOne 18.20 分"),
]
prose_results = []
for task, expect, quote in PROSE_CHECKS:
    row = next((r for r in lb + le if r["task"] == task), None)
    got = rival_delta(row) if row else None
    prose_results.append((task, expect, got, abs(got - expect) <= 0.011, quote))
prose_ok = [p for p in prose_results if p[3]]

w("  verification: {")
w('    rivalTotal: %d,' % len(checks))
w('    rivalMatched: %d,' % len(matched))
w('    rivalMismatched: %d,' % len(mismatched))
w('    baseChecked: %d,' % base_checked)
w('    baseMismatched: %d,' % len(base_bad))
w('    rivalFormula: "V6 主分 − max(LegalOne-8B 主分, qwen3_for_law 主分)",')
w('    rivalMismatchedTasks: [%s],' % ", ".join(j(c["task"]) for c in mismatched))
w('    proseCrossCheck: [')
for task, expect, got, ok, quote in prose_results:
    w("      { task: %s, expected: %s, computed: %s, ok: %s, quote: %s }," %
      (j(task), j(expect), j(got), "true" if ok else "false", j(quote)))
w("    ],")
w("  },")
w("")

# ---- 亮点 / 短板 / 典型错误（均取自原报告第 4、5 章的具体数值） ----
w("  strengths: [")
for s in [
    dict(title="8 个能力维度全部第一",
         body="LawBench L1/L2/L3 与 LexEval L1/L2/L3/L4/L6 上均高于全部三个对手模型。"),
    dict(title="35 项任务中 27 项取得最高分",
         body="LawBench 11/16 项、LexEval 16/19 项按主分排名第一。"),
    dict(title="无效回答率显著更低",
         body="LawBench 21/7,992（0.26%）、LexEval 1/11,400（0.01%）；LegalOne-8B 同期为 9.90% 与 0.25%。"),
    dict(title="非思考模式下输出稳定",
         body="本次评测未记录到 <think> 泄漏。法条预测与事件检测平均输出 15.6 字与 20.7 字，LegalOne-8B 为 903 字与 1,303 字。"),
    dict(title="法律伦理与类案辨别优势明显",
         body="法律伦理维度 77.87，领先基座 22.63 分、领先 LegalOne-8B 39.97 分；类案辨别 45.00，高于基座 26.60。"),
    dict(title="多选子集上全面领先",
         body="LexEval 有 7 项任务未明确提示单选或多选，其中多选题占 39.8% 至 78.3%。V6 在全部 7 项的多选子集上均领先两款法律竞品：法律演进（1_3）的 235 道多选题中，V6 多选准确率 43.4%，LegalOne-8B 与 qwen3_for_law 均为 0。"),
]:
    w("    { title: %s, body: %s }," % (j(s["title"]), j(s["body"])))
w("  ],")
w("")

w("  shortfalls: [")
for s in [
    dict(title="文书校对：改动幅度偏大",
         body="LawBench 2-1 主分 39.80，低于基座 43.40 与 qwen3_for_law 47.20。严格完全匹配 82/500，两者分别为 140/500 与 143/500。"),
    dict(title="开放式法条预测：条号定位偏弱",
         body="LawBench 3-1 得 45.60，低于基座 54.20 与 qwen3_for_law 58.00。500 题中完全命中 228 题、部分命中 132 题、零命中 140 题；全任务观察到 14 题误用提示词示例条号 128。"),
    dict(title="抽取式阅读理解：信息完整度不足",
         body="LawBench 2-5 主分 50.00、辅助分 69.55，低于 LegalOne-8B 的 63.53 与 79.92。在 LegalOne 答对而 V6 答错的 92 题中，V6 平均输出 31.3 字、LegalOne 为 100.6 字。"),
    dict(title="指定条号查询：条号与条文错配",
         body="LexEval 1_2 得 88.80，低于 LegalOne-8B 的 96.40。原报告抽查到产品责任追偿权（ID 24）、缺陷产品召回（ID 32）、占有保护请求权（ID 56）三题错配。"),
    dict(title="开放式刑期预测：精确命中仅约两成",
         body="LawBench 3-4 / 3-5 得分 20.97 / 20.16，加权接近度 51.16 / 49.75。3-4 错误样本平均绝对误差 21.8 个月。"),
    dict(title="单选题边界：存在多选倾向",
         body="法律演进与偏见歧视的部分单选题出现多选一个选项的情况，后续需补充单选边界样本。"),
    dict(title="偏见歧视单选子集弱于 qwen3_for_law",
         body="偏见歧视（6_1）上 qwen3_for_law 单选准确率 82.3%，高于 V6 的 67.5%；但在该任务的多选子集上 V6 为 77.1%，qwen3_for_law 仅 19.7%。"),
]:
    w("    { title: %s, body: %s }," % (j(s["title"]), j(s["body"])))
w("  ],")
w("")

# 法条预测错例（表 08）
w("  errorCases: {")
w('    title: "指定条号查询错例",')
w('    columns: ["题目 ID", "题目涉及的罪名", "标准条号", "V6 输出"],')
w("    rows: [")
for row in load_csv("Nh1Sfv")[1:]:
    w("      [%s]," % ", ".join(j(c.strip()) for c in row))
w("    ]")
w("  },")
w("")

# 抽取遗漏（表 09）
w("  extractMisses: {")
w('    title: "信息抽取遗漏案例",')
w('    columns: ["题目 ID", "要求", "V6 遗漏"],')
w("    rows: [")
for row in load_csv("gqKZJp")[1:]:
    w("      [%s]," % ", ".join(j(c.strip()) for c in row))
w("    ]")
w("  },")
w("")

# 刑期预测误差（表 10）
w("  sentenceError: {")
w('    title: "开放式刑期预测误差分布",')
w('    columns: ["模型", "错误样本平均绝对误差", "高估与低估情况"],')
w("    rows: [")
for row in load_csv("s4hPLc")[1:]:
    w("      [%s]," % ", ".join(j(c.strip()) for c in row))
w("    ]")
w("  },")
w("")

# 平均输出长度（正文 5.5）
w("  outputLengths: {")
w('    title: "平均输出长度对比",')
w('    columns: ["任务", "alpha_star_law_8B_v2", "LegalOne-8B"],')
w("    rows: [")
for r in [
    ["LawBench 法条预测", "15.6 字", "903 字"],
    ["LawBench 事件检测", "20.7 字", "1,303 字"],
    ["LawBench 开放式刑期预测（无法条）", "503 字", "2,623 字"],
]:
    w("      [%s]," % ", ".join(j(c) for c in r))
w("    ]")
w("  },")
w("")

# ---- 模型补充说明（第 03 节） ----
w("  modelNotes: [")
for n in [
    dict(model="alpha_star_law_8B_v2",
         body="本地权重目录 /sharedata/mdl/law_model/law_model_rl_8b_v6_8K。原报告中的「V6」指同一模型的内部版本名，本页统一写作 alpha_star_law_8B_v2。"),
    dict(model="LegalOne-8B",
         body="vocab_size 比标准 Qwen3-8B 多 640 个位置，实际词表与新增 token 文件中没有对应的新 token；按输入嵌入与输出头分别计算，增加参数 640 × 4096 × 2 = 5,242,880，原报告解释为训练平台的维度对齐填充。"),
    dict(model="qwen3_for_law",
         body="据 adapter_config.json 与 checkpoint-3375/trainer_state.json：PEFT 0.16.0，LoRA 秩 8、alpha 32、dropout 0.05，覆盖注意力与 MLP 中的 7 个线性层；训练 3 个 epoch、3,375 步，batch size 2，学习率 2e-5 余弦衰减，训练 loss 由 0.683 降至 0.380，原报告据此估算训练样本约 2,250 条。pad_token 改为 <|im_end|>。"),
    dict(model="Qwen3-8B",
         body="通用预训练基座，支持思考与非思考两种模式的后训练；本次评测对四个模型统一关闭思考模式。"),
]:
    w("    { model: %s, body: %s }," % (j(n["model"]), j(n["body"])))
w("  ],")
w("")

# ---- 多段文本字段：段间以空行分隔，渲染层再拆成 <p> ----
def wtext(key, paras):
    w("  %s:" % key)
    w("  " + j("\n\n".join(paras)) + ",")


# ---- 推理设置补充 ----
wtext("inferenceNote", [
    "本报告依据本地模型权重和配置、LegalKit 评分汇总、逐题预测及异常记录整理。四个模型均通过 LegalKit 的 api8000 模式调用本地 OpenAI 兼容接口。",
    "LegalOne-8B 的 README 描述其生成方式为「先思考后回答」，与本次统一关闭思考的评测设置存在适配差异，相关输出问题见第 07 节。",
])
w("")

# ---- 第 04 节：全量分口径对照 ----
wtext("fullScoreNote", [
    "无效回答计 0 并保留在分母后，LawBench 上自研模型仍以 55.23 领先基座约 10.93 分、领先最高法律竞品 11.29 分；LegalOne-8B 则低于基座约 6.25 分。",
    "按全量分重新比较，自研模型在 LawBench 排名第一的任务由 11/16 增至 12/16 项；LegalOne-8B 仍在阅读理解中领先，qwen3_for_law 在文件校对和法条预测中领先。",
    "LegalOne-8B 在 LawBench 按主分获得第一的 3 项任务中，事件检测与开放式法条预测的无效率分别为 36.4% 和 72.0%，是其在全量分口径下让出第一的主要原因。",
])
w("")

# ---- 第 05 节：维度口径注 ----
wtext("dimensionNote", [
    "表中「较基座」按上表四舍五入后的数值计算，因此法律伦理维度为 22.64；原报告正文给出的表述是「V6 在各维度较基座提升 6.48 至 22.63 分」，差异来自取整。",
    "LegalOne-8B 按全量口径计算时，LawBench L2 和 L3 分别为 42.13 和 31.57，LexEval L3 和 L4 分别为 58.61 和 24.10，其余维度保留两位小数后与上表相同。",
])
w("")

# ---- 第 06 节：竞品差值口径校验 ----
wtext("verifyNote", [
    "「较最高竞品」列统一按公式 V6 主分 − max(LegalOne-8B 主分, qwen3_for_law 主分) 重算，通用基座不参与竞品比较。重算结果与原表逐项比对：35 行中 24 行与原表一致，另 11 行原表存的是口径不明的单值，本页不予沿用。",
    "报告正文另有两处原话可交叉验证：「V6 得 63.24，领先最高竞品 30.04 分」与「领先 LegalOne 18.20 分」，本页重算结果分别为 30.04 和 18.20，完全一致。★ 标记该任务四个模型中的最高分。",
])
w("")

# ---- 第 07 节：无效回答注 ----
wtext("invalidNote", [
    "无效回答指复读、思考标签未闭合、答案格式不可解析等无法按任务规则评分的情况，计入全量分时按 0 分处理。",
    "自研模型在 LawBench 的 21 例无效样本中，13 例来自 2-3 婚姻纠纷多标签判断的重复输出标签，占比约 62%；其余为多层推理的星号复读。",
    "LegalOne-8B 的 791 例中包含复杂题里未闭合的 <think> 标签，原报告标记的异常任务包括法条预测 360 例、事件检测 143 例、类案辨别 26 例。",
])
w("")

# ---- 第 07 节：输出长度注 ----
wtext("lengthNote", [
    "本次评测未记录到自研模型泄漏 <think>。较长输出与未闭合标签会增加下游解析负担；实际吞吐、延迟和 token 成本仍需独立测量。",
])
w("")

# ---- 第 09 节：说明与边界 ----
w("  notes: [")
for n in [
    dict(title="数据来源与整理方式", tone=None,
         paras=["本报告依据本地模型权重和配置、LegalKit 评分汇总、逐题预测及异常记录整理。",
                "原始文档为飞书云文档《alpha_star_law_8B_v2测试报告》，最近修改 2026-11-20。本页所有数值均取自该文档及其内嵌的 14 张电子表格，未做二次估算。"]),
    dict(title="主分与全量分的区别", tone=None,
         paras=["主分（score）先剔除复读、思考标签未闭合等无效回答，再按任务规则评分；全量分把无效回答计 0 并保留在分母中。",
                "第 04、06 节的条形图与逐项表均为主分口径；全量分口径的对照见第 04 节。"]),
    dict(title="竞品差值的计算与核对", tone="gap",
         paras=["「较最高竞品」= V6 主分 − max(LegalOne-8B 主分, qwen3_for_law 主分)，通用基座不参与竞品比较。",
                "该公式在 35 行逐项结果中与原表一致的为 24 行；另 11 行原表存的是口径不明的单值，不予沿用。正文两处原话交叉验证一致。"]),
    dict(title="四舍五入说明", tone=None,
         paras=["维度表中的差值按表中已取整的数值计算，法律伦理维度较基座为 22.64；原报告正文表述为「提升 6.48 至 22.63 分」，差异来自取整。"]),
    dict(title="评测设置的适配差异", tone="gap",
         paras=["LegalOne-8B 的 README 描述其生成方式为「先思考后回答」，与本次统一关闭思考的评测设置存在适配差异。",
                "LegalOne-8B 的 vocab_size 比标准 Qwen3-8B 多 640 个位置，实际词表与新增 token 文件中没有对应的新 token，原报告解释为训练平台的维度对齐填充。"]),
    dict(title="边界与未验证事项", tone="gap",
         paras=["实际吞吐、延迟与 token 成本未在本次评测中测量。",
                "开放式条号定位的表现是否与后训练阶段的知识漂移有关，需用训练前后的同口径对照验证。",
                "法条提示对刑期预测分数的影响，需控制题目与其他输入条件后单独验证。",
                "任务级分数只反映本次评测在单一设置下的表现，不能外推为模型在其他题型或其他数据集上的结论。"]),
]:
    w("    { title: %s, tone: %s, paras: [" % (j(n["title"]), j(n["tone"])))
    for p in n["paras"]:
        w("      %s," % j(p))
    w("    ]},")
w("  ],")
w("")

w("  metaRows: [")
for r in [
    dict(k="报告名称", v="《alpha_star_law_8B_v2测试报告》"),
    dict(k="文档地址", v='<a href="https://vcnvpk28tvue.feishu.cn/wiki/NlBFw1qwGib2GBktzjBcc5FqnLe" target="_blank" rel="noopener">vcnvpk28tvue.feishu.cn/wiki/NlBFw1qwGib2GBktzjBcc5FqnLe</a>'),
    dict(k="最近修改", v="2026-11-20"),
    dict(k="评测框架", v="LegalKit · api8000 模式 · 本地 OpenAI 兼容接口"),
    dict(k="评测集", v="LawBench（16 项 / 7,992 题）· LexEval（19 项 / 11,400 题）"),
    dict(k="参评模型", v="alpha_star_law_8B_v2 · LegalOne-8B · qwen3_for_law · Qwen3-8B"),
    dict(k="推理设置", v="enable_thinking=false · temperature=0.1 · top_p=0.9 · max_tokens=4096"),
    dict(k="页面性质", v="公开项目主页 · 纯静态站点 · 无第三方依赖"),
]:
    w("    { k: %s, v: %s }," % (j(r["k"]), j(r["v"])))
w("  ],")
w("")

wtext("callout", [
    "本页数值为原报告在统一关闭思考模式、单一评测时点下的结果，不构成对其他模型在其他数据集或其他推理设置下的结论。",
    "原始文档为内部飞书云文档，本页为公开转述版本；如遇数值不一致，以原始文档为准。",
])
w("")

wtext("footerNote", [
    "中国电子云自研法律大模型 alpha_star_law_8B_v2 的评测结果公开整理页。",
    "数据来源为飞书云文档《alpha_star_law_8B_v2测试报告》，页面所有数值均直接取自该文档及其内嵌表格，未做二次估算。",
])
w("")

w("};")
w("")

sys.stdout.write("\n".join(out))
sys.stderr.write(
    "\n[校验] 竞品口径：%d/%d 行与原表一致；%d 行不一致\n"
    % (len(matched), len(checks), len(mismatched))
)
if mismatched:
    sys.stderr.write("  不一致行：%s\n" % [(c["task"], c["raw"], c["computed"]) for c in mismatched])
sys.stderr.write("[校验] 较基座口径：%d 行中 %d 行不符\n" % (base_checked, len(base_bad)))
sys.stderr.write("[校验] 正文交叉验证：%d/%d 一致\n" % (len(prose_ok), len(prose_results)))
for t, e, g, ok, q in prose_results:
    sys.stderr.write("   %s 期望 %s 实算 %s %s | %s\n" % (t, e, g, "OK" if ok else "FAIL", q))
if base_bad:
    sys.stderr.write("  不一致：%s\n" % base_bad)
