/* ============================================================
   渲染层：从 assets/report.js 读取 REPORT 数据并生成页面
   纯原生实现 · 无第三方依赖 · 无构建步骤
   ============================================================ */
(function () {
  "use strict";

  var D = window.REPORT || {};
  var $ = function (id) { return document.getElementById(id); };
  var DELTA_KEYS = { deltaBase: 1, deltaRival: 1 };
  var SVG_NS = "http://www.w3.org/2000/svg";

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

  function svgEl(tag, attrs, kids) {
    var n = document.createElementNS(SVG_NS, tag);
    if (attrs) for (var k in attrs) {
      if (k === "text") n.textContent = attrs[k];
      else if (attrs[k] !== null && attrs[k] !== undefined) n.setAttribute(k, attrs[k]);
    }
    (kids || []).forEach(function (c) { if (c) n.appendChild(c); });
    return n;
  }

  /* 图标 */
  function icon(id, cls) {
    var s = svgEl("svg", { class: cls || "ic" });
    s.appendChild(svgEl("use", { href: "#" + id }));
    return s;
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

  function fillParas(id, text, cls) {
    var host = $(id);
    if (!host) return;
    host.innerHTML = "";
    String(text || "").split("\n\n").forEach(function (t) {
      t = t.trim();
      if (!t) return;
      host.appendChild(el("p", { class: cls || null, html: esc(t) }));
    });
  }

  /* 富文本：内容本身可信（来自本地生成的数据文件），保留内嵌 <strong> 等标记 */
  function fillHtml(id, text) {
    var host = $(id);
    if (!host) return;
    host.innerHTML = "";
    String(text || "").split("\n\n").forEach(function (t) {
      t = t.trim();
      if (!t) return;
      host.appendChild(el("p", { html: t }));
    });
  }

  /* 原始表头中的内部版本名统一显示为产品名 */
  function modelLabel(v) {
    return (v === "V6") ? "alpha_star_law_8B_v2" : v;
  }

  /* ---------------- Hero ---------------- */
  (function () {
    var H = D.hero || {};
    var tag = $("hero-tagline");
    if (tag) tag.textContent = H.tagline || "";
    var lead = $("hero-lead");
    if (lead && H.lead) lead.innerHTML = H.lead;

    var badges = $("hero-badges");
    if (badges) {
      (H.badges || []).forEach(function (b) {
        badges.appendChild(el("li", {}, [icon(b.icon), el("span", { text: b.text })]));
      });
    }
  })();

  /* ---------------- 冠军卡 ---------------- */
  (function () {
    var C = (D.hero || {}).champion;
    if (!C) return;
    var t = $("champion-title");
    if (t) t.textContent = C.title || "";
    var b = $("champion-badge");
    if (b) b.textContent = C.badge || "";

    var box = $("champion-rows");
    if (box) {
      (C.rows || []).forEach(function (r) {
        var selfPct = Math.max(0, Math.min(100, r.value));
        var basePct = Math.max(0, Math.min(100, r.base));
        box.appendChild(el("div", { class: "champ-row" }, [
          el("div", { class: "champ-row-top" }, [
            el("span", { class: "champ-label", text: r.label }),
            el("span", { class: "champ-val", text: fmt(r.value) })
          ]),
          el("div", { class: "champ-bar" }, [
            el("div", { class: "champ-fill", style: "width:" + selfPct + "%" }),
            el("div", { class: "champ-base", style: "left:" + basePct + "%" })
          ]),
          el("div", { class: "champ-row-foot", html: "较 Qwen3-8B 基座 <b>" + r.delta + "</b>" })
        ]));
      });
    }
    fillHtml("champion-foot", C.foot);
  })();

  /* ---------------- KPI ---------------- */
  (function () {
    var box = $("kpi-grid");
    if (!box) return;
    (D.kpis || []).forEach(function (k) {
      var note = el("div", { class: "kpi-note" });
      if (k.note) note.innerHTML = k.note;
      box.appendChild(el("div", { class: "kpi" + (k.tone ? " is-" + k.tone : "") }, [
        el("div", { class: "kpi-icon" }, [icon(k.icon)]),
        el("div", { class: "kpi-label", text: k.label }),
        el("div", { class: "kpi-value" }, [
          String(k.value),
          k.unit ? el("span", { class: "unit", text: k.unit }) : null
        ]),
        note
      ]));
    });
  })();

  /* ---------------- 结论 ---------------- */
  (function () {
    var box = $("conclusion-body");
    if (!box) return;
    (D.conclusion || []).forEach(function (p) { box.appendChild(el("p", { html: p })); });
  })();

  /* ---------------- 模型对比总表 ---------------- */
  (function () {
    var head = $("cmp-head");
    var body = $("cmp-body");
    if (!head || !body || !D.comparison) return;
    var cols = D.comparison.columns || [];

    cols.forEach(function (c, i) {
      var th = el("th", { class: (i === 0 ? "" : "num") + (c.self ? " self-col" : "") });
      th.appendChild(document.createTextNode(c.label));
      if (c.self) th.appendChild(el("span", { class: "col-tag", text: "自研" }));
      head.appendChild(th);
    });

    (D.comparison.rows || []).forEach(function (row) {
      var vals = row.values || [];
      var nums = vals.map(Number).filter(function (v) { return !isNaN(v); });
      var best = null;
      if (nums.length) {
        best = row.lower ? Math.min.apply(null, nums) : Math.max.apply(null, nums);
      }
      var tr = el("tr");
      tr.appendChild(el("td", { text: row.item }));
      vals.forEach(function (v, i) {
        var isSelf = i === 0 && cols[i] && cols[i].self;
        var td = el("td", { class: "num" + (isSelf ? " self-col" : "") });
        var txt = fmt(v, row.dec) + (row.suffix && typeof v === "number" ? row.suffix : "");
        td.textContent = txt;
        if (best !== null && Number(v) === best) td.className += " is-best";
        tr.appendChild(td);
      });
      body.appendChild(tr);
    });

    var cap = $("cmp-cap");
    if (cap && D.comparison.scale) {
      cap.innerHTML = "主分＝剔除无效回答后的有效得分；全量分＝无效回答计 0 并保留在分母。" +
        "评测覆盖 <strong>" + D.comparison.scale.tasks + "</strong> 项任务、<strong>" +
        D.comparison.scale.questions + "</strong> 道题目。";
    }
  })();

  /* ---------------- 两榜总分 ---------------- */
  (function () {
    var box = $("benchmark-charts");
    if (!box) return;
    (D.benchmarks || []).forEach(function (b) {
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
      var th = el("th", { class: i === 0 ? "" : "num" });
      th.appendChild(document.createTextNode(c));
      if (i === 1) {
        th.className += " self-col";
        th.appendChild(el("span", { class: "col-tag", text: "自研" }));
      }
      head.appendChild(th);
    });
    D.fullScores.forEach(function (r) {
      var tr = el("tr");
      tr.appendChild(el("td", { text: r.dataset }));
      [r.self, r.rivalOne, r.rivalTwo, r.base].forEach(function (v, i) {
        tr.appendChild(el("td", { class: "num" + (i === 0 ? " self-col" : ""), text: fmt(v) }));
      });
      body.appendChild(tr);
    });
    fillParas("full-score-cap", D.fullScoreCaption);
  })();

  /* ---------------- 能力维度 ---------------- */
  (function () {
    var host = $("radar");
    if (!host) return;
    var dims = D.dimensions || [];
    if (dims.length < 3) return;

    var W = 480, H = 470, cx = 240, cy = 232, R = 150;
    var n = dims.length;
    var maxV = D.dimensionMax || 100;
    var s = svgEl("svg", { class: "radar-svg", viewBox: "0 0 " + W + " " + H, role: "img", "aria-label": "八维度雷达对比图" });

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
      s.appendChild(svgEl("polygon", { class: "radar-grid", points: poly(function () { return r; }) }));
    });
    for (var i = 0; i < n; i++) {
      var p = pt(i, 1);
      s.appendChild(svgEl("line", { class: "radar-axis", x1: cx, y1: cy, x2: p[0].toFixed(1), y2: p[1].toFixed(1) }));
    }

    if (D.dimensionBase) {
      s.appendChild(svgEl("polygon", { class: "radar-area-base", points: poly(function (d) { return clamp(d.base); }) }));
    }
    s.appendChild(svgEl("polygon", { class: "radar-area-self", points: poly(function (d) { return clamp(d.self); }) }));

    dims.forEach(function (d, i) {
      var pSelf = pt(i, clamp(d.self));
      s.appendChild(svgEl("circle", { class: "radar-dot-self", cx: pSelf[0].toFixed(1), cy: pSelf[1].toFixed(1), r: 3.4 }));
      if (D.dimensionBase) {
        var pB = pt(i, clamp(d.base));
        s.appendChild(svgEl("circle", { class: "radar-dot-base", cx: pB[0].toFixed(1), cy: pB[1].toFixed(1), r: 2.6 }));
      }

      var lp = pt(i, 1.24);
      var anchor = Math.abs(lp[0] - cx) < 14 ? "middle" : (lp[0] > cx ? "start" : "end");
      s.appendChild(svgEl("text", {
        class: "radar-axis-label",
        x: lp[0].toFixed(1), y: (lp[1] - 4).toFixed(1),
        "text-anchor": anchor, text: d.short || d.name
      }));
      s.appendChild(svgEl("text", {
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
    fillParas("dimension-cap", D.dimensionNote);
  })();

  /* ---------------- 任务级明细 ---------------- */
  (function () {
    var host = $("task-tables");
    if (!host) return;
    (D.taskSets || []).forEach(function (set, si) {
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

      var block = el("div", { class: "task-block" }, [
        el("div", { class: "task-title" }, [
          el("span", { text: set.title }),
          el("span", { class: "task-count", text: (set.rows || []).length + " 项" })
        ]),
        el("div", { class: "table-wrap" }, [el("table", {}, [el("thead", {}, [head]), tb])]),
        set.note ? el("p", { class: "task-note", text: set.note }) : null
      ]);
      if (si !== 0) block.setAttribute("hidden", "");
      block.dataset.tab = String(si);
      host.appendChild(block);
    });

    /* 标签页切换 */
    var tabs = $("task-tabs");
    if (tabs) {
      tabs.addEventListener("click", function (e) {
        var btn = e.target.closest ? e.target.closest(".tab") : null;
        if (!btn) return;
        var idx = btn.getAttribute("data-tab");
        Array.prototype.forEach.call(tabs.querySelectorAll(".tab"), function (b) {
          b.classList.toggle("is-active", b === btn);
        });
        Array.prototype.forEach.call(host.querySelectorAll(".task-block"), function (b) {
          if (b.dataset.tab === idx) b.removeAttribute("hidden");
          else b.setAttribute("hidden", "");
        });
      });
    }
    fillParas("verify-cap", D.verifyNote);
  })();

  /* ---------------- 工程表现 ---------------- */
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

  /* ---------------- 页脚 ---------------- */
  fillParas("footer-note", D.footerNote);

  (function () {
    var d = $("footer-date");
    if (d && D.meta && D.meta.updated) d.textContent = "评测更新：" + D.meta.updated;
  })();

  /* ---------------- 浮动侧边导航：滚动高亮 ---------------- */
  (function () {
    var links = Array.prototype.slice.call(document.querySelectorAll(".rail-nav a"));
    if (!links.length) return;
    var sections = links.map(function (a) {
      return document.querySelector(a.getAttribute("href"));
    }).filter(Boolean);
    if (!sections.length) return;

    function sync() {
      var probe = window.scrollY + window.innerHeight * 0.32;
      var idx = 0;
      for (var i = 0; i < sections.length; i++) {
        var top = sections[i].getBoundingClientRect().top + window.scrollY;
        if (top <= probe) idx = i;
      }
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) {
        idx = sections.length - 1;
      }
      links.forEach(function (a, i) {
        if (i === idx) a.classList.add("is-active");
        else a.classList.remove("is-active");
      });
    }

    var queued = false;
    window.addEventListener("scroll", function () {
      if (queued) return;
      queued = true;
      window.requestAnimationFrame(function () { queued = false; sync(); });
    }, { passive: true });
    window.addEventListener("resize", sync);
    sync();
  })();
})();
