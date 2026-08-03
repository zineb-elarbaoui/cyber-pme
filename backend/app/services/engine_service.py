"""
Sprint 5 — Charge l'instance RuleEngine (Sprint 3) une seule fois au
démarrage de l'app, à partir de database/seeds/regles_expertes.json et
database/seeds/mesures.json (chemins confirmés dans tes notes de projet).

Même logique que rag_service.py pour le modèle d'embeddings : RuleEngine()
est bon marché à construire (juste de l'indexation de dicts en mémoire, pas
de calcul lourd), mais il n'y a aucune raison de relire/re-parser les deux
fichiers JSON à chaque requête HTTP — un seul chargement au démarrage suffit
tant que les fichiers ne changent pas en cours d'exécution du serveur.

TODO(Zineb) : si tes fichiers JSON ne sont pas dans database/seeds/ à la
racine du repo mais ailleurs (ex: backend/database/seeds/), ajuste
REGLES_JSON_PATH / MESURES_JSON_PATH ci-dessous, idéalement en les sortant
vers app/config.py (settings.REGLES_JSON_PATH) plutôt qu'en dur ici.
"""
import json
from pathlib import Path
from typing import Optional

from app.engine.rule_engine import RuleEngine

PROJECT_ROOT = Path(__file__).resolve().parents[3]

REGLES_JSON_PATH = PROJECT_ROOT / "database" / "seeds" / "regles_expertes.json"
MESURES_JSON_PATH = PROJECT_ROOT / "database" / "seeds" / "mesures.json"

_engine: Optional[RuleEngine] = None


def init_engine(
    regles_path: Path = REGLES_JSON_PATH, mesures_path: Path = MESURES_JSON_PATH
) -> RuleEngine:
    """Appelé une seule fois au démarrage de l'app (voir main.py lifespan)."""
    global _engine
    with open(regles_path, "r", encoding="utf-8") as f:
        regles = json.load(f)
    with open(mesures_path, "r", encoding="utf-8") as f:
        mesures = json.load(f)
    _engine = RuleEngine(regles=regles, mesures=mesures)
    return _engine


def get_engine() -> RuleEngine:
    if _engine is None:
        raise RuntimeError(
            "RuleEngine non initialisé — init_engine() doit être appelé au "
            "démarrage de l'app (lifespan de main.py)."
        )
    return _engine