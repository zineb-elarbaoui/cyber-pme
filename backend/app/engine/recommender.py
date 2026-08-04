from typing import Any, Dict, List

from .rule_engine import RuleEngine
from .scoring import calculer_score_priorite


def generer_plan_action(
    engine: RuleEngine,
    reponses: Dict[int, Any],
    profil: Dict[str, Any],
) -> List[Dict[str, Any]]:
    """
    :param engine: instance de RuleEngine déjà chargée avec règles + mesures
    :param reponses: {id_question: valeur_reponse}
    :param profil: dict pme_profil (secteur_activite, traite_donnees_sensibles, ...)
    :return: liste de recommandations, triée par score_priorite décroissant.
             Chaque élément contient les infos nécessaires pour peupler
             recommandation_generee, plus le détail de la mesure pour
             affichage/debug.
    """
    regles_declenchees = engine.evaluer(reponses, profil)

    plan: List[Dict[str, Any]] = []
    erreurs: List[Dict[str, Any]] = []

    for regle in regles_declenchees:
        if regle.en_erreur:
            erreurs.append({"id_regle": regle.id_regle, "erreurs": regle.erreurs})
            continue

        mesure = engine.get_mesure(regle.id_mesure)
        score = calculer_score_priorite(
            priorite_base=regle.priorite_base,
            mesure=mesure,
            reponses=reponses,
            profil=profil,
        )

        plan.append({
            "id_regle": regle.id_regle,
            "id_domaine": regle.id_domaine,
            "id_mesure": regle.id_mesure,
            "titre_mesure": mesure["titre"],
            "description_mesure": mesure["description"],
            "impact": mesure.get("impact"),
            "cout_estime": mesure.get("cout_estime"),
            "difficulte_estimee": mesure.get("difficulte_estimee"),
            "section_guide_precise": mesure.get("section_guide_precise"),
            "priorite_base": regle.priorite_base,
            "score_priorite": score,
        })

    plan.sort(key=lambda r: r["score_priorite"], reverse=True)

    if erreurs:
        # Ne bloque pas la génération du plan, mais doit être loggé/affiché
        # pour investigation (règle mal formée, référence cassée, etc.)
        for e in erreurs:
            print(f"[ATTENTION] Règle {e['id_regle']} ignorée : {e['erreurs']}")

    return plan