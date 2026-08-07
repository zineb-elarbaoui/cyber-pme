import { i as __toESM } from "../_runtime.mjs";
import { i as globalScore, o as maturityLabel, r as domains, s as recommendations } from "./mock-data-BnxDtUDN.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { O as ArrowRight, T as ChevronDown, b as Download, l as Share2, n as TriangleAlert, r as TrendingUp, s as ShieldCheck, v as Funnel } from "../_libs/lucide-react.mjs";
import { t as AppShell } from "./AppShell-Cm9lcG9b.mjs";
import { n as MetaBadge, r as PriorityBadge, t as DomainTag } from "./Badges-CPPHgMFM.mjs";
import { c as Radar, d as PolarGrid, f as ResponsiveContainer, l as PolarAngleAxis, n as RadarChart, u as PolarRadiusAxis } from "../_libs/recharts+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/results-5_OSOCUm.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ScoreGauge({ score, size = 220 }) {
	const pct = Math.min(1, score / 102);
	const stroke = 14;
	const r = size / 2 - stroke;
	const c = 2 * Math.PI * r;
	const label = maturityLabel(score);
	const toneColor = label.tone === "success" ? "oklch(0.62 0.16 155)" : label.tone === "warning" ? "oklch(0.72 0.16 60)" : label.tone === "critical" ? "oklch(0.58 0.22 25)" : "oklch(0.55 0.16 255)";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative inline-flex items-center justify-center",
		style: {
			width: size,
			height: size
		},
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
			width: size,
			height: size,
			className: "-rotate-90",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("defs", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("linearGradient", {
					id: "gaugeGrad",
					x1: "0",
					y1: "0",
					x2: "1",
					y2: "1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
						offset: "0%",
						stopColor: "oklch(0.55 0.16 255)"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
						offset: "100%",
						stopColor: toneColor
					})]
				}) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
					cx: size / 2,
					cy: size / 2,
					r,
					stroke: "oklch(0.92 0.015 250)",
					strokeWidth: stroke,
					fill: "none"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
					cx: size / 2,
					cy: size / 2,
					r,
					stroke: "url(#gaugeGrad)",
					strokeWidth: stroke,
					strokeLinecap: "round",
					fill: "none",
					strokeDasharray: c,
					strokeDashoffset: c * (1 - pct)
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "absolute inset-0 flex flex-col items-center justify-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "font-display text-5xl font-semibold tabular-nums tracking-tight",
					children: score
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-xs text-muted-foreground",
					children: ["/ ", 102]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-1.5 text-[11px] font-medium uppercase tracking-wider",
					style: { color: toneColor },
					children: label.label
				})
			]
		})]
	});
}
var data = domains.map((d) => ({
	domain: d.name.split(" ").slice(0, 2).join(" "),
	score: d.score,
	full: d.max
}));
function DomainRadar() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "h-[320px] w-full",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(RadarChart, {
			data,
			outerRadius: "72%",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PolarGrid, { stroke: "oklch(0.88 0.02 250)" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PolarAngleAxis, {
					dataKey: "domain",
					tick: {
						fill: "oklch(0.35 0.05 258)",
						fontSize: 10.5
					}
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PolarRadiusAxis, {
					angle: 90,
					domain: [0, 5],
					tick: {
						fill: "oklch(0.6 0.03 258)",
						fontSize: 9
					},
					axisLine: false
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Radar, {
					dataKey: "score",
					stroke: "oklch(0.55 0.16 255)",
					fill: "oklch(0.55 0.16 255)",
					fillOpacity: .28,
					strokeWidth: 2
				})
			]
		}) })
	});
}
function DomainBars() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "space-y-2.5",
		children: domains.map((d) => {
			const pct = d.score / d.max * 100;
			const tone = d.score <= 1 ? "oklch(0.58 0.22 25)" : d.score <= 2 ? "oklch(0.72 0.16 60)" : d.score <= 3 ? "oklch(0.55 0.16 255)" : "oklch(0.62 0.16 155)";
			return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-[1fr_auto] items-center gap-3",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-1 flex items-center justify-between text-xs",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-medium text-foreground",
						children: d.name
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "tabular-nums text-muted-foreground",
						children: [
							d.score,
							"/",
							d.max
						]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "h-1.5 w-full overflow-hidden rounded-full bg-secondary",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-full rounded-full transition-all",
						style: {
							width: `${pct}%`,
							background: tone
						}
					})
				})] })
			}, d.id);
		})
	});
}
function RecommendationCard({ rec, index }) {
	const [open, setOpen] = (0, import_react.useState)(false);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("article", {
		className: "group relative overflow-hidden rounded-xl border border-border bg-gradient-card shadow-sm transition hover:shadow-elegant",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col gap-4 p-5 md:flex-row md:items-start md:gap-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/5 font-display text-sm font-semibold text-primary tabular-nums ring-1 ring-primary/10",
				children: String(index + 1).padStart(2, "0")
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-w-0 flex-1",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PriorityBadge, { priority: rec.priority }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DomainTag, { children: rec.domainName })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "mt-2.5 font-display text-[17px] font-semibold leading-snug text-foreground",
						children: rec.title
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1.5 text-sm leading-relaxed text-muted-foreground",
						children: rec.summary
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 flex flex-wrap gap-1.5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MetaBadge, {
								label: "Coût",
								value: rec.cost
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MetaBadge, {
								label: "Difficulté",
								value: rec.difficulty
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MetaBadge, {
								label: "Impact",
								value: rec.impact
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MetaBadge, {
								label: "Réf.",
								value: rec.guideRef
							})
						]
					}),
					open && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 rounded-lg border border-border bg-secondary/40 p-4 text-sm leading-relaxed text-foreground/85",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mb-1.5 text-[10.5px] font-semibold uppercase tracking-wider text-muted-foreground",
							children: "Justification (RAG)"
						}), rec.rationale]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => setOpen((v) => !v),
							className: "inline-flex items-center gap-1 rounded-md border border-border bg-background px-2.5 py-1.5 text-xs font-medium text-foreground transition hover:bg-secondary",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "h-3.5 w-3.5 transition-transform " + (open ? "rotate-180" : "") }), open ? "Masquer" : "Voir la justification"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/recommendation/$id",
							params: { id: rec.id },
							className: "inline-flex items-center gap-1 rounded-md bg-primary px-2.5 py-1.5 text-xs font-medium text-primary-foreground transition hover:opacity-95",
							children: ["Détail ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-3.5 w-3.5" })]
						})]
					})
				]
			})]
		})
	});
}
var priorityOrder = [
	"critical",
	"high",
	"medium",
	"low"
];
function ResultsPage() {
	const [prio, setPrio] = (0, import_react.useState)("all");
	const [dom, setDom] = (0, import_react.useState)("all");
	const [cost, setCost] = (0, import_react.useState)("all");
	const filtered = (0, import_react.useMemo)(() => {
		return recommendations.filter((r) => prio === "all" ? true : r.priority === prio).filter((r) => dom === "all" ? true : r.domainId === dom).filter((r) => cost === "all" ? true : r.cost === cost).sort((a, b) => priorityOrder.indexOf(a.priority) - priorityOrder.indexOf(b.priority));
	}, [
		prio,
		dom,
		cost
	]);
	maturityLabel(globalScore);
	const criticalCount = recommendations.filter((r) => r.priority === "critical").length;
	const highCount = recommendations.filter((r) => r.priority === "high").length;
	const strongest = [...domains].sort((a, b) => b.score - a.score)[0];
	const weakest = [...domains].sort((a, b) => a.score - b.score)[0];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {
		crumbs: [
			{
				label: "Accueil",
				to: "/"
			},
			{
				label: "Questionnaire",
				to: "/assessment"
			},
			{ label: "Résultats" }
		],
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mx-auto max-w-7xl px-6 py-10",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-8 flex flex-wrap items-end justify-between gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-[11px] font-semibold uppercase tracking-widest text-[oklch(0.55_0.16_255)]",
							children: "Rapport de diagnostic · Atlas Distribution SARL"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "mt-2 font-display text-3xl font-semibold tracking-tight",
							children: "Votre posture cybersécurité"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm text-muted-foreground",
							children: "Généré le 17 juillet 2026 · basé sur 24 réponses et le référentiel ANRT PME."
						})
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							className: "inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-3 py-2 text-sm font-medium transition hover:bg-secondary",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Share2, { className: "h-4 w-4" }), " Partager"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							className: "inline-flex items-center gap-1.5 rounded-md bg-primary px-3.5 py-2 text-sm font-medium text-primary-foreground shadow-elegant transition hover:opacity-95",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "h-4 w-4" }), " Exporter en PDF"]
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-5 lg:grid-cols-[380px_1fr]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl border border-border bg-gradient-card p-6 shadow-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-[11px] font-semibold uppercase tracking-widest text-muted-foreground",
								children: "Score global de maturité"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-3 flex flex-col items-center",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScoreGauge, { score: globalScore })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-6 grid grid-cols-2 gap-2 text-center text-xs",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-lg border border-border bg-background p-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-[10.5px] font-medium uppercase tracking-wider text-muted-foreground",
										children: "Objectif 12 mois"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-1 font-display text-xl font-semibold",
										children: ["75", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-xs text-muted-foreground",
											children: ["/", 102]
										})]
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-lg border border-border bg-background p-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-[10.5px] font-medium uppercase tracking-wider text-muted-foreground",
										children: "Progression"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-1 inline-flex items-center gap-1 font-display text-xl font-semibold text-[oklch(0.55_0.16_155)]",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "h-4 w-4" }), " +16"]
									})]
								})]
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-3 sm:grid-cols-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
									icon: TriangleAlert,
									tone: "critical",
									value: criticalCount,
									label: "Actions critiques"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
									icon: TriangleAlert,
									tone: "warning",
									value: highCount,
									label: "Priorité élevée"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
									icon: ShieldCheck,
									tone: "success",
									value: strongest.name,
									label: "Domaine le plus mature"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
									icon: TriangleAlert,
									tone: "critical",
									value: weakest.name,
									label: "Domaine à renforcer"
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-2xl border border-border bg-gradient-card p-5 shadow-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mb-3 flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-[11px] font-semibold uppercase tracking-widest text-muted-foreground",
									children: "Maturité par domaine"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-0.5 font-display text-lg font-semibold",
									children: "15 domaines évalués"
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex gap-1.5 text-[10.5px]",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LegendDot, {
											color: "oklch(0.58 0.22 25)",
											label: "0–1 Critique"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LegendDot, {
											color: "oklch(0.72 0.16 60)",
											label: "2 À renforcer"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LegendDot, {
											color: "oklch(0.55 0.16 255)",
											label: "3 Défini"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LegendDot, {
											color: "oklch(0.62 0.16 155)",
											label: "4–5 Maîtrisé"
										})
									]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DomainRadar, {})]
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-5 grid gap-5 lg:grid-cols-[1.4fr_1fr]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl border border-border bg-card p-6 shadow-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mb-4 flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-[11px] font-semibold uppercase tracking-widest text-muted-foreground",
								children: "Détail par domaine"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-0.5 font-display text-lg font-semibold",
								children: "Forces et faiblesses"
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs text-muted-foreground",
								children: "Échelle 0–5"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DomainBars, {})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl border border-border bg-card p-6 shadow-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-[11px] font-semibold uppercase tracking-widest text-muted-foreground",
								children: "Conformité réglementaire"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-0.5 font-display text-lg font-semibold",
								children: "Obligations identifiées"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-4 space-y-3",
								children: [
									{
										r: "Loi 09-08 (Maroc)",
										status: "Partiel",
										tone: "warning",
										note: "Déclaration CNDP incomplète"
									},
									{
										r: "RGPD (clients UE)",
										status: "Non conforme",
										tone: "critical",
										note: "Registre des traitements absent"
									},
									{
										r: "Guide ANRT PME",
										status: "Aligné (58%)",
										tone: "primary",
										note: "8 domaines sur 15 conformes"
									},
									{
										r: "CERT-MA — bonnes pratiques",
										status: "À initier",
										tone: "warning",
										note: "Contact d'urgence non déclaré"
									}
								].map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-start justify-between gap-3 rounded-lg border border-border bg-background p-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-sm font-semibold",
										children: c.r
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-xs text-muted-foreground",
										children: c.note
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusChip, {
										tone: c.tone,
										children: c.status
									})]
								}, c.r))
							})
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-10",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-4 flex flex-wrap items-end justify-between gap-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-[11px] font-semibold uppercase tracking-widest text-[oklch(0.55_0.16_255)]",
								children: "Plan d'action priorisé"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
								className: "mt-1 font-display text-2xl font-semibold tracking-tight",
								children: [
									filtered.length,
									" recommandation",
									filtered.length > 1 ? "s" : "",
									" personnalisée",
									filtered.length > 1 ? "s" : ""
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-sm text-muted-foreground",
								children: "Triées par score de priorité = urgence × impact × faisabilité."
							})
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-center gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Funnel, { className: "h-4 w-4 text-muted-foreground" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select, {
									label: "Priorité",
									value: prio,
									onChange: setPrio,
									options: [
										{
											v: "all",
											l: "Toutes"
										},
										{
											v: "critical",
											l: "Critique"
										},
										{
											v: "high",
											l: "Élevée"
										},
										{
											v: "medium",
											l: "Moyenne"
										},
										{
											v: "low",
											l: "Faible"
										}
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select, {
									label: "Domaine",
									value: dom,
									onChange: setDom,
									options: [{
										v: "all",
										l: "Tous"
									}, ...domains.map((d) => ({
										v: d.id,
										l: d.name
									}))]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select, {
									label: "Coût",
									value: cost,
									onChange: setCost,
									options: [
										{
											v: "all",
											l: "Tous"
										},
										{
											v: "faible",
											l: "Faible"
										},
										{
											v: "moyen",
											l: "Moyen"
										},
										{
											v: "eleve",
											l: "Élevé"
										}
									]
								})
							]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid gap-3",
						children: filtered.map((r, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RecommendationCard, {
							rec: r,
							index: i
						}, r.id))
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-10 rounded-2xl border border-border bg-gradient-hero p-6 text-primary-foreground shadow-elegant",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center justify-between gap-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-[11px] font-semibold uppercase tracking-widest text-white/70",
								children: "Prochaine étape"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-1 font-display text-xl font-semibold",
								children: "Suivre l'exécution de votre plan d'action"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-1 text-sm text-white/75",
								children: "Créez un espace de suivi pour mesurer votre progression trimestrielle."
							})
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-primary shadow-elegant hover:bg-white/95",
							children: "Activer le suivi"
						})]
					})
				})
			]
		})
	});
}
function Kpi({ icon: Icon, tone, value, label }) {
	const map = {
		critical: {
			bg: "bg-[oklch(0.97_0.03_25)]",
			fg: "text-[oklch(0.42_0.19_25)]"
		},
		warning: {
			bg: "bg-[oklch(0.97_0.04_60)]",
			fg: "text-[oklch(0.42_0.14_60)]"
		},
		success: {
			bg: "bg-[oklch(0.97_0.03_155)]",
			fg: "text-[oklch(0.35_0.13_155)]"
		},
		primary: {
			bg: "bg-[oklch(0.97_0.02_255)]",
			fg: "text-[oklch(0.32_0.11_260)]"
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-xl border border-border bg-gradient-card p-4 shadow-sm",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "inline-flex h-8 w-8 items-center justify-center rounded-lg " + map[tone].bg + " " + map[tone].fg,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-4 w-4" })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-3 font-display text-lg font-semibold leading-tight",
				children: value
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-0.5 text-[11px] uppercase tracking-wider text-muted-foreground",
				children: label
			})
		]
	});
}
function StatusChip({ tone, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "rounded-full px-2.5 py-0.5 text-[11px] font-semibold ring-1 ring-inset " + {
			critical: "bg-[oklch(0.97_0.03_25)] text-[oklch(0.42_0.19_25)] ring-[oklch(0.58_0.22_25)]/25",
			warning: "bg-[oklch(0.97_0.04_60)] text-[oklch(0.42_0.14_60)] ring-[oklch(0.72_0.16_60)]/25",
			success: "bg-[oklch(0.97_0.03_155)] text-[oklch(0.35_0.13_155)] ring-[oklch(0.62_0.16_155)]/25",
			primary: "bg-[oklch(0.97_0.02_255)] text-[oklch(0.32_0.11_260)] ring-[oklch(0.55_0.16_255)]/25"
		}[tone],
		children
	});
}
function LegendDot({ color, label }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: "inline-flex items-center gap-1 text-muted-foreground",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "h-2 w-2 rounded-full",
				style: { background: color }
			}),
			" ",
			label
		]
	});
}
function Select({ label, value, onChange, options }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: "inline-flex items-center gap-1.5 rounded-md border border-border bg-background pl-2.5 pr-1.5 text-xs",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-muted-foreground",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
			value,
			onChange: (e) => onChange(e.target.value),
			className: "cursor-pointer border-0 bg-transparent py-1.5 text-xs font-semibold text-foreground outline-none",
			children: options.map((o) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
				value: o.v,
				children: o.l
			}, o.v))
		})]
	});
}
//#endregion
export { ResultsPage as component };
