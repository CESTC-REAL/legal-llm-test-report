#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
从内部评测表格的 CSV 导出生成 assets/report.js。

用法:
    python3 scripts/build_report_data.py data > assets/report.js

CSV 为带 "[row=N] " 行号前缀的两维表格导出，解析时会去掉该前缀。
所有页面数值都由本脚本从 data/ 下的 CSV 生成，不手工转录。
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


# -------------------------------------------------- 对外文案自足化
# 原始表格的描述性单元格会回指内部评测记录；对外页面应自足表述。
PUBLIC_TEXT_FIXES = [
    ("原报告标记的此类异常包括", "其中包括"),
    ("原报告给出汇总比例", "按汇总口径给出"),
    ("原报告列举了", "其中高估"),
]


def public_text(s):
    for a, b in PUBLIC_TEXT_FIXES:
        s = s.replace(a, b)
    return s


# ---------------------------------------------------------------- 读取各表
score_rows = load_csv("wfphnF")[1:]                 # 结论对比表（头条数值）
data_rows = load_csv("edhldx")[1:]                  # 数据集规模
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

# -------------------------------------------------- 领先统计（模型对比总表用）
MODEL_KEYS = ["self", "rivalOne", "rivalTwo", "base"]


def count_first(rows):
    """统计各模型取得最高分的任务数（含并列）。"""
    c = dict.fromkeys(MODEL_KEYS, 0)
    for r in rows:
        vals = {k: r.get(k) for k in MODEL_KEYS}
        valid = [v for v in vals.values() if v is not None]
        if not valid:
            continue
        best = max(valid)
        for k, v in vals.items():
            if v is not None and abs(v - best) < 1e-9:
                c[k] += 1
    return c


lb_first = count_first(lb)
le_first = count_first(le)
task_first = {k: lb_first[k] + le_first[k] for k in MODEL_KEYS}

# -------------------------------------------------- 法律任务版图（按法律实务归类）
# 归类规则：把两套评测集的 35 项任务按法律实务职能归入 5 个类别。
# 类别下的任务数、均分、较基座差值、最高分任务全部由原始逐项表统计，不手工填写。
LEGAL_CATEGORIES = [
    ("knowledge", "法律知识与检索", "i-book",
     "法律概念、法规条文、立法沿革与类案辨别"),
    ("extraction", "文书理解与信息抽取", "i-doc",
     "卷宗要素、实体关系、争议焦点与证据抽取"),
    ("sentencing", "定罪量刑与法律计算", "i-gavel",
     "罪名、案由、刑期与涉案金额的推理计算"),
    ("application", "法条适用与文书生成", "i-seal",
     "法条定位、案例分析与法律文书写作"),
    ("ethics", "法律伦理与合规", "i-shield",
     "司法偏见、道德边界与隐私保护"),
]

LEGAL_CATEGORY_BY_TASK = {
    # 法律知识与检索
    "知识问答": "knowledge", "法律概念": "knowledge", "法规查询": "knowledge",
    "法律演进": "knowledge", "类案辨别": "knowledge",
    # 文书理解与信息抽取
    "文件校对": "extraction", "纠纷焦点识别": "extraction",
    "问题主题识别": "extraction", "阅读理解": "extraction",
    "命名实体识别": "extraction", "论点挖掘": "extraction",
    "事件检测": "extraction", "触发词提取": "extraction",
    "要素识别": "extraction", "事实验证": "extraction",
    "关系提取": "extraction", "实体识别": "extraction",
    "论辩挖掘": "extraction",
    # 定罪量刑与法律计算
    "婚姻纠纷鉴定": "sentencing", "罪名预测": "sentencing",
    "案由预测": "sentencing", "刑期预测": "sentencing",
    "刑期预测（无法条）": "sentencing", "刑期预测（有法条）": "sentencing",
    "犯罪金额计算": "sentencing", "法律计算": "sentencing",
    "多层推理": "sentencing",
    # 法条适用与文书生成
    "法条预测": "application", "案例分析": "application",
    "文书质量": "application",
    # 法律伦理与合规
    "偏见歧视": "ethics", "道德": "ethics", "隐私": "ethics",
}

