
from typing import Dict, List
from uuid import UUID

from sqlalchemy.orm import Session

from app.models.pme_profil import PmeProfil
from app.models.reponse import Reponse
from app.models.recommandation import RecommandationGeneree
from app.models.domaine import Domaine
from app.engine.recommender import generer_plan_action
from app.services.engine_service import get_engine
from app.services.rag_service import generer_justification_pour_mesure


def _profil_vers_dict(profil: PmeProfil) -> dict:
    return {
        "secteur_activite": profil.secteur_activite,
        "taille_effectif": profil.taille_effectif,
        "chiffre_affaires_annuel": profil.chiffre_affaires_annuel,
        "possede_service_it": profil.possede_service_it,
        "possede_responsable_securite": profil.possede_responsable_securite,
        "niveau_digitalisation": profil.niveau_digitalisation,
        "traite_donnees_sensibles": profil.traite_donnees_sensibles,
        "historique_incident_cyber": profil.historique_incident_cyber,
        "budget_cybersecurite": profil.budget_cybersecurite,
        "reglementations_applicables": profil.reglementations_applicables or [],
    }


def _noms_domaines(db: Session) -> Dict[int, str]:
    """Lookup id_domaine -> nom_domaine, chargé une fois par appel (pas par
    recommandation) — évite 45 requêtes SQL pour un profil qui déclenche 45
    recommandations (cas 'Clinique Santé Nord' du rapport Sprint 3)."""
    return {d.id_domaine: d.nom_domaine for d in db.query(Domaine).all()}


def generer_recommandations_pour_pme(
    db: Session, id_pme: UUID, avec_justification_rag: bool = True
) -> List[dict]:
    
    profil = db.query(PmeProfil).filter(PmeProfil.id_pme == id_pme).first()
    if profil is None:
        raise ValueError("PME introuvable")

    reponses_rows = db.query(Reponse).filter(Reponse.id_pme == id_pme).all()
    reponses_dict = {r.id_question: r.valeur_reponse for r in reponses_rows}

    engine = get_engine()
    plan = generer_plan_action(
        engine=engine, reponses=reponses_dict, profil=_profil_vers_dict(profil)
    )

    noms_domaines = _noms_domaines(db)

    resultats = []
    for item in plan:
        nom_domaine = noms_domaines.get(item["id_domaine"], "")

        justification = None
        if avec_justification_rag:
            justification = generer_justification_pour_mesure(
                titre_mesure=item["titre_mesure"],
                description_mesure=item["description_mesure"],
                nom_domaine=nom_domaine,
                section_guide_precise=item.get("section_guide_precise") or "",
            )

        recommandation = RecommandationGeneree(
            id_pme=id_pme,
            id_regle=item["id_regle"],
            score_priorite=item["score_priorite"],
            justification_rag=justification,
        )
        db.add(recommandation)
        db.flush()  # récupère id_recommandation généré sans committer tout de suite

        resultats.append({
            **item,
            "nom_domaine": nom_domaine,
            "id_recommandation": recommandation.id_recommandation,
            "justification_rag": justification,
        })

    db.commit()
    return resultats