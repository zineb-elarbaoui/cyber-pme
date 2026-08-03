"""
Sprint 5 — Setup SQLAlchemy : engine, session factory, Base déclarative
(importée par tous les fichiers app/models/*.py), et la dépendance get_db()
utilisée dans les routers (Depends(get_db)).
"""
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

from app.config import settings

engine = create_engine(settings.DATABASE_URL, pool_pre_ping=True)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db():
    """Dépendance FastAPI : une session par requête, fermée automatiquement
    même en cas d'exception (le `finally` s'exécute toujours)."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()