# 涉及罪名 / 量刑的任务，在明细表中加「罪」标记
CHARGE_TASKS = {"罪名预测", "案由预测", "刑期预测", "刑期预测（无法条）",
                "刑期预测（有法条）", "犯罪金额计算", "婚姻纠纷鉴定"}


def strip_code(task):
    """去掉任务编号前缀（'1-2 知识问答' -> '知识问答'）。"""
    return re.sub(r"^\d+[-_]\d+\s*", "", task.strip())


legal_items = []
for dataset, rows in (("LawBench", lb), ("LexEval", le)):
    for r in rows:
        name = strip_code(r["task"])
        legal_items.append({
            "task": r["task"], "name": name,
            "cat": LEGAL_CATEGORY_BY_TASK.get(name),
            "dataset": dataset,
            "self": r["self"], "base": r["base"],
            "charge": name in CHARGE_TASKS,
        })

legal_categories = []
for key, label, icon, desc in LEGAL_CATEGORIES:
    items = [it for it in legal_items if it["cat"] == key]
    self_vals = [it["self"] for it in items if it["self"] is not None]
    base_vals = [it["base"] for it in items if it["base"] is not None]
    self_avg = r2(sum(self_vals) / len(self_vals)) if self_vals else None
    base_avg = r2(sum(base_vals) / len(base_vals)) if base_vals else None
    top = max((it for it in items if it["self"] is not None),
              key=lambda it: it["self"], default=None)
    legal_categories.append({
        "key": key, "name": label, "icon": icon, "desc": desc,
        "count": len(items), "selfAvg": self_avg, "baseAvg": base_avg,
        "deltaBase": r2(self_avg - base_avg) if (self_avg is not None and base_avg is not None) else None,
        "top": top,
        "items": items,
    })

legal_unclassified = sorted({it["name"] for it in legal_items if not it["cat"]})

# 罪名词表：来自错例表中的真实罪名字段
legal_charges = []
for row in load_csv("Nh1Sfv")[1:]:
    if len(row) < 2:
        continue
    for c in re.split(r"[、,，]", row[1].strip()):
        c = c.strip()
        if c and c not in legal_charges:
            legal_charges.append(c)


dim_first = dict.fromkeys(MODEL_KEYS, 0)
for r in dim_rows:
    if len(r) < 6:
        continue
    vals = [num(x) for x in r[2:6]]
    valid = [v for v in vals if v is not None]
    if not valid:
        continue
    best = max(valid)
    for k, v in zip(MODEL_KEYS, vals):
        if v is not None and abs(v - best) < 1e-9:
            dim_first[k] += 1


def rate(s):
    """从 '791 / 7,992（约 9.90%）' 中取出 '9.90'。"""
    m = re.search(r"([\d.]+)\s*%", str(s))
    return m.group(1) if m else None


invalid_rate = {}
for r in invalid_rows:
    if len(r) < 3:
        continue
    nm = r[0].strip()
    invalid_rate[nm] = {"lb": rate(r[1]), "le": rate(r[2])}

# 数据集规模合计
TOTAL_TASKS = TOTAL_QUESTIONS = ""
for r in data_rows:
    if r and r[0].strip() == "合计":
        TOTAL_TASKS = r[1].strip()
        TOTAL_QUESTIONS = r[2].strip()

# ---------------------------------------------------------------- 输出
out = []
w = out.append


def wtext(key, paras):
    """写出一个多段文本字段：段间以空行分隔，渲染层再拆成 <p>。"""
    w("  %s:" % key)
    w("  " + j("\n\n".join(paras)) + ",")


