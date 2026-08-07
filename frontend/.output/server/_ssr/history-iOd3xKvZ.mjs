import { a as historyPoints, i as globalScore, s as recommendations } from "./mock-data-BnxDtUDN.mjs";
import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { C as CircleCheck, r as TrendingUp, x as Clock } from "../_libs/lucide-react.mjs";
import { t as AppShell } from "./AppShell-Cm9lcG9b.mjs";
import { r as PriorityBadge, t as DomainTag } from "./Badges-CPPHgMFM.mjs";
import { a as Area, f as ResponsiveContainer, i as XAxis, o as Line, p as Tooltip, r as YAxis, s as CartesianGrid, t as AreaChart } from "../_libs/recharts+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/history-iOd3xKvZ.js
var import_jsx_runtime = require_jsx_runtime();
function HistoryPage() {
	const treated = recommendations.slice(0, 3);
	const pending = recommendations.slice(3);
	const delta = historyPoints[historyPoints.length - 1].score - historyPoints[0].score;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {
		crumbs: [{
			label: "Accueil",
			to: "/"
		}, { label: "Historique" }],
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mx-auto max-w-7xl px-6 py-10",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
					className: "mb-8 flex flex-wrap items-end justify-between gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-[11px] font-semibold uppercase tracking-widest text-[oklch(0.55_0.16_255)]",
						children: "Suivi long terme · Atlas Distribution SARL"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-2 font-display text-3xl font-semibold tracking-tight",
						children: "Évolution de votre maturité cyber"
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2 rounded-lg border border-border bg-card p-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "h-5 w-5 text-[oklch(0.55_0.16_155)]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-[10.5px] font-medium uppercase tracking-wider text-muted-foreground",
							children: "Progression 12 mois"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "font-display text-xl font-semibold text-[oklch(0.35_0.13_155)]",
							children: [
								"+",
								delta,
								" points"
							]
						})] })]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-2xl border border-border bg-gradient-card p-6 shadow-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-4 flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-[11px] font-semibold uppercase tracking-widest text-muted-foreground",
							children: "Score global"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "font-display text-lg font-semibold",
							children: "Évolution trimestrielle"
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-right",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-[10.5px] font-medium uppercase tracking-wider text-muted-foreground",
								children: "Actuel"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "font-display text-2xl font-semibold tabular-nums",
								children: [globalScore, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-sm text-muted-foreground",
									children: "/102"
								})]
							})]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-[280px] w-full",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AreaChart, {
							data: historyPoints,
							margin: {
								top: 5,
								right: 12,
								left: -12,
								bottom: 0
							},
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("defs", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("linearGradient", {
									id: "areaGrad",
									x1: "0",
									y1: "0",
									x2: "0",
									y2: "1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
										offset: "0%",
										stopColor: "oklch(0.55 0.16 255)",
										stopOpacity: .35
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
										offset: "100%",
										stopColor: "oklch(0.55 0.16 255)",
										stopOpacity: 0
									})]
								}) }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
									stroke: "oklch(0.92 0.015 250)",
									vertical: false
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
									dataKey: "date",
									tick: {
										fill: "oklch(0.5 0.03 258)",
										fontSize: 11
									},
									axisLine: false,
									tickLine: false
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
									domain: [0, 102],
									tick: {
										fill: "oklch(0.5 0.03 258)",
										fontSize: 11
									},
									axisLine: false,
									tickLine: false
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { contentStyle: {
									background: "oklch(0.22 0.07 258)",
									border: "none",
									borderRadius: 8,
									color: "white",
									fontSize: 12
								} }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Area, {
									type: "monotone",
									dataKey: "score",
									stroke: "oklch(0.55 0.16 255)",
									strokeWidth: 2.5,
									fill: "url(#areaGrad)"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
									type: "monotone",
									dataKey: "score",
									stroke: "oklch(0.55 0.16 255)",
									strokeWidth: 0,
									dot: {
										r: 4,
										fill: "oklch(0.55 0.16 255)"
									}
								})
							]
						}) })
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 grid gap-5 lg:grid-cols-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
						title: "Recommandations traitées",
						count: treated.length,
						icon: CircleCheck,
						tone: "success",
						children: treated.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RowItem, {
							rec: r,
							status: "done"
						}, r.id))
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
						title: "En attente d'action",
						count: pending.length,
						icon: Clock,
						tone: "warning",
						children: pending.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RowItem, {
							rec: r,
							status: "pending"
						}, r.id))
					})]
				})
			]
		})
	});
}
function Panel({ title, count, icon: Icon, tone, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-2xl border border-border bg-card p-5 shadow-sm",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-4 flex items-center justify-between",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "inline-flex h-7 w-7 items-center justify-center rounded-md " + (tone === "success" ? "bg-[oklch(0.97_0.03_155)] text-[oklch(0.35_0.13_155)]" : "bg-[oklch(0.97_0.04_60)] text-[oklch(0.42_0.14_60)]"),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-4 w-4" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-base font-semibold",
					children: title
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "rounded-full bg-secondary px-2 py-0.5 text-xs font-semibold",
				children: count
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "space-y-2",
			children
		})]
	});
}
function RowItem({ rec, status }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center justify-between gap-3 rounded-lg border border-border bg-background p-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "min-w-0",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PriorityBadge, { priority: rec.priority }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DomainTag, { children: rec.domainName })]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-1.5 truncate text-sm font-semibold text-foreground",
				children: rec.title
			})]
		}), status === "done" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "inline-flex items-center gap-1 rounded-full bg-[oklch(0.97_0.03_155)] px-2.5 py-0.5 text-[11px] font-semibold text-[oklch(0.35_0.13_155)] ring-1 ring-inset ring-[oklch(0.62_0.16_155)]/25",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-3 w-3" }), " Traitée"]
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "inline-flex items-center gap-1 rounded-full bg-secondary px-2.5 py-0.5 text-[11px] font-semibold text-muted-foreground",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "h-3 w-3" }), " En attente"]
		})]
	});
}
//#endregion
export { HistoryPage as component };
