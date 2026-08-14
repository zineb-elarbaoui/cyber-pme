import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { ArrowLeft, ArrowRight, Building2, Users, Landmark, ShieldAlert, ScrollText, Loader2 } from "lucide-react";
import { useWizard } from "@/lib/wizard-context";
import { creerProfil, ApiError, type PmeProfilCreate } from "@/lib/api";

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

// ---------------------------------------------------------------------------
// Forme locale du formulaire (libellés affichés à l'utilisateur, en français).
// Convertie en PmeProfilCreate (valeurs d'enum backend) au moment de l'envoi
// via mapFormToProfil() ci-dessous.
// ---------------------------------------------------------------------------
type FormState = {
  nom_entreprise: string;
  email: string;
  mot_de_passe: string;
  secteur: string;
  ville: string;
  annee: string;
  effectif: string;
  ca_annuel: string;
  service_it: string;
  rssi: string;
  digitalisation: string;
  services_exposes: string[];
  donnees_sensibles: string[];
  nb_apps: string;
  incident: string;
  budget: string;
  reglementations: string[];
};

const initialForm: FormState = {
  nom_entreprise: "",
  email: "",
  mot_de_passe: "",
  secteur: "",
  ville: "",
  annee: "",
  effectif: "",
  ca_annuel: "",
  service_it: "",
  rssi: "",
  digitalisation: "",
  services_exposes: [],
  donnees_sensibles: [],
  nb_apps: "",
  incident: "",
  budget: "",
  reglementations: [],
};

const SECTEUR_MAP: Record<string, PmeProfilCreate["secteur_activite"]> = {
  "Services": "services",
  "Industrie & manufacturing": "industrie",
  "Commerce & distribution": "commerce",
  "Technologies & digital": "tech_digital",
  "Santé": "sante",
  "Finance & assurance": "finance_assurance",
  "Autre": "autre",
};

const EFFECTIF_MAP: Record<string, PmeProfilCreate["taille_effectif"]> = {
  "TPE (1–9)": "tpe",
  "Petite (10–49)": "petite",
  "Moyenne (50–249)": "moyenne",
  "Grande (250+)": "moyenne", // le schéma backend ne va pas au-delà de "moyenne"
};

const CA_MAP: Record<string, PmeProfilCreate["chiffre_affaires_annuel"]> = {
  "< 3 MMAD": "moins_3mdh",
  "3–10 MMAD": "3_10mdh",
  "10–50 MMAD": "10_50mdh",
  "50–200 MMAD": "plus_50mdh",
  "> 200 MMAD": "plus_50mdh",
};

const RSSI_MAP: Record<string, PmeProfilCreate["possede_responsable_securite"]> = {
  "Interne": "oui",
  "Externalisé": "externalise",
  "Aucun": "non",
};

const DIGITALISATION_MAP: Record<string, PmeProfilCreate["niveau_digitalisation"]> = {
  "Faible": "faible",
  "Moyen": "moyen",
  "Avancé": "eleve",
  "Cœur d'activité": "eleve",
};

const BUDGET_MAP: Record<string, PmeProfilCreate["budget_cybersecurite"]> = {
  "Non identifié": "aucun",
  "< 20 000 MAD": "faible",
  "20 000–100 000 MAD": "modere",
  "100 000–500 000 MAD": "structure",
  "> 500 000 MAD": "structure",
};

const REGLEMENTATION_MAP: Record<string, string> = {
  "Loi 09-08 (Maroc)": "loi_09_08",
  "RGPD (UE)": "rgpd",
  "PCI-DSS": "pci_dss",
  "HIPAA / santé": "hipaa",
  "BAM (bancaire)": "bam",
};

function mapFormToProfil(f: FormState): PmeProfilCreate {
  return {
    nom_entreprise: f.nom_entreprise.trim(),
    email: f.email.trim(),
    mot_de_passe: f.mot_de_passe,
    secteur_activite: SECTEUR_MAP[f.secteur] ?? "autre",
    taille_effectif: EFFECTIF_MAP[f.effectif] ?? "petite",
    chiffre_affaires_annuel: CA_MAP[f.ca_annuel] ?? "moins_3mdh",
    possede_service_it: f.service_it === "Oui, dédié" || f.service_it === "Oui, partagé",
    possede_responsable_securite: RSSI_MAP[f.rssi] ?? "non",
    niveau_digitalisation: DIGITALISATION_MAP[f.digitalisation] ?? "faible",
    traite_donnees_sensibles: f.donnees_sensibles.length > 0 && !f.donnees_sensibles.includes("Aucune"),
    historique_incident_cyber:
      f.incident === "" ? "ne_sait_pas" : f.incident === "Aucun" ? "non" : "oui",
    budget_cybersecurite: BUDGET_MAP[f.budget] ?? "aucun",
    reglementations_applicables: f.reglementations
      .map((r) => REGLEMENTATION_MAP[r])
      .filter(Boolean),
  };
}