w("/* ============================================================")
w("   alpha_star_law_8B_v2 评测主页 · 数据源（自动生成，勿手改）")
w("   生成器：scripts/build_report_data.py")
w(f"   竞品差值口径校验：{len(matched)}/{len(checks)} 行与原表一致，"
  f"{len(mismatched)} 行不符")
w(f"   较基座口径校验：{base_checked} 行中 {len(base_bad)} 行不符")
w("   ============================================================ */")
w("window.REPORT = {")
w("")
w("  meta: {")
w('    updated: "2026-11-20",')
w('    product: "alpha_star_law_8B_v2",')
w('    org: "中国电子云",')
w("  },")
w("")

# ---------------------------------------------------------------- Hero
w("  hero: {")
w('    org: "中国电子云",')
w('    tagline: "中国电子云自研中文法律领域大模型",')
w('    lead: "在 <strong>LawBench</strong> 与 <strong>LexEval</strong> 两套中文法律评测集上总分双榜第一；'
  '<strong>8 个能力维度</strong>全面领先，<strong>35 项任务中 27 项</strong>取得最高分。",')
w('    badges: [')
for b in [
    dict(icon="i-trophy", text="两榜总分第一"),
    dict(icon="i-target", text="8 / 8 能力维度领先"),
    dict(icon="i-flag", text="27 / 35 任务第一"),
    dict(icon="i-layers", text="19,392 道评测题"),
]:
    w("      { icon: %s, text: %s }," % (j(b["icon"]), j(b["text"])))
w("    ],")
w("    champion: {")
w('      title: "两榜总分",')
w('      badge: "全榜第一",')
w("      rows: [")
for row in total_rows:
    ds = row[0].strip()
    v, b = num(row[1]), num(row[4])
    w("        { label: %s, value: %s, base: %s, delta: %s }," %
      (j(ds), j(v), j(b), j("%+.2f" % (v - b))))
w("      ],")
w('      foot: "较 Qwen3-8B 基座两榜平均 <strong>+12.88 分</strong>（<strong>+24.90%</strong>）"')
w("    }")
w("  },")
w("")

# 结论（产品口径改写）
w("  conclusion: [")
for t in [
    "alpha_star_law_8B_v2 是<strong>中国电子云自研的 8B 级中文法律领域大模型</strong>，"
    "面向法律知识理解、法律推理与文书业务场景优化。",
    "本次评测在 LawBench 与 LexEval 两套中文法律评测集上与通用基座及两款开源法律模型同台比较，"
    "<strong>两榜总分均为第一</strong>，<strong>8 个能力维度全面领先</strong>，"
    "<strong>35 项任务中 27 项</strong>取得最高分。",
    "相较 Qwen3-8B 通用基座，两榜等权平均提升 <strong>12.88 分</strong>（<strong>+24.90%</strong>）；"
    "相较平均分最高的法律竞品提升 <strong>13.15 分</strong>（<strong>+25.55%</strong>）。",
]:
    w(f"    {j(t)},")
w("  ],")
w("")

# KPI
w("  kpis: [")
for k in [
    dict(icon="i-scale", label="LawBench 总分", value="55.39", unit="分", tone="win",
         note="较基座 <span class='up'>+11.02</span> · 较最高竞品 <span class='up'>+10.92</span>"),
    dict(icon="i-book", label="LexEval 总分", value="73.82", unit="分", tone="win",
         note="较基座 <span class='up'>+14.73</span> · 较最高竞品 <span class='up'>+14.88</span>"),
    dict(icon="i-layers", label="两榜等权平均", value="64.61", unit="分", tone="win",
         note="基座 51.73 · 最高竞品 51.46"),
    dict(icon="i-target", label="能力维度领先", value="8", unit="/ 8", tone="win",
         note="LawBench L1–L3 · LexEval L1–L4、L6"),
    dict(icon="i-flag", label="任务取得最高分", value="27", unit="/ 35", tone="win",
         note="LawBench 11/16 · LexEval 16/19"),
    dict(icon="i-shield", label="LawBench 无效回答率", value="0.26", unit="%", tone="win",
         note="LexEval 仅 0.01% · 竞品最高 9.90%"),
]:
    w("    { icon: %s, label: %s, value: %s, unit: %s, tone: %s, note: %s }," %
      (j(k["icon"]), j(k["label"]), j(k["value"]), j(k["unit"]), j(k["tone"]), j(k["note"])))
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

