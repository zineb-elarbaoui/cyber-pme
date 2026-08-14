
from contextlib import asynccontextmanager

from fastapi import FastAPI

from app.routers import profil, questionnaire, recommandations, feedback
from app.services.rag_service import init_rag_context
from app.services.engine_service import init_engine
from app.routers import auth
from fastapi.middleware.cors import CORSMiddleware



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

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8080"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(profil.router)
app.include_router(questionnaire.router)
app.include_router(recommandations.router)
app.include_router(feedback.router)

app.include_router(auth.router)


@app.get("/health", tags=["health"])
def health_check():
    return {"status": "ok"}