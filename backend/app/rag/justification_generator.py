"""
PFA N°13 — Sprint 4 — justification_generator.py

Étant donné une recommandation (mesure + règle déclenchée) et les passages du
guide récupérés par retriever.py, génère une justification en français en
s'appuyant STRICTEMENT sur les passages fournis (pas d'invention).

LLM utilisé : Ollama en local (gratuit, pas de clé API, pas de dépendance
réseau externe une fois le modèle téléchargé).

Prérequis :
    1. Installer Ollama : https://ollama.com/download
    2. Télécharger un modèle qui gère bien le français, ex :
         ollama pull llama3.1:8b
       (si ta machine a peu de RAM, essaie plutôt : ollama pull mistral:7b-instruct)
    3. Lancer le serveur Ollama (généralement automatique après installation,
       sinon : `ollama serve`) — il écoute par défaut sur http://localhost:11434

Usage autonome (test) :
    python justification_generator.py
"""

import json
import sys

import urllib.request
import urllib.error

OLLAMA_URL = "http://localhost:11434/api/generate"
MODEL_NAME = "llama3.2:3b"  # modèle léger (~2 Go) ; remplace par "qwen2.5:1.5b" si besoin de plus léger encore, ou "mistral:7b-instruct" si plus de RAM disponible

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
    payload = json.dumps(
        {"model": model, "prompt": prompt, "stream": False, "options": {"temperature": 0.2}}
    ).encode("utf-8")

    req = urllib.request.Request(
        OLLAMA_URL, data=payload, headers={"Content-Type": "application/json"}
    )
    try:
        with urllib.request.urlopen(req, timeout=120) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            return data.get("response", "").strip()
    except urllib.error.URLError as e:
        sys.exit(
            f"Impossible de joindre Ollama sur {OLLAMA_URL} ({e}). "
            "Vérifie qu'Ollama tourne (`ollama serve`) et que le modèle est "
            f"téléchargé (`ollama pull {model}`)."
        )


def generer_justification(titre_mesure, description_mesure, nom_domaine, chunks):
    """
    Point d'entrée à appeler depuis recommender.py (Sprint 3) pour enrichir
    chaque recommandation générée avec le champ justification_rag de la table
    recommandation_generee.
    """
    if not chunks:
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
    """Petit test avec des données factices, sans dépendre de la DB, pour
    vérifier que la connexion à Ollama fonctionne avant de brancher le reste."""
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