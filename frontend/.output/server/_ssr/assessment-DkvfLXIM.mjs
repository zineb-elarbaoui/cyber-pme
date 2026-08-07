import { i as __toESM } from "../_runtime.mjs";
import { c as scaleLabels3, l as scaleLabels5, n as domainQuestions, t as contextualQuestions } from "./mock-data-BnxDtUDN.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { y as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { C as CircleCheck, O as ArrowRight, k as ArrowLeft } from "../_libs/lucide-react.mjs";
import { t as AppShell } from "./AppShell-Cm9lcG9b.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/assessment-DkvfLXIM.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var questions = [...contextualQuestions.map((q, i) => ({
	id: `c${i}`,
	type: "context",
	text: q
})), ...domainQuestions.map((q, i) => ({
	id: `d${i}`,
	type: "domain",
	text: q.question,
	domain: q.domainName
}))];
function AssessmentPage() {
	const nav = useNavigate();
	const [idx, setIdx] = (0, import_react.useState)(0);
	const [answers, setAnswers] = (0, import_react.useState)({});
	const q = questions[idx];
	const scale = q.type === "context" ? scaleLabels3 : scaleLabels5;
	const answered = q.id in answers;
	const total = questions.length;
	const done = Object.keys(answers).length;
	const pct = (idx + (answered ? 1 : 0)) / total * 100;
	const grouped = (0, import_react.useMemo)(() => ({
		context: questions.filter((x) => x.type === "context"),
		domain: questions.filter((x) => x.type === "domain")
	}), []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {
		crumbs: [
			{
				label: "Accueil",
				to: "/"
			},
			{
				label: "Profil",
				to: "/profile"
			},
			{ label: "Questionnaire" }
		],
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mx-auto max-w-5xl px-6 py-12",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
					className: "mb-6 flex flex-wrap items-end justify-between gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-[11px] font-semibold uppercase tracking-widest text-[oklch(0.55_0.16_255)]",
						children: q.type === "context" ? "Bloc contextuel · impact métier" : `Bloc maturité · ${q.domain}`
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-2 font-display text-2xl font-semibold tracking-tight",
						children: "Questionnaire de maturité"
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-right",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-[11px] font-medium uppercase tracking-wider text-muted-foreground",
							children: "Progression"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "font-display text-xl font-semibold tabular-nums",
							children: [done, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-sm text-muted-foreground",
								children: ["/", total]
							})]
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mb-8 h-1.5 w-full overflow-hidden rounded-full bg-secondary",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-full rounded-full bg-primary transition-all",
						style: { width: `${pct}%` }
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-6 lg:grid-cols-[1fr_260px]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl border border-border bg-gradient-card p-6 shadow-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2 text-xs text-muted-foreground",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "inline-flex h-6 items-center rounded-md bg-secondary px-2 font-medium",
									children: [
										"Question ",
										idx + 1,
										" / ",
										total
									]
								}), q.type === "domain" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "rounded-md bg-primary/5 px-2 py-0.5 font-medium text-primary",
									children: q.domain
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "mt-3 font-display text-[22px] font-semibold leading-snug text-foreground",
								children: q.text
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-6 grid gap-2",
								children: scale.map((s) => {
									const active = answers[q.id] === s.value;
									return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										onClick: () => setAnswers((a) => ({
											...a,
											[q.id]: s.value
										})),
										className: "group flex items-start gap-4 rounded-lg border p-4 text-left transition " + (active ? "border-primary bg-primary/5 shadow-elegant" : "border-border bg-background hover:border-ring/60"),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "flex h-9 w-9 shrink-0 items-center justify-center rounded-md font-display text-sm font-semibold tabular-nums transition " + (active ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground group-hover:bg-primary/10"),
											children: s.value
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "min-w-0",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center gap-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "font-semibold text-foreground",
													children: s.title
												}), active && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-4 w-4 text-primary" })]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "text-sm text-muted-foreground",
												children: s.desc
											})]
										})]
									}, s.value);
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-6 flex items-center justify-between border-t border-border pt-5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: () => setIdx((i) => Math.max(0, i - 1)),
									disabled: idx === 0,
									className: "inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-3.5 py-2 text-sm font-medium transition hover:bg-secondary disabled:opacity-40",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-4 w-4" }), " Précédent"]
								}), idx < total - 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: () => setIdx((i) => i + 1),
									disabled: !answered,
									className: "inline-flex items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-elegant transition hover:opacity-95 disabled:opacity-40",
									children: ["Suivant ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-4 w-4" })]
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: () => nav({ to: "/results" }),
									disabled: !answered,
									className: "inline-flex items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-elegant transition hover:opacity-95 disabled:opacity-40",
									children: ["Voir mes résultats ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-4 w-4" })]
								})]
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
						className: "rounded-xl border border-border bg-card p-4 shadow-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mb-2 text-[10.5px] font-semibold uppercase tracking-wider text-muted-foreground",
								children: "Structure"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
								title: `Contexte (${grouped.context.length})`,
								items: grouped.context,
								idx,
								setIdx,
								answers
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
								title: `Domaines (${grouped.domain.length})`,
								items: grouped.domain,
								idx,
								setIdx,
								answers
							})
						]
					})]
				})
			]
		})
	});
}
function Section({ title, items, idx, setIdx, answers }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mb-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mb-1.5 text-xs font-semibold text-foreground",
			children: title
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
			className: "grid grid-cols-9 gap-1",
			children: items.map((it) => {
				const globalIdx = it.id.startsWith("c") ? parseInt(it.id.slice(1)) : parseInt(it.id.slice(1)) + 9;
				const current = globalIdx === idx;
				const done = it.id in answers;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => setIdx(globalIdx),
					className: "flex h-7 w-full items-center justify-center rounded text-[10.5px] font-semibold tabular-nums transition " + (current ? "bg-primary text-primary-foreground" : done ? "bg-[oklch(0.62_0.16_155)]/15 text-[oklch(0.35_0.13_155)]" : "bg-secondary text-muted-foreground hover:bg-secondary/70"),
					title: it.text,
					children: globalIdx + 1
				}) }, it.id);
			})
		})]
	});
}
//#endregion
export { AssessmentPage as component };
