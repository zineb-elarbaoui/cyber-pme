from uuid import UUID
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from fastapi.responses import Response
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.database import get_db
from app.schemas.recommandation import PlanActionOut
from app.services.recommandation_service import (
    generer_recommandations_pour_pme,
)
from app.services.pdf_service import generer_pdf_rapport

from app.models.pme_profil import PmeProfil
from app.models.reponse import Reponse
from app.models.question import Question
from app.models.domaine import Domaine
from app.models.recommandation import RecommandationGeneree
from app.models.regle_experte import RegleExperte
from app.models.mesure import Mesure
from app.models.feedback import Feedback

router = APIRouter(
    prefix="/recommandations",
    tags=["recommandations"],
)


# --------------------------------------------------------------------------
# Fonction interne partagée — lit le DERNIER lot déjà persisté, sans jamais
# en générer un nouveau. Utilisée par GET /{id_pme} ET par l'export PDF, pour
# qu'aucune simple consultation ne puisse écraser silencieusement un lot
# généré avec RAG par un lot plus récent généré sans RAG (bug corrigé ici :
# l'export PDF appelait auparavant generer_recommandations_pour_pme(), qui
# PERSISTE toujours un nouveau lot — même pour une simple lecture).
# --------------------------------------------------------------------------

def _lire_dernier_lot(db: Session, id_pme: UUID) -> Optional[list[dict]]:
    derniere_date = (
        db.query(func.max(RecommandationGeneree.date_generation))
        .filter(RecommandationGeneree.id_pme == id_pme)
        .scalar()
    )
    if derniere_date is None:
        return None

    rows = (
        db.query(RecommandationGeneree, RegleExperte, Mesure, Domaine)
        .join(RegleExperte, RecommandationGeneree.id_regle == RegleExperte.id_regle)
        .join(Mesure, RegleExperte.id_mesure == Mesure.id_mesure)
        .join(Domaine, RegleExperte.id_domaine == Domaine.id_domaine)
        .filter(
            RecommandationGeneree.id_pme == id_pme,
            RecommandationGeneree.date_generation == derniere_date,
        )
        .order_by(RecommandationGeneree.score_priorite.desc())
        .all()
    )

    return [
        {
            "id_recommandation": reco.id_recommandation,
            "id_regle": reco.id_regle,
            "id_domaine": regle.id_domaine,
            "id_mesure": regle.id_mesure,
            "nom_domaine": domaine.nom_domaine,
            "titre_mesure": mesure.titre,
            "description_mesure": mesure.description,
            "cout_estime": mesure.cout_estime,
            "difficulte_estimee": mesure.difficulte_estimee,
            "impact": mesure.impact,
            "section_guide_precise": mesure.section_guide_precise,
            "score_priorite": float(reco.score_priorite),
            "justification_rag": reco.justification_rag,
        }
        for reco, regle, mesure, domaine in rows
    ]


# --------------------------------------------------------------------------
# POST /recommandations/{id_pme}
# SEUL endpoint qui génère (et persiste) un nouveau lot de recommandations.
# --------------------------------------------------------------------------

@router.post("/{id_pme}", response_model=PlanActionOut)
def generer_recommandations(
    id_pme: UUID,
    avec_rag: bool = Query(
        default=True,
        description=(
            "Génère la justification RAG (appelle Ollama, plus lent). "
            "Mettre à false pour tester le moteur de règles seul, "
            "sans dépendance Ollama."
        ),
    ),
    db: Session = Depends(get_db),
):
    try:
        plan = generer_recommandations_pour_pme(
            db,
            id_pme,
            avec_justification_rag=avec_rag,
        )
    except ValueError:
        raise HTTPException(
            status_code=404,
            detail="PME introuvable ou sans réponses",
        )

    return {
        "id_pme": id_pme,
        "nb_recommandations": len(plan),
        "recommandations": plan,
    }


# --------------------------------------------------------------------------
# GET /recommandations/{id_pme}
# Relit le dernier lot déjà généré — ne génère jamais rien.
# --------------------------------------------------------------------------

@router.get("/{id_pme}", response_model=PlanActionOut)
def lire_recommandations(id_pme: UUID, db: Session = Depends(get_db)):
    recommandations = _lire_dernier_lot(db, id_pme)
    if recommandations is None:
        raise HTTPException(
            status_code=404,
            detail="Aucune recommandation générée pour cette PME — appelez POST /recommandations/{id_pme} d'abord.",
        )

    return {
        "id_pme": id_pme,
        "nb_recommandations": len(recommandations),
        "recommandations": recommandations,
    }


# --------------------------------------------------------------------------
# GET /recommandations/{id_pme}/suivi
# Sépare les recommandations traitées / en attente, basé sur la table feedback
# --------------------------------------------------------------------------

