import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AppShell } from "@/components/AppShell";
import { PriorityBadge, MetaBadge, DomainTag } from "@/components/cyber/Badges";
import { ArrowLeft, BookOpen, MessageSquare, Star, ThumbsUp, CheckCircle2, Loader2 } from "lucide-react";
import { getRecommandations, envoyerFeedback, ApiError } from "@/lib/api";
import { useWizard } from "@/lib/wizard-context";
import { priorityBucket } from "@/lib/maturity";

export const Route = createFileRoute("/recommendation/$id")({
  component: RecommendationDetail,
  head: () => ({ meta: [{ name: "robots", content: "noindex" }] }),
});

function RecommendationDetail() {
  const { id } = Route.useParams();
  const nav = useNavigate();
  const { state } = useWizard();

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Réutilise le cache déjà peuplé par /results (même queryKey) — évite de
  // relancer tout le moteur de règles + RAG juste pour afficher le détail
  // d'une seule recommandation déjà générée. staleTime: Infinity empêche un
  // refetch automatique tant que le cache existe.
  const recommandationsQ = useQuery({
    queryKey: ["recommandations", state.idPme],
    queryFn: () => getRecommandations(state.idPme as string, true),
    enabled: mounted && !!state.idPme,
    staleTime: Infinity,
  });

  const rec = useMemo(() => {
    const list = recommandationsQ.data?.recommandations ?? [];
    const found = list.find((r) => r.id_recommandation === id);
    if (!found) return null;
    return {
      id: found.id_recommandation,
      title: found.titre_mesure,
      domainName: found.nom_domaine,
      priority: priorityBucket(found.score_priorite),
      scorePriorite: found.score_priorite,
      cost: found.cout_estime,
      difficulty: found.difficulte_estimee,
      impact: found.impact,
      guideRef: `Guide CMRPI/AUSIM — §${found.section_guide_precise}`,
      description: found.description_mesure,
      rationale: found.justification_rag,
    };
  }, [recommandationsQ.data, id]);

  const [rating, setRating] = useState(0);
  const [applied, setApplied] = useState<string | null>(null);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  async function handleSubmitFeedback() {
    if (!rec || rating === 0) return;
    setSubmitError(null);
    setSubmitting(true);
    try {
      await envoyerFeedback({
        id_recommandation: rec.id,
        note_pertinence: rating,
        commentaire: comment || undefined,
        recommandation_appliquee: applied === "Déjà appliquée" || applied === "En cours",
      });
      setSubmitted(true);
    } catch (e) {
      setSubmitError(e instanceof ApiError ? e.message : "Erreur lors de l'envoi du feedback.");
    } finally {
      setSubmitting(false);
    }
  }

  if (!mounted || recommandationsQ.isLoading) {
    return (
      <AppShell crumbs={[{ label: "Résultats", to: "/results" }]}>
        <div className="flex min-h-[50vh] items-center justify-center gap-2 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" /> Chargement…
        </div>
      </AppShell>
    );
  }

  if (!state.idPme || recommandationsQ.isError || !rec) {
    return (
      <AppShell crumbs={[{ label: "Résultats", to: "/results" }]}>
        <div className="mx-auto max-w-lg px-6 py-20 text-center">
          <p className="text-sm text-muted-foreground">
            Recommandation introuvable — le rapport n'est peut-être plus en cache.
          </p>
          <button
            onClick={() => nav({ to: "/results" })}
            className="mt-4 inline-flex items-center gap-1.5 rounded-md bg-primary px-3.5 py-2 text-sm font-medium text-primary-foreground"
          >
            <ArrowLeft className="h-4 w-4" /> Retour au rapport
          </button>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell crumbs={[{ label: "Résultats", to: "/results" }, { label: rec.domainName }, { label: rec.title }]}>
      <section className="mx-auto max-w-4xl px-6 py-10">
        <Link to="/results" className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-3.5 w-3.5" /> Retour au rapport
        </Link>

        <header className="mt-4 rounded-2xl border border-border bg-gradient-card p-7 shadow-sm">
          <div className="flex flex-wrap items-center gap-2">
            <PriorityBadge priority={rec.priority} />
            <DomainTag>{rec.domainName}</DomainTag>
          </div>
          <h1 className="mt-3 font-display text-3xl font-semibold leading-tight tracking-tight">{rec.title}</h1>
          <div className="mt-5 flex flex-wrap gap-1.5">
            <MetaBadge label="Coût" value={rec.cost} />
            <MetaBadge label="Difficulté" value={rec.difficulty} />
            <MetaBadge label="Impact" value={rec.impact} />
            <MetaBadge label="Réf." value={rec.guideRef} />
          </div>
        </header>

        <div className="mt-6 grid gap-5 lg:grid-cols-[1fr_260px]">
          <div className="space-y-5">
            <Panel title="Description de la mesure">
              <p className="text-sm leading-relaxed text-foreground/85">{rec.description}</p>
            </Panel>

            <Panel title="Pourquoi cette recommandation" icon={BookOpen} accent>
              {rec.rationale ? (
                <p className="text-sm leading-relaxed text-foreground/85">{rec.rationale}</p>
              ) : (
                <p className="text-sm italic text-muted-foreground">
                  Justification non disponible (générée sans RAG, ou aucun passage du guide n'a pu être associé à cette mesure).
                </p>
              )}
            </Panel>

            {/* Feedback */}
            <Panel title="Cette recommandation est-elle pertinente ?" icon={MessageSquare}>
              {submitted ? (
                <div className="flex items-center gap-2 rounded-lg bg-[oklch(0.97_0.03_155)] p-4 text-sm font-medium text-[oklch(0.35_0.13_155)]">
                  <CheckCircle2 className="h-4 w-4" /> Merci ! Votre retour améliore les futures recommandations.
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Pertinence</div>
                    <div className="flex gap-1">
                      {[1,2,3,4,5].map((n) => (
                        <button
                          key={n}
                          onClick={() => setRating(n)}
                          className={"rounded-md p-1.5 transition " + (n <= rating ? "text-[oklch(0.72_0.16_60)]" : "text-muted-foreground hover:text-foreground")}
                          aria-label={`${n} étoile${n > 1 ? "s" : ""}`}
                        >
                          <Star className={"h-5 w-5 " + (n <= rating ? "fill-current" : "")} />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Avez-vous appliqué cette mesure ?</div>
                    <div className="flex flex-wrap gap-2">
                      {["Déjà appliquée", "Planifiée", "En cours", "Non pertinente"].map((o) => (
                        <button
                          key={o}
                          onClick={() => setApplied(o)}
                          className={"rounded-md border px-3 py-1.5 text-xs font-medium transition " + (applied === o ? "border-primary bg-primary/5 text-primary" : "border-border bg-background text-muted-foreground hover:border-ring/60")}
                        >
                          {o}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Commentaire (optionnel)</div>
                    <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      rows={3}
                      placeholder="Freins rencontrés, contexte particulier, question…"
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/25"
                    />
                  </div>
                  {submitError && (
                    <div className="rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-xs text-destructive">
                      {submitError}
                    </div>
                  )}
                  <button
                    onClick={handleSubmitFeedback}
                    disabled={rating === 0 || submitting}
                    className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3.5 py-2 text-sm font-medium text-primary-foreground shadow-elegant transition hover:opacity-95 disabled:opacity-40"
                  >
                    {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <ThumbsUp className="h-4 w-4" />}
                    Envoyer mon feedback
                  </button>
                </div>
              )}
            </Panel>
          </div>

          <aside className="space-y-4">
            <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
              <div className="text-[10.5px] font-semibold uppercase tracking-wider text-muted-foreground">Score de priorité</div>
              <div className="mt-1 font-display text-3xl font-semibold tabular-nums">
                {rec.scorePriorite.toFixed(1)}
              </div>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                Priorité de base × poids d'impact × contexte de risque {"("}Q1–Q9{")"} × pertinence sectorielle
                — méthodologie qualitative du projet (Sprint 3), non issue du guide.
              </p>
            </div>
            <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
              <div className="text-[10.5px] font-semibold uppercase tracking-wider text-muted-foreground">Source</div>
              <div className="mt-1 text-sm font-semibold">{rec.guideRef}</div>
              <p className="mt-2 text-xs text-muted-foreground">
                {rec.rationale
                  ? "Justification générée par le pipeline RAG (Ollama) à partir des passages du guide indexés dans pgvector."
                  : "Recommandation déclenchée par le moteur de règles expertes ; justification RAG non générée pour cet appel."}
              </p>
            </div>
          </aside>
        </div>
      </section>
    </AppShell>
  );
}

function Panel({ title, icon: Icon, children, accent }: { title: string; icon?: any; children: React.ReactNode; accent?: boolean }) {
  return (
    <div className={"rounded-xl border p-6 shadow-sm " + (accent ? "border-primary/20 bg-primary/[0.03]" : "border-border bg-card")}>
      <div className="mb-3 flex items-center gap-2">
        {Icon && <Icon className="h-4 w-4 text-primary" />}
        <h2 className="font-display text-base font-semibold">{title}</h2>
      </div>
      {children}
    </div>
  );
}