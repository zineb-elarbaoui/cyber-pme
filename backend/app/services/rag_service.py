"""
Sprint 5 — Colle entre l'API et le pipeline RAG du Sprint 4
(app/rag/retriever.py + app/rag/justification_generator.py).

Point important : retriever.py utilise psycopg2 brut (pas la session
SQLAlchemy de l'API) et charge un SentenceTransformer. Les deux sont chers à
recréer par requête : le modèle et la connexion sont donc chargés UNE FOIS au
démarrage de l'app (voir main.py, lifespan) et réutilisés ici via un état
partagé (RagContext), plutôt que d'appeler retriever.load_model() /
get_connection() à chaque appel API.


"""
from dataclasses import dataclass
from typing import Optional

from app.rag import retriever, justification_generator
from app.config import settings


@dataclass
class RagContext:
    model: object  # SentenceTransformer, chargé une fois
    conn: object    # connexion psycopg2, réutilisée (thread-safe : psycopg2 gère son propre lock interne par connexion ; en cas de charge concurrente élevée, passer à un pool - cf. note Sprint 6)


_rag_context: Optional[RagContext] = None


def init_rag_context() -> RagContext:
    """Appelé une seule fois au démarrage de l'app (voir main.py lifespan)."""
    global _rag_context
    model = retriever.load_model()
    conn = retriever.get_connection(settings.DATABASE_URL)
    _rag_context = RagContext(model=model, conn=conn)
    return _rag_context


def get_rag_context() -> RagContext:
    if _rag_context is None:
        raise RuntimeError(
            "RagContext non initialisé — init_rag_context() doit être appelé "
            "au démarrage de l'app (lifespan de main.py)."
        )
    return _rag_context


def generer_justification_pour_mesure(
    titre_mesure: str,
    description_mesure: str,
    nom_domaine: str,
    section_guide_precise: str,
) -> str:
    """
    Point d'entrée unique utilisé par recommandation_service.py : récupère le
    contexte pertinent du guide (retriever) puis génère la justification
    (justification_generator), sans recharger le modèle ni rouvrir de
    connexion à chaque appel.
    """
    ctx = get_rag_context()
    chunks = retriever.retrieve_context(
        ctx.conn, ctx.model, section_guide_precise, description_mesure
    )
    return justification_generator.generer_justification(
        titre_mesure=titre_mesure,
        description_mesure=description_mesure,
        nom_domaine=nom_domaine,
        chunks=chunks,
    )