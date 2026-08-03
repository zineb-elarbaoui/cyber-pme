"""
Configuration centralisée du projet, chargée depuis .env à la racine de
backend/ (ou du répertoire de travail depuis lequel uvicorn est lancé).

Rappel (Sprint 5) : le .env était vide à la fin du Sprint 4 — il doit
contenir au minimum DATABASE_URL avant de lancer l'app.

Les chemins REGLES_JSON_PATH/MESURES_JSON_PATH par défaut sont calculés à
partir de l'emplacement de ce fichier (backend/app/config.py), PAS du
répertoire de travail courant — database/seeds/ est un dossier frère de
backend/ à la racine du repo, donc un chemin relatif du type
"database/seeds/..." ne fonctionne que si uvicorn/pytest est lancé depuis la
racine du repo, jamais depuis backend/. Un oubli de surcharge dans .env
(comme celui qui a cassé charger_corpus_reel.py) tombe maintenant sur un
défaut qui marche quand même, plutôt que sur un FileNotFoundError silencieux.
"""
from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict

# backend/app/config.py -> parent (app/) -> parent (backend/) -> parent (racine du repo)
REPO_ROOT = Path(__file__).resolve().parent.parent.parent


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    # --- Base de données ---
    DATABASE_URL: str = "postgresql://postgres:postgres@localhost:5432/pfa13_db"

    # --- RAG / LLM (Sprint 4) ---
    OLLAMA_URL: str = "http://localhost:11434/api/generate"
    OLLAMA_MODEL: str = "llama3.2:3b"

    # --- Moteur de règles (Sprint 3) — chemins des corpus JSON ---
    # Ancrés sur REPO_ROOT, pas sur le CWD — surchageables via .env si besoin
    # (ex: si database/seeds/ est déplacé ailleurs).
    REGLES_JSON_PATH: str = str(REPO_ROOT / "database" / "seeds" / "regles_expertes.json")
    MESURES_JSON_PATH: str = str(REPO_ROOT / "database" / "seeds" / "mesures.json")


settings = Settings()