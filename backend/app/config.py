
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

    # --- Moteur de règles  — chemins des corpus JSON ---
    # Ancrés sur REPO_ROOT, pas sur le CWD — surchageables via .env si besoin
    # (ex: si database/seeds/ est déplacé ailleurs).
    REGLES_JSON_PATH: str = str(REPO_ROOT / "database" / "seeds" / "regles_expertes.json")
    MESURES_JSON_PATH: str = str(REPO_ROOT / "database" / "seeds" / "mesures.json")


settings = Settings()