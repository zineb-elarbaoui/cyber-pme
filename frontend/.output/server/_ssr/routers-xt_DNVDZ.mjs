import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { C as CircleCheck, O as ArrowRight, d as Radar, m as ListChecks, p as Lock, s as ShieldCheck, x as Clock, y as FileText } from "../_libs/lucide-react.mjs";
import { t as AppShell } from "./AppShell-Cm9lcG9b.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routers-xt_DNVDZ.js
var import_jsx_runtime = require_jsx_runtime();
function Landing() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "relative overflow-hidden bg-gradient-hero text-primary-foreground",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 grid-pattern opacity-40" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute -right-40 top-1/2 h-[520px] w-[520px] -translate-y-1/2 rounded-full bg-[var(--primary-accent)]/25 blur-3xl" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative mx-auto grid max-w-7xl gap-12 px-6 py-24 lg:grid-cols-[1.15fr_0.85fr] lg:py-32",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.14em] text-white/80 backdrop-blur",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-1.5 w-1.5 rounded-full bg-[var(--primary-accent)]" }), "Programme national — CMRPI × AUSIM"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
							className: "mt-5 max-w-2xl font-display text-5xl font-semibold leading-[1.05] tracking-tight md:text-6xl",
							children: [
								"Diagnostiquez la ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[oklch(0.85_0.12_255)]",
									children: "maturité cyber"
								}),
								" de votre PME en 15 minutes."
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-5 max-w-xl text-[15px] leading-relaxed text-white/75",
							children: "Répondez à 24 questions guidées. Obtenez un plan d'action priorisé, adapté à votre secteur, votre taille et vos obligations légales — loi 09-08, RGPD, exigences sectorielles."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-8 flex flex-wrap items-center gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/profile",
								className: "inline-flex items-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-semibold text-primary shadow-elegant transition hover:bg-white/95",
								children: ["Démarrer mon évaluation ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-4 w-4" })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/results",
								className: "inline-flex items-center gap-2 rounded-lg border border-white/25 bg-white/5 px-5 py-3 text-sm font-medium text-white backdrop-blur transition hover:bg-white/10",
								children: "Voir un exemple de rapport"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dl", {
							className: "mt-10 grid grid-cols-3 gap-6 border-t border-white/10 pt-6 text-white/80",
							children: [
								{
									k: "15 min",
									v: "Durée moyenne"
								},
								{
									k: "15",
									v: "Domaines évalués"
								},
								{
									k: "100 %",
									v: "Confidentiel"
								}
							].map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
								className: "font-display text-2xl font-semibold text-white",
								children: s.k
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
								className: "text-[11px] uppercase tracking-widest text-white/60",
								children: s.v
							})] }, s.k))
						})
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-2xl border border-white/15 bg-white/95 p-5 text-foreground shadow-2xl backdrop-blur",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-[10.5px] font-semibold uppercase tracking-widest text-muted-foreground",
											children: "Score global"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "mt-1 font-display text-4xl font-semibold tabular-nums",
											children: ["58", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-lg text-muted-foreground",
												children: "/102"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "mt-0.5 text-xs font-medium text-[oklch(0.55_0.16_255)]",
											children: "Maturité émergente"
										})
									] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-1 rounded-full bg-secondary px-2.5 py-1 text-[11px] font-medium text-secondary-foreground",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-3.5 w-3.5 text-[oklch(0.62_0.16_155)]" }), " Rapport prêt"]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-4 space-y-2",
									children: [
										{
											n: "Contrôle d'accès",
											v: 2,
											tone: "oklch(0.72 0.16 60)"
										},
										{
											n: "Continuité d'activité",
											v: 2,
											tone: "oklch(0.72 0.16 60)"
										},
										{
											n: "Sensibilisation",
											v: 1,
											tone: "oklch(0.58 0.22 25)"
										},
										{
											n: "Sécurité réseau",
											v: 3,
											tone: "oklch(0.55 0.16 255)"
										},
										{
											n: "Conformité 09-08",
											v: 2,
											tone: "oklch(0.72 0.16 60)"
										}
									].map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mb-1 flex items-center justify-between text-[11px]",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-medium",
											children: d.n
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "tabular-nums text-muted-foreground",
											children: [d.v, "/5"]
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "h-1.5 rounded-full bg-secondary",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "h-full rounded-full",
											style: {
												width: `${d.v / 5 * 100}%`,
												background: d.tone
											}
										})
									})] }, d.n))
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-4 flex items-center justify-between rounded-lg bg-secondary/60 p-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-[11px]",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "font-semibold text-foreground",
											children: "Prochaine action"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-muted-foreground",
											children: "Activer le MFA sur les comptes admin"
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "rounded-full bg-[oklch(0.97_0.03_25)] px-2 py-0.5 text-[10px] font-semibold text-[oklch(0.42_0.19_25)] ring-1 ring-inset ring-[oklch(0.58_0.22_25)]/25",
										children: "Critique"
									})]
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "absolute -bottom-4 -left-4 rounded-xl border border-white/15 bg-primary/70 p-3 text-[11px] text-white/85 backdrop-blur",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "h-3.5 w-3.5" }), "Données chiffrées · hébergement conforme"]
							})
						})]
					})]
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mx-auto max-w-7xl px-6 py-20",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-end justify-between gap-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-[11px] font-semibold uppercase tracking-widest text-[oklch(0.55_0.16_255)]",
					children: "Comment ça marche"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-2 font-display text-3xl font-semibold tracking-tight",
					children: "Un diagnostic conçu pour les dirigeants de PME."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "hidden max-w-md text-sm text-muted-foreground md:block",
					children: "Aucune expertise cyber requise. Chaque question est expliquée, chaque niveau détaillé. Le rapport est directement actionnable."
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-10 grid gap-4 md:grid-cols-4",
				children: [
					{
						i: ShieldCheck,
						t: "Profil PME",
						d: "Secteur, taille, obligations légales, budget."
					},
					{
						i: ListChecks,
						t: "24 questions",
						d: "9 contextuelles + 15 par domaine, échelles guidées."
					},
					{
						i: Radar,
						t: "Scoring auto",
						d: "Moteur de règles + RAG sur guides officiels."
					},
					{
						i: FileText,
						t: "Plan d'action",
						d: "Recommandations priorisées, exportables en PDF."
					}
				].map(({ i: Icon, t, d }, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative rounded-xl border border-border bg-gradient-card p-5 shadow-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "absolute right-4 top-4 font-display text-xs font-semibold text-muted-foreground",
							children: String(idx + 1).padStart(2, "0")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-5 w-5" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "font-display text-base font-semibold",
							children: t
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm text-muted-foreground",
							children: d
						})
					]
				}, t))
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "border-y border-border bg-secondary/40",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto grid max-w-7xl gap-10 px-6 py-16 lg:grid-cols-[0.9fr_1.1fr]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-[11px] font-semibold uppercase tracking-widest text-[oklch(0.55_0.16_255)]",
						children: "Référentiels"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mt-2 font-display text-3xl font-semibold tracking-tight",
						children: "Aligné avec les guides officiels."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 max-w-md text-sm text-muted-foreground",
						children: "Le moteur s'appuie sur le guide ANRT PME, les recommandations CERT-MA et les exigences de la loi 09-08 sur la protection des données personnelles."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-6 flex flex-wrap gap-2",
						children: [
							"Loi 09-08",
							"Guide ANRT PME",
							"CERT-MA",
							"ISO 27001 (extraits)",
							"RGPD",
							"NIST CSF"
						].map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "rounded-md border border-border bg-background px-2.5 py-1 text-xs font-medium",
							children: r
						}, r))
					})
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid gap-3 sm:grid-cols-2",
					children: [
						{
							t: "Politique & gouvernance",
							d: "Cadrage direction, responsabilités, revues."
						},
						{
							t: "Gestion des risques",
							d: "Cartographie, analyse d'impact, plans."
						},
						{
							t: "Contrôle d'accès",
							d: "MFA, moindre privilège, revues trimestrielles."
						},
						{
							t: "Continuité d'activité",
							d: "Sauvegardes, PRA, tests de restauration."
						},
						{
							t: "Sensibilisation",
							d: "Phishing, hygiène numérique, onboarding."
						},
						{
							t: "Conformité légale",
							d: "Loi 09-08, CNDP, secteur bancaire, santé."
						}
					].map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-lg border border-border bg-background p-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-sm font-semibold text-foreground",
							children: c.t
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-0.5 text-xs text-muted-foreground",
							children: c.d
						})]
					}, c.t))
				})]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "mx-auto max-w-7xl px-6 py-20",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "overflow-hidden rounded-2xl bg-gradient-hero p-10 text-primary-foreground shadow-elegant",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col items-start justify-between gap-6 md:flex-row md:items-center",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-widest text-white/70",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "h-3.5 w-3.5" }), " ~15 minutes"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "mt-2 font-display text-3xl font-semibold tracking-tight",
							children: "Prêt à évaluer votre posture cyber ?"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 max-w-xl text-sm text-white/75",
							children: "Recevez un plan d'action personnalisé, sans engagement, exportable au format PDF pour votre direction."
						})
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/profile",
						className: "inline-flex items-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-semibold text-primary shadow-elegant transition hover:bg-white/95",
						children: ["Démarrer maintenant ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-4 w-4" })]
					})]
				})
			})
		})
	] });
}
//#endregion
export { Landing as component };
