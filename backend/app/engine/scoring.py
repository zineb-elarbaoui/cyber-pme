from typing import Any, Dict

POIDS_IMPACT = {
    "faible": 1.0,
    "moyen": 1.5,
    "eleve": 2.0,
    "tres_eleve": 2.5,
}

QUESTIONS_CONTEXTUELLES = list(range(1, 10))  # Q1 à Q9, échelle 0-3 (contexte/risque)

SECTEURS_SENSIBLES = {"sante", "finance_assurance"}


def multiplicateur_contexte(reponses: Dict[int, Any]) -> float:
    """
    Multiplicateur [1.0 ; 2.0] à partir de la moyenne des réponses Q1-Q9
    (échelle 0-3). Les questions sans réponse sont simplement ignorées
    (ni bonus ni pénalité). Si aucune des 9 questions contextuelles n'a de
    réponse, retourne 1.0 (neutre) plutôt que d'échouer.
    """
    valeurs = []
    for q in QUESTIONS_CONTEXTUELLES:
        if q in reponses:
            try:
                valeurs.append(int(reponses[q]))
            except (TypeError, ValueError):
                continue

    if not valeurs:
        return 1.0

    moyenne = sum(valeurs) / len(valeurs)  # 0.0 à 3.0
    return 1.0 + (moyenne / 3.0)  # 1.0 à 2.0


def pertinence_secteur(mesure: Dict[str, Any], profil: Dict[str, Any]) -> float:
    """
    Bonus x1.2 si le secteur de la PME est sensible (ou qu'elle traite des
    données sensibles) ET que la mesure a un impact eleve/tres_eleve.
    Sinon neutre (x1.0).
    """
    secteur = profil.get("secteur_activite")
    traite_sensibles = profil.get("traite_donnees_sensibles", False)
    impact = mesure.get("impact")

    if impact in ("eleve", "tres_eleve") and (secteur in SECTEURS_SENSIBLES or traite_sensibles):
        return 1.2
    return 1.0


def calculer_score_priorite(
    priorite_base: int,
    mesure: Dict[str, Any],
    reponses: Dict[int, Any],
    profil: Dict[str, Any],
    appliquer_pertinence_secteur: bool = True,
) -> float:
    """
    :return: score_priorite arrondi à 2 décimales (compatible NUMERIC(5,2))
    """
    poids = POIDS_IMPACT.get(mesure.get("impact"), 1.0)
    contexte = multiplicateur_contexte(reponses)
    secteur = pertinence_secteur(mesure, profil) if appliquer_pertinence_secteur else 1.0

    score = priorite_base * poids * contexte * secteur
    return round(score, 2)