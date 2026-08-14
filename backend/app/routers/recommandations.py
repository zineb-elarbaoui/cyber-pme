from uuid import UUID

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

router = APIRouter(
    prefix="/recommandations",
    tags=["recommandations"],
)



# POST /recommandations/{id_pme}
# Génère (et persiste) les recommandations pour une PME


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



# GET /recommandations/{id_pme}
# Relit les recommandations déjà générées (dernière génération), sans
# relancer le moteur de règles ni le RAG — affichage instantané quand une
# PME se reconnecte à un diagnostic déjà terminé.


@router.get("/{id_pme}", response_model=PlanActionOut)
def lire_recommandations(id_pme: UUID, db: Session = Depends(get_db)):
    derniere_date = (
        db.query(func.max(RecommandationGeneree.date_generation))
        .filter(RecommandationGeneree.id_pme == id_pme)
        .scalar()
    )
    if derniere_date is None:
        raise HTTPException(
            status_code=404,
            detail="Aucune recommandation générée pour cette PME — appelez POST /recommandations/{id_pme} d'abord.",
        )

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

    recommandations = [
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

    return {
        "id_pme": id_pme,
        "nb_recommandations": len(recommandations),
        "recommandations": recommandations,
    }



# GET /recommandations/{id_pme}/pdf
# Génère et télécharge le rapport PDF de cybersécurité


@router.get("/{id_pme}/pdf")
def telecharger_rapport_pdf(
    id_pme: UUID,
    avec_rag: bool = Query(default=False, description="Inclure les justifications RAG (nécessite Ollama actif)."),
    db: Session = Depends(get_db),
):
    profil = db.query(PmeProfil).filter(PmeProfil.id_pme == id_pme).first()
    if not profil:
        raise HTTPException(status_code=404, detail="Profil PME introuvable")

    # Réutilise la même logique que POST /recommandations/{id_pme} — pas de
    # requête SQL dupliquée pour les recommandations elles-mêmes.
    try:
        plan = generer_recommandations_pour_pme(db, id_pme, avec_justification_rag=avec_rag)
    except ValueError:
        raise HTTPException(status_code=404, detail="PME introuvable ou sans réponses")

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

    # Regroupement des paliers de priorité — mêmes seuils provisoires que
    # côté frontend (src/lib/maturity.ts), à recalibrer ensemble au Sprint 7.
    def bucket(score: float) -> str:
        if score >= 15:
            return "critical"
        if score >= 8:
            return "high"
        if score >= 4:
            return "medium"
        return "low"

    # `plan` vient de generer_recommandations_pour_pme() — confirmé être une
    # liste de dicts, donc accès par clé plutôt que par attribut.
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