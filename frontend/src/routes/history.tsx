import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { historyPoints, recommendations, globalScore } from "@/lib/mock-data";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";
import { PriorityBadge, DomainTag } from "@/components/cyber/Badges";
import { CheckCircle2, Clock, TrendingUp } from "lucide-react";

export const Route = createFileRoute("/history")({
  component: HistoryPage,
  head: () => ({ meta: [{ title: "Historique — CyberDiag" }] }),
});

function HistoryPage() {
  const treated = recommendations.slice(0, 3);
  const pending = recommendations.slice(3);
  const delta = historyPoints[historyPoints.length - 1].score - historyPoints[0].score;

  return (
    <AppShell crumbs={[{ label: "Accueil", to: "/" }, { label: "Historique" }]}>
      <section className="mx-auto max-w-7xl px-6 py-10">
        <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-widest text-[oklch(0.55_0.16_255)]">Suivi long terme · Atlas Distribution SARL</div>
            <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight">Évolution de votre maturité cyber</h1>
          </div>
          <div className="flex items-center gap-2 rounded-lg border border-border bg-card p-3">
            <TrendingUp className="h-5 w-5 text-[oklch(0.55_0.16_155)]" />
            <div>
              <div className="text-[10.5px] font-medium uppercase tracking-wider text-muted-foreground">Progression 12 mois</div>
              <div className="font-display text-xl font-semibold text-[oklch(0.35_0.13_155)]">+{delta} points</div>
            </div>
          </div>
        </header>

        {/* Chart */}
        <div className="rounded-2xl border border-border bg-gradient-card p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">Score global</div>
              <div className="font-display text-lg font-semibold">Évolution trimestrielle</div>
            </div>
            <div className="text-right">
              <div className="text-[10.5px] font-medium uppercase tracking-wider text-muted-foreground">Actuel</div>
              <div className="font-display text-2xl font-semibold tabular-nums">{globalScore}<span className="text-sm text-muted-foreground">/102</span></div>
            </div>
          </div>
          <div className="h-[280px] w-full">
            <ResponsiveContainer>
              <AreaChart data={historyPoints} margin={{ top: 5, right: 12, left: -12, bottom: 0 }}>
                <defs>
                  <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.55 0.16 255)" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="oklch(0.55 0.16 255)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="oklch(0.92 0.015 250)" vertical={false} />
                <XAxis dataKey="date" tick={{ fill: "oklch(0.5 0.03 258)", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 102]} tick={{ fill: "oklch(0.5 0.03 258)", fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: "oklch(0.22 0.07 258)", border: "none", borderRadius: 8, color: "white", fontSize: 12 }} />
                <Area type="monotone" dataKey="score" stroke="oklch(0.55 0.16 255)" strokeWidth={2.5} fill="url(#areaGrad)" />
                <Line type="monotone" dataKey="score" stroke="oklch(0.55 0.16 255)" strokeWidth={0} dot={{ r: 4, fill: "oklch(0.55 0.16 255)" }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recos progress */}
        <div className="mt-6 grid gap-5 lg:grid-cols-2">
          <Panel title="Recommandations traitées" count={treated.length} icon={CheckCircle2} tone="success">
            {treated.map((r) => (
              <RowItem key={r.id} rec={r} status="done" />
            ))}
          </Panel>
          <Panel title="En attente d'action" count={pending.length} icon={Clock} tone="warning">
            {pending.map((r) => (
              <RowItem key={r.id} rec={r} status="pending" />
            ))}
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

function RowItem({ rec, status }: { rec: (typeof recommendations)[number]; status: "done" | "pending" }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border border-border bg-background p-3">
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <PriorityBadge priority={rec.priority} />
          <DomainTag>{rec.domainName}</DomainTag>
        </div>
        <div className="mt-1.5 truncate text-sm font-semibold text-foreground">{rec.title}</div>
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