@router.get("/{id_pme}/suivi")
def suivi_recommandations(id_pme: UUID, db: Session = Depends(get_db)):
    derniere_date = (
        db.query(func.max(RecommandationGeneree.date_generation))
        .filter(RecommandationGeneree.id_pme == id_pme)
        .scalar()
    )
    if derniere_date is None:
        raise HTTPException(status_code=404, detail="Aucune recommandation générée pour cette PME.")

    rows = (
        db.query(RecommandationGeneree, RegleExperte, Mesure, Domaine, Feedback)
        .join(RegleExperte, RecommandationGeneree.id_regle == RegleExperte.id_regle)
        .join(Mesure, RegleExperte.id_mesure == Mesure.id_mesure)
        .join(Domaine, RegleExperte.id_domaine == Domaine.id_domaine)
        .outerjoin(Feedback, Feedback.id_recommandation == RecommandationGeneree.id_recommandation)
        .filter(
            RecommandationGeneree.id_pme == id_pme,
            RecommandationGeneree.date_generation == derniere_date,
        )
        .order_by(RecommandationGeneree.score_priorite.desc())
        .all()
    )

    def to_dict(reco, regle, mesure, domaine):
        return {
            "id_recommandation": reco.id_recommandation,
            "id_domaine": regle.id_domaine,
            "nom_domaine": domaine.nom_domaine,
            "titre_mesure": mesure.titre,
            "score_priorite": float(reco.score_priorite),
        }

    traitees, en_attente = [], []
    for reco, regle, mesure, domaine, feedback in rows:
        item = to_dict(reco, regle, mesure, domaine)
        if feedback is not None and feedback.recommandation_appliquee is True:
            traitees.append(item)
        else:
            en_attente.append(item)

    return {
        "id_pme": id_pme,
        "recommandations_traitees": traitees,
        "recommandations_en_attente": en_attente,
    }


# --------------------------------------------------------------------------
# GET /recommandations/{id_pme}/pdf
# Génère et télécharge le rapport PDF — LIT le dernier lot déjà généré,
# ne régénère JAMAIS rien (corrige le bug qui écrasait les justifications
# RAG existantes à chaque export PDF).
# --------------------------------------------------------------------------

@router.get("/{id_pme}/pdf")
def telecharger_rapport_pdf(id_pme: UUID, db: Session = Depends(get_db)):
    profil = db.query(PmeProfil).filter(PmeProfil.id_pme == id_pme).first()
    if not profil:
        raise HTTPException(status_code=404, detail="Profil PME introuvable")

    plan = _lire_dernier_lot(db, id_pme)
    if plan is None:
        raise HTTPException(
            status_code=404,
            detail="Aucune recommandation générée pour cette PME — appelez POST /recommandations/{id_pme} d'abord.",
        )

    # --- Scores par domaine : jointure reponse -> question -> domaine ----
    lignes = (
        db.query(Reponse, Question, Domaine)
        .join(Question, Reponse.id_question == Question.id_question)
        .outerjoin(Domaine, Question.id_domaine == Domaine.id_domaine)
        .filter(Reponse.id_pme == id_pme)
        .all()
    )

    domaines_scores: dict[int, dict] = {}
    contexte_score = 0
    contexte_max = 0

    for reponse, question, domaine in lignes:
        try:
            valeur = int(reponse.valeur_reponse)
        except (TypeError, ValueError):
            valeur = 0

        if question.type_question == "contextuelle":
            contexte_score += valeur
            contexte_max += question.valeur_max
        elif question.type_question == "domaine" and domaine is not None:
            entry = domaines_scores.setdefault(
                domaine.id_domaine, {"nom": domaine.nom_domaine, "score": 0, "max": 0}
            )
            entry["score"] += valeur
            entry["max"] += question.valeur_max

    domaines_list = list(domaines_scores.values())
    global_score = contexte_score + sum(d["score"] for d in domaines_list)
    max_score = contexte_max + sum(d["max"] for d in domaines_list)

    def bucket(score: float) -> str:
        if score >= 15:
            return "critical"
        if score >= 8:
            return "high"
        if score >= 4:
            return "medium"
        return "low"

    recommandations_data = [
        {
            "titre": r["titre_mesure"],
            "domaine": r["nom_domaine"],
            "priority": bucket(float(r["score_priorite"])),
            "score_priorite": float(r["score_priorite"]),
            "cout": r["cout_estime"],
            "difficulte": r["difficulte_estimee"],
            "impact": r["impact"],
            "section": r["section_guide_precise"],
            "justification": r.get("justification_rag"),
        }
        for r in plan
    ]

    pdf_bytes = generer_pdf_rapport(
        profil={
            "nom_entreprise": profil.nom_entreprise,
            "secteur_activite": profil.secteur_activite,
            "taille_effectif": profil.taille_effectif,
        },
        global_score=global_score,
        max_score=max_score,
        domaines=domaines_list,
        recommandations=recommandations_data,
    )

    filename = f"rapport-cybersecurite-{profil.nom_entreprise.replace(' ', '_')}.pdf"
    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={"Content-Disposition": f'attachment; filename="{filename}"'},
    )