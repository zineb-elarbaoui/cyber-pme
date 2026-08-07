import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ShieldCheck, Radar, ListChecks, FileText, Clock, ArrowRight, Lock, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/")({
  component: Landing,
});

function Landing() {
  return (
    <AppShell>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-hero text-primary-foreground">
        <div className="absolute inset-0 grid-pattern opacity-40" />
        <div className="absolute -right-40 top-1/2 h-[520px] w-[520px] -translate-y-1/2 rounded-full bg-[var(--primary-accent)]/25 blur-3xl" />
        <div className="relative mx-auto grid max-w-7xl gap-12 px-6 py-24 lg:grid-cols-[1.15fr_0.85fr] lg:py-32">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.14em] text-white/80 backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--primary-accent)]" />
              Programme national — CMRPI × AUSIM
            </div>
            <h1 className="mt-5 max-w-2xl font-display text-5xl font-semibold leading-[1.05] tracking-tight md:text-6xl">
              Diagnostiquez la <span className="text-[oklch(0.85_0.12_255)]">maturité cyber</span> de votre PME en 15 minutes.
            </h1>
            <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-white/75">
              Répondez à 24 questions guidées. Obtenez un plan d'action priorisé, adapté à votre secteur, votre taille et vos obligations légales — loi 09-08, RGPD, exigences sectorielles.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link to="/profile" className="inline-flex items-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-semibold text-primary shadow-elegant transition hover:bg-white/95">
                Démarrer mon évaluation <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/results" className="inline-flex items-center gap-2 rounded-lg border border-white/25 bg-white/5 px-5 py-3 text-sm font-medium text-white backdrop-blur transition hover:bg-white/10">
                Voir un exemple de rapport
              </Link>
            </div>
            <dl className="mt-10 grid grid-cols-3 gap-6 border-t border-white/10 pt-6 text-white/80">
              {[
                { k: "15 min", v: "Durée moyenne" },
                { k: "15", v: "Domaines évalués" },
                { k: "100 %", v: "Confidentiel" },
              ].map((s) => (
                <div key={s.k}>
                  <dt className="font-display text-2xl font-semibold text-white">{s.k}</dt>
                  <dd className="text-[11px] uppercase tracking-widest text-white/60">{s.v}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Hero card mockup */}
          <div className="relative">
            <div className="rounded-2xl border border-white/15 bg-white/95 p-5 text-foreground shadow-2xl backdrop-blur">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[10.5px] font-semibold uppercase tracking-widest text-muted-foreground">Score global</div>
                  <div className="mt-1 font-display text-4xl font-semibold tabular-nums">58<span className="text-lg text-muted-foreground">/102</span></div>
                  <div className="mt-0.5 text-xs font-medium text-[oklch(0.55_0.16_255)]">Maturité émergente</div>
                </div>
                <div className="flex items-center gap-1 rounded-full bg-secondary px-2.5 py-1 text-[11px] font-medium text-secondary-foreground">
                  <CheckCircle2 className="h-3.5 w-3.5 text-[oklch(0.62_0.16_155)]" /> Rapport prêt
                </div>
              </div>
              <div className="mt-4 space-y-2">
                {[
                  { n: "Contrôle d'accès", v: 2, tone: "oklch(0.72 0.16 60)" },
                  { n: "Continuité d'activité", v: 2, tone: "oklch(0.72 0.16 60)" },
                  { n: "Sensibilisation", v: 1, tone: "oklch(0.58 0.22 25)" },
                  { n: "Sécurité réseau", v: 3, tone: "oklch(0.55 0.16 255)" },
                  { n: "Conformité 09-08", v: 2, tone: "oklch(0.72 0.16 60)" },
                ].map((d) => (
                  <div key={d.n}>
                    <div className="mb-1 flex items-center justify-between text-[11px]">
                      <span className="font-medium">{d.n}</span>
                      <span className="tabular-nums text-muted-foreground">{d.v}/5</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-secondary">
                      <div className="h-full rounded-full" style={{ width: `${(d.v/5)*100}%`, background: d.tone }} />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex items-center justify-between rounded-lg bg-secondary/60 p-3">
                <div className="text-[11px]">
                  <div className="font-semibold text-foreground">Prochaine action</div>
                  <div className="text-muted-foreground">Activer le MFA sur les comptes admin</div>
                </div>
                <span className="rounded-full bg-[oklch(0.97_0.03_25)] px-2 py-0.5 text-[10px] font-semibold text-[oklch(0.42_0.19_25)] ring-1 ring-inset ring-[oklch(0.58_0.22_25)]/25">
                  Critique
                </span>
              </div>
            </div>
            <div className="absolute -bottom-4 -left-4 rounded-xl border border-white/15 bg-primary/70 p-3 text-[11px] text-white/85 backdrop-blur">
              <div className="flex items-center gap-2">
                <Lock className="h-3.5 w-3.5" />
                Données chiffrées · hébergement conforme
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Steps */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="flex items-end justify-between gap-6">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-widest text-[oklch(0.55_0.16_255)]">Comment ça marche</div>
            <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight">Un diagnostic conçu pour les dirigeants de PME.</h2>
          </div>
          <p className="hidden max-w-md text-sm text-muted-foreground md:block">
            Aucune expertise cyber requise. Chaque question est expliquée, chaque niveau détaillé. Le rapport est directement actionnable.
          </p>
        </div>
        <div className="mt-10 grid gap-4 md:grid-cols-4">
          {[
            { i: ShieldCheck, t: "Profil PME", d: "Secteur, taille, obligations légales, budget." },
            { i: ListChecks, t: "24 questions", d: "9 contextuelles + 15 par domaine, échelles guidées." },
            { i: Radar, t: "Scoring auto", d: "Moteur de règles + RAG sur guides officiels." },
            { i: FileText, t: "Plan d'action", d: "Recommandations priorisées, exportables en PDF." },
          ].map(({ i: Icon, t, d }, idx) => (
            <div key={t} className="relative rounded-xl border border-border bg-gradient-card p-5 shadow-sm">
              <div className="absolute right-4 top-4 font-display text-xs font-semibold text-muted-foreground">
                {String(idx + 1).padStart(2, "0")}
              </div>
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Icon className="h-5 w-5" />
              </div>
              <div className="font-display text-base font-semibold">{t}</div>
              <p className="mt-1 text-sm text-muted-foreground">{d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Coverage */}
      <section className="border-y border-border bg-secondary/40">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 py-16 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-widest text-[oklch(0.55_0.16_255)]">Référentiels</div>
            <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight">Aligné avec les guides officiels.</h2>
            <p className="mt-3 max-w-md text-sm text-muted-foreground">
              Le moteur s'appuie sur le guide ANRT PME, les recommandations CERT-MA et les exigences de la loi 09-08 sur la protection des données personnelles.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {["Loi 09-08", "Guide ANRT PME", "CERT-MA", "ISO 27001 (extraits)", "RGPD", "NIST CSF"].map((r) => (
                <span key={r} className="rounded-md border border-border bg-background px-2.5 py-1 text-xs font-medium">
                  {r}
                </span>
              ))}
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              { t: "Politique & gouvernance", d: "Cadrage direction, responsabilités, revues." },
              { t: "Gestion des risques", d: "Cartographie, analyse d'impact, plans." },
              { t: "Contrôle d'accès", d: "MFA, moindre privilège, revues trimestrielles." },
              { t: "Continuité d'activité", d: "Sauvegardes, PRA, tests de restauration." },
              { t: "Sensibilisation", d: "Phishing, hygiène numérique, onboarding." },
              { t: "Conformité légale", d: "Loi 09-08, CNDP, secteur bancaire, santé." },
            ].map((c) => (
              <div key={c.t} className="rounded-lg border border-border bg-background p-4">
                <div className="text-sm font-semibold text-foreground">{c.t}</div>
                <div className="mt-0.5 text-xs text-muted-foreground">{c.d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="overflow-hidden rounded-2xl bg-gradient-hero p-10 text-primary-foreground shadow-elegant">
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div>
              <div className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-widest text-white/70">
                <Clock className="h-3.5 w-3.5" /> ~15 minutes
              </div>
              <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight">Prêt à évaluer votre posture cyber ?</h2>
              <p className="mt-2 max-w-xl text-sm text-white/75">Recevez un plan d'action personnalisé, sans engagement, exportable au format PDF pour votre direction.</p>
            </div>
            <Link to="/profile" className="inline-flex items-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-semibold text-primary shadow-elegant transition hover:bg-white/95">
              Démarrer maintenant <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </AppShell>
  );
}
