import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AppShell } from "@/components/AppShell";
import { ScoreGauge } from "@/components/cyber/ScoreGauge";
import { DomainRadar, DomainBars, type DomainScore } from "@/components/cyber/DomainRadar";
import { RecommendationCard, type RecommendationVM } from "@/components/cyber/RecommendationCard";
import { getQuestionnaire, getRecommandations, getRecommandationsExistantes, telechargerRapportPdf, ApiError, type RecommandationOut } from "@/lib/api";
import { useWizard } from "@/lib/wizard-context";
import { maturityLabel, priorityBucket, type PriorityBucket } from "@/lib/maturity";
import { Download, Filter, TrendingUp, AlertTriangle, ShieldCheck, Loader2 } from "lucide-react";

export const Route = createFileRoute("/results")({
  component: ResultsPage,
  head: () => ({ meta: [{ title: "Rapport de maturité cyber — CyberDiag" }] }),
});

const priorityOrder: PriorityBucket[] = ["critical", "high", "medium", "low"];

function ResultsPage() {
  const nav = useNavigate();
  const { state } = useWizard();

  useEffect(() => {
    if (!state.idPme) nav({ to: "/profile" });
  }, [state.idPme, nav]);

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Le questionnaire est déjà en cache (staleTime: Infinity, même queryKey
  // qu'assessment.tsx) — pas de second appel réseau si on vient bien du flux normal.
  const questionnaireQ = useQuery({
    queryKey: ["questionnaire"],
    queryFn: getQuestionnaire,
    staleTime: Infinity,
    enabled: mounted,
  });

  const recommandationsQ = useQuery({
    queryKey: ["recommandations", state.idPme],
    queryFn: async () => {
      // Essaie d'abord de relire des recommandations déjà générées (rapide,
      // pas de RAG relancé) — utile pour une PME qui se reconnecte à un
      // diagnostic déjà terminé. Ne (re)génère tout que si rien n'existe.
      try {
        return await getRecommandationsExistantes(state.idPme as string);
      } catch (e) {
        if (e instanceof ApiError && e.status === 404) {
          return await getRecommandations(state.idPme as string, true);
        }
        throw e;
      }
    },
    enabled: mounted && !!state.idPme,
  });

  const [prio, setPrio] = useState<"all" | PriorityBucket>("all");
  const [dom, setDom] = useState<string>("all");
  const [cost, setCost] = useState<string>("all");
  const [exportingPdf, setExportingPdf] = useState(false);
  const [pdfError, setPdfError] = useState<string | null>(null);

  async function handleExportPdf() {
    if (!state.idPme) return;
    setPdfError(null);
    setExportingPdf(true);
    try {
      await telechargerRapportPdf(state.idPme, state.profil.nom_entreprise);
    } catch (e) {
      setPdfError(e instanceof ApiError ? e.message : "Erreur lors du téléchargement du PDF.");
    } finally {
      setExportingPdf(false);
    }
  }

  // -------------------------------------------------------------------------
  // Scores par domaine calculés côté client : la structure du questionnaire
  // (cache react-query) + les réponses données pendant /assessment (state du
  // wizard) suffisent — pas besoin d'un endpoint dédié. Ça permet aussi de
  // calculer le score max réel (101, pas 102) en tenant compte de l'anomalie
  // du domaine 3 plafonné à 4 au lieu de 5.
  // -------------------------------------------------------------------------
  const computed = useMemo(() => {
    const data = questionnaireQ.data;
    if (!data) return null;

    const domainesById = new Map(data.domaines.map((d) => [d.id_domaine, d]));
    const domainScores: DomainScore[] = data.questions
      .filter((q) => q.type_question === "domaine" && q.id_domaine != null)
      .map((q) => {
        const dom = domainesById.get(q.id_domaine as number);
        const raw = state.reponses[q.id_question];
        return {
          id: q.id_domaine as number,
          name: dom?.nom_domaine ?? `Domaine ${q.id_domaine}`,
          score: raw != null ? Number(raw) : 0,
          max: q.valeur_max,
        };
      });

    const contextQuestions = data.questions.filter((q) => q.type_question === "contextuelle");
    const contextScore = contextQuestions.reduce((sum, q) => sum + Number(state.reponses[q.id_question] ?? 0), 0);
    const contextMax = contextQuestions.reduce((sum, q) => sum + q.valeur_max, 0);

    const domainScoreSum = domainScores.reduce((s, d) => s + d.score, 0);
    const domainMaxSum = domainScores.reduce((s, d) => s + d.max, 0);

    const globalScore = contextScore + domainScoreSum;
    const maxGlobalScore = contextMax + domainMaxSum;

    const sorted = [...domainScores].sort((a, b) => b.score / (b.max || 1) - a.score / (a.max || 1));
    const strongest = sorted[0];
    const weakest = sorted[sorted.length - 1];

    return { domainScores, globalScore, maxGlobalScore, strongest, weakest };
  }, [questionnaireQ.data, state.reponses]);

  // -------------------------------------------------------------------------
  // Recommandations : API -> view model attendu par RecommendationCard.
  // -------------------------------------------------------------------------
  const recommendations: RecommendationVM[] = useMemo(() => {
    const list = recommandationsQ.data?.recommandations ?? [];
    return [...list]
      .sort((a, b) => b.score_priorite - a.score_priorite)
      .map((r: RecommandationOut) => ({
        id: r.id_recommandation,
        title: r.titre_mesure,
        domainName: r.nom_domaine,
        priority: priorityBucket(r.score_priorite),
        cost: r.cout_estime,
        difficulty: r.difficulte_estimee,
        impact: r.impact,
        guideRef: `Guide CMRPI/AUSIM — §${r.section_guide_precise}`,
        summary: r.description_mesure,
        rationale: r.justification_rag,
      }));
  }, [recommandationsQ.data]);

  const domainOptions = useMemo(() => {
    const seen = new Map<string, string>();
    recommendations.forEach((r) => seen.set(r.domainName, r.domainName));
    return Array.from(seen.keys());
  }, [recommendations]);

  const filtered = useMemo(() => {
    return recommendations
      .filter((r) => (prio === "all" ? true : r.priority === prio))
      .filter((r) => (dom === "all" ? true : r.domainName === dom))
      .filter((r) => (cost === "all" ? true : r.cost === cost))
      .sort((a, b) => priorityOrder.indexOf(a.priority) - priorityOrder.indexOf(b.priority));
  }, [recommendations, prio, dom, cost]);

  const criticalCount = recommendations.filter((r) => r.priority === "critical").length;
  const highCount = recommendations.filter((r) => r.priority === "high").length;

  // ---------------------------------------------------------------------------
  const isLoading = questionnaireQ.isLoading || recommandationsQ.isLoading || !computed;
  const isError = questionnaireQ.isError || recommandationsQ.isError;

  if (isLoading) {
    return (
      <AppShell crumbs={[{ label: "Accueil", to: "/" }, { label: "Questionnaire", to: "/assessment" }, { label: "Résultats" }]}>
        <div className="flex min-h-[50vh] items-center justify-center gap-2 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" /> Génération de votre plan d'action…
        </div>
      </AppShell>
    );
  }

  if (isError || !computed) {
    return (
      <AppShell crumbs={[{ label: "Accueil", to: "/" }, { label: "Questionnaire", to: "/assessment" }, { label: "Résultats" }]}>
        <div className="mx-auto max-w-lg px-6 py-20 text-center">
          <p className="text-sm text-destructive">
            {recommandationsQ.error instanceof ApiError
              ? recommandationsQ.error.message
              : "Impossible de générer les recommandations."}
          </p>
          <p className="mt-2 text-sm text-muted-foreground">Vérifie que le backend est bien démarré (et Ollama, si le RAG est activé), puis recharge la page.</p>
        </div>
      </AppShell>
    );
  }

  const label = maturityLabel(computed.globalScore, computed.maxGlobalScore);
  const nbReponses = Object.keys(state.reponses).length;

  return (
    <AppShell crumbs={[{ label: "Accueil", to: "/" }, { label: "Questionnaire", to: "/assessment" }, { label: "Résultats" }]}>
      <section className="mx-auto max-w-7xl px-6 py-10">
        {/* Header */}
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-widest text-[oklch(0.55_0.16_255)]">
              Rapport de diagnostic{state.profil.nom_entreprise ? ` · ${state.profil.nom_entreprise}` : ""}
            </div>
            <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight">Votre posture cybersécurité</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Généré le {new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })} · basé sur {nbReponses} réponses et le guide CMRPI/AUSIM.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {pdfError && <span className="text-xs text-destructive">{pdfError}</span>}
            <button
              onClick={handleExportPdf}
              disabled={exportingPdf}
              className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3.5 py-2 text-sm font-medium text-primary-foreground shadow-elegant transition hover:opacity-95 disabled:opacity-60"
            >
              {exportingPdf ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Génération…
                </>
              ) : (
                <>
                  <Download className="h-4 w-4" /> Exporter en PDF
                </>
              )}
            </button>
          </div>
        </div>

        {/* Top row: gauge + KPIs */}
        <div className="grid gap-5 lg:grid-cols-[380px_1fr]">
          <div className="rounded-2xl border border-border bg-gradient-card p-6 shadow-sm">
            <div className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">Score global de maturité</div>
            <div className="mt-3 flex flex-col items-center">
              <ScoreGauge score={computed.globalScore} maxScore={computed.maxGlobalScore} />
            </div>
            <div className="mt-6 grid grid-cols-2 gap-2 text-center text-xs">
              <div className="rounded-lg border border-border bg-background p-3">
                <div className="text-[10.5px] font-medium uppercase tracking-wider text-muted-foreground">Domaines évalués</div>
                <div className="mt-1 font-display text-xl font-semibold">15</div>
              </div>
              <div className="rounded-lg border border-border bg-background p-3">
                <div className="text-[10.5px] font-medium uppercase tracking-wider text-muted-foreground">Recommandations</div>
                <div className="mt-1 inline-flex items-center gap-1 font-display text-xl font-semibold text-[oklch(0.55_0.16_155)]">
                  <TrendingUp className="h-4 w-4" /> {recommendations.length}
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-5">
            <div className="grid gap-3 sm:grid-cols-4">
              <Kpi icon={AlertTriangle} tone="critical" value={criticalCount} label="Actions critiques" />
              <Kpi icon={AlertTriangle} tone="warning" value={highCount} label="Priorité élevée" />
              <Kpi icon={ShieldCheck} tone="success" value={computed.strongest?.name ?? "—"} label="Domaine le plus mature" />
              <Kpi icon={AlertTriangle} tone="critical" value={computed.weakest?.name ?? "—"} label="Domaine à renforcer" />
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
              <DomainRadar domains={computed.domainScores} />
            </div>
          </div>
        </div>

        {/* Bars */}
        <div className="mt-5">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">Détail par domaine</div>
                <div className="mt-0.5 font-display text-lg font-semibold">Forces et faiblesses</div>
              </div>
              <span className="text-xs text-muted-foreground">Échelle 0–5 (0–4 pour le domaine « Gestion des risques SSI »)</span>
            </div>
            <DomainBars domains={computed.domainScores} />
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
              <p className="mt-1 text-sm text-muted-foreground">Triées par score de priorité (voir méthodologie Sprint 3).</p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select label="Priorité" value={prio} onChange={setPrio as any} options={[
                { v: "all", l: "Toutes" }, { v: "critical", l: "Critique" }, { v: "high", l: "Élevée" }, { v: "medium", l: "Moyenne" }, { v: "low", l: "Faible" },
              ]} />
              <Select label="Domaine" value={dom} onChange={setDom} options={[
                { v: "all", l: "Tous" },
                ...domainOptions.map((d) => ({ v: d, l: d })),
              ]} />
              <Select label="Coût" value={cost} onChange={setCost} options={[
                { v: "all", l: "Tous" }, { v: "faible", l: "Faible" }, { v: "moyen", l: "Moyen" }, { v: "eleve", l: "Élevé" },
              ]} />
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border bg-card p-10 text-center text-sm text-muted-foreground">
              Aucune recommandation ne correspond à ces filtres — ou votre PME n'a déclenché aucune règle experte pour cette combinaison.
            </div>
          ) : (
            <div className="grid gap-3">
              {filtered.map((r, i) => <RecommendationCard key={r.id} rec={r} index={i} />)}
            </div>
          )}
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