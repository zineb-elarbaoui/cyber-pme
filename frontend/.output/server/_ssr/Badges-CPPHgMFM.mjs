import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/Badges-CPPHgMFM.js
var import_jsx_runtime = require_jsx_runtime();
var priorityMap = {
	critical: {
		label: "Critique",
		cls: "bg-[oklch(0.97_0.03_25)] text-[oklch(0.42_0.19_25)] ring-[oklch(0.58_0.22_25)]/25",
		dot: "bg-[oklch(0.58_0.22_25)]"
	},
	high: {
		label: "Élevée",
		cls: "bg-[oklch(0.97_0.04_60)] text-[oklch(0.42_0.14_60)] ring-[oklch(0.72_0.16_60)]/30",
		dot: "bg-[oklch(0.72_0.16_60)]"
	},
	medium: {
		label: "Moyenne",
		cls: "bg-[oklch(0.97_0.02_255)] text-[oklch(0.32_0.11_260)] ring-[oklch(0.55_0.16_255)]/25",
		dot: "bg-[oklch(0.55_0.16_255)]"
	},
	low: {
		label: "Faible",
		cls: "bg-[oklch(0.97_0.03_155)] text-[oklch(0.35_0.13_155)] ring-[oklch(0.62_0.16_155)]/25",
		dot: "bg-[oklch(0.62_0.16_155)]"
	}
};
function PriorityBadge({ priority }) {
	const p = priorityMap[priority];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: `inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ring-1 ring-inset ${p.cls}`,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `h-1.5 w-1.5 rounded-full ${p.dot}` }),
			"Priorité ",
			p.label
		]
	});
}
var levelLabel = {
	faible: "Faible",
	moyen: "Moyen",
	eleve: "Élevé"
};
function MetaBadge({ label, value, tone = "muted" }) {
	const v = levelLabel[value] ?? value;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: "inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-2 py-1 text-[11px] " + (tone === "primary" ? "text-foreground" : "text-muted-foreground"),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "uppercase tracking-wider text-[9.5px] text-muted-foreground",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "font-semibold text-foreground",
			children: v
		})]
	});
}
function DomainTag({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "inline-flex items-center rounded-md bg-secondary px-2 py-0.5 text-[11px] font-medium text-secondary-foreground",
		children
	});
}
//#endregion
export { MetaBadge as n, PriorityBadge as r, DomainTag as t };
