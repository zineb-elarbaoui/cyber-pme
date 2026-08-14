import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AppShell } from "@/components/AppShell";
import { getQuestionnaire, envoyerReponses, ApiError, type QuestionOut } from "@/lib/api";
import { useWizard } from "@/lib/wizard-context";
import { ArrowLeft, ArrowRight, CheckCircle2, Loader2 } from "lucide-react";

export const Route = createFileRoute("/assessment")({
  component: AssessmentPage,
  head: () => ({ meta: [{ title: "Questionnaire de maturité — CyberDiag" }] }),
});

function AssessmentPage() {
  const nav = useNavigate();
  const { state, setReponse } = useWizard();

  // Si on arrive directement sur /assessment sans être passé par /profile,
  // il n'y a pas d'id_pme -> on ne peut rien soumettre à la fin. On renvoie
  // l'utilisateur créer son profil d'abord.
  useEffect(() => {
    if (!state.idPme) {
      nav({ to: "/profile" });
    }
  }, [state.idPme, nav]);

  // La requête ne doit s'exécuter que côté navigateur : ces données dépendent
  // du state client (id_pme en sessionStorage), et le SSR de TanStack Start
  // tentait de résoudre cette query côté serveur au premier rendu, ce qui
  // provoquait un aborted/ECONNRESET et bloquait la page sur "Chargement…".
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["questionnaire"],
    queryFn: getQuestionnaire,
    staleTime: Infinity, // le questionnaire ne change pas pendant une session
    enabled: mounted,
  });

  const [idx, setIdx] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Questions triées par numero (Q1..Q24), avec le nom du domaine résolu
  // pour les questions de type "domaine" (Q10..Q24).
  const questions = useMemo(() => {
    if (!data) return [];
    const domainesById = new Map(data.domaines.map((d) => [d.id_domaine, d]));
    return [...data.questions]
      .sort((a, b) => a.numero - b.numero)
      .map((q) => ({
        ...q,
        domainName: q.id_domaine ? domainesById.get(q.id_domaine)?.nom_domaine : undefined,
      }));
  }, [data]);

  const total = questions.length;
  const q = questions[idx];
  const answered = q ? q.id_question in state.reponses : false;
  const done = Object.keys(state.reponses).length;
  const pct = total > 0 ? ((idx + (answered ? 1 : 0)) / total) * 100 : 0;

  const grouped = useMemo(
    () => ({
      context: questions.filter((x) => x.type_question === "contextuelle"),
      domain: questions.filter((x) => x.type_question === "domaine"),
    }),
    [questions]
  );

  async function handleFinish() {
    if (!state.idPme) return;
    setSubmitError(null);
    setSubmitting(true);
    try {
      const reponses = Object.entries(state.reponses).map(([id_question, valeur_reponse]) => ({
        id_question: Number(id_question),
        valeur_reponse: String(valeur_reponse),
      }));
      await envoyerReponses(state.idPme, reponses);
      nav({ to: "/results" });
    } catch (e) {
      setSubmitError(
        e instanceof ApiError
          ? `Impossible d'envoyer vos réponses (${e.message}).`
          : "Erreur réseau — le backend est-il démarré ?"
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (isLoading) {
    return (
      <AppShell crumbs={[{ label: "Accueil", to: "/" }, { label: "Profil", to: "/profile" }, { label: "Questionnaire" }]}>
        <div className="flex min-h-[50vh] items-center justify-center gap-2 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" /> Chargement du questionnaire…
        </div>
      </AppShell>
    );
  }

  if (isError || !data || total === 0) {
    return (
      <AppShell crumbs={[{ label: "Accueil", to: "/" }, { label: "Profil", to: "/profile" }, { label: "Questionnaire" }]}>
        <div className="mx-auto max-w-lg px-6 py-20 text-center">
          <p className="text-sm text-destructive">
            {error instanceof ApiError ? error.message : "Impossible de charger le questionnaire."}
          </p>
          <p className="mt-2 text-sm text-muted-foreground">Vérifie que le backend est bien démarré, puis recharge la page.</p>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell crumbs={[{ label: "Accueil", to: "/" }, { label: "Profil", to: "/profile" }, { label: "Questionnaire" }]}>
      <section className="mx-auto max-w-5xl px-6 py-12">
        <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-widest text-[oklch(0.55_0.16_255)]">
              {q.type_question === "contextuelle" ? "Bloc contextuel · impact métier" : `Bloc maturité · ${q.domainName ?? ""}`}
            </div>
            <h1 className="mt-2 font-display text-2xl font-semibold tracking-tight">Questionnaire de maturité</h1>
          </div>
          <div className="text-right">
            <div className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Progression</div>
            <div className="font-display text-xl font-semibold tabular-nums">{done}<span className="text-sm text-muted-foreground">/{total}</span></div>
          </div>
        </header>

        <div className="mb-8 h-1.5 w-full overflow-hidden rounded-full bg-secondary">
          <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${pct}%` }} />
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_260px]">
          {/* Question card */}
          <div className="rounded-xl border border-border bg-gradient-card p-6 shadow-sm">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="inline-flex h-6 items-center rounded-md bg-secondary px-2 font-medium">Question {idx + 1} / {total}</span>
              {q.type_question === "domaine" && q.domainName && (
                <span className="rounded-md bg-primary/5 px-2 py-0.5 font-medium text-primary">{q.domainName}</span>
              )}
            </div>
            <h2 className="mt-3 font-display text-[22px] font-semibold leading-snug text-foreground">{q.intitule}</h2>

            {/* L'échelle vient directement de q.options renvoyé par l'API — pas
                d'échelle statique côté frontend, ce qui gère naturellement les
                cas où valeur_max varie (ex. domaine 3 "Gestion des risques SSI"
                qui s'arrête à 4 au lieu de 5, cf. limite documentée du guide). */}
            <div className="mt-6 grid gap-2">
              {(q.options ?? []).map((opt) => {
                const active = state.reponses[q.id_question] === String(opt.valeur);
                return (
                  <button
                    key={opt.valeur}
                    onClick={() => setReponse(q.id_question, String(opt.valeur))}
                    className={
                      "group flex items-start gap-4 rounded-lg border p-4 text-left transition " +
                      (active
                        ? "border-primary bg-primary/5 shadow-elegant"
                        : "border-border bg-background hover:border-ring/60")
                    }
                  >
                    <div className={
                      "flex h-9 w-9 shrink-0 items-center justify-center rounded-md font-display text-sm font-semibold tabular-nums transition " +
                      (active ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground group-hover:bg-primary/10")
                    }>
                      {opt.valeur}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        {active && <CheckCircle2 className="h-4 w-4 text-primary" />}
                      </div>
                      <div className="text-sm text-muted-foreground">{opt.libelle}</div>
                    </div>
                  </button>
                );
              })}
            </div>

            {submitError && (
              <div className="mt-4 rounded-md border border-destructive/30 bg-destructive/5 px-3.5 py-2.5 text-sm text-destructive">
                {submitError}
              </div>
            )}

            <div className="mt-6 flex items-center justify-between border-t border-border pt-5">
              <button
                onClick={() => setIdx((i) => Math.max(0, i - 1))}
                disabled={idx === 0 || submitting}
                className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-3.5 py-2 text-sm font-medium transition hover:bg-secondary disabled:opacity-40"
              >
                <ArrowLeft className="h-4 w-4" /> Précédent
              </button>
              {idx < total - 1 ? (
                <button
                  onClick={() => setIdx((i) => i + 1)}
                  disabled={!answered}
                  className="inline-flex items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-elegant transition hover:opacity-95 disabled:opacity-40"
                >
                  Suivant <ArrowRight className="h-4 w-4" />
                </button>
              ) : (
                <button
                  onClick={handleFinish}
                  disabled={!answered || submitting}
                  className="inline-flex items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-elegant transition hover:opacity-95 disabled:opacity-60"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" /> Envoi…
                    </>
                  ) : (
                    <>
                      Voir mes résultats <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Side outline */}
          <aside className="rounded-xl border border-border bg-card p-4 shadow-sm">
            <div className="mb-2 text-[10.5px] font-semibold uppercase tracking-wider text-muted-foreground">Structure</div>
            <Section title={`Contexte (${grouped.context.length})`} items={grouped.context} questions={questions} idx={idx} setIdx={setIdx} reponses={state.reponses} />
            <Section title={`Domaines (${grouped.domain.length})`} items={grouped.domain} questions={questions} idx={idx} setIdx={setIdx} reponses={state.reponses} />
          </aside>
        </div>
      </section>
    </AppShell>
  );
}

function Section({
  title,
  items,
  questions,
  idx,
  setIdx,
  reponses,
}: {
  title: string;
  items: (QuestionOut & { domainName?: string })[];
  questions: (QuestionOut & { domainName?: string })[];
  idx: number;
  setIdx: (n: number) => void;
  reponses: Record<number, string>;
}) {
  return (
    <div className="mb-3">
      <div className="mb-1.5 text-xs font-semibold text-foreground">{title}</div>
      <ol className="grid grid-cols-9 gap-1">
        {items.map((it) => {
          const globalIdx = questions.findIndex((x) => x.id_question === it.id_question);
          const current = globalIdx === idx;
          const isDone = it.id_question in reponses;
          return (
            <li key={it.id_question}>
              <button
                onClick={() => setIdx(globalIdx)}
                className={
                  "flex h-7 w-full items-center justify-center rounded text-[10.5px] font-semibold tabular-nums transition " +
                  (current
                    ? "bg-primary text-primary-foreground"
                    : isDone
                    ? "bg-[oklch(0.62_0.16_155)]/15 text-[oklch(0.35_0.13_155)]"
                    : "bg-secondary text-muted-foreground hover:bg-secondary/70")
                }
                title={it.intitule}
              >
                {globalIdx + 1}
              </button>
            </li>
          );
        })}
      </ol>
    </div>
  );
}