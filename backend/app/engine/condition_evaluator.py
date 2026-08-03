"""
condition_evaluator.py
=======================
Évalue les conditions JSONB stockées dans regle_experte.condition contre
un profil PME et ses réponses au questionnaire de maturité.

Formats de condition supportés (issus de regles_expertes.json) :

1. Condition simple sur une question :
   {"id_question": 13, "operateur": "<=", "valeur": 1}

2. Condition composée : question + critère supplémentaire sur le profil PME,
   via une clause "et" qui teste soit une égalité, soit une appartenance :
   {"id_question": 17, "operateur": "<=", "valeur": 1,
    "et": {"champ": "traite_donnees_sensibles", "valeur": true}}

   {"id_question": 24, "operateur": "<=", "valeur": 1,
    "et": {"champ": "reglementations_applicables", "contient": "rgpd"}}
"""

from typing import Any, Dict

OPERATEURS = {
    "<=": lambda a, b: a <= b,
    ">=": lambda a, b: a >= b,
    "<": lambda a, b: a < b,
    ">": lambda a, b: a > b,
    "==": lambda a, b: a == b,
    "!=": lambda a, b: a != b,
}


class ConditionEvaluationError(Exception):
    """Levée quand une condition est mal formée, référence un opérateur
    inconnu, ou ne peut pas être comparée (type incohérent)."""


def evaluate_condition(
    condition: Dict[str, Any],
    reponses: Dict[int, Any],
    profil: Dict[str, Any],
) -> bool:
    """
    Évalue une condition de règle experte.

    :param condition: dict condition tel que stocké dans regle_experte.condition
    :param reponses: {id_question: valeur_reponse} pour la PME évaluée
    :param profil: dict représentant une ligne pme_profil (champs -> valeurs)
    :return: True si la condition est satisfaite, False sinon (y compris si
             la question référencée n'a pas de réponse : on ne déclenche pas
             une règle sur une donnée manquante plutôt que de lever une erreur)
    """
    id_question = condition.get("id_question")
    operateur = condition.get("operateur")
    valeur_attendue = condition.get("valeur")

    if id_question is None or operateur is None:
        raise ConditionEvaluationError(
            f"Condition mal formée (id_question/operateur manquant) : {condition}"
        )

    if operateur not in OPERATEURS:
        raise ConditionEvaluationError(f"Opérateur inconnu : {operateur}")

    if id_question not in reponses:
        return False

    valeur_reponse = reponses[id_question]

    try:
        base_ok = OPERATEURS[operateur](int(valeur_reponse), int(valeur_attendue))
    except (TypeError, ValueError) as e:
        raise ConditionEvaluationError(
            f"Impossible de comparer la réponse Q{id_question}={valeur_reponse!r} "
            f"à la valeur attendue {valeur_attendue!r} : {e}"
        )

    if not base_ok:
        return False

    clause_et = condition.get("et")
    if clause_et is not None:
        return _evaluate_et_clause(clause_et, profil)

    return True


def _evaluate_et_clause(clause: Dict[str, Any], profil: Dict[str, Any]) -> bool:
    champ = clause.get("champ")
    if champ is None:
        raise ConditionEvaluationError(f"Clause 'et' mal formée (champ manquant) : {clause}")

    if champ not in profil:
        return False

    valeur_profil = profil[champ]

    if "valeur" in clause:
        return valeur_profil == clause["valeur"]

    if "contient" in clause:
        if valeur_profil is None:
            return False
        return clause["contient"] in valeur_profil

    raise ConditionEvaluationError(f"Clause 'et' ne contient ni 'valeur' ni 'contient' : {clause}")