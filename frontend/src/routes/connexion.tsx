import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { connexion, getReponses, ApiError } from "@/lib/api";
import { useWizard } from "@/lib/wizard-context";
import { LogIn, Loader2 } from "lucide-react";

export const Route = createFileRoute("/connexion")({
  component: ConnexionPage,
  head: () => ({ meta: [{ title: "Connexion — CyberDiag" }] }),
});

function ConnexionPage() {
  const nav = useNavigate();
  const { setIdPme, setProfil, setReponses } = useWizard();
  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const res = await connexion({ email, mot_de_passe: motDePasse });
      setIdPme(res.id_pme);
      setProfil({ nom_entreprise: res.nom_entreprise });

      // Recharge les réponses déjà enregistrées en base — sans ça, le state
      // local (sessionStorage) reste vide après une reconnexion sur un
      // nouvel onglet/navigateur, et le score/radar affichent 0 malgré des
      // recommandations déjà générées et bien réelles.
      try {
        const reponsesExistantes = await getReponses(res.id_pme);
        const reponsesMap = Object.fromEntries(
          reponsesExistantes.map((r) => [r.id_question, r.valeur_reponse])
        );
        setReponses(reponsesMap);
      } catch {
        // pas bloquant : si ça échoue, l'utilisateur repartira simplement
        // du questionnaire à zéro plutôt que de planter la connexion.
      }

      nav({ to: res.questionnaire_complete ? "/results" : "/assessment" });
    } catch (e) {
      setError(
        e instanceof ApiError && e.status === 401
          ? "Email ou mot de passe incorrect."
          : "Erreur de connexion — le backend est-il démarré ?"
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AppShell crumbs={[{ label: "Accueil", to: "/" }, { label: "Connexion" }]}>
      <section className="mx-auto max-w-md px-6 py-16">
        <div className="text-[11px] font-semibold uppercase tracking-widest text-[oklch(0.55_0.16_255)]">Espace entreprise</div>
        <h1 className="mt-2 font-display text-2xl font-semibold tracking-tight">Retrouver mon diagnostic</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Connectez-vous avec l'email et le mot de passe utilisés lors de votre première évaluation.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4 rounded-xl border border-border bg-gradient-card p-6 shadow-sm">
          <label className="block">
            <div className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Email</div>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/25"
            />
          </label>
          <label className="block">
            <div className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Mot de passe</div>
            <input
              type="password"
              required
              value={motDePasse}
              onChange={(e) => setMotDePasse(e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/25"
            />
          </label>

          {error && (
            <div className="rounded-md border border-destructive/30 bg-destructive/5 px-3.5 py-2.5 text-sm text-destructive">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="inline-flex w-full items-center justify-center gap-1.5 rounded-md bg-primary px-3.5 py-2.5 text-sm font-medium text-primary-foreground shadow-elegant transition hover:opacity-95 disabled:opacity-60"
          >
            {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogIn className="h-4 w-4" />}
            Se connecter
          </button>
        </form>

        <p className="mt-4 text-center text-xs text-muted-foreground">
          Première évaluation ? <Link to="/profile" className="underline">Créer un profil</Link>
        </p>
      </section>
    </AppShell>
  );
}