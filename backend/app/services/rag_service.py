
from dataclasses import dataclass
from typing import Optional

from app.rag import retriever, justification_generator
from app.config import settings


@dataclass
class RagContext:
    model: object  
    conn: object    


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