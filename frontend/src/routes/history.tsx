import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AppShell } from "@/components/AppShell";
import { getSuiviRecommandations, ApiError, type SuiviItem } from "@/lib/api";
import { useWizard } from "@/lib/wizard-context";
import { priorityBucket } from "@/lib/maturity";
import { PriorityBadge, DomainTag } from "@/components/cyber/Badges";
import { CheckCircle2, Clock, Info, Loader2 } from "lucide-react";

export const Route = createFileRoute("/history")({
  component: HistoryPage,
  head: () => ({ meta: [{ title: "Suivi des recommandations — CyberDiag" }] }),
});

function HistoryPage() {
  const nav = useNavigate();
  const { state } = useWizard();

  useEffect(() => {
    if (!state.idPme) nav({ to: "/profile" });
  }, [state.idPme, nav]);

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const suiviQ = useQuery({
    queryKey: ["suivi", state.idPme],
    queryFn: () => getSuiviRecommandations(state.idPme as string),
    enabled: mounted && !!state.idPme,
  });

  if (!mounted || suiviQ.isLoading) {
    return (
      <AppShell crumbs={[{ label: "Résultats", to: "/results" }, { label: "Suivi" }]}>
        <div className="flex min-h-[50vh] items-center justify-center gap-2 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" /> Chargement du suivi…
        </div>
      </AppShell>
    );
  }

  if (suiviQ.isError || !suiviQ.data) {
    return (
      <AppShell crumbs={[{ label: "Résultats", to: "/results" }, { label: "Suivi" }]}>
        <div className="mx-auto max-w-lg px-6 py-20 text-center">
          <p className="text-sm text-muted-foreground">
            {suiviQ.error instanceof ApiError
              ? suiviQ.error.message
              : "Aucune recommandation générée pour l'instant."}
          </p>
        </div>
      </AppShell>
    );
  }

  const { recommandations_traitees, recommandations_en_attente } = suiviQ.data;
  const total = recommandations_traitees.length + recommandations_en_attente.length;
  const pct = total > 0 ? Math.round((recommandations_traitees.length / total) * 100) : 0;

  return (
    <AppShell crumbs={[{ label: "Résultats", to: "/results" }, { label: "Suivi" }]}>
      <section className="mx-auto max-w-7xl px-6 py-10">
        <header className="mb-8">
          <div className="text-[11px] font-semibold uppercase tracking-widest text-[oklch(0.55_0.16_255)]">
            Suivi{state.profil.nom_entreprise ? ` · ${state.profil.nom_entreprise}` : ""}
          </div>
          <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight">Suivi de la mise en œuvre</h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Basé sur les retours laissés depuis les pages de détail de chaque recommandation.
          </p>
        </header>

        {/* Note honnête plutôt qu'un graphique fictif : pas de mécanisme de
            snapshots d'évaluation dans le temps pour l'instant. */}
        <div className="mb-6 flex items-start gap-2.5 rounded-lg border border-border bg-secondary/40 px-4 py-3 text-sm text-muted-foreground">
          <Info className="mt-0.5 h-4 w-4 shrink-0" />
          <span>
            L'évolution du score dans le temps sera disponible à partir d'une prochaine évaluation formelle —
            cette page se limite pour l'instant au statut de mise en œuvre de chaque recommandation.
          </span>
        </div>

        {total > 0 && (
          <div className="mb-6 rounded-2xl border border-border bg-gradient-card p-5 shadow-sm">
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="font-medium text-foreground">Progression de la mise en œuvre</span>
              <span className="tabular-nums text-muted-foreground">{recommandations_traitees.length}/{total} traitées</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
              <div className="h-full rounded-full bg-[oklch(0.62_0.16_155)] transition-all" style={{ width: `${pct}%` }} />
            </div>
          </div>
        )}

        <div className="grid gap-5 lg:grid-cols-2">
          <Panel title="Recommandations traitées" count={recommandations_traitees.length} icon={CheckCircle2} tone="success">
            {recommandations_traitees.length === 0 ? (
              <EmptyNote text="Aucune recommandation marquée comme appliquée pour l'instant." />
            ) : (
              recommandations_traitees.map((r) => <RowItem key={r.id_recommandation} rec={r} status="done" />)
            )}
          </Panel>
          <Panel title="En attente d'action" count={recommandations_en_attente.length} icon={Clock} tone="warning">
            {recommandations_en_attente.length === 0 ? (
              <EmptyNote text="Tout est traité !" />
            ) : (
              recommandations_en_attente.map((r) => <RowItem key={r.id_recommandation} rec={r} status="pending" />)
            )}
          </Panel>
        </div>
      </section>
    </AppShell>
  );
}

function Panel({ title, count, icon: Icon, tone, children }: { title: string; count: number; icon: any; tone: "success" | "warning"; children: React.ReactNode }) {
  const bg = tone === "success" ? "bg-[oklch(0.97_0.03_155)] text-[oklch(0.35_0.13_155)]" : "bg-[oklch(0.97_0.04_60)] text-[oklch(0.42_0.14_60)]";
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={"inline-flex h-7 w-7 items-center justify-center rounded-md " + bg}><Icon className="h-4 w-4" /></span>
          <h2 className="font-display text-base font-semibold">{title}</h2>
        </div>
        <span className="rounded-full bg-secondary px-2 py-0.5 text-xs font-semibold">{count}</span>
      </div>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function EmptyNote({ text }: { text: string }) {
  return <div className="rounded-lg border border-dashed border-border p-4 text-center text-sm text-muted-foreground">{text}</div>;
}

function RowItem({ rec, status }: { rec: SuiviItem; status: "done" | "pending" }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border border-border bg-background p-3">
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <PriorityBadge priority={priorityBucket(rec.score_priorite)} />
          <DomainTag>{rec.nom_domaine}</DomainTag>
        </div>
        <div className="mt-1.5 truncate text-sm font-semibold text-foreground">{rec.titre_mesure}</div>
      </div>
      {status === "done" ? (
        <span className="inline-flex items-center gap-1 rounded-full bg-[oklch(0.97_0.03_155)] px-2.5 py-0.5 text-[11px] font-semibold text-[oklch(0.35_0.13_155)] ring-1 ring-inset ring-[oklch(0.62_0.16_155)]/25">
          <CheckCircle2 className="h-3 w-3" /> Traitée
        </span>
      ) : (
        <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-2.5 py-0.5 text-[11px] font-semibold text-muted-foreground">
          <Clock className="h-3 w-3" /> En attente
        </span>
      )}
    </div>
  );
}