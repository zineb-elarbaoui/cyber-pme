import type { PriorityBucket } from "@/lib/maturity";

const priorityMap: Record<PriorityBucket, { label: string; cls: string; dot: string }> = {
  critical: { label: "Critique", cls: "bg-[oklch(0.97_0.03_25)] text-[oklch(0.42_0.19_25)] ring-[oklch(0.58_0.22_25)]/25", dot: "bg-[oklch(0.58_0.22_25)]" },
  high:     { label: "Élevée",   cls: "bg-[oklch(0.97_0.04_60)] text-[oklch(0.42_0.14_60)] ring-[oklch(0.72_0.16_60)]/30", dot: "bg-[oklch(0.72_0.16_60)]" },
  medium:   { label: "Moyenne",  cls: "bg-[oklch(0.97_0.02_255)] text-[oklch(0.32_0.11_260)] ring-[oklch(0.55_0.16_255)]/25", dot: "bg-[oklch(0.55_0.16_255)]" },
  low:      { label: "Faible",   cls: "bg-[oklch(0.97_0.03_155)] text-[oklch(0.35_0.13_155)] ring-[oklch(0.62_0.16_155)]/25", dot: "bg-[oklch(0.62_0.16_155)]" },
};

export function PriorityBadge({ priority }: { priority: PriorityBucket }) {
  const p = priorityMap[priority];
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ring-1 ring-inset ${p.cls}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${p.dot}`} />
      Priorité {p.label}
    </span>
  );
}

// Couvre les deux enums backend qui transitent par ce badge :
// cout_estime/impact ('faible'|'moyen'|'eleve'|'tres_eleve') et
// difficulte_estimee ('facile'|'moyenne'|'difficile').
const levelLabel: Record<string, string> = {
  faible: "Faible",
  moyen: "Moyen",
  eleve: "Élevé",
  tres_eleve: "Très élevé",
  facile: "Facile",
  moyenne: "Moyenne",
  difficile: "Difficile",
};

export function MetaBadge({ label, value, tone = "muted" }: { label: string; value: string; tone?: "muted" | "primary" }) {
  const v = levelLabel[value] ?? value;
  return (
    <span className={"inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-2 py-1 text-[11px] " + (tone === "primary" ? "text-foreground" : "text-muted-foreground") }>
      <span className="uppercase tracking-wider text-[9.5px] text-muted-foreground">{label}</span>
      <span className="font-semibold text-foreground">{v}</span>
    </span>
  );
}

export function DomainTag({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-md bg-secondary px-2 py-0.5 text-[11px] font-medium text-secondary-foreground">
      {children}
    </span>
  );
}