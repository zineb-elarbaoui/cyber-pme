
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