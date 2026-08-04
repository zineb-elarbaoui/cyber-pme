
import pytest

from app.engine.scoring import (
    multiplicateur_contexte,
    pertinence_secteur,
    calculer_score_priorite,
    POIDS_IMPACT,
)




def test_contexte_aucune_reponse_est_neutre():
    assert multiplicateur_contexte({}) == 1.0


def test_contexte_toutes_reponses_a_zero():
    reponses = {i: 0 for i in range(1, 10)}
    assert multiplicateur_contexte(reponses) == 1.0


def test_contexte_toutes_reponses_au_max():
    reponses = {i: 3 for i in range(1, 10)}
    assert multiplicateur_contexte(reponses) == 2.0


def test_contexte_moyenne_intermediaire():
    # moyenne = 1.5 -> 1.0 + 1.5/3 = 1.5
    reponses = {i: 1.5 for i in range(1, 10)}
    # on force des int valides pour rester réaliste (moyenne réelle testée séparément)
    reponses = {1: 1, 2: 2, 3: 1, 4: 2, 5: 1, 6: 2, 7: 1, 8: 2, 9: 1}  # moyenne = 13/9
    resultat = multiplicateur_contexte(reponses)
    assert 1.4 < resultat < 1.5


def test_contexte_ignore_questions_hors_perimetre():
    """Q10+ (domaine) ne doivent pas influencer le multiplicateur contextuel."""
    reponses = {1: 3, 2: 3, 3: 3, 4: 3, 5: 3, 6: 3, 7: 3, 8: 3, 9: 3, 10: 0, 15: 0}
    assert multiplicateur_contexte(reponses) == 2.0


def test_contexte_ignore_reponses_partielles():
    """Seules les Q1-Q9 réellement répondues comptent dans la moyenne."""
    reponses = {1: 3, 2: 3}  # seulement 2 réponses sur 9, toutes au max
    assert multiplicateur_contexte(reponses) == 2.0


def test_contexte_ignore_valeurs_non_numeriques():
    reponses = {1: "invalide", 2: 3}
    assert multiplicateur_contexte(reponses) == 2.0  # seule Q2=3 est retenue



def test_pertinence_secteur_sensible_et_impact_tres_eleve():
    mesure = {"impact": "tres_eleve"}
    profil = {"secteur_activite": "sante", "traite_donnees_sensibles": False}
    assert pertinence_secteur(mesure, profil) == 1.2


def test_pertinence_secteur_donnees_sensibles_suffit():
    mesure = {"impact": "eleve"}
    profil = {"secteur_activite": "services", "traite_donnees_sensibles": True}
    assert pertinence_secteur(mesure, profil) == 1.2


def test_pertinence_secteur_neutre_si_secteur_non_sensible_et_pas_de_donnees_sensibles():
    mesure = {"impact": "tres_eleve"}
    profil = {"secteur_activite": "commerce", "traite_donnees_sensibles": False}
    assert pertinence_secteur(mesure, profil) == 1.0


def test_pertinence_secteur_neutre_si_impact_faible_meme_secteur_sensible():
    """Le bonus ne s'applique qu'aux mesures à impact eleve/tres_eleve."""
    mesure = {"impact": "faible"}
    profil = {"secteur_activite": "sante", "traite_donnees_sensibles": True}
    assert pertinence_secteur(mesure, profil) == 1.0


def test_pertinence_secteur_neutre_si_impact_moyen():
    mesure = {"impact": "moyen"}
    profil = {"secteur_activite": "finance_assurance", "traite_donnees_sensibles": True}
    assert pertinence_secteur(mesure, profil) == 1.0



def test_score_formule_complete_cas_neutre():
    """
    priorite_base=3, impact=moyen (x1.5), pas de contexte (x1.0 par défaut
    car reponses vides), pas de bonus secteur (profil neutre).
    Score attendu = 3 x 1.5 x 1.0 x 1.0 = 4.5
    """
    mesure = {"impact": "moyen"}
    profil = {"secteur_activite": "commerce", "traite_donnees_sensibles": False}
    score = calculer_score_priorite(priorite_base=3, mesure=mesure, reponses={}, profil=profil)
    assert score == 4.5


def test_score_formule_complete_cas_maximal():
    """
    priorite_base=5, impact=tres_eleve (x2.5), contexte max (x2.0),
    secteur sensible + impact tres_eleve (x1.2).
    Score attendu = 5 x 2.5 x 2.0 x 1.2 = 30.0
    """
    mesure = {"impact": "tres_eleve"}
    profil = {"secteur_activite": "sante", "traite_donnees_sensibles": True}
    reponses = {i: 3 for i in range(1, 10)}
    score = calculer_score_priorite(priorite_base=5, mesure=mesure, reponses=reponses, profil=profil)
    assert score == 30.0


def test_score_desactivation_pertinence_secteur():
    mesure = {"impact": "tres_eleve"}
    profil = {"secteur_activite": "sante", "traite_donnees_sensibles": True}
    reponses = {i: 3 for i in range(1, 10)}

    score_avec_bonus = calculer_score_priorite(5, mesure, reponses, profil, appliquer_pertinence_secteur=True)
    score_sans_bonus = calculer_score_priorite(5, mesure, reponses, profil, appliquer_pertinence_secteur=False)

    assert score_avec_bonus == 30.0
    assert score_sans_bonus == 25.0  # 5 x 2.5 x 2.0 x 1.0
    assert score_avec_bonus > score_sans_bonus


def test_score_arrondi_a_deux_decimales():
    mesure = {"impact": "eleve"}
    profil = {"secteur_activite": "services", "traite_donnees_sensibles": False}
    reponses = {1: 2, 2: 1, 3: 2}  # moyenne = 5/3, non ronde
    score = calculer_score_priorite(priorite_base=4, mesure=mesure, reponses=reponses, profil=profil)
    # vérifie juste que le résultat est bien arrondi à 2 décimales (pas de dérive flottante)
    assert round(score, 2) == score


@pytest.mark.parametrize("priorite_base", [1, 2, 3, 4, 5])
def test_score_croissant_avec_priorite_base(priorite_base):
    """Toutes choses égales par ailleurs, le score doit croître avec priorite_base."""
    mesure = {"impact": "moyen"}
    profil = {"secteur_activite": "commerce", "traite_donnees_sensibles": False}
    score = calculer_score_priorite(priorite_base, mesure, {}, profil)
    assert score == round(priorite_base * POIDS_IMPACT["moyen"], 2)


def test_score_impact_inconnu_retombe_sur_poids_neutre():
    """Un impact absent/invalide ne doit pas faire planter le calcul (poids par défaut = 1.0)."""
    mesure = {"impact": "valeur_invalide"}
    profil = {"secteur_activite": "commerce", "traite_donnees_sensibles": False}
    score = calculer_score_priorite(priorite_base=3, mesure=mesure, reponses={}, profil=profil)
    assert score == 3.0  # 3 x 1.0 x 1.0 x 1.0