"""
Tests de base pour le router /feedback.
"""
import uuid


def _generer_une_recommandation(client, id_pme):
    """Fait déclencher au moins une règle et retourne le premier
    id_recommandation persisté, pour tester /feedback dessus."""
    client.post(f"/profil/{id_pme}/reponses", json={"reponses": [{"id_question": 23, "valeur_reponse": "1"}]})
    resp = client.post(f"/recommandations/{id_pme}?avec_rag=false")
    return resp.json()["recommandations"][0]["id_recommandation"]


def test_creer_feedback_valide(client, profil_cree):
    id_recommandation = _generer_une_recommandation(client, profil_cree["id_pme"])

    payload = {
        "id_recommandation": id_recommandation,
        "note_pertinence": 4,
        "commentaire": "Recommandation pertinente pour notre contexte.",
        "recommandation_appliquee": True,
    }
    resp = client.post("/feedback", json=payload)
    assert resp.status_code == 201, resp.text
    assert resp.json()["note_pertinence"] == 4


def test_feedback_pour_recommandation_inexistante_renvoie_404(client):
    payload = {"id_recommandation": str(uuid.uuid4()), "note_pertinence": 3}
    resp = client.post("/feedback", json=payload)
    assert resp.status_code == 404


def test_feedback_en_double_renvoie_409(client, profil_cree):
    """UNIQUE sur id_recommandation dans la table feedback — un deuxième
    feedback sur la même recommandation doit être rejeté."""
    id_recommandation = _generer_une_recommandation(client, profil_cree["id_pme"])
    payload = {"id_recommandation": id_recommandation, "note_pertinence": 4}

    resp1 = client.post("/feedback", json=payload)
    assert resp1.status_code == 201

    resp2 = client.post("/feedback", json=payload)
    assert resp2.status_code == 409


def test_feedback_note_hors_bornes_renvoie_422(client, profil_cree):
    id_recommandation = _generer_une_recommandation(client, profil_cree["id_pme"])
    payload = {"id_recommandation": id_recommandation, "note_pertinence": 8}  # hors 1-5
    resp = client.post("/feedback", json=payload)
    assert resp.status_code == 422