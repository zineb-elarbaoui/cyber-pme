
import json
from pathlib import Path

import pytest

from app.engine.condition_evaluator import evaluate_condition, ConditionEvaluationError
from app.engine.rule_engine import RuleEngine



def test_condition_simple_satisfaite():
    condition = {"id_question": 10, "operateur": "<=", "valeur": 1}
    assert evaluate_condition(condition, {10: 1}, {}) is True
    assert evaluate_condition(condition, {10: 0}, {}) is True


def test_condition_simple_non_satisfaite():
    condition = {"id_question": 10, "operateur": "<=", "valeur": 1}
    assert evaluate_condition(condition, {10: 2}, {}) is False


def test_condition_question_sans_reponse_retourne_false():
    """Pas de crash : une question sans réponse ne déclenche simplement pas la règle."""
    condition = {"id_question": 10, "operateur": "<=", "valeur": 1}
    assert evaluate_condition(condition, {}, {}) is False


@pytest.mark.parametrize("operateur,reponse,attendu,resultat", [
    (">=", 3, 2, True),
    (">=", 1, 2, False),
    ("==", 2, 2, True),
    ("!=", 2, 3, True),
    ("<", 1, 2, True),
    (">", 3, 2, True),
])
def test_tous_les_operateurs(operateur, reponse, attendu, resultat):
    condition = {"id_question": 1, "operateur": operateur, "valeur": attendu}
    assert evaluate_condition(condition, {1: reponse}, {}) is resultat


def test_operateur_inconnu_leve_erreur():
    condition = {"id_question": 10, "operateur": "~=", "valeur": 1}
    with pytest.raises(ConditionEvaluationError):
        evaluate_condition(condition, {10: 1}, {})


def test_condition_mal_formee_leve_erreur():
    with pytest.raises(ConditionEvaluationError):
        evaluate_condition({"operateur": "<="}, {}, {})  # id_question manquant


def test_valeur_reponse_non_numerique_leve_erreur():
    condition = {"id_question": 10, "operateur": "<=", "valeur": 1}
    with pytest.raises(ConditionEvaluationError):
        evaluate_condition(condition, {10: "non_numerique"}, {})



def test_clause_et_valeur_satisfaite(profil_sensible):
    condition = {
        "id_question": 17, "operateur": "<=", "valeur": 1,
        "et": {"champ": "traite_donnees_sensibles", "valeur": True},
    }
    assert evaluate_condition(condition, {17: 1}, profil_sensible) is True


def test_clause_et_valeur_non_satisfaite(profil_neutre):
    condition = {
        "id_question": 17, "operateur": "<=", "valeur": 1,
        "et": {"champ": "traite_donnees_sensibles", "valeur": True},
    }
    # base_ok=True mais clause "et" fausse -> False
    assert evaluate_condition(condition, {17: 1}, profil_neutre) is False


def test_clause_et_base_non_satisfaite_court_circuite(profil_sensible):
    """Si la condition de base échoue, la clause 'et' n'est même pas évaluée."""
    condition = {
        "id_question": 17, "operateur": "<=", "valeur": 1,
        "et": {"champ": "traite_donnees_sensibles", "valeur": True},
    }
    assert evaluate_condition(condition, {17: 3}, profil_sensible) is False


def test_clause_et_contient_satisfaite(profil_sensible):
    condition = {
        "id_question": 24, "operateur": "<=", "valeur": 1,
        "et": {"champ": "reglementations_applicables", "contient": "rgpd"},
    }
    assert evaluate_condition(condition, {24: 1}, profil_sensible) is True


def test_clause_et_contient_non_satisfaite(profil_neutre):
    condition = {
        "id_question": 24, "operateur": "<=", "valeur": 1,
        "et": {"champ": "reglementations_applicables", "contient": "rgpd"},
    }
    assert evaluate_condition(condition, {24: 1}, profil_neutre) is False


def test_clause_et_champ_absent_du_profil_retourne_false():
    condition = {
        "id_question": 24, "operateur": "<=", "valeur": 1,
        "et": {"champ": "champ_qui_nexiste_pas", "valeur": True},
    }
    assert evaluate_condition(condition, {24: 1}, {}) is False


def test_clause_et_mal_formee_leve_erreur(profil_sensible):
    condition = {
        "id_question": 24, "operateur": "<=", "valeur": 1,
        "et": {"champ": "traite_donnees_sensibles"},  # ni "valeur" ni "contient"
    }
    with pytest.raises(ConditionEvaluationError):
        evaluate_condition(condition, {24: 1}, profil_sensible)



@pytest.fixture
def mesures_synthetiques():
    return [
        {"id_mesure": 1, "titre": "Mesure A", "impact": "moyen"},
        {"id_mesure": 2, "titre": "Mesure B (fille)", "impact": "tres_eleve"},
        {"id_mesure": 3, "titre": "Mesure C (indépendante)", "impact": "faible"},
        {"id_mesure": 4, "titre": "Mesure D (petite-fille)", "impact": "eleve"},
    ]


