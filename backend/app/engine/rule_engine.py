from dataclasses import dataclass, field
from typing import Any, Dict, List, Optional

from .condition_evaluator import evaluate_condition, ConditionEvaluationError


@dataclass
class RegleDeclenchee:
    id_regle: int
    id_domaine: int
    id_mesure: int
    priorite_base: int
    id_regle_parent: Optional[int] = None
    erreurs: List[str] = field(default_factory=list)

    @property
    def en_erreur(self) -> bool:
        return len(self.erreurs) > 0


class RuleEngine:
    def __init__(self, regles: List[Dict[str, Any]], mesures: List[Dict[str, Any]]):
        """
        :param regles: contenu de regles_expertes.json
        :param mesures: contenu de mesures.json
        """
        self.regles = regles
        self.regles_par_id: Dict[int, Dict[str, Any]] = {r["id_regle"]: r for r in regles}
        self.mesures_par_id: Dict[int, Dict[str, Any]] = {m["id_mesure"]: m for m in mesures}

    def get_mesure(self, id_mesure: int) -> Dict[str, Any]:
        return self.mesures_par_id[id_mesure]

    def evaluer(
        self,
        reponses: Dict[int, Any],
        profil: Dict[str, Any],
    ) -> List[RegleDeclenchee]:
        """
        :param reponses: {id_question: valeur_reponse} pour la PME évaluée
        :param profil: dict représentant la ligne pme_profil (champs métier)
        :return: liste des règles déclenchées (et des règles en erreur
                 d'évaluation, isolées via .erreurs plutôt que de faire
                 échouer tout le moteur)
        """
        resultats: List[RegleDeclenchee] = []
        cache_evaluation: Dict[int, bool] = {}

        for regle in self.regles:
            id_regle = regle["id_regle"]
            try:
                declenchee = self._est_declenchee(regle, reponses, profil, cache_evaluation)
            except ConditionEvaluationError as e:
                resultats.append(RegleDeclenchee(
                    id_regle=id_regle,
                    id_domaine=regle["id_domaine"],
                    id_mesure=regle["id_mesure"],
                    priorite_base=regle["priorite_base"],
                    id_regle_parent=regle.get("id_regle_parent"),
                    erreurs=[str(e)],
                ))
                continue

            if declenchee:
                resultats.append(RegleDeclenchee(
                    id_regle=id_regle,
                    id_domaine=regle["id_domaine"],
                    id_mesure=regle["id_mesure"],
                    priorite_base=regle["priorite_base"],
                    id_regle_parent=regle.get("id_regle_parent"),
                ))

        return resultats

    def _est_declenchee(
        self,
        regle: Dict[str, Any],
        reponses: Dict[int, Any],
        profil: Dict[str, Any],
        cache: Dict[int, bool],
    ) -> bool:
        id_regle = regle["id_regle"]
        if id_regle in cache:
            return cache[id_regle]

        propre_condition_ok = evaluate_condition(regle["condition"], reponses, profil)

        id_parent = regle.get("id_regle_parent")
        if id_parent is not None and propre_condition_ok:
            regle_parent = self.regles_par_id.get(id_parent)
            if regle_parent is None:
                raise ConditionEvaluationError(
                    f"Règle {id_regle} référence une règle parent inexistante ({id_parent})"
                )
            parent_ok = self._est_declenchee(regle_parent, reponses, profil, cache)
            resultat = propre_condition_ok and parent_ok
        else:
            resultat = propre_condition_ok

        cache[id_regle] = resultat
        return resultat