/* ============================================================
   渲染层：从 assets/report.js 读取 REPORT 数据并生成页面
   纯原生实现 · 无第三方依赖 · 无构建步骤
   ============================================================ */
(function () {
  "use strict";

  var D = window.REPORT || {};
  var $ = function (id) { return document.getElementById(id); };
  var DELTA_KEYS = { deltaBase: 1, deltaRival: 1 };

  /* ---------------- 基础工具 ---------------- */
  function el(tag, attrs, kids) {
    var n = document.createElement(tag);
    if (attrs) for (var k in attrs) {
      if (k === "class") { if (attrs[k]) n.className = attrs[k]; }
      else if (k === "html") n.innerHTML = attrs[k];
      else if (k === "text") n.textContent = attrs[k];
      else if (k.slice(0, 2) === "on") n.addEventListener(k.slice(2), attrs[k]);
      else if (attrs[k] !== null && attrs[k] !== undefined) n.setAttribute(k, attrs[k]);
    }
    (kids || []).forEach(function (c) {
      if (c === null || c === undefined) return;
      n.appendChild(typeof c === "string" ? document.createTextNode(c) : c);
    });
    return n;
  }

  function svg(tag, attrs, kids) {
    var n = document.createElementNS("http://www.w3.org/2000/svg", tag);
    if (attrs) for (var k in attrs) {
      if (k === "text") n.textContent = attrs[k];
      else if (attrs[k] !== null && attrs[k] !== undefined) n.setAttribute(k, attrs[k]);
    }
    (kids || []).forEach(function (c) { if (c) n.appendChild(c); });
    return n;
  }

  function clear(id) { var n = $(id); while (n && n.firstChild) n.removeChild(n.firstChild); }

  /* 原报告表头中的「V6」即 alpha_star_law_8B_v2 的内部版本名 */
  function modelLabel(v) {
    return (v === "V6") ? "alpha_star_law_8B_v2（V6）" : v;
  }

  /* 数值：固定两位小数；缺失显示 — */
  function fmt(v, d) {
    if (v === null || v === undefined || v === "" || v === "—") return "—";
    var n = Number(v);
    if (isNaN(n)) return String(v);
    return n.toFixed(d === undefined ? 2 : d);
  }

  /* 差值：显式正负号，负号用 U+2212 与原表一致 */
  function fmtDelta(v) {
    if (v === null || v === undefined || v === "") return "—";
    var n = Number(v);
    if (isNaN(n)) return String(v);
    if (n > 0) return "+" + n.toFixed(2);
    if (n < 0) return "−" + Math.abs(n).toFixed(2);
    return "0.00";
  }

  /* HTML 转义：正文里出现的 <think> 等字面串不能被当成标签解析 */
  function esc(s) {
    return String(s === null || s === undefined ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  /* 多段文本 -> 多个 <p>（数据里以空行分段） */
  function paras(text, cls) {
    var out = [];
    String(text || "").split("\n\n").forEach(function (t) {
      t = t.trim();
      if (!t) return;
      out.push(el("p", { class: cls || null, html: esc(t) }));
    });
    return out;
  }

  function fillParas(id, text, cls) {
    var host = $(id);
    if (!host) return;
    host.innerHTML = "";
    paras(text, cls).forEach(function (p) { host.appendChild(p); });
  }

  /* ---------------- 01 · Hero ---------------- */
  (function () {
    var box = $("hero-chips");
    if (!box || !D.meta) return;
    (D.meta.chips || []).forEach(function (c) {
      box.appendChild(el("span", { class: "chip" }, [el("b", { text: c.k }), c.v]));
    });
  })();

  (function () {
    var box = $("score-rows");
    if (!box || !D.benchmarks) return;
    D.benchmarks.forEach(function (b) {
      var self = (b.models || []).filter(function (m) { return m.self; })[0] || {};
      var row = el("div", { class: "score-row" }, [
        el("div", { class: "score-row-top" }, [
          el("span", { class: "score-name", text: b.name }),
          el("span", { class: "score-val", text: fmt(self.score) })
        ])
      ]);
      var delta = el("div", { class: "score-delta" });
      (b.deltas || []).forEach(function (d) {
        delta.appendChild(el("span", {}, [
          d.label + " ",
          el("span", { class: d.up ? "up" : "", text: d.value })
        ]));
      });
      row.appendChild(delta);
      box.appendChild(row);
    });
  })();

  /* ---------------- 01 · 结论与 KPI ---------------- */
  (function () {
    var box = $("conclusion-body");
    if (!box) return;
    (D.conclusion || []).forEach(function (p) { box.appendChild(el("p", { html: p })); });
  })();

  (function () {
    var box = $("kpi-grid");
    if (!box) return;
    (D.kpis || []).forEach(function (k) {
      var note = el("div", { class: "kpi-note" });
      if (k.note) note.innerHTML = k.note;
      box.appendChild(el("div", { class: "kpi" + (k.tone ? " is-" + k.tone : "") }, [
        el("div", { class: "kpi-label", text: k.label }),
        el("div", { class: "kpi-value" }, [
          String(k.value),
          k.unit ? el("span", { class: "unit", text: k.unit }) : null
        ]),
        note
      ]));
    });
  })();

  /* ---------------- 02 · 评测范围 ---------------- */
  (function () {
    var tb = $("datasets-body");
    if (!tb) return;
    (D.datasets || []).forEach(function (r) {
      tb.appendChild(el("tr", { class: r.name === "合计" ? "row-total" : "" }, [
        el("td", { class: "name", text: r.name }),
        el("td", { class: "num", text: r.tasks }),
        el("td", { class: "num", text: r.questions }),
        el("td", { text: r.scope || "—" })
      ]));
    });
  })();

  (function () {
    var box = $("metrics-body");
    if (!box) return;
    (D.metrics || []).forEach(function (m) {
      box.appendChild(el("div", { class: "metric-card" }, [
        el("div", { class: "m-name", text: m.name }),
        el("p", { class: "m-desc", text: m.desc })
      ]));
    });
  })();

  (function () {
    var mode = $("inference-mode");
    if (mode && D.inference) mode.textContent = D.inference.mode;

    var chips = $("inference-params");
    if (chips && D.inference) {
      (D.inference.params || []).forEach(function (p) {
        var i = p.indexOf("=");
        if (i < 0) { chips.appendChild(el("span", { class: "param-chip" }, [el("span", { class: "pv", text: p })])); return; }
        chips.appendChild(el("span", { class: "param-chip" }, [
          el("span", { class: "pk", text: p.slice(0, i) }),
          el("span", { class: "peq", text: "=" }),
          el("span", { class: "pv", text: p.slice(i + 1) })
        ]));
      });
    }

    fillParas("inference-note", D.inferenceNote);
  })();

  /* ---------------- 03 · 模型与权重 ---------------- */
  (function () {
    var box = $("models-body");
    if (!box) return;
    var notes = {};
    (D.modelNotes || []).forEach(function (n) { notes[n.model] = n.body; });

    (D.models || []).forEach(function (m) {
      var card = el("div", { class: "model-card" + (m.self ? " is-self" : "") }, [
        el("div", { class: "model-head" }, [
          el("span", { class: "model-name", text: m.name }),
          el("span", { class: "tag " + (m.tagCls || "tag-plain"), text: m.role })
        ]),
        el("div", { class: "model-src", text: m.source }),
        el("p", { class: "model-route", text: m.route || "" })
      ]);

      if (m.url) {
        card.appendChild(el("div", { class: "model-link" }, [
          el("span", { class: "link-label", text: "权重 / 模型页：" }),
          el("a", { href: m.url, target: "_blank", rel: "noopener", text: m.url })
        ]));
      } else {
        card.appendChild(el("div", { class: "model-link" }, [
          el("span", { class: "link-label", text: "权重 / 模型页：" }),
          el("span", { class: "link-none", text: "未公开" })
        ]));
      }

      if (notes[m.name]) {
        card.appendChild(el("p", { class: "model-note", text: notes[m.name] }));
      }
      box.appendChild(card);
    });
  })();

  (function () {
    var head = $("weights-head");
    var body = $("weights-body");
    if (!head || !body || !D.weights) return;
    (D.weights.columns || []).forEach(function (c, i) {
      head.appendChild(el("th", { class: i === 1 ? "col-self" : "", text: c }));
    });
    (D.weights.rows || []).forEach(function (row) {
      var tr = el("tr");
      row.forEach(function (v, i) {
        tr.appendChild(el("td", { class: i === 1 ? "col-self" : "", text: v === "" ? "—" : v }));
      });
      body.appendChild(tr);
    });
  })();

  /* ---------------- 04 · 总分对比 ---------------- */
  (function () {
    var box = $("benchmark-charts");
    if (!box) return;
    D.benchmarks.forEach(function (b) {
      var bars = el("div", { class: "bars" });
      (b.models || []).slice().sort(function (x, y) { return y.score - x.score; })
        .forEach(function (m, i) {
          var pct = b.max ? Math.max(0, Math.min(100, (m.score / b.max) * 100)) : 0;
          bars.appendChild(el("div", { class: "bar-row" + (m.self ? " is-self" : "") }, [
            el("div", { class: "bar-top" }, [
              el("span", { class: "bar-rank", text: "#" + (i + 1) }),
              el("span", { class: "bar-label", text: m.name, title: m.name }),
              el("span", { class: "bar-val", text: fmt(m.score) })
            ]),
            el("div", { class: "bar-track" }, [
              el("div", { class: "bar-fill b-" + (m.cls || "base"), style: "width:" + pct + "%" })
            ])
          ]));
        });

      var legend = el("div", { class: "legend" }, [
        el("span", { class: "legend-item" }, [el("span", { class: "legend-swatch", style: "background:var(--brand)" }), "自研模型"]),
        el("span", { class: "legend-item" }, [el("span", { class: "legend-swatch", style: "background:var(--rival)" }), "开源法律模型"]),
        el("span", { class: "legend-item" }, [el("span", { class: "legend-swatch", style: "background:var(--base)" }), "通用基座"])
      ]);

      box.appendChild(el("div", { class: "chart-card" }, [
        el("div", { class: "chart-title", text: b.name }),
        el("div", { class: "chart-sub", text: b.sub || ("满分 " + (b.max || 100) + " 分") }),
        bars, legend
      ]));
    });
  })();

  (function () {
    var head = $("full-score-head");
    var body = $("full-score-body");
    if (!head || !body || !D.fullScores) return;
    ["数据集", "alpha_star_law_8B_v2", "LegalOne-8B", "qwen3_for_law", "Qwen3-8B 基座"].forEach(function (c, i) {
      head.appendChild(el("th", { class: i === 1 ? "num col-self" : (i === 0 ? "" : "num"), text: c }));
    });
    D.fullScores.forEach(function (r) {
      body.appendChild(el("tr", {}, [
        el("td", { class: "name", text: r.dataset }),
        el("td", { class: "num col-self", text: fmt(r.self) }),
        el("td", { class: "num", text: fmt(r.rivalOne) }),
        el("td", { class: "num", text: fmt(r.rivalTwo) }),
        el("td", { class: "num", text: fmt(r.base) })
      ]));
    });
    fillParas("full-score-note", D.fullScoreNote);
  })();

  /* ---------------- 05 · 能力维度 ---------------- */
  (function () {
    var host = $("radar");
    if (!host) return;
    var dims = D.dimensions || [];
    if (dims.length < 3) return;

    var W = 480, H = 400, cx = 240, cy = 200, R = 125;
    var n = dims.length;
    var maxV = D.dimensionMax || 100;
    var s = svg("svg", { class: "radar-svg", viewBox: "0 0 " + W + " " + H, role: "img", "aria-label": "八维度雷达对比图" });

    function pt(i, ratio) {
      var ang = -Math.PI / 2 + i * 2 * Math.PI / n;
      return [cx + Math.cos(ang) * R * ratio, cy + Math.sin(ang) * R * ratio];
    }
    function poly(ratioFn) {
      return dims.map(function (d, i) {
        var p = pt(i, ratioFn(d));
        return p[0].toFixed(1) + "," + p[1].toFixed(1);
      }).join(" ");
    }
    function clamp(v) { return Math.max(0, Math.min(1, (v || 0) / maxV)); }

    [0.25, 0.5, 0.75, 1].forEach(function (r) {
      s.appendChild(svg("polygon", { class: "radar-grid", points: poly(function () { return r; }) }));
    });
    for (var i = 0; i < n; i++) {
      var p = pt(i, 1);
      s.appendChild(svg("line", { class: "radar-axis", x1: cx, y1: cy, x2: p[0].toFixed(1), y2: p[1].toFixed(1) }));
    }

    if (D.dimensionBase) {
      s.appendChild(svg("polygon", { class: "radar-area-base", points: poly(function (d) { return clamp(d.base); }) }));
    }
    s.appendChild(svg("polygon", { class: "radar-area-self", points: poly(function (d) { return clamp(d.self); }) }));

    dims.forEach(function (d, i) {
      var pSelf = pt(i, clamp(d.self));
      s.appendChild(svg("circle", { class: "radar-dot-self", cx: pSelf[0].toFixed(1), cy: pSelf[1].toFixed(1), r: 3.4 }));
      if (D.dimensionBase) {
        var pB = pt(i, clamp(d.base));
        s.appendChild(svg("circle", { class: "radar-dot-base", cx: pB[0].toFixed(1), cy: pB[1].toFixed(1), r: 2.6 }));
      }

      var lp = pt(i, 1.28);
      var anchor = Math.abs(lp[0] - cx) < 14 ? "middle" : (lp[0] > cx ? "start" : "end");
      s.appendChild(svg("text", {
        class: "radar-axis-label",
        x: lp[0].toFixed(1), y: (lp[1] - 4).toFixed(1),
        "text-anchor": anchor, text: d.short || d.name
      }));
      s.appendChild(svg("text", {
        class: "radar-axis-sub",
        x: lp[0].toFixed(1), y: (lp[1] + 10).toFixed(1),
        "text-anchor": anchor, text: (d.prefix || "") + " " + (d.code || "")
      }));
    });

    host.appendChild(s);
  })();

  (function () {
    var tb = $("dim-body");
    if (!tb) return;
    (D.dimensions || []).forEach(function (d) {
      var delta = (d.self !== null && d.base !== null) ? d.self - d.base : null;
      var cls = delta === null ? "num" : (delta > 0 ? "num up" : (delta < 0 ? "num down" : "num"));
      tb.appendChild(el("tr", {}, [
        el("td", { class: "name" }, [
          el("span", { class: "dim-prefix", text: (d.prefix || "") + " " + (d.code || "") }),
          el("span", { text: d.short || d.name })
        ]),
        el("td", { class: "num", text: fmt(d.self) }),
        el("td", { class: "num", text: fmt(d.base) }),
        el("td", { class: cls, text: fmtDelta(delta) })
      ]));
    });
    fillParas("dimension-note", D.dimensionNote);
  })();

  /* ---------------- 06 · 任务级明细 ---------------- */
  (function () {
    var host = $("task-tables");
    if (!host) return;
    (D.taskSets || []).forEach(function (set) {
      var tb = el("tbody");
      (set.rows || []).forEach(function (r) {
        var tr = el("tr");
        (set.columns || []).forEach(function (col) {
          var v = r[col.key];
          var isBest = (r.best === col.key);
          var td;
          if (DELTA_KEYS[col.key]) {
            var n = Number(v);
            var c = isNaN(n) ? "num" : (n > 0 ? "num up" : (n < 0 ? "num down" : "num"));
            td = el("td", { class: c, text: fmtDelta(v) });
          } else if (col.num && typeof v === "number") {
            td = el("td", { class: "num", text: fmt(v) });
          } else {
            td = el("td", { class: col.num ? "num" : "name", text: (v === null || v === undefined) ? "—" : String(v) });
          }
          if (isBest) {
            td.innerHTML = td.innerHTML + '<span class="best-mark">★</span>';
            td.className += " is-best";
          }
          tr.appendChild(td);
        });
        tb.appendChild(tr);
      });

      var head = el("tr", {}, (set.columns || []).map(function (col) {
        return el("th", { class: col.num ? "num" : "", text: col.label });
      }));

      host.appendChild(el("div", { class: "task-block" }, [
        el("div", { class: "task-title" }, [
          el("span", { text: set.title }),
          el("span", { class: "task-count", text: (set.rows || []).length + " 项" })
        ]),
        el("div", { class: "table-wrap" }, [el("table", {}, [el("thead", {}, [head]), tb])]),
        set.note ? el("p", { class: "task-note", text: set.note }) : null
      ]));
    });
    fillParas("verify-note", D.verifyNote);
  })();

  /* ---------------- 07 · 稳定性与典型错误 ---------------- */
  (function () {
    var tb = $("invalid-body");
    if (tb) {
      (D.invalid || []).forEach(function (r) {
        tb.appendChild(el("tr", { class: r.model === "V6" ? "row-self" : "" }, [
          el("td", { class: "name", text: modelLabel(r.model) }),
          el("td", { class: "num", text: r.lawbench }),
          el("td", { class: "num", text: r.lexeval }),
          el("td", { text: r.note })
        ]));
      });
    }
    fillParas("invalid-note", D.invalidNote);
  })();

  (function () {
    var head = $("len-head");
    var body = $("len-body");
    if (!head || !body || !D.outputLengths) return;
    D.outputLengths.columns.forEach(function (c, i) {
      head.appendChild(el("th", { class: i === 0 ? "" : "num", text: c }));
    });
    D.outputLengths.rows.forEach(function (r) {
      var tr = el("tr");
      r.forEach(function (v, i) {
        tr.appendChild(el("td", { class: i === 0 ? "name" : "num", text: v }));
      });
      body.appendChild(tr);
    });
    fillParas("length-note", D.lengthNote);
  })();

  function renderCase(titleId, headId, bodyId, data) {
    var t = $(titleId), head = $(headId), body = $(bodyId);
    if (t && data) t.textContent = data.title;
    if (!head || !body || !data) return;
    data.columns.forEach(function (c, i) {
      head.appendChild(el("th", { class: i === 0 ? "" : "num", text: c }));
    });
    data.rows.forEach(function (r) {
      var tr = el("tr");
      r.forEach(function (v, i) {
        tr.appendChild(el("td", { class: i === 0 ? "name" : "", text: i === 0 ? modelLabel(v) : v }));
      });
      body.appendChild(tr);
    });
  }

  renderCase("err1-title", "err1-head", "err1-body", D.errorCases);
  renderCase("err2-title", "err2-head", "err2-body", D.extractMisses);
  renderCase("err3-title", "err3-head", "err3-body", D.sentenceError);

  /* ---------------- 08 · 亮点与短板 ---------------- */
  function renderBullets(id, items, gap) {
    var box = $(id);
    if (!box) return;
    (items || []).forEach(function (it) {
      box.appendChild(el("div", { class: "bullet-item" + (gap ? " is-gap" : "") }, [
        el("div", { class: "bullet-title", text: it.title }),
        el("p", { class: "bullet-body", text: it.body })
      ]));
    });
  }
  renderBullets("strengths-body", D.strengths, false);
  renderBullets("shortfalls-body", D.shortfalls, true);

  /* ---------------- 09 · 说明与边界 ---------------- */
  (function () {
    var box = $("note-list");
    if (!box) return;
    (D.notes || []).forEach(function (n) {
      var card = el("div", { class: "note-card" + (n.tone ? " is-" + n.tone : "") }, [
        el("h3", { text: n.title })
      ]);
      (n.paras || []).forEach(function (p) { card.appendChild(el("p", { text: p })); });
      box.appendChild(card);
    });
  })();

  (function () {
    var dl = $("meta-grid");
    if (!dl) return;
    (D.metaRows || []).forEach(function (r) {
      dl.appendChild(el("dt", { text: r.k }));
      dl.appendChild(el("dd", { html: r.v }));
    });
  })();

  fillParas("callout", D.callout);
  fillParas("footer-note", D.footerNote);

  (function () {
    var d = $("footer-date");
    if (d && D.meta && D.meta.updated) d.textContent = "报告更新：" + D.meta.updated;
  })();
})();
