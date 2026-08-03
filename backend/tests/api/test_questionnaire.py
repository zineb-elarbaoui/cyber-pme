"""
Tests de base pour le router /questionnaire (lecture seule, données statiques
de schema_pfa13.sql).
"""


def test_lire_questionnaire_renvoie_15_domaines_et_24_questions(client):
    resp = client.get("/questionnaire")
    assert resp.status_code == 200

    data = resp.json()
    assert len(data["domaines"]) == 15
    assert len(data["questions"]) == 24


def test_questions_contextuelles_q1_a_q9_sans_domaine(client):
    resp = client.get("/questionnaire")
    questions = resp.json()["questions"]

    contextuelles = [q for q in questions if q["type_question"] == "contextuelle"]
    assert len(contextuelles) == 9
    assert all(q["id_domaine"] is None for q in contextuelles)
    assert all(q["valeur_max"] == 3 for q in contextuelles)


def test_questions_domaine_q10_a_q24_ont_un_domaine(client):
    resp = client.get("/questionnaire")
    questions = resp.json()["questions"]

    questions_domaine = [q for q in questions if q["type_question"] == "domaine"]
    assert len(questions_domaine) == 15
    assert all(q["id_domaine"] is not None for q in questions_domaine)


def test_domaine_3_a_valeur_max_4_anomalie_documentee(client):
    """Cf. limite documentée (Sprint 1-2) : le domaine 3 'Gestion des risques
    SSI' n'a pas de niveau 5 dans le guide source, valeur_max fixé à 4."""
    resp = client.get("/questionnaire")
    questions = resp.json()["questions"]

    q12 = next(q for q in questions if q["numero"] == 12)
    assert q12["valeur_max"] == 4