from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.domaine import Domaine
from app.models.question import Question
from app.schemas.questionnaire import QuestionnaireOut

router = APIRouter(prefix="/questionnaire", tags=["questionnaire"])


@router.get("", response_model=QuestionnaireOut)
def lire_questionnaire(db: Session = Depends(get_db)):
    """Catalogue complet (15 domaines + 24 questions) pour construire le
    formulaire côté frontend (Sprint 6) en un seul appel."""
    domaines = db.query(Domaine).order_by(Domaine.numero).all()
    questions = db.query(Question).order_by(Question.numero).all()
    return {"domaines": domaines, "questions": questions}