from typing import List
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.pme_profil import PmeProfil
from app.models.reponse import Reponse
from app.schemas.pme import PmeProfilCreate, PmeProfilOut, ReponseBulkCreate, ReponseOut

router = APIRouter(prefix="/profil", tags=["profil"])


@router.post("", response_model=PmeProfilOut, status_code=201)
def creer_profil(payload: PmeProfilCreate, db: Session = Depends(get_db)):
    profil = PmeProfil(**payload.model_dump())
    db.add(profil)
    db.commit()
    db.refresh(profil)
    return profil


@router.get("/{id_pme}", response_model=PmeProfilOut)
def lire_profil(id_pme: UUID, db: Session = Depends(get_db)):
    profil = db.query(PmeProfil).filter(PmeProfil.id_pme == id_pme).first()
    if profil is None:
        raise HTTPException(status_code=404, detail="PME introuvable")
    return profil


@router.post("/{id_pme}/reponses", response_model=List[ReponseOut], status_code=201)
def soumettre_reponses(id_pme: UUID, payload: ReponseBulkCreate, db: Session = Depends(get_db)):
    profil = db.query(PmeProfil).filter(PmeProfil.id_pme == id_pme).first()
    if profil is None:
        raise HTTPException(status_code=404, detail="PME introuvable")

    reponses_creees = []
    for r in payload.reponses:
        # upsert simple : une PME répond une fois par question (UNIQUE id_pme+id_question)
        existante = (
            db.query(Reponse)
            .filter(Reponse.id_pme == id_pme, Reponse.id_question == r.id_question)
            .first()
        )
        if existante:
            existante.valeur_reponse = r.valeur_reponse
            reponses_creees.append(existante)
        else:
            nouvelle = Reponse(id_pme=id_pme, id_question=r.id_question, valeur_reponse=r.valeur_reponse)
            db.add(nouvelle)
            reponses_creees.append(nouvelle)

    db.commit()
    for r in reponses_creees:
        db.refresh(r)
    return reponses_creees


@router.get("/{id_pme}/reponses", response_model=List[ReponseOut])
def lire_reponses(id_pme: UUID, db: Session = Depends(get_db)):
    return db.query(Reponse).filter(Reponse.id_pme == id_pme).all()