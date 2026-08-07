import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { ScoreGauge } from "@/components/cyber/ScoreGauge";
import { DomainRadar, DomainBars } from "@/components/cyber/DomainRadar";
import { RecommendationCard } from "@/components/cyber/RecommendationCard";
import { recommendations, domains, globalScore, maxGlobalScore, maturityLabel, type Priority, type Level } from "@/lib/mock-data";
import { Download, Share2, Filter, TrendingUp, AlertTriangle, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/results")({
  component: ResultsPage,
  head: () => ({ meta: [{ title: "Rapport de maturité cyber — CyberDiag" }] }),
});

const priorityOrder: Priority[] = ["critical", "high", "medium", "low"];

function ResultsPage() {
  const [prio, setPrio] = useState<"all" | Priority>("all");
  const [dom, setDom] = useState<string>("all");
  const [cost, setCost] = useState<"all" | Level>("all");

  const filtered = useMemo(() => {
    return recommendations
      .filter((r) => (prio === "all" ? true : r.priority === prio))
      .filter((r) => (dom === "all" ? true : r.domainId === dom))
      .filter((r) => (cost === "all" ? true : r.cost === cost))
      .sort((a, b) => priorityOrder.indexOf(a.priority) - priorityOrder.indexOf(b.priority));
  }, [prio, dom, cost]);

  const label = maturityLabel(globalScore);
  const criticalCount = recommendations.filter((r) => r.priority === "critical").length;
  const highCount = recommendations.filter((r) => r.priority === "high").length;
  const strongest = [...domains].sort((a, b) => b.score - a.score)[0];
  const weakest = [...domains].sort((a, b) => a.score - b.score)[0];

  return (
    <AppShell crumbs={[{ label: "Accueil", to: "/" }, { label: "Questionnaire", to: "/assessment" }, { label: "Résultats" }]}>
      <section className="mx-auto max-w-7xl px-6 py-10">
        {/* Header */}
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-widest text-[oklch(0.55_0.16_255)]">Rapport de diagnostic · Atlas Distribution SARL</div>
            <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight">Votre posture cybersécurité</h1>
            <p className="mt-1 text-sm text-muted-foreground">Généré le 17 juillet 2026 · basé sur 24 réponses et le référentiel ANRT PME.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-3 py-2 text-sm font-medium transition hover:bg-secondary">
              <Share2 className="h-4 w-4" /> Partager
            </button>
            <button className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3.5 py-2 text-sm font-medium text-primary-foreground shadow-elegant transition hover:opacity-95">
              <Download className="h-4 w-4" /> Exporter en PDF
            </button>
          </div>
        </div>

        {/* Top row: gauge + KPIs */}
        <div className="grid gap-5 lg:grid-cols-[380px_1fr]">
          <div className="rounded-2xl border border-border bg-gradient-card p-6 shadow-sm">
            <div className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">Score global de maturité</div>
            <div className="mt-3 flex flex-col items-center">
              <ScoreGauge score={globalScore} />
            </div>
            <div className="mt-6 grid grid-cols-2 gap-2 text-center text-xs">
              <div className="rounded-lg border border-border bg-background p-3">
                <div className="text-[10.5px] font-medium uppercase tracking-wider text-muted-foreground">Objectif 12 mois</div>
                <div className="mt-1 font-display text-xl font-semibold">75<span className="text-xs text-muted-foreground">/{maxGlobalScore}</span></div>
              </div>
              <div className="rounded-lg border border-border bg-background p-3">
                <div className="text-[10.5px] font-medium uppercase tracking-wider text-muted-foreground">Progression</div>
                <div className="mt-1 inline-flex items-center gap-1 font-display text-xl font-semibold text-[oklch(0.55_0.16_155)]">
                  <TrendingUp className="h-4 w-4" /> +16
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-5">
            <div className="grid gap-3 sm:grid-cols-4">
              <Kpi icon={AlertTriangle} tone="critical" value={criticalCount} label="Actions critiques" />
              <Kpi icon={AlertTriangle} tone="warning" value={highCount} label="Priorité élevée" />
              <Kpi icon={ShieldCheck} tone="success" value={strongest.name} label="Domaine le plus mature" />
              <Kpi icon={AlertTriangle} tone="critical" value={weakest.name} label="Domaine à renforcer" />
            </div>
            <div className="rounded-2xl border border-border bg-gradient-card p-5 shadow-sm">
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">Maturité par domaine</div>
                  <div className="mt-0.5 font-display text-lg font-semibold">15 domaines évalués</div>
                </div>
                <div className="flex gap-1.5 text-[10.5px]">
                  <LegendDot color="oklch(0.58 0.22 25)" label="0–1 Critique" />
                  <LegendDot color="oklch(0.72 0.16 60)" label="2 À renforcer" />
                  <LegendDot color="oklch(0.55 0.16 255)" label="3 Défini" />
                  <LegendDot color="oklch(0.62 0.16 155)" label="4–5 Maîtrisé" />
                </div>
              </div>
              <DomainRadar />
            </div>
          </div>
        </div>

        {/* Bars + Compliance */}
        <div className="mt-5 grid gap-5 lg:grid-cols-[1.4fr_1fr]">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">Détail par domaine</div>
                <div className="mt-0.5 font-display text-lg font-semibold">Forces et faiblesses</div>
              </div>
              <span className="text-xs text-muted-foreground">Échelle 0–5</span>
            </div>
            <DomainBars />
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <div className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">Conformité réglementaire</div>
            <div className="mt-0.5 font-display text-lg font-semibold">Obligations identifiées</div>
            <div className="mt-4 space-y-3">
              {[
                { r: "Loi 09-08 (Maroc)", status: "Partiel", tone: "warning", note: "Déclaration CNDP incomplète" },
                { r: "RGPD (clients UE)", status: "Non conforme", tone: "critical", note: "Registre des traitements absent" },
                { r: "Guide ANRT PME", status: "Aligné (58%)", tone: "primary", note: "8 domaines sur 15 conformes" },
                { r: "CERT-MA — bonnes pratiques", status: "À initier", tone: "warning", note: "Contact d'urgence non déclaré" },
              ].map((c) => (
                <div key={c.r} className="flex items-start justify-between gap-3 rounded-lg border border-border bg-background p-3">
                  <div>
                    <div className="text-sm font-semibold">{c.r}</div>
                    <div className="text-xs text-muted-foreground">{c.note}</div>
                  </div>
                  <StatusChip tone={c.tone as any}>{c.status}</StatusChip>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recommendations */}
        <div className="mt-10">
          <div className="mb-4 flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-widest text-[oklch(0.55_0.16_255)]">Plan d'action priorisé</div>
              <h2 className="mt-1 font-display text-2xl font-semibold tracking-tight">
                {filtered.length} recommandation{filtered.length > 1 ? "s" : ""} personnalisée{filtered.length > 1 ? "s" : ""}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">Triées par score de priorité = urgence × impact × faisabilité.</p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select label="Priorité" value={prio} onChange={setPrio as any} options={[
                { v: "all", l: "Toutes" }, { v: "critical", l: "Critique" }, { v: "high", l: "Élevée" }, { v: "medium", l: "Moyenne" }, { v: "low", l: "Faible" },
              ]} />
              <Select label="Domaine" value={dom} onChange={setDom} options={[
                { v: "all", l: "Tous" },
                ...domains.map((d) => ({ v: d.id, l: d.name })),
              ]} />
              <Select label="Coût" value={cost} onChange={setCost as any} options={[
                { v: "all", l: "Tous" }, { v: "faible", l: "Faible" }, { v: "moyen", l: "Moyen" }, { v: "eleve", l: "Élevé" },
              ]} />
            </div>
          </div>

          <div className="grid gap-3">
            {filtered.map((r, i) => <RecommendationCard key={r.id} rec={r} index={i} />)}
          </div>
        </div>

        <div className="mt-10 rounded-2xl border border-border bg-gradient-hero p-6 text-primary-foreground shadow-elegant">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-widest text-white/70">Prochaine étape</div>
              <div className="mt-1 font-display text-xl font-semibold">Suivre l'exécution de votre plan d'action</div>
              <div className="mt-1 text-sm text-white/75">Créez un espace de suivi pour mesurer votre progression trimestrielle.</div>
            </div>
            <button className="rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-primary shadow-elegant hover:bg-white/95">
              Activer le suivi
            </button>
          </div>
        </div>
      </section>
    </AppShell>
  );
}

