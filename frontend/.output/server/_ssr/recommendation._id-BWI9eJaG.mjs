import { i as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { C as CircleCheck, D as BookOpen, a as Star, f as MessageSquare, i as ThumbsUp, k as ArrowLeft } from "../_libs/lucide-react.mjs";
import { t as AppShell } from "./AppShell-Cm9lcG9b.mjs";
import { n as MetaBadge, r as PriorityBadge, t as DomainTag } from "./Badges-CPPHgMFM.mjs";
import { n as Route } from "./router-CF7J5Eul.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/recommendation._id-BWI9eJaG.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function RecommendationDetail() {
	const { rec } = Route.useLoaderData();
	const [rating, setRating] = (0, import_react.useState)(0);
	const [applied, setApplied] = (0, import_react.useState)(null);
	const [comment, setComment] = (0, import_react.useState)("");
	const [submitted, setSubmitted] = (0, import_react.useState)(false);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {
		crumbs: [
			{
				label: "Résultats",
				to: "/results"
			},
			{ label: rec.domainName },
			{ label: rec.title }
		],
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mx-auto max-w-4xl px-6 py-10",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/results",
					className: "inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-3.5 w-3.5" }), " Retour au rapport"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
					className: "mt-4 rounded-2xl border border-border bg-gradient-card p-7 shadow-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PriorityBadge, { priority: rec.priority }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DomainTag, { children: rec.domainName })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "mt-3 font-display text-3xl font-semibold leading-tight tracking-tight",
							children: rec.title
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 max-w-2xl text-sm text-muted-foreground",
							children: rec.summary
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-5 flex flex-wrap gap-1.5",
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
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 grid gap-5 lg:grid-cols-[1fr_260px]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
								title: "Description de la mesure",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm leading-relaxed text-foreground/85",
									children: rec.description
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
								title: "Pourquoi cette recommandation",
								icon: BookOpen,
								accent: true,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm leading-relaxed text-foreground/85",
									children: rec.rationale
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("blockquote", {
									className: "mt-4 border-l-2 border-primary/40 bg-secondary/50 pl-4 py-2 text-sm italic text-muted-foreground",
									children: ["« Toute PME exposée à Internet doit protéger ses accès à privilèges par une authentification à deux facteurs. »", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("cite", {
										className: "mt-1 block text-[11px] not-italic font-semibold uppercase tracking-wider text-foreground/60",
										children: ["— ", rec.guideRef]
									})]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
								title: "Étapes de mise en œuvre",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
									className: "space-y-3",
									children: [
										"Identifier les comptes critiques (admin, messagerie, VPN, SaaS).",
										"Choisir une solution MFA (authenticator app, clé physique FIDO2).",
										"Piloter avec 3 utilisateurs, documenter la procédure d'enrôlement.",
										"Déployer à l'ensemble des collaborateurs concernés.",
										"Mettre en place une procédure de récupération sécurisée."
									].map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
										className: "flex items-start gap-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 font-display text-[11px] font-semibold text-primary",
											children: i + 1
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-sm text-foreground/85",
											children: s
										})]
									}, i))
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
								title: "Cette recommandation est-elle pertinente ?",
								icon: MessageSquare,
								children: submitted ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2 rounded-lg bg-[oklch(0.97_0.03_155)] p-4 text-sm font-medium text-[oklch(0.35_0.13_155)]",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-4 w-4" }), " Merci ! Votre retour améliore les futures recommandations."]
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-4",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground",
											children: "Pertinence"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "flex gap-1",
											children: [
												1,
												2,
												3,
												4,
												5
											].map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												onClick: () => setRating(n),
												className: "rounded-md p-1.5 transition " + (n <= rating ? "text-[oklch(0.72_0.16_60)]" : "text-muted-foreground hover:text-foreground"),
												"aria-label": `${n} étoile${n > 1 ? "s" : ""}`,
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: "h-5 w-5 " + (n <= rating ? "fill-current" : "") })
											}, n))
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground",
											children: "Avez-vous appliqué cette mesure ?"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "flex flex-wrap gap-2",
											children: [
												"Déjà appliquée",
												"Planifiée",
												"En cours",
												"Non pertinente"
											].map((o) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												onClick: () => setApplied(o),
												className: "rounded-md border px-3 py-1.5 text-xs font-medium transition " + (applied === o ? "border-primary bg-primary/5 text-primary" : "border-border bg-background text-muted-foreground hover:border-ring/60"),
												children: o
											}, o))
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground",
											children: "Commentaire (optionnel)"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
											value: comment,
											onChange: (e) => setComment(e.target.value),
											rows: 3,
											placeholder: "Freins rencontrés, contexte particulier, question…",
											className: "w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/25"
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											onClick: () => setSubmitted(true),
											disabled: rating === 0,
											className: "inline-flex items-center gap-1.5 rounded-md bg-primary px-3.5 py-2 text-sm font-medium text-primary-foreground shadow-elegant transition hover:opacity-95 disabled:opacity-40",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThumbsUp, { className: "h-4 w-4" }), " Envoyer mon feedback"]
										})
									]
								})
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
						className: "space-y-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-xl border border-border bg-card p-5 shadow-sm",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-[10.5px] font-semibold uppercase tracking-wider text-muted-foreground",
									children: "Score de priorité"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-1 font-display text-3xl font-semibold tabular-nums",
									children: ["92", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-sm text-muted-foreground",
										children: "/100"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-3 space-y-2 text-xs",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScoreLine, {
											label: "Urgence",
											value: 95
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScoreLine, {
											label: "Impact",
											value: 90
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScoreLine, {
											label: "Faisabilité",
											value: 88
										})
									]
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-xl border border-border bg-card p-5 shadow-sm",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-[10.5px] font-semibold uppercase tracking-wider text-muted-foreground",
									children: "Source"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-1 text-sm font-semibold",
									children: rec.guideRef
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-2 text-xs text-muted-foreground",
									children: "Passage extrait par le moteur RAG à partir du guide officiel indexé (pgvector)."
								})
							]
						})]
					})]
				})
			]
		})
	});
}
function Panel({ title, icon: Icon, children, accent }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-xl border p-6 shadow-sm " + (accent ? "border-primary/20 bg-primary/[0.03]" : "border-border bg-card"),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-3 flex items-center gap-2",
			children: [Icon && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-4 w-4 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display text-base font-semibold",
				children: title
			})]
		}), children]
	});
}
function ScoreLine({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mb-1 flex items-center justify-between",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-muted-foreground",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "tabular-nums font-semibold text-foreground",
			children: value
		})]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "h-1.5 rounded-full bg-secondary",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "h-full rounded-full bg-primary",
			style: { width: `${value}%` }
		})
	})] });
}
//#endregion
export { RecommendationDetail as component };
