const API_URL = (import.meta as any).env.VITE_API_URL || "http://localhost:8000";

export async function creerProfil(data: any) {
  const res = await fetch(`${API_URL}/profil`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Erreur création profil");
  return res.json();
}

export async function getQuestionnaire() {
  const res = await fetch(`${API_URL}/questionnaire`);
  if (!res.ok) throw new Error("Erreur chargement questionnaire");
  return res.json();
}

export async function getRecommandations(idPme: string, avecRag = true) {
  const res = await fetch(`${API_URL}/recommandations/${idPme}?avec_rag=${avecRag}`, {
    method: "POST",
  });
  if (!res.ok) throw new Error("Erreur génération recommandations");
  return res.json();
}

export async function envoyerFeedback(data: any) {
  const res = await fetch(`${API_URL}/feedback`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Erreur envoi feedback");
  return res.json();
}