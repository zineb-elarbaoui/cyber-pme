import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { recommendations } from "@/lib/mock-data";
import { PriorityBadge, MetaBadge, DomainTag } from "@/components/cyber/Badges";
import { ArrowLeft, BookOpen, MessageSquare, Star, ThumbsUp, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/recommendation/$id")({
  loader: ({ params }) => {
    const rec = recommendations.find((r) => r.id === params.id);
    if (!rec) throw notFound();
    return { rec };
  },
  component: RecommendationDetail,
  head: ({ loaderData }) => ({
    meta: [
      { title: loaderData ? `${loaderData.rec.title} — CyberDiag` : "Recommandation — CyberDiag" },
      { name: "robots", content: "noindex" },
    ],
  }),
});

function RecommendationDetail() {
  const { rec } = Route.useLoaderData();
  const [rating, setRating] = useState(0);
  const [applied, setApplied] = useState<string | null>(null);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);

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
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{rec.summary}</p>
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
              <p className="text-sm leading-relaxed text-foreground/85">{rec.rationale}</p>
              <blockquote className="mt-4 border-l-2 border-primary/40 bg-secondary/50 pl-4 py-2 text-sm italic text-muted-foreground">
                « Toute PME exposée à Internet doit protéger ses accès à privilèges par une authentification à deux facteurs. »
                <cite className="mt-1 block text-[11px] not-italic font-semibold uppercase tracking-wider text-foreground/60">
                  — {rec.guideRef}
                </cite>
              </blockquote>
            </Panel>

            <Panel title="Étapes de mise en œuvre">
              <ol className="space-y-3">
                {[
                  "Identifier les comptes critiques (admin, messagerie, VPN, SaaS).",
                  "Choisir une solution MFA (authenticator app, clé physique FIDO2).",
                  "Piloter avec 3 utilisateurs, documenter la procédure d'enrôlement.",
                  "Déployer à l'ensemble des collaborateurs concernés.",
                  "Mettre en place une procédure de récupération sécurisée.",
                ].map((s, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 font-display text-[11px] font-semibold text-primary">{i + 1}</span>
                    <span className="text-sm text-foreground/85">{s}</span>
                  </li>
                ))}
              </ol>
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
                  <button
                    onClick={() => setSubmitted(true)}
                    disabled={rating === 0}
                    className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3.5 py-2 text-sm font-medium text-primary-foreground shadow-elegant transition hover:opacity-95 disabled:opacity-40"
                  >
                    <ThumbsUp className="h-4 w-4" /> Envoyer mon feedback
                  </button>
                </div>
              )}
            </Panel>
          </div>

          <aside className="space-y-4">
            <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
              <div className="text-[10.5px] font-semibold uppercase tracking-wider text-muted-foreground">Score de priorité</div>
              <div className="mt-1 font-display text-3xl font-semibold tabular-nums">92<span className="text-sm text-muted-foreground">/100</span></div>
              <div className="mt-3 space-y-2 text-xs">
                <ScoreLine label="Urgence" value={95} />
                <ScoreLine label="Impact" value={90} />
                <ScoreLine label="Faisabilité" value={88} />
              </div>
            </div>
            <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
              <div className="text-[10.5px] font-semibold uppercase tracking-wider text-muted-foreground">Source</div>
              <div className="mt-1 text-sm font-semibold">{rec.guideRef}</div>
              <p className="mt-2 text-xs text-muted-foreground">
                Passage extrait par le moteur RAG à partir du guide officiel indexé (pgvector).
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

function ScoreLine({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between">
        <span className="text-muted-foreground">{label}</span>
        <span className="tabular-nums font-semibold text-foreground">{value}</span>
      </div>
      <div className="h-1.5 rounded-full bg-secondary">
        <div className="h-full rounded-full bg-primary" style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}