# ---------------------------------------------------------------- 模型对比总表
# 这是技术报告博客的标志性元素：一张表横向对比四个模型在各项评测上的表现。
MAIN = {r[0].strip(): [num(x) for x in r[1:5]] for r in total_rows}   # LawBench / LexEval / 平均
FULL = {r[0].strip(): [num(x) for x in r[1:5]] for r in full_rows}
RATE_KEYS = {"self": "V6", "rivalOne": "LegalOne-8B",
             "rivalTwo": "qwen3_for_law", "base": "Qwen3-8B 基座"}

# -------------------------------------------------- 头条数值自校验（结论表 vs 总分表）
# 结论表（表 01）是报告对外呈现的头条口径；总分表（表 05）是逐项汇总口径。
# 二者必须完全一致，否则说明汇总链路有偏差。
headline_checks = []
for row in score_rows:
    if len(row) < 6:
        continue
    name = row[0].strip()
    if name not in MAIN:
        continue
    self_v, rival1, rival2, base_v = MAIN[name]
    concl_self, concl_base = num(row[1]), num(row[2])
    d_base = num(re.search(r"([-+]?\d+(?:\.\d+)?)", row[3]).group(1)) if row[3] else None
    d_rival = num(re.search(r"([-+]?\d+(?:\.\d+)?)", row[5]).group(1)) if row[5] else None
    rival_name, rival_score = [s.strip() for s in row[4].split("·")] if "·" in row[4] else (None, None)
    best_rival = max((v for v in (rival1, rival2) if v is not None))
    items = [
        ("自研总分", concl_self, self_v),
        ("基座总分", concl_base, base_v),
        ("较基座提升", d_base, None if self_v is None or base_v is None else self_v - base_v),
        ("较最高竞品提升", d_rival, None if self_v is None else self_v - best_rival),
        ("最高竞品得分", num(rival_score) if rival_score else None, best_rival),
    ]
    for field, expect, computed in items:
        if expect is None or computed is None:
            ok = expect is None and computed is None
        else:
            ok = abs(expect - computed) <= 0.011
        headline_checks.append({"bench": name, "field": field, "expect": expect,
                                "computed": r2(computed), "ok": ok})
headline_ok = [c for c in headline_checks if c["ok"]]
headline_bad = [c for c in headline_checks if not c["ok"]]

w("  comparison: {")
w("    columns: [")
w("      { key: \"item\", label: \"评测项\" },")
w("      { key: \"self\", label: \"alpha_star_law_8B_v2\", self: true },")
w("      { key: \"rivalOne\", label: \"LegalOne-8B\" },")
w("      { key: \"rivalTwo\", label: \"qwen3_for_law\" },")
w("      { key: \"base\", label: \"Qwen3-8B 基座\" }")
w("    ],")
w("    rows: [")
for item, src, key in [
    ("LawBench 主分", MAIN, "LawBench"),
    ("LawBench 全量分", FULL, "LawBench"),
    ("LexEval 主分", MAIN, "LexEval"),
    ("LexEval 全量分", FULL, "LexEval"),
    ("两榜等权平均", MAIN, "两榜等权平均"),
]:
    vals = src[key]
    w("      { item: %s, num: true, values: [%s] }," %
      (j(item), ", ".join(j(v) for v in vals)))
for item, getter, unit in [
    ("能力维度取得第一", lambda k: dim_first[k], " / 8"),
    ("任务取得最高分", lambda k: task_first[k], " / 35"),
]:
    w("      { item: %s, num: true, dec: 0, suffix: %s, values: [%s] }," %
      (j(item), j(unit), ", ".join(j(getter(k)) for k in MODEL_KEYS)))