@pytest.fixture
def regles_synthetiques():
    return [
        {
            "id_regle": 1,
            "id_domaine": 1,
            "id_regle_parent": None,
            "condition": {"id_question": 10, "operateur": "<=", "valeur": 1},
            "id_mesure": 1,
            "priorite_base": 3,
        },
        {
            "id_regle": 2,
            "id_domaine": 1,
            "id_regle_parent": 1,
            "condition": {
                "id_question": 10, "operateur": "<=", "valeur": 1,
                "et": {"champ": "traite_donnees_sensibles", "valeur": True},
            },
            "id_mesure": 2,
            "priorite_base": 5,
        },
        {
            "id_regle": 3,
            "id_domaine": 2,
            "id_regle_parent": None,
            "condition": {"id_question": 11, "operateur": "<=", "valeur": 1},
            "id_mesure": 3,
            "priorite_base": 2,
        },
        {
            # petite-fille : parent = règle 2, elle-même fille de règle 1
            "id_regle": 4,
            "id_domaine": 1,
            "id_regle_parent": 2,
            "condition": {
                "id_question": 10, "operateur": "<=", "valeur": 1,
                "et": {"champ": "budget_cybersecurite", "valeur": "aucun"},
            },
            "id_mesure": 4,
            "priorite_base": 5,
        },
    ]


def test_regle_simple_declenchee(regles_synthetiques, mesures_synthetiques, profil_neutre):
    engine = RuleEngine(regles_synthetiques, mesures_synthetiques)
    resultats = engine.evaluer({10: 1, 11: 3}, profil_neutre)
    ids = {r.id_regle for r in resultats}
    assert ids == {1}  # seule la règle 1 (indépendante) se déclenche


def test_regle_fille_declenchee_si_parent_et_clause_ok(regles_synthetiques, mesures_synthetiques, profil_sensible):
    engine = RuleEngine(regles_synthetiques, mesures_synthetiques)
    resultats = engine.evaluer({10: 1, 11: 3}, profil_sensible)
    ids = {r.id_regle for r in resultats}
    # règle 1 (mère, toujours vraie si Q10<=1) + règle 2 (fille, clause données sensibles OK).
    # NB : profil_sensible a aussi budget_cybersecurite="aucun", ce qui satisfait également
    # la clause de la petite-fille (règle 4) -- elle se déclenche donc aussi, à raison.
    assert ids == {1, 2, 4}


def test_regle_fille_absente_si_clause_et_fausse(regles_synthetiques, mesures_synthetiques, profil_neutre):
    engine = RuleEngine(regles_synthetiques, mesures_synthetiques)
    resultats = engine.evaluer({10: 1, 11: 3}, profil_neutre)
    ids = {r.id_regle for r in resultats}
    assert 2 not in ids  # traite_donnees_sensibles=False -> clause "et" fausse


def test_regle_fille_absente_si_parent_non_declenche(regles_synthetiques, mesures_synthetiques, profil_sensible):
    """
    Même si la condition PROPRE de la fille serait vraie, elle ne doit pas se
    déclencher si sa règle mère ne l'est pas (Q10=3 > seuil 1 de la mère).
    """
    engine = RuleEngine(regles_synthetiques, mesures_synthetiques)
    resultats = engine.evaluer({10: 3, 11: 3}, profil_sensible)
    ids = {r.id_regle for r in resultats}
    assert 1 not in ids
    assert 2 not in ids


def test_petite_fille_necessite_toute_la_chaine(regles_synthetiques, mesures_synthetiques):
    """
    Règle 4 (petite-fille de 1, via 2) ne doit se déclencher que si 1 ET 2 ET 4
    sont toutes vraies -- vérifie que la récursion mère/fille se propage sur
    plusieurs niveaux et pas seulement un.
    """
    engine = RuleEngine(regles_synthetiques, mesures_synthetiques)

    profil_incomplet = {"traite_donnees_sensibles": True, "budget_cybersecurite": "aucun"}
    resultats = engine.evaluer({10: 1, 11: 3}, profil_incomplet)
    ids = {r.id_regle for r in resultats}
    assert ids == {1, 2, 4}  # toute la chaîne est satisfaite

    profil_sans_budget_aucun = {"traite_donnees_sensibles": True, "budget_cybersecurite": "modere"}
    resultats2 = engine.evaluer({10: 1, 11: 3}, profil_sans_budget_aucun)
    ids2 = {r.id_regle for r in resultats2}
    assert ids2 == {1, 2}  # 4 ne se déclenche pas : sa propre clause "et" est fausse


