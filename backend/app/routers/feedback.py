from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.feedback import Feedback
from app.models.recommandation import RecommandationGeneree
from app.schemas.feedback import FeedbackCreate, FeedbackOut

router = APIRouter(prefix="/feedback", tags=["feedback"])


@router.post("", response_model=FeedbackOut, status_code=201)
def creer_feedback(payload: FeedbackCreate, db: Session = Depends(get_db)):
    recommandation = (
        db.query(RecommandationGeneree)
        .filter(RecommandationGeneree.id_recommandation == payload.id_recommandation)
        .first()
    )
    if recommandation is None:
        raise HTTPException(status_code=404, detail="Recommandation introuvable")

    existant = (
        db.query(Feedback)
        .filter(Feedback.id_recommandation == payload.id_recommandation)
        .first()
    )

    if existant is not None:
        
        for champ, valeur in payload.model_dump().items():
            if champ == "id_recommandation":
                continue
            setattr(existant, champ, valeur)
        db.commit()
        db.refresh(existant)
        return existant

    feedback = Feedback(**payload.model_dump())
    db.add(feedback)
    db.commit()
    db.refresh(feedback)
    return feedback