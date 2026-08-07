import { i as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { v as Link, y as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { E as Building2, O as ArrowRight, c as ShieldAlert, g as Landmark, k as ArrowLeft, t as Users, u as ScrollText } from "../_libs/lucide-react.mjs";
import { t as AppShell } from "./AppShell-Cm9lcG9b.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/profile-CTEiu0h6.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var steps = [
	{
		id: 1,
		name: "Identité",
		icon: Building2
	},
	{
		id: 2,
		name: "Organisation",
		icon: Users
	},
	{
		id: 3,
		name: "Contexte SI",
		icon: Landmark
	},
	{
		id: 4,
		name: "Risques & budget",
		icon: ShieldAlert
	},
	{
		id: 5,
		name: "Conformité",
		icon: ScrollText
	}
];
function ProfilePage() {
	const nav = useNavigate();
	const [step, setStep] = (0, import_react.useState)(1);
	const progress = step / steps.length * 100;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {
		crumbs: [{
			label: "Accueil",
			to: "/"
		}, { label: "Profil PME" }],
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mx-auto max-w-5xl px-6 py-12",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
					className: "mb-8",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-[11px] font-semibold uppercase tracking-widest text-[oklch(0.55_0.16_255)]",
							children: "Étape 1/2 · Profil"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "mt-2 font-display text-3xl font-semibold tracking-tight",
							children: "Parlez-nous de votre entreprise"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 max-w-2xl text-sm text-muted-foreground",
							children: "Ces informations personnalisent le diagnostic et les recommandations. Aucune donnée n'est partagée sans votre accord."
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border border-border bg-gradient-card p-5 shadow-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mb-2 flex items-center justify-between text-[11px] font-medium uppercase tracking-wider text-muted-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Progression" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "tabular-nums text-foreground",
								children: [
									step,
									"/",
									steps.length
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mb-6 h-1.5 w-full overflow-hidden rounded-full bg-secondary",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "h-full rounded-full bg-primary transition-all",
								style: { width: `${progress}%` }
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
							className: "grid grid-cols-5 gap-2",
							children: steps.map((s) => {
								const Icon = s.icon;
								const active = s.id === step;
								const done = s.id < step;
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "flex flex-col items-center gap-1.5 text-center",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "flex h-9 w-9 items-center justify-center rounded-full border text-xs font-semibold transition " + (active ? "border-primary bg-primary text-primary-foreground shadow-elegant" : done ? "border-[oklch(0.62_0.16_155)] bg-[oklch(0.62_0.16_155)] text-white" : "border-border bg-background text-muted-foreground"),
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-4 w-4" })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[11px] " + (active ? "font-semibold text-foreground" : "text-muted-foreground"),
										children: s.name
									})]
								}, s.id);
							})
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 rounded-xl border border-border bg-card p-6 shadow-sm",
					children: [
						step === 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(StepGrid, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Nom de l'entreprise",
								placeholder: "Ex : Atlas Distribution SARL"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Secteur d'activité",
								as: "select",
								options: [
									"Services",
									"Industrie & manufacturing",
									"Commerce & distribution",
									"Technologies & digital",
									"Santé",
									"Finance & assurance",
									"Autre"
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Ville / Région",
								placeholder: "Casablanca-Settat"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Année de création",
								placeholder: "2015"
							})
						] }),
						step === 2 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(StepGrid, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Effectif",
								as: "select",
								options: [
									"TPE (1–9)",
									"Petite (10–49)",
									"Moyenne (50–249)",
									"Grande (250+)"
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Chiffre d'affaires annuel",
								as: "select",
								options: [
									"< 3 MMAD",
									"3–10 MMAD",
									"10–50 MMAD",
									"50–200 MMAD",
									"> 200 MMAD"
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Service informatique interne",
								as: "radio",
								options: [
									"Oui, dédié",
									"Oui, partagé",
									"Non",
									"Externalisé"
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Responsable sécurité (RSSI)",
								as: "radio",
								options: [
									"Interne",
									"Externalisé",
									"Aucun"
								]
							})
						] }),
						step === 3 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(StepGrid, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Niveau de digitalisation",
								as: "radio",
								options: [
									"Faible",
									"Moyen",
									"Avancé",
									"Cœur d'activité"
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Services exposés à Internet",
								as: "checkbox",
								options: [
									"Site web",
									"E-commerce",
									"Messagerie",
									"VPN / accès distant",
									"Applications métier SaaS"
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Traitement de données sensibles",
								as: "checkbox",
								options: [
									"Données personnelles clients",
									"Données santé",
									"Données bancaires",
									"Propriété intellectuelle"
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Nombre d'applications métier",
								placeholder: "Ex : 8"
							})
						] }),
						step === 4 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(StepGrid, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Incident cyber au cours des 24 derniers mois",
								as: "radio",
								options: [
									"Aucun",
									"Tentative détectée",
									"Incident mineur",
									"Incident majeur"
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Impact d'une interruption 24h",
								as: "radio",
								options: [
									"Négligeable",
									"Modéré",
									"Élevé",
									"Critique"
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Budget cybersécurité annuel",
								as: "select",
								options: [
									"Non identifié",
									"< 20 000 MAD",
									"20 000–100 000 MAD",
									"100 000–500 000 MAD",
									"> 500 000 MAD"
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Sauvegardes testées récemment",
								as: "radio",
								options: [
									"Oui, mensuellement",
									"Oui, ponctuellement",
									"Non",
									"Ne sait pas"
								]
							})
						] }),
						step === 5 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(StepGrid, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Réglementations applicables",
								as: "checkbox",
								options: [
									"Loi 09-08 (Maroc)",
									"RGPD (UE)",
									"PCI-DSS",
									"HIPAA / santé",
									"BAM (bancaire)",
									"Aucune identifiée"
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Déclaration CNDP réalisée",
								as: "radio",
								options: [
									"Oui",
									"Partiellement",
									"Non",
									"Ne sait pas"
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Contrats sous-traitants formalisés",
								as: "radio",
								options: [
									"Oui, systématiquement",
									"Partiellement",
									"Non"
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Certifications visées",
								as: "checkbox",
								options: [
									"ISO 27001",
									"SOC 2",
									"Aucune",
									"Autre"
								]
							})
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-8 flex items-center justify-between border-t border-border pt-6",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: () => setStep((s) => Math.max(1, s - 1)),
									disabled: step === 1,
									className: "inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-3.5 py-2 text-sm font-medium transition hover:bg-secondary disabled:opacity-40",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-4 w-4" }), " Précédent"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-xs text-muted-foreground",
									children: step === steps.length ? "Prochaine étape : questionnaire de maturité" : `Étape suivante : ${steps[step].name}`
								}),
								step < steps.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: () => setStep((s) => s + 1),
									className: "inline-flex items-center gap-1.5 rounded-md bg-primary px-3.5 py-2 text-sm font-medium text-primary-foreground shadow-elegant transition hover:opacity-95",
									children: ["Continuer ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-4 w-4" })]
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: () => nav({ to: "/assessment" }),
									className: "inline-flex items-center gap-1.5 rounded-md bg-primary px-3.5 py-2 text-sm font-medium text-primary-foreground shadow-elegant transition hover:opacity-95",
									children: ["Lancer le questionnaire ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-4 w-4" })]
								})
							]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-4 text-center text-xs text-muted-foreground",
					children: [
						"Vous pouvez modifier ces réponses plus tard depuis ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/history",
							className: "underline",
							children: "votre historique"
						}),
						"."
					]
				})
			]
		})
	});
}
function StepGrid({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid gap-5 md:grid-cols-2",
		children
	});
}
function Field({ label, placeholder, as = "text", options = [] }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: "block",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mb-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground",
				children: label
			}),
			as === "text" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				type: "text",
				placeholder,
				className: "w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/25"
			}),
			as === "select" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
				className: "w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/25",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
					value: "",
					children: "— Sélectionnez —"
				}), options.map((o) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
					value: o,
					children: o
				}, o))]
			}),
			as === "radio" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-1.5",
				children: options.map((o) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "flex cursor-pointer items-center gap-2 rounded-md border border-border bg-background px-3 py-2 text-sm transition hover:border-ring/60 has-[:checked]:border-primary has-[:checked]:bg-primary/5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "radio",
						name: label,
						className: "accent-[var(--primary-accent)]"
					}), o]
				}, o))
			}),
			as === "checkbox" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-1.5",
				children: options.map((o) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "flex cursor-pointer items-center gap-2 rounded-md border border-border bg-background px-3 py-2 text-sm transition hover:border-ring/60 has-[:checked]:border-primary has-[:checked]:bg-primary/5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "checkbox",
						className: "accent-[var(--primary-accent)]"
					}), o]
				}, o))
			})
		]
	});
}
//#endregion
export { ProfilePage as component };
