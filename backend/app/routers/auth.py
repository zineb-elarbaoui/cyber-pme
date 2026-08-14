

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.database import get_db
from app.models.pme_profil import PmeProfil
from app.models.reponse import Reponse
from app.schemas.auth import ConnexionRequest, ConnexionResponse
from app.services.auth_service import verify_password

router = APIRouter(prefix="/auth", tags=["auth"])

NB_QUESTIONS_TOTAL = 24  


@router.post("/connexion", response_model=ConnexionResponse)
def connexion(payload: ConnexionRequest, db: Session = Depends(get_db)):
    profil = db.query(PmeProfil).filter(PmeProfil.email == payload.email).first()

    if not profil or not verify_password(payload.mot_de_passe, profil.mot_de_passe_hash):
        
        raise HTTPException(status_code=401, detail="Email ou mot de passe incorrect.")

    nb_reponses = db.query(func.count(Reponse.id_reponse)).filter(Reponse.id_pme == profil.id_pme).scalar()

    return ConnexionResponse(
        id_pme=profil.id_pme,
        nom_entreprise=profil.nom_entreprise,
        questionnaire_complete=(nb_reponses or 0) >= NB_QUESTIONS_TOTAL,
    )