// Validation minimale par étape — bloque "Continuer" tant que les champs
// obligatoires de l'étape ne sont pas remplis.
function isStepValid(step: number, f: FormState): boolean {
  switch (step) {
    case 1:
      return (
        f.nom_entreprise.trim().length > 0 &&
        f.email.trim().length > 3 &&
        f.email.includes("@") &&
        f.mot_de_passe.length >= 6 &&
        f.secteur !== ""
      );
    case 2:
      return f.effectif !== "" && f.ca_annuel !== "" && f.service_it !== "" && f.rssi !== "";
    case 3:
      return f.digitalisation !== "";
    case 4:
      return f.incident !== "" && f.budget !== "";
    case 5:
      return true; // section optionnelle
    default:
      return true;
  }
}

function ProfilePage() {
  const nav = useNavigate();
  const { setProfil, setIdPme } = useWizard();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormState>(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const progress = (step / steps.length) * 100;

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function toggleMulti(key: "services_exposes" | "donnees_sensibles" | "reglementations", value: string) {
    setForm((f) => {
      const current = f[key];
      const next = current.includes(value) ? current.filter((v) => v !== value) : [...current, value];
      return { ...f, [key]: next };
    });
  }

  async function handleSubmit() {
    setError(null);
    setSubmitting(true);
    try {
      const payload = mapFormToProfil(form);
      const created = await creerProfil(payload);
      setProfil(payload);
      setIdPme(created.id_pme);
      nav({ to: "/assessment" });
    } catch (e) {
      setError(
        e instanceof ApiError
          ? `Impossible de créer le profil (${e.message}). Vérifie que le backend tourne bien.`
          : "Erreur réseau — le backend est-il démarré ?"
      );
    } finally {
      setSubmitting(false);
    }
  }

  const canContinue = isStepValid(step, form);

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
              <Field
                label="Nom de l'entreprise"
                placeholder="Ex : Atlas Distribution SARL"
                value={form.nom_entreprise}
                onChange={(v) => updateField("nom_entreprise", v)}
              />
              <Field
                label="Secteur d'activité"
                as="select"
                options={Object.keys(SECTEUR_MAP)}
                value={form.secteur}
                onChange={(v) => updateField("secteur", v)}
              />
              <Field
                label="Email (identifiant de connexion)"
                placeholder="contact@entreprise.ma"
                value={form.email}
                onChange={(v) => updateField("email", v)}
              />
              <div>
                <div className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Mot de passe</div>
                <input
                  type="password"
                  placeholder="6 caractères minimum"
                  value={form.mot_de_passe}
                  onChange={(e) => updateField("mot_de_passe", e.target.value)}
                  className="w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/25"
                />
              </div>
              <Field
                label="Ville / Région"
                placeholder="Casablanca-Settat"
                value={form.ville}
                onChange={(v) => updateField("ville", v)}
              />
              <Field
                label="Année de création"
                placeholder="2015"
                value={form.annee}
                onChange={(v) => updateField("annee", v)}
              />
            </StepGrid>
          )}
          {step === 2 && (
            <StepGrid>
              <Field
                label="Effectif"
                as="select"
                options={Object.keys(EFFECTIF_MAP)}
                value={form.effectif}
                onChange={(v) => updateField("effectif", v)}
              />
              <Field
                label="Chiffre d'affaires annuel"
                as="select"
                options={Object.keys(CA_MAP)}
                value={form.ca_annuel}
                onChange={(v) => updateField("ca_annuel", v)}
              />
              <Field
                label="Service informatique interne"
                as="radio"
                options={["Oui, dédié", "Oui, partagé", "Non", "Externalisé"]}
                value={form.service_it}
                onChange={(v) => updateField("service_it", v)}
              />
              <Field
                label="Responsable sécurité (RSSI)"
                as="radio"
                options={Object.keys(RSSI_MAP)}
                value={form.rssi}
                onChange={(v) => updateField("rssi", v)}
              />
            </StepGrid>
          )}
          {step === 3 && (
            <StepGrid>
              <Field
                label="Niveau de digitalisation"
                as="radio"
                options={Object.keys(DIGITALISATION_MAP)}
                value={form.digitalisation}
                onChange={(v) => updateField("digitalisation", v)}
              />
              <Field
                label="Services exposés à Internet"
                as="checkbox"
                options={["Site web", "E-commerce", "Messagerie", "VPN / accès distant", "Applications métier SaaS"]}
                values={form.services_exposes}
                onToggle={(v) => toggleMulti("services_exposes", v)}
              />
              <Field
                label="Traitement de données sensibles"
                as="checkbox"
                options={["Données personnelles clients", "Données santé", "Données bancaires", "Propriété intellectuelle", "Aucune"]}
                values={form.donnees_sensibles}
                onToggle={(v) => toggleMulti("donnees_sensibles", v)}
              />
              <Field
                label="Nombre d'applications métier"
                placeholder="Ex : 8"
                value={form.nb_apps}
                onChange={(v) => updateField("nb_apps", v)}
              />
            </StepGrid>
          )}
          {step === 4 && (
            <StepGrid>
              <Field
                label="Incident cyber au cours des 24 derniers mois"
                as="radio"
                options={["Aucun", "Tentative détectée", "Incident mineur", "Incident majeur"]}
                value={form.incident}
                onChange={(v) => updateField("incident", v)}
              />
              <Field
                label="Budget cybersécurité annuel"
                as="select"
                options={Object.keys(BUDGET_MAP)}
                value={form.budget}
                onChange={(v) => updateField("budget", v)}
              />
            </StepGrid>
          )}
          {step === 5 && (
            <StepGrid>
              <Field
                label="Réglementations applicables"
                as="checkbox"
                options={[...Object.keys(REGLEMENTATION_MAP), "Aucune identifiée"]}
                values={form.reglementations}
                onToggle={(v) => toggleMulti("reglementations", v)}
              />
            </StepGrid>
          )}

          {error && (
            <div className="mt-6 rounded-md border border-destructive/30 bg-destructive/5 px-3.5 py-2.5 text-sm text-destructive">
              {error}
            </div>
          )}

          <div className="mt-8 flex items-center justify-between border-t border-border pt-6">
            <button
              onClick={() => setStep((s) => Math.max(1, s - 1))}
              disabled={step === 1 || submitting}
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
                disabled={!canContinue}
                className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3.5 py-2 text-sm font-medium text-primary-foreground shadow-elegant transition hover:opacity-95 disabled:opacity-40"
              >
                Continuer <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3.5 py-2 text-sm font-medium text-primary-foreground shadow-elegant transition hover:opacity-95 disabled:opacity-60"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Création du profil…
                  </>
                ) : (
                  <>
                    Lancer le questionnaire <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        <p className="mt-4 text-center text-xs text-muted-foreground">
          Déjà évalué ? <Link to="/connexion" className="underline">Se connecter</Link> pour retrouver votre diagnostic.
        </p>
      </section>
    </AppShell>
  );
}