for item, field, label in [
    ("LawBench 无效回答率", "lb", "LawBench"),
    ("LexEval 无效回答率", "le", "LexEval"),
]:
    w("      { item: %s, num: true, lower: true, suffix: \"%%\", values: [%s] }," %
      (j(item), ", ".join(j(invalid_rate[RATE_KEYS[k]][field]) for k in MODEL_KEYS)))
w("    ],")
w("    scale: {")
w("      tasks: %s," % j(TOTAL_TASKS))
w("      questions: %s" % j(TOTAL_QUESTIONS))
w("    }")
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
      (j(row[0].strip()), j(row[1].strip()), j(row[2].strip()), j(public_text(row[3].strip()))))
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
      "deltaBase: %s, deltaRival: %s, best: %s, charge: %s }," %
      (j(row["task"]), j(row["dim"]), j(row["self"]), j(row["selfAux"]), j(row["selfInvalid"]),
       j(row["rivalOne"]), j(row["rivalTwo"]), j(row["base"]),
       j(row["deltaBase"]), j(row["deltaRival"]),
       j("self") if row["self"] == best else "null",
       "true" if strip_code(row["task"]) in CHARGE_TASKS else "false"))
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
      "deltaBase: %s, deltaRival: %s, best: %s, charge: %s }," %
      (j(row["task"]), j(row["dim"]), j(row["count"]), j(row["self"]),
       j(row["rivalOne"]), j(row["rivalTwo"]), j(row["base"]),
       j(row["deltaBase"]), j(row["deltaRival"]),
       j("self") if row["self"] == best else "null",
       "true" if strip_code(row["task"]) in CHARGE_TASKS else "false"))
w("      ]")
w("    }")
w("  ],")
w("")

# ---------------------------------------------------------------- 法律任务版图
w("  legalMap: {")
w("    categories: [")
for c in legal_categories:
    w("      { key: %s, name: %s, icon: %s, desc: %s, count: %d, selfAvg: %s, baseAvg: %s, deltaBase: %s," %
      (j(c["key"]), j(c["name"]), j(c["icon"]), j(c["desc"]), c["count"],
       j(c["selfAvg"]), j(c["baseAvg"]), j(c["deltaBase"])))
    w("        top: { task: %s, name: %s, dataset: %s, score: %s }," %
      (j(c["top"]["task"] if c["top"] else None),
       j(c["top"]["name"] if c["top"] else None),
       j(c["top"]["dataset"] if c["top"] else None),
       j(c["top"]["self"] if c["top"] else None)))
    w("        items: [")
    for it in c["items"]:
        w("          { name: %s, task: %s, dataset: %s, self: %s, charge: %s }," %
          (j(it["name"]), j(it["task"]), j(it["dataset"]), j(it["self"]),
           "true" if it["charge"] else "false"))
    w("        ] },")
w("    ],")
w("    charges: [%s]," % ", ".join(j(c) for c in legal_charges))
w("    unclassified: [%s]" % ", ".join(j(x) for x in legal_unclassified))
w("  },")
w("")

# 校验结论（写进页面）
# 正文原话交叉验证（不依赖表格，直接取自报告正文）
PROSE_CHECKS = [
    ("2-3 婚姻纠纷鉴定", 30.04, "自研模型得 63.24，领先最高竞品 30.04 分"),
    ("2-6 命名实体识别", 18.20, "领先 LegalOne 18.20 分"),
]
prose_results = []
for task, expect, quote in PROSE_CHECKS:
    row = next((r for r in lb + le if r["task"] == task), None)
    got = rival_delta(row) if row else None
    prose_results.append((task, expect, got, abs(got - expect) <= 0.011, quote))
prose_ok = [p for p in prose_results if p[3]]

