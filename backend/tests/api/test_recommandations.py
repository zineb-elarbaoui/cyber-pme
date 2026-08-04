"""
Tests de base pour le router /recommandations.

"""
import uuid


def _repondre_q23_faible(client, id_pme, valeur="1"):
    """Q23 (numero) = 'Plan de continuité d'activité', <=1 déclenche les
    règles 31 (sauvegarde régulière) et 32 (fille, sauvegarde chiffrée si
    traite_donnees_sensibles=True — cf. regles_expertes.json)."""
    return client.post(f"/profil/{id_pme}/reponses", json={"reponses": [{"id_question": 23, "valeur_reponse": valeur}]})


def test_recommandations_pour_pme_inexistante_renvoie_404(client):
    id_inexistant = uuid.uuid4()
    resp = client.post(f"/recommandations/{id_inexistant}?avec_rag=false")
    assert resp.status_code == 404


def test_recommandations_declenche_regle_mere_et_fille_si_donnees_sensibles(client, profil_cree):
    """profil_cree a traite_donnees_sensibles=True (cf. conftest) — la règle
    fille 32 doit se déclencher en plus de la règle mère 31."""
    id_pme = profil_cree["id_pme"]
    _repondre_q23_faible(client, id_pme, valeur="1")

    resp = client.post(f"/recommandations/{id_pme}?avec_rag=false")
    assert resp.status_code == 200, resp.text

    data = resp.json()
    ids_regles = {r["id_regle"] for r in data["recommandations"]}
    assert 31 in ids_regles, "règle mère (sauvegarde régulière) non déclenchée"
    assert 32 in ids_regles, "règle fille (sauvegarde chiffrée, données sensibles) non déclenchée"


def test_recommandations_triees_par_score_decroissant(client, profil_cree):
    id_pme = profil_cree["id_pme"]
    _repondre_q23_faible(client, id_pme, valeur="1")

    resp = client.post(f"/recommandations/{id_pme}?avec_rag=false")
    scores = [r["score_priorite"] for r in resp.json()["recommandations"]]
    assert scores == sorted(scores, reverse=True)


def test_recommandations_sans_reponses_ne_declenche_rien(client, profil_cree):
    """Aucune réponse soumise -> aucune règle ne peut être évaluée comme
    déclenchée (cf. test d'intégration Sprint 3 équivalent, hors API)."""
    id_pme = profil_cree["id_pme"]
    resp = client.post(f"/recommandations/{id_pme}?avec_rag=false")
    assert resp.status_code == 200
    assert resp.json()["nb_recommandations"] == 0


def test_recommandations_avec_rag_false_ne_remplit_pas_justification(client, profil_cree):
    id_pme = profil_cree["id_pme"]
    _repondre_q23_faible(client, id_pme, valeur="1")

    resp = client.post(f"/recommandations/{id_pme}?avec_rag=false")
    recommandations = resp.json()["recommandations"]
    assert len(recommandations) > 0
    assert all(r["justification_rag"] is None for r in recommandations)


def test_recommandations_persistees_en_base(client, db_session, profil_cree):
    from app.models.recommandation import RecommandationGeneree

    id_pme = profil_cree["id_pme"]
    _repondre_q23_faible(client, id_pme, valeur="1")
    resp = client.post(f"/recommandations/{id_pme}?avec_rag=false")

    nb_attendu = resp.json()["nb_recommandations"]
    nb_en_base = (
        db_session.query(RecommandationGeneree)
        .filter(RecommandationGeneree.id_pme == id_pme)
        .count()
    )
    assert nb_en_base == nb_attendu