function Kpi({ icon: Icon, tone, value, label }: { icon: any; tone: "critical" | "warning" | "success" | "primary"; value: React.ReactNode; label: string }) {
  const map: Record<string, { bg: string; fg: string }> = {
    critical: { bg: "bg-[oklch(0.97_0.03_25)]", fg: "text-[oklch(0.42_0.19_25)]" },
    warning:  { bg: "bg-[oklch(0.97_0.04_60)]", fg: "text-[oklch(0.42_0.14_60)]" },
    success:  { bg: "bg-[oklch(0.97_0.03_155)]", fg: "text-[oklch(0.35_0.13_155)]" },
    primary:  { bg: "bg-[oklch(0.97_0.02_255)]", fg: "text-[oklch(0.32_0.11_260)]" },
  };
  return (
    <div className="rounded-xl border border-border bg-gradient-card p-4 shadow-sm">
      <div className={"inline-flex h-8 w-8 items-center justify-center rounded-lg " + map[tone].bg + " " + map[tone].fg}>
        <Icon className="h-4 w-4" />
      </div>
      <div className="mt-3 font-display text-lg font-semibold leading-tight">{value}</div>
      <div className="mt-0.5 text-[11px] uppercase tracking-wider text-muted-foreground">{label}</div>
    </div>
  );
}

function StatusChip({ tone, children }: { tone: "critical" | "warning" | "success" | "primary"; children: React.ReactNode }) {
  const map: Record<string, string> = {
    critical: "bg-[oklch(0.97_0.03_25)] text-[oklch(0.42_0.19_25)] ring-[oklch(0.58_0.22_25)]/25",
    warning:  "bg-[oklch(0.97_0.04_60)] text-[oklch(0.42_0.14_60)] ring-[oklch(0.72_0.16_60)]/25",
    success:  "bg-[oklch(0.97_0.03_155)] text-[oklch(0.35_0.13_155)] ring-[oklch(0.62_0.16_155)]/25",
    primary:  "bg-[oklch(0.97_0.02_255)] text-[oklch(0.32_0.11_260)] ring-[oklch(0.55_0.16_255)]/25",
  };
  return <span className={"rounded-full px-2.5 py-0.5 text-[11px] font-semibold ring-1 ring-inset " + map[tone]}>{children}</span>;
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1 text-muted-foreground">
      <span className="h-2 w-2 rounded-full" style={{ background: color }} /> {label}
    </span>
  );
}

function Select<T extends string>({ label, value, onChange, options }: { label: string; value: T; onChange: (v: T) => void; options: { v: T; l: string }[] }) {
  return (
    <label className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background pl-2.5 pr-1.5 text-xs">
      <span className="text-muted-foreground">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
        className="cursor-pointer border-0 bg-transparent py-1.5 text-xs font-semibold text-foreground outline-none"
      >
        {options.map((o) => <option key={o.v} value={o.v}>{o.l}</option>)}
      </select>
    </label>
  );
}