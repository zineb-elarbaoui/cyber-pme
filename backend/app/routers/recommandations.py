from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.recommandation import PlanActionOut
from app.services.recommandation_service import generer_recommandations_pour_pme

router = APIRouter(prefix="/recommandations", tags=["recommandations"])


@router.post("/{id_pme}", response_model=PlanActionOut)
def generer_recommandations(
    id_pme: UUID,
    avec_rag: bool = Query(
        default=True,
        description="Génère la justification RAG (appelle Ollama, plus lent). "
        "Mettre à false pour tester le moteur de règles seul, sans dépendance Ollama.",
    ),
    db: Session = Depends(get_db),
):
    try:
        plan = generer_recommandations_pour_pme(db, id_pme, avec_justification_rag=avec_rag)
    except ValueError:
        raise HTTPException(status_code=404, detail="PME introuvable ou sans réponses")

    return {"id_pme": id_pme, "nb_recommandations": len(plan), "recommandations": plan}