function StepGrid({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-5 md:grid-cols-2">{children}</div>;
}

// Field supporte deux modes :
// - single value (text / select / radio) : value + onChange
// - multi value (checkbox)               : values + onToggle
function Field({
  label,
  placeholder,
  as = "text",
  options = [],
  value,
  onChange,
  values,
  onToggle,
}: {
  label: string;
  placeholder?: string;
  as?: "text" | "select" | "radio" | "checkbox";
  options?: string[];
  value?: string;
  onChange?: (v: string) => void;
  values?: string[];
  onToggle?: (v: string) => void;
}) {
  return (
    <label className="block">
      <div className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</div>
      {as === "text" && (
        <input
          type="text"
          placeholder={placeholder}
          value={value ?? ""}
          onChange={(e) => onChange?.(e.target.value)}
          className="w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/25"
        />
      )}
      {as === "select" && (
        <select
          value={value ?? ""}
          onChange={(e) => onChange?.(e.target.value)}
          className="w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/25"
        >
          <option value="">— Sélectionnez —</option>
          {options.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
      )}
      {as === "radio" && (
        <div className="grid gap-1.5">
          {options.map((o) => (
            <label key={o} className="flex cursor-pointer items-center gap-2 rounded-md border border-border bg-background px-3 py-2 text-sm transition hover:border-ring/60 has-[:checked]:border-primary has-[:checked]:bg-primary/5">
              <input
                type="radio"
                name={label}
                checked={value === o}
                onChange={() => onChange?.(o)}
                className="accent-[var(--primary-accent)]"
              />
              {o}
            </label>
          ))}
        </div>
      )}
      {as === "checkbox" && (
        <div className="grid gap-1.5">
          {options.map((o) => (
            <label key={o} className="flex cursor-pointer items-center gap-2 rounded-md border border-border bg-background px-3 py-2 text-sm transition hover:border-ring/60 has-[:checked]:border-primary has-[:checked]:bg-primary/5">
              <input
                type="checkbox"
                checked={values?.includes(o) ?? false}
                onChange={() => onToggle?.(o)}
                className="accent-[var(--primary-accent)]"
              />
              {o}
            </label>
          ))}
        </div>
      )}
    </label>
  );
}