"""
Sprint 5 — Colle entre l'API et app/engine/recommender.py (Sprint 3) +
app/services/rag_service.py (Sprint 4).


"""
from typing import List
from uuid import UUID

from sqlalchemy.orm import Session

from app.models.pme_profil import PmeProfil
from app.models.reponse import Reponse
from app.models.recommandation import RecommandationGeneree
from app.models.regle_experte import RegleExperte
from app.engine.recommender import generer_plan_action
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


def generer_recommandations_pour_pme(
    db: Session, id_pme: UUID, avec_justification_rag: bool = True
) -> List[dict]:
    """
    1. Charge le profil + les réponses depuis la DB (session SQLAlchemy).
    2. Appelle le moteur de règles (Sprint 3) en mémoire.
    3. Pour chaque recommandation déclenchée, appelle le RAG pour la
       justification (optionnel — désactivable si Ollama n'est pas dispo,
       ex. pour des tests rapides sans dépendance externe).
    4. Persiste chaque recommandation dans recommandation_generee.
    5. Retourne la liste triée par score décroissant, prête pour le schéma
       PlanActionOut.
    """
    profil = db.query(PmeProfil).filter(PmeProfil.id_pme == id_pme).first()
    if profil is None:
        raise ValueError("PME introuvable")

    reponses_rows = db.query(Reponse).filter(Reponse.id_pme == id_pme).all()
    reponses_dict = {r.id_question: r.valeur_reponse for r in reponses_rows}

    plan = generer_plan_action(profil=_profil_vers_dict(profil), reponses=reponses_dict)

    resultats = []
    for item in plan:
        justification = None
        if avec_justification_rag:
            justification = generer_justification_pour_mesure(
                titre_mesure=item["titre_mesure"],
                description_mesure=item["description_mesure"],
                nom_domaine=item["nom_domaine"],
                section_guide_precise=item.get("section_guide_precise", ""),
            )

        recommandation = RecommandationGeneree(
            id_pme=id_pme,
            id_regle=item["id_regle"],
            score_priorite=item["score_priorite"],
            justification_rag=justification,
        )
        db.add(recommandation)
        db.flush()  # récupère id_recommandation généré sans committer tout de suite

        resultats.append({**item, "id_recommandation": recommandation.id_recommandation, "justification_rag": justification})

    db.commit()
    resultats.sort(key=lambda r: r["score_priorite"], reverse=True)
    return resultats