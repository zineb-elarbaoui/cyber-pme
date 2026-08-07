import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { contextualQuestions, domainQuestions, scaleLabels3, scaleLabels5 } from "@/lib/mock-data";
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/assessment")({
  component: AssessmentPage,
  head: () => ({ meta: [{ title: "Questionnaire de maturité — CyberDiag" }] }),
});

type Q = { id: string; type: "context" | "domain"; text: string; domain?: string };

const questions: Q[] = [
  ...contextualQuestions.map((q, i) => ({ id: `c${i}`, type: "context" as const, text: q })),
  ...domainQuestions.map((q, i) => ({ id: `d${i}`, type: "domain" as const, text: q.question, domain: q.domainName })),
];

function AssessmentPage() {
  const nav = useNavigate();
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const q = questions[idx];
  const scale = q.type === "context" ? scaleLabels3 : scaleLabels5;
  const answered = q.id in answers;
  const total = questions.length;
  const done = Object.keys(answers).length;
  const pct = ((idx + (answered ? 1 : 0)) / total) * 100;

  const grouped = useMemo(() => ({
    context: questions.filter((x) => x.type === "context"),
    domain: questions.filter((x) => x.type === "domain"),
  }), []);

  return (
    <AppShell crumbs={[{ label: "Accueil", to: "/" }, { label: "Profil", to: "/profile" }, { label: "Questionnaire" }]}>
      <section className="mx-auto max-w-5xl px-6 py-12">
        <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-widest text-[oklch(0.55_0.16_255)]">
              {q.type === "context" ? "Bloc contextuel · impact métier" : `Bloc maturité · ${q.domain}`}
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
              {q.type === "domain" && <span className="rounded-md bg-primary/5 px-2 py-0.5 font-medium text-primary">{q.domain}</span>}
            </div>
            <h2 className="mt-3 font-display text-[22px] font-semibold leading-snug text-foreground">{q.text}</h2>

            <div className="mt-6 grid gap-2">
              {scale.map((s) => {
                const active = answers[q.id] === s.value;
                return (
                  <button
                    key={s.value}
                    onClick={() => setAnswers((a) => ({ ...a, [q.id]: s.value }))}
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
                      {s.value}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-foreground">{s.title}</span>
                        {active && <CheckCircle2 className="h-4 w-4 text-primary" />}
                      </div>
                      <div className="text-sm text-muted-foreground">{s.desc}</div>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="mt-6 flex items-center justify-between border-t border-border pt-5">
              <button
                onClick={() => setIdx((i) => Math.max(0, i - 1))}
                disabled={idx === 0}
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
                  onClick={() => nav({ to: "/results" })}
                  disabled={!answered}
                  className="inline-flex items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-elegant transition hover:opacity-95 disabled:opacity-40"
                >
                  Voir mes résultats <ArrowRight className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          {/* Side outline */}
          <aside className="rounded-xl border border-border bg-card p-4 shadow-sm">
            <div className="mb-2 text-[10.5px] font-semibold uppercase tracking-wider text-muted-foreground">Structure</div>
            <Section title={`Contexte (${grouped.context.length})`} items={grouped.context} idx={idx} setIdx={setIdx} answers={answers} />
            <Section title={`Domaines (${grouped.domain.length})`} items={grouped.domain} idx={idx} setIdx={setIdx} answers={answers} />
          </aside>
        </div>
      </section>
    </AppShell>
  );
}

function Section({ title, items, idx, setIdx, answers }: { title: string; items: Q[]; idx: number; setIdx: (n: number) => void; answers: Record<string, number> }) {
  return (
    <div className="mb-3">
      <div className="mb-1.5 text-xs font-semibold text-foreground">{title}</div>
      <ol className="grid grid-cols-9 gap-1">
        {items.map((it) => {
          const globalIdx = it.id.startsWith("c")
            ? parseInt(it.id.slice(1))
            : parseInt(it.id.slice(1)) + 9;
          const current = globalIdx === idx;
          const done = it.id in answers;
          return (
            <li key={it.id}>
              <button
                onClick={() => setIdx(globalIdx)}
                className={
                  "flex h-7 w-full items-center justify-center rounded text-[10.5px] font-semibold tabular-nums transition " +
                  (current
                    ? "bg-primary text-primary-foreground"
                    : done
                    ? "bg-[oklch(0.62_0.16_155)]/15 text-[oklch(0.35_0.13_155)]"
                    : "bg-secondary text-muted-foreground hover:bg-secondary/70")
                }
                title={it.text}
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