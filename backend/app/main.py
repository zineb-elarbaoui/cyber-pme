"""
Sprint 5 — Proposition d'intégration dans main.py.

Je n'ai pas le contenu de ton main.py/database.py/config.py actuels, donc je
ne les écrase pas : ce fichier est un GABARIT à fusionner à la main. Les
points essentiels à récupérer :

1. Le lifespan qui appelle init_rag_context() UNE FOIS au démarrage
   (charge le SentenceTransformer + ouvre la connexion psycopg2 du retriever).
2. Le montage des 4 routers du Sprint 5.

Si ton database.py n'a pas encore de `Base` déclarative SQLAlchemy (utilisée
par app/models/*), il faut l'y ajouter :

    from sqlalchemy.orm import declarative_base
    Base = declarative_base()

Et un get_db() classique :

    def get_db():
        db = SessionLocal()
        try:
            yield db
        finally:
            db.close()

Et dans config.py, s'assurer qu'il existe bien `settings.DATABASE_URL`
(utilisé par rag_service.init_rag_context()).
"""
from contextlib import asynccontextmanager

from fastapi import FastAPI

from app.routers import profil, questionnaire, recommandations, feedback
from app.services.rag_service import init_rag_context
from app.services.engine_service import init_engine


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Chargement unique du moteur de règles (JSON -> RuleEngine en mémoire)
    # et du modèle d'embeddings + connexion DB du retriever. Sans ça, chaque
    # appel à /recommandations rechargerait tout ça à chaque requête.
    init_engine()
    init_rag_context()
    yield
    # (pas de cleanup explicite requis ici ; à ajouter si besoin de fermer
    # proprement la connexion psycopg2 au shutdown)


app = FastAPI(
    title="PFA N°13 — API de diagnostic cyber-résilience PME",
    description="Moteur de règles expertes + RAG, basé sur le guide CMRPI/AUSIM",
    version="0.5.0",  # Sprint 5
    lifespan=lifespan,
)

app.include_router(profil.router)
app.include_router(questionnaire.router)
app.include_router(recommandations.router)
app.include_router(feedback.router)


@app.get("/health", tags=["health"])
def health_check():
    return {"status": "ok"}