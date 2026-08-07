import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { ArrowLeft, ArrowRight, Building2, Users, Landmark, ShieldAlert, ScrollText } from "lucide-react";

export const Route = createFileRoute("/profile")({
  component: ProfilePage,
  head: () => ({ meta: [{ title: "Profil PME — CyberDiag" }, { name: "description", content: "Renseignez le profil de votre PME pour un diagnostic adapté." }] }),
});

const steps = [
  { id: 1, name: "Identité", icon: Building2 },
  { id: 2, name: "Organisation", icon: Users },
  { id: 3, name: "Contexte SI", icon: Landmark },
  { id: 4, name: "Risques & budget", icon: ShieldAlert },
  { id: 5, name: "Conformité", icon: ScrollText },
];

function ProfilePage() {
  const nav = useNavigate();
  const [step, setStep] = useState(1);
  const progress = (step / steps.length) * 100;

  return (
    <AppShell crumbs={[{ label: "Accueil", to: "/" }, { label: "Profil PME" }]}>
      <section className="mx-auto max-w-5xl px-6 py-12">
        <header className="mb-8">
          <div className="text-[11px] font-semibold uppercase tracking-widest text-[oklch(0.55_0.16_255)]">Étape 1/2 · Profil</div>
          <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight">Parlez-nous de votre entreprise</h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Ces informations personnalisent le diagnostic et les recommandations. Aucune donnée n'est partagée sans votre accord.
          </p>
        </header>

        {/* Stepper */}
        <div className="rounded-xl border border-border bg-gradient-card p-5 shadow-sm">
          <div className="mb-2 flex items-center justify-between text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
            <span>Progression</span>
            <span className="tabular-nums text-foreground">{step}/{steps.length}</span>
          </div>
          <div className="mb-6 h-1.5 w-full overflow-hidden rounded-full bg-secondary">
            <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${progress}%` }} />
          </div>
          <ol className="grid grid-cols-5 gap-2">
            {steps.map((s) => {
              const Icon = s.icon;
              const active = s.id === step;
              const done = s.id < step;
              return (
                <li key={s.id} className="flex flex-col items-center gap-1.5 text-center">
                  <div className={
                    "flex h-9 w-9 items-center justify-center rounded-full border text-xs font-semibold transition " +
                    (active ? "border-primary bg-primary text-primary-foreground shadow-elegant" :
                     done ? "border-[oklch(0.62_0.16_155)] bg-[oklch(0.62_0.16_155)] text-white" :
                     "border-border bg-background text-muted-foreground")
                  }>
                    <Icon className="h-4 w-4" />
                  </div>
                  <span className={"text-[11px] " + (active ? "font-semibold text-foreground" : "text-muted-foreground")}>{s.name}</span>
                </li>
              );
            })}
          </ol>
        </div>

        {/* Step body */}
        <div className="mt-6 rounded-xl border border-border bg-card p-6 shadow-sm">
          {step === 1 && (
            <StepGrid>
              <Field label="Nom de l'entreprise" placeholder="Ex : Atlas Distribution SARL" />
              <Field label="Secteur d'activité" as="select" options={["Services", "Industrie & manufacturing", "Commerce & distribution", "Technologies & digital", "Santé", "Finance & assurance", "Autre"]} />
              <Field label="Ville / Région" placeholder="Casablanca-Settat" />
              <Field label="Année de création" placeholder="2015" />
            </StepGrid>
          )}
          {step === 2 && (
            <StepGrid>
              <Field label="Effectif" as="select" options={["TPE (1–9)", "Petite (10–49)", "Moyenne (50–249)", "Grande (250+)"]} />
              <Field label="Chiffre d'affaires annuel" as="select" options={["< 3 MMAD", "3–10 MMAD", "10–50 MMAD", "50–200 MMAD", "> 200 MMAD"]} />
              <Field label="Service informatique interne" as="radio" options={["Oui, dédié", "Oui, partagé", "Non", "Externalisé"]} />
              <Field label="Responsable sécurité (RSSI)" as="radio" options={["Interne", "Externalisé", "Aucun"]} />
            </StepGrid>
          )}
          {step === 3 && (
            <StepGrid>
              <Field label="Niveau de digitalisation" as="radio" options={["Faible", "Moyen", "Avancé", "Cœur d'activité"]} />
              <Field label="Services exposés à Internet" as="checkbox" options={["Site web", "E-commerce", "Messagerie", "VPN / accès distant", "Applications métier SaaS"]} />
              <Field label="Traitement de données sensibles" as="checkbox" options={["Données personnelles clients", "Données santé", "Données bancaires", "Propriété intellectuelle"]} />
              <Field label="Nombre d'applications métier" placeholder="Ex : 8" />
            </StepGrid>
          )}
          {step === 4 && (
            <StepGrid>
              <Field label="Incident cyber au cours des 24 derniers mois" as="radio" options={["Aucun", "Tentative détectée", "Incident mineur", "Incident majeur"]} />
              <Field label="Impact d'une interruption 24h" as="radio" options={["Négligeable", "Modéré", "Élevé", "Critique"]} />
              <Field label="Budget cybersécurité annuel" as="select" options={["Non identifié", "< 20 000 MAD", "20 000–100 000 MAD", "100 000–500 000 MAD", "> 500 000 MAD"]} />
              <Field label="Sauvegardes testées récemment" as="radio" options={["Oui, mensuellement", "Oui, ponctuellement", "Non", "Ne sait pas"]} />
            </StepGrid>
          )}
          {step === 5 && (
            <StepGrid>
              <Field label="Réglementations applicables" as="checkbox" options={["Loi 09-08 (Maroc)", "RGPD (UE)", "PCI-DSS", "HIPAA / santé", "BAM (bancaire)", "Aucune identifiée"]} />
              <Field label="Déclaration CNDP réalisée" as="radio" options={["Oui", "Partiellement", "Non", "Ne sait pas"]} />
              <Field label="Contrats sous-traitants formalisés" as="radio" options={["Oui, systématiquement", "Partiellement", "Non"]} />
              <Field label="Certifications visées" as="checkbox" options={["ISO 27001", "SOC 2", "Aucune", "Autre"]} />
            </StepGrid>
          )}

          <div className="mt-8 flex items-center justify-between border-t border-border pt-6">
            <button
              onClick={() => setStep((s) => Math.max(1, s - 1))}
              disabled={step === 1}
              className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-3.5 py-2 text-sm font-medium transition hover:bg-secondary disabled:opacity-40"
            >
              <ArrowLeft className="h-4 w-4" /> Précédent
            </button>
            <div className="text-xs text-muted-foreground">
              {step === steps.length ? "Prochaine étape : questionnaire de maturité" : `Étape suivante : ${steps[step].name}`}
            </div>
            {step < steps.length ? (
              <button
                onClick={() => setStep((s) => s + 1)}
                className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3.5 py-2 text-sm font-medium text-primary-foreground shadow-elegant transition hover:opacity-95"
              >
                Continuer <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                onClick={() => nav({ to: "/assessment" })}
                className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3.5 py-2 text-sm font-medium text-primary-foreground shadow-elegant transition hover:opacity-95"
              >
                Lancer le questionnaire <ArrowRight className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        <p className="mt-4 text-center text-xs text-muted-foreground">
          Vous pouvez modifier ces réponses plus tard depuis <Link to="/history" className="underline">votre historique</Link>.
        </p>
      </section>
    </AppShell>
  );
}

function StepGrid({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-5 md:grid-cols-2">{children}</div>;
}

function Field({
  label,
  placeholder,
  as = "text",
  options = [],
}: {
  label: string;
  placeholder?: string;
  as?: "text" | "select" | "radio" | "checkbox";
  options?: string[];
}) {
  return (
    <label className="block">
      <div className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</div>
      {as === "text" && (
        <input
          type="text"
          placeholder={placeholder}
          className="w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/25"
        />
      )}
      {as === "select" && (
        <select className="w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/25">
          <option value="">— Sélectionnez —</option>
          {options.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
      )}
      {as === "radio" && (
        <div className="grid gap-1.5">
          {options.map((o) => (
            <label key={o} className="flex cursor-pointer items-center gap-2 rounded-md border border-border bg-background px-3 py-2 text-sm transition hover:border-ring/60 has-[:checked]:border-primary has-[:checked]:bg-primary/5">
              <input type="radio" name={label} className="accent-[var(--primary-accent)]" />
              {o}
            </label>
          ))}
        </div>
      )}
      {as === "checkbox" && (
        <div className="grid gap-1.5">
          {options.map((o) => (
            <label key={o} className="flex cursor-pointer items-center gap-2 rounded-md border border-border bg-background px-3 py-2 text-sm transition hover:border-ring/60 has-[:checked]:border-primary has-[:checked]:bg-primary/5">
              <input type="checkbox" className="accent-[var(--primary-accent)]" />
              {o}
            </label>
          ))}
        </div>
      )}
    </label>
  );
}