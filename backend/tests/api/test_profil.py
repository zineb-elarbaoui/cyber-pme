"""
Tests de base pour le router /profil.
"""
import uuid


def test_creer_profil_renvoie_201_et_id_pme(profil_cree):
    assert "id_pme" in profil_cree
    assert profil_cree["nom_entreprise"] == "PME Test Pytest"
    assert profil_cree["secteur_activite"] == "sante"


def test_lire_profil_existant(client, profil_cree):
    resp = client.get(f"/profil/{profil_cree['id_pme']}")
    assert resp.status_code == 200
    assert resp.json()["id_pme"] == profil_cree["id_pme"]


def test_lire_profil_inexistant_renvoie_404(client):
    id_inexistant = uuid.uuid4()
    resp = client.get(f"/profil/{id_inexistant}")
    assert resp.status_code == 404


def test_creer_profil_avec_secteur_invalide_renvoie_422(client, payload_profil_valide):
    payload = {**payload_profil_valide, "secteur_activite": "secteur_qui_nexiste_pas"}
    resp = client.post("/profil", json=payload)
    assert resp.status_code == 422  # rejeté par l'enum Pydantic avant d'atteindre la DB


def test_soumettre_puis_lire_reponses(client, profil_cree):
    id_pme = profil_cree["id_pme"]
    payload = {"reponses": [{"id_question": 23, "valeur_reponse": "1"}]}

    resp_post = client.post(f"/profil/{id_pme}/reponses", json=payload)
    assert resp_post.status_code == 201, resp_post.text
    assert len(resp_post.json()) == 1
    assert resp_post.json()[0]["valeur_reponse"] == "1"

    resp_get = client.get(f"/profil/{id_pme}/reponses")
    assert resp_get.status_code == 200
    assert len(resp_get.json()) == 1


def test_soumettre_reponses_pour_pme_inexistante_renvoie_404(client):
    id_inexistant = uuid.uuid4()
    payload = {"reponses": [{"id_question": 23, "valeur_reponse": "1"}]}
    resp = client.post(f"/profil/{id_inexistant}/reponses", json=payload)
    assert resp.status_code == 404


def test_soumettre_deux_fois_meme_question_fait_un_upsert(client, profil_cree):
    """Une PME répond une fois par question (UNIQUE id_pme+id_question côté
    schéma) — la deuxième soumission doit mettre à jour, pas dupliquer."""
    id_pme = profil_cree["id_pme"]
    client.post(f"/profil/{id_pme}/reponses", json={"reponses": [{"id_question": 23, "valeur_reponse": "1"}]})
    client.post(f"/profil/{id_pme}/reponses", json={"reponses": [{"id_question": 23, "valeur_reponse": "3"}]})

    resp = client.get(f"/profil/{id_pme}/reponses")
    reponses = resp.json()
    assert len(reponses) == 1
    assert reponses[0]["valeur_reponse"] == "3"