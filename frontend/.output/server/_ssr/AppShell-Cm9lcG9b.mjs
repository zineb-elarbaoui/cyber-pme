import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { d as useRouterState, v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { S as ClipboardList, _ as History, h as LayoutDashboard, o as Shield, w as ChevronRight } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/AppShell-Cm9lcG9b.js
var import_jsx_runtime = require_jsx_runtime();
var nav = [
	{
		to: "/",
		label: "Accueil",
		icon: Shield
	},
	{
		to: "/profile",
		label: "Profil PME",
		icon: ClipboardList
	},
	{
		to: "/assessment",
		label: "Questionnaire",
		icon: ClipboardList
	},
	{
		to: "/results",
		label: "Résultats",
		icon: LayoutDashboard
	},
	{
		to: "/history",
		label: "Historique",
		icon: History
	}
];
function AppShell({ children, crumbs }) {
	const path = useRouterState({ select: (s) => s.location.pathname });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background text-foreground",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto flex h-16 max-w-7xl items-center justify-between px-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/",
							className: "flex items-center gap-2.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-elegant",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shield, {
									className: "h-5 w-5",
									strokeWidth: 2.4
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-[var(--primary-accent)]" })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "leading-tight",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "font-display text-[15px] font-semibold tracking-tight",
									children: "CyberDiag PME"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-[10.5px] uppercase tracking-[0.14em] text-muted-foreground",
									children: "CMRPI × AUSIM"
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
							className: "hidden items-center gap-1 md:flex",
							children: nav.map((n) => {
								const active = n.to === "/" ? path === "/" : path.startsWith(n.to);
								return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: n.to,
									className: "rounded-md px-3 py-1.5 text-sm font-medium transition-colors " + (active ? "bg-secondary text-foreground" : "text-muted-foreground hover:text-foreground"),
									children: n.label
								}, n.to);
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/assessment",
							className: "hidden rounded-md bg-primary px-3.5 py-2 text-sm font-medium text-primary-foreground shadow-elegant transition hover:opacity-95 md:inline-flex",
							children: "Démarrer un diagnostic"
						})
					]
				}), crumbs && crumbs.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mx-auto flex max-w-7xl items-center gap-1.5 px-6 pb-3 text-xs text-muted-foreground",
					children: crumbs.map((c, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "flex items-center gap-1.5",
						children: [i > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-3 w-3" }), c.to ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: c.to,
							className: "hover:text-foreground",
							children: c.label
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-foreground",
							children: c.label
						})]
					}, i))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", { children }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("footer", {
				className: "mt-24 border-t border-border/70 bg-secondary/40",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mx-auto max-w-7xl px-6 py-8 text-xs text-muted-foreground",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: "© 2026 CyberDiag PME · Projet PFA · Partenariat CMRPI / AUSIM" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Loi 09-08" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Guide ANRT PME" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "CERT-MA" })
							]
						})]
					})
				})
			})
		]
	});
}
//#endregion
export { AppShell as t };