def test_regle_parent_inexistante_isolee_en_erreur(mesures_synthetiques):
    """Une référence de parent cassée ne doit pas faire planter tout le moteur."""
    regles = [{
        "id_regle": 99,
        "id_domaine": 1,
        "id_regle_parent": 404,  # n'existe pas
        "condition": {"id_question": 10, "operateur": "<=", "valeur": 1},
        "id_mesure": 1,
        "priorite_base": 3,
    }]
    engine = RuleEngine(regles, mesures_synthetiques)
    resultats = engine.evaluer({10: 1}, {})
    assert len(resultats) == 1
    assert resultats[0].en_erreur is True
    assert "parent inexistante" in resultats[0].erreurs[0]


def test_aucune_regle_declenchee_si_toutes_conditions_fausses(regles_synthetiques, mesures_synthetiques, profil_neutre):
    engine = RuleEngine(regles_synthetiques, mesures_synthetiques)
    resultats = engine.evaluer({10: 5, 11: 5}, profil_neutre)
    assert resultats == []


def test_cache_evite_reevaluation_multiple(regles_synthetiques, mesures_synthetiques, profil_sensible):
    """
    Règle 4 dépend de règle 2 qui dépend de règle 1. Le moteur doit réutiliser
    le résultat déjà calculé pour la règle 1/2 plutôt que de la réévaluer à
    chaque règle fille -- comportement vérifié indirectement via le résultat
    correct (le test de non-régression sur la performance sort du cadre ici).
    """
    engine = RuleEngine(regles_synthetiques, mesures_synthetiques)
    resultats = engine.evaluer({10: 1, 11: 3}, {**profil_sensible, "budget_cybersecurite": "aucun"})
    ids = {r.id_regle for r in resultats}
    assert ids == {1, 2, 4}


@pytest.fixture(scope="module")
def vraies_donnees():
    """
    Cherche mesures.json / regles_expertes.json dans plusieurs emplacements
    plausibles selon l'environnement (repo local vs. environnement de dev),
    plutôt que de dépendre d'un chemin unique codé en dur.

    Emplacement attendu dans le repo : database/seeds/ à la racine du projet
    (sibling de backend/), conformément à la structure convenue.
    """
    backend_dir = Path(__file__).resolve().parent.parent
    candidats = [
        backend_dir.parent / "database" / "seeds",  
        backend_dir / "database" / "seeds",          
        Path("/mnt/project"),                        
    ]

    seeds_dir = next((c for c in candidats if (c / "mesures.json").exists()), None)
    if seeds_dir is None:
        pytest.skip(
            "mesures.json / regles_expertes.json introuvables. "
            "Placez-les dans database/seeds/ à la racine du repo (sibling de backend/)."
        )

    with open(seeds_dir / "mesures.json", encoding="utf-8") as f:
        mesures = json.load(f)
    with open(seeds_dir / "regles_expertes.json", encoding="utf-8") as f:
        regles = json.load(f)
    return regles, mesures


def test_corpus_reel_53_regles_chargees(vraies_donnees):
    regles, mesures = vraies_donnees
    assert len(regles) == 53
    assert len(mesures) == 53


def test_corpus_reel_couples_mere_fille_donnees_sensibles(vraies_donnees):
    """
    Vérifie les 3 couples mère/fille réels du corpus (règles 3/4, 22/23, 31/32),
    tous conditionnés par traite_donnees_sensibles=true.
    """
    regles, mesures = vraies_donnees
    engine = RuleEngine(regles, mesures)

    profil_sensible = {"traite_donnees_sensibles": True}
    profil_non_sensible = {"traite_donnees_sensibles": False}

    reponses = {17: 1, 21: 1, 23: 1}  # déclenche les 3 règles mères

    ids_sensible = {r.id_regle for r in engine.evaluer(reponses, profil_sensible)}
    ids_non_sensible = {r.id_regle for r in engine.evaluer(reponses, profil_non_sensible)}

    for fille in (4, 23, 32):
        assert fille in ids_sensible, f"Règle fille {fille} devrait se déclencher (données sensibles)"
        assert fille not in ids_non_sensible, f"Règle fille {fille} ne devrait PAS se déclencher (pas de données sensibles)"


def test_corpus_reel_regle_rgpd_conditionnelle(vraies_donnees):
    """Règle 51 (domaine 15) ne se déclenche que si 'rgpd' est dans reglementations_applicables."""
    regles, mesures = vraies_donnees
    engine = RuleEngine(regles, mesures)

    resultats_avec_rgpd = engine.evaluer({24: 1}, {"reglementations_applicables": ["loi_09_08", "rgpd"]})
    resultats_sans_rgpd = engine.evaluer({24: 1}, {"reglementations_applicables": ["loi_09_08"]})

    assert 51 in {r.id_regle for r in resultats_avec_rgpd}
    assert 51 not in {r.id_regle for r in resultats_sans_rgpd}


def test_corpus_reel_aucune_reponse_ne_declenche_rien(vraies_donnees):
    regles, mesures = vraies_donnees
    engine = RuleEngine(regles, mesures)
    resultats = engine.evaluer({}, {})
    assert resultats == []
    