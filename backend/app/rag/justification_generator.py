import json
import sys
import time

import urllib.request
import urllib.error

OLLAMA_URL = "http://127.0.0.1:11434/api/generate"  
MODEL_NAME = "llama3.2:3b"

PROMPT_TEMPLATE = """Tu es un assistant qui rédige des justifications courtes et factuelles \
pour un outil de diagnostic de cybersécurité destiné aux PME marocaines.

Contexte de la recommandation :
- Mesure recommandée : {titre_mesure}
- Description : {description_mesure}
- Domaine de sécurité concerné : {nom_domaine}

Extraits du guide de référence CMRPI/AUSIM (seule source autorisée) :
{passages}

Consigne :
Rédige une justification de 2 à 3 phrases maximum expliquant pourquoi cette \
mesure est recommandée, en te basant UNIQUEMENT sur les extraits fournis \
ci-dessus. Cite la section du guide entre parenthèses (ex: "(section 3.1.2)"). \
N'invente aucune information qui ne figure pas dans les extraits. Si les \
extraits ne permettent pas de justifier précisément la mesure, dis-le \
explicitement plutôt que d'improviser. Réponds uniquement en français, sans \
préambule ni formule de politesse.
"""


def format_passages(chunks):
    lines = []
    for c in chunks:
        lines.append(f"- (section {c['section_guide']}) {c['texte']}")
    return "\n".join(lines)


def call_ollama(prompt: str, model: str = MODEL_NAME) -> str:
    print(f"[RAG DEBUG] Appel Ollama sur {OLLAMA_URL} (modèle={model})...", flush=True)
    debut = time.time()
    payload = json.dumps(
        {
            "model": model,
            "prompt": prompt,
            "stream": False,
            "options": {
                "temperature": 0.2,
                "num_predict": 200,  # borne la longueur générée (2-3 phrases demandées) -> accélère nettement
            },
        }
    ).encode("utf-8")

    req = urllib.request.Request(
        OLLAMA_URL, data=payload, headers={"Content-Type": "application/json"}
    )
    try:
        with urllib.request.urlopen(req, timeout=180) as resp:
            duree = time.time() - debut
            print(f"[RAG DEBUG] Réponse Ollama reçue en {duree:.1f}s, lecture...", flush=True)
            data = json.loads(resp.read().decode("utf-8"))
            print("[RAG DEBUG] Justification générée avec succès.", flush=True)
            return data.get("response", "").strip()
    except urllib.error.URLError as e:
        print(f"[RAG DEBUG] Échec de connexion à Ollama : {e}", flush=True)
        sys.exit(
            f"Impossible de joindre Ollama sur {OLLAMA_URL} ({e}). "
            "Vérifie qu'Ollama tourne (`ollama serve`) et que le modèle est "
            f"téléchargé (`ollama pull {model}`)."
        )


def generer_justification(titre_mesure, description_mesure, nom_domaine, chunks):
    print(f"[RAG DEBUG] generer_justification appelé pour : {titre_mesure!r} ({len(chunks)} chunk(s))", flush=True)

    if not chunks:
        print("[RAG DEBUG] Aucun chunk fourni -> justification générique renvoyée sans appel LLM.", flush=True)
        return (
            "Aucun passage du guide n'a pu être associé à cette mesure — "
            "justification non générée (voir limite documentée : couverture "
            "partielle de certains domaines dans le guide CMRPI/AUSIM)."
        )

    prompt = PROMPT_TEMPLATE.format(
        titre_mesure=titre_mesure,
        description_mesure=description_mesure,
        nom_domaine=nom_domaine,
        passages=format_passages(chunks),
    )
    return call_ollama(prompt)


def _test_manuel():
    chunks_test = [
        {
            "section_guide": "3.5.1",
            "texte": "Mettre en place une procédure de sauvegarde régulière et testée des données critiques.",
        }
    ]
    justification = generer_justification(
        titre_mesure="Sauvegardes régulières",
        description_mesure="Mettre en place des sauvegardes régulières (quotidiennes ou hebdomadaires) sur un support externe dédié.",
        nom_domaine="Plan de continuité d'activité",
        chunks=chunks_test,
    )
    print("Justification générée :\n")
    print(justification)


if __name__ == "__main__":
    _test_manuel()