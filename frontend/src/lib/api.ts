// src/lib/api.ts
// Client API centralisant tous les appels vers le backend FastAPI .
// Toutes les fonctions lèvent une erreur explicite en cas d'échec réseau ou HTTP.

const API_URL = (((import.meta as any).env?.VITE_API_URL) as string) || "http://localhost:8000";

class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
    this.name = "ApiError";
  }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options,
  });

  if (!res.ok) {
    let detail = res.statusText;
    try {
      const body = await res.json();
      detail = body.detail || detail;
    } catch {
      // pas de corps JSON, on garde le statusText
    }
    throw new ApiError(`${res.status} — ${detail}`, res.status);
  }

  // certains endpoints (ex: DELETE) peuvent ne rien renvoyer
  const text = await res.text();
  return text ? JSON.parse(text) : (undefined as T);
}

// Types alignés sur le schéma backend (schema_pfa13.sql / schemas Pydantic)

export type PmeProfilCreate = {
  nom_entreprise: string;
  email: string;
  secteur_activite: "services" | "industrie" | "commerce" | "tech_digital" | "sante" | "finance_assurance" | "autre";
  taille_effectif: "tpe" | "petite" | "moyenne";
  chiffre_affaires_annuel: "moins_3mdh" | "3_10mdh" | "10_50mdh" | "plus_50mdh";
  possede_service_it: boolean;
  possede_responsable_securite: "oui" | "non" | "externalise";
  niveau_digitalisation: "faible" | "moyen" | "eleve";
  traite_donnees_sensibles: boolean;
  historique_incident_cyber: "oui" | "non" | "ne_sait_pas";
  budget_cybersecurite: "aucun" | "faible" | "modere" | "structure";
  reglementations_applicables?: string[];
  mot_de_passe: string;
};

export type PmeProfilOut = PmeProfilCreate & {
  id_pme: string;
  date_evaluation: string;
};

export type ReponseCreate = {
  id_question: number;
  valeur_reponse: string;
};

export type QuestionOut = {
  id_question: number;
  numero: number;
  type_question: "contextuelle" | "domaine";
  id_domaine: number | null;
  intitule: string;
  type_reponse: string;
  valeur_max: number;
  options: { valeur: number; libelle: string }[] | null;
};

export type DomaineOut = {
  id_domaine: number;
  numero: number;
  nom_domaine: string;
  section_guide: string;
  remarque?: string | null;
};

export type QuestionnaireOut = {
  domaines: DomaineOut[];
  questions: QuestionOut[];
};

export type RecommandationOut = {
  id_recommandation: string;
  id_regle: number;
  id_domaine: number;
  nom_domaine: string;
  titre_mesure: string;
  description_mesure: string;
  cout_estime: string;
  difficulte_estimee: string;
  impact: string;
  section_guide_precise: string;
  score_priorite: number;
  justification_rag: string | null;
};

export type PlanActionOut = {
  id_pme: string;
  nb_recommandations: number;
  recommandations: RecommandationOut[];
};

export type FeedbackCreate = {
  id_recommandation: string;
  note_pertinence: number;
  commentaire?: string;
  recommandation_appliquee?: boolean;
};

// Appels API

export type ConnexionRequest = {
  email: string;
  mot_de_passe: string;
};

export type ConnexionResponse = {
  id_pme: string;
  nom_entreprise: string;
  questionnaire_complete: boolean;
};

export type ReponseOut = {
  id_reponse: string;
  id_question: number;
  valeur_reponse: string;
};

export function getReponses(idPme: string) {
  return request<ReponseOut[]>(`/profil/${idPme}/reponses`);
}

export function connexion(data: ConnexionRequest) {
  return request<ConnexionResponse>("/auth/connexion", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function creerProfil(data: PmeProfilCreate) {
  return request<PmeProfilOut>("/profil", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function getProfil(idPme: string) {
  return request<PmeProfilOut>(`/profil/${idPme}`);
}

export function envoyerReponses(idPme: string, reponses: ReponseCreate[]) {
  return request<{ id_pme: string; nb_reponses: number }>(`/profil/${idPme}/reponses`, {
    method: "POST",
    body: JSON.stringify({ reponses }),
  });
}

export function getQuestionnaire() {
  return request<QuestionnaireOut>("/questionnaire");
}

export function getRecommandations(idPme: string, avecRag = true) {
  return request<PlanActionOut>(`/recommandations/${idPme}?avec_rag=${avecRag}`, {
    method: "POST",
  });
}

// Relit les recommandations déjà générées (rapide, pas de recalcul) — à
// essayer en premier. Lève une ApiError(status=404) si rien n'existe encore
// pour cette PME, auquel cas il faut appeler getRecommandations() ci-dessus.
export function getRecommandationsExistantes(idPme: string) {
  return request<PlanActionOut>(`/recommandations/${idPme}`, { method: "GET" });
}

export function envoyerFeedback(data: FeedbackCreate) {
  return request<{ id_feedback: string }>("/feedback", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// Le PDF n'est pas du JSON — appel fetch direct plutôt que via request().
export async function telechargerRapportPdf(idPme: string, nomEntreprise?: string, avecRag = false) {
  const res = await fetch(`${API_URL}/recommandations/${idPme}/pdf?avec_rag=${avecRag}`);
  if (!res.ok) {
    throw new ApiError(`Impossible de générer le PDF (${res.status})`, res.status);
  }
  const blob = await res.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `rapport-cybersecurite-${(nomEntreprise ?? "pme").replace(/\s+/g, "_")}.pdf`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
}

export { ApiError };