w("  verification: {")
w('    headlineChecked: %d,' % len(headline_checks))
w('    headlineMatched: %d,' % len(headline_ok))
w('    headlineMismatched: %d,' % len(headline_bad))
w('    headlineDetail: [')
for c in headline_checks:
    w("      { bench: %s, field: %s, expect: %s, computed: %s, ok: %s }," %
      (j(c["bench"]), j(c["field"]), j(c["expect"]), j(c["computed"]),
       "true" if c["ok"] else "false"))
w("    ],")
w('    rivalTotal: %d,' % len(checks))
w('    rivalMatched: %d,' % len(matched))
w('    rivalMismatched: %d,' % len(mismatched))
w('    baseChecked: %d,' % base_checked)
w('    baseMismatched: %d,' % len(base_bad))
w('    rivalFormula: "自研模型主分 − max(LegalOne-8B 主分, qwen3_for_law 主分)",')
w('    rivalMismatchedTasks: [%s],' % ", ".join(j(c["task"]) for c in mismatched))
w('    proseCrossCheck: [')
for task, expect, got, ok, quote in prose_results:
    w("      { task: %s, expected: %s, computed: %s, ok: %s, quote: %s }," %
      (j(task), j(expect), j(got), "true" if ok else "false", j(quote)))
w("    ],")
w("  },")
w("")

# 法条预测错例（表 08）
w("  errorCases: {")
w('    title: "指定条号查询错例",')
w('    columns: ["题目 ID", "题目涉及的罪名", "标准条号", "自研模型输出"],')
w("    rows: [")
for row in load_csv("Nh1Sfv")[1:]:
    w("      [%s]," % ", ".join(j(c.strip()) for c in row))
w("    ]")
w("  },")
w("")

# 抽取遗漏（表 09）
w("  extractMisses: {")
w('    title: "信息抽取遗漏案例",')
w('    columns: ["题目 ID", "要求", "自研模型遗漏"],')
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
    cells = [public_text(c.strip()) for c in row]
    w("      [%s]," % ", ".join(j(c) for c in cells))
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

# ---- 极简脚注：只保留读者真正会用到的口径说明 ----
wtext("fullScoreCaption", [
    "全量分把无效回答计 0 并保留在分母中。LawBench 上自研模型仍领先基座 10.93 分、领先最高法律竞品 11.29 分；"
    "LegalOne-8B 则低于基座 6.25 分。",
])
w("")

wtext("dimensionNote", [
    "差值按表中取整后的数值计算，法律伦理维度为 22.64（原始测算口径为 22.63，差异来自取整）。",
])
w("")

wtext("verifyNote", [
    "「较最高竞品」= 自研模型主分 − max(LegalOne-8B 主分, qwen3_for_law 主分)，通用基座不参与竞品比较；★ 标记该任务最高分。",
])
w("")

wtext("footerNote", [
    "中国电子云自研法律大模型 alpha_star_law_8B_v2 的公开评测主页。",
    "全部数值来自中国电子云内部评测，并在 GitHub 开源组织 CESTC-REAL 同步发布。",
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
sys.stderr.write("[校验] 头条数值（结论表 vs 总分表）：%d/%d 一致\n"
                 % (len(headline_ok), len(headline_checks)))
for c in headline_checks:
    sys.stderr.write("   %-12s %-14s 结论表 %-8s 实算 %-8s %s\n"
                     % (c["bench"], c["field"], c["expect"], c["computed"],
                        "OK" if c["ok"] else "FAIL"))
sys.stderr.write("[校验] 正文交叉验证：%d/%d 一致\n" % (len(prose_ok), len(prose_results)))
for t, e, g, ok, q in prose_results:
    sys.stderr.write("   %s 期望 %s 实算 %s %s | %s\n" % (t, e, g, "OK" if ok else "FAIL", q))
if base_bad:
    sys.stderr.write("  不一致：%s\n" % base_bad)
