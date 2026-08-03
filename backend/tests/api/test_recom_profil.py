"""
Sprint 5 — Scénarios de profils PME contrastés, en complément de
test_recommandations.py (qui couvre un seul profil : santé + données
sensibles). Reprend l'esprit du rapport Sprint 3 (6 profils fictifs
contrastés testés sur le moteur seul) mais via l'API bout en bout.

Couvre la formulation exacte du livrable attendu :
"Résultats de tests (Postman/pytest) sur 3-4 scénarios de profils différents"
"""
import pytest


@pytest.fixture()
def profil_sans_donnees_sensibles(client, db_session):
    """Secteur non sensible, traite_donnees_sensibles=False — doit déclencher
    la règle mère (31) mais PAS la règle fille (32, conditionnée par
    traite_donnees_sensibles=true)."""
    payload = {
        "nom_entreprise": "Commerce Test Sans Donnees Sensibles",
        "secteur_activite": "commerce",
        "taille_effectif": "tpe",
        "chiffre_affaires_annuel": "moins_3mdh",
        "possede_service_it": False,
        "possede_responsable_securite": "non",
        "niveau_digitalisation": "faible",
        "traite_donnees_sensibles": False,
        "historique_incident_cyber": "non",
        "budget_cybersecurite": "aucun",
        "reglementations_applicables": [],
    }
    resp = client.post("/profil", json=payload)
    assert resp.status_code == 201, resp.text
    profil = resp.json()

    yield profil

    from app.models.pme_profil import PmeProfil
    row = db_session.query(PmeProfil).filter(PmeProfil.id_pme == profil["id_pme"]).first()
    if row is not None:
        db_session.delete(row)
        db_session.commit()


@pytest.fixture()
def profil_rgpd(client, db_session):
    """Secteur tech, RGPD explicitement applicable — doit déclencher la
    règle conditionnelle 51 (seule règle du corpus testant l'appartenance à
    reglementations_applicables plutôt qu'un champ booléen)."""
    payload = {
        "nom_entreprise": "Startup Tech Test RGPD",
        "secteur_activite": "tech_digital",
        "taille_effectif": "moyenne",
        "chiffre_affaires_annuel": "plus_50mdh",
        "possede_service_it": True,
        "possede_responsable_securite": "oui",
        "niveau_digitalisation": "eleve",
        "traite_donnees_sensibles": True,
        "historique_incident_cyber": "non",
        "budget_cybersecurite": "modere",
        "reglementations_applicables": ["rgpd"],
    }
    resp = client.post("/profil", json=payload)
    assert resp.status_code == 201, resp.text
    profil = resp.json()

    yield profil

    from app.models.pme_profil import PmeProfil
    row = db_session.query(PmeProfil).filter(PmeProfil.id_pme == profil["id_pme"]).first()
    if row is not None:
        db_session.delete(row)
        db_session.commit()


@pytest.fixture()
def profil_mature(client, db_session):
    """Profil finance, mais avec des réponses de haute maturité (5/5) sur
    plusieurs domaines — contrairement à test_recommandations_sans_reponses_
    ne_declenche_rien (qui teste l'ABSENCE de réponse), ce profil RÉPOND
    et démontre que bien répondre supprime aussi les déclenchements."""
    payload = {
        "nom_entreprise": "Assurance Test Profil Mature",
        "secteur_activite": "finance_assurance",
        "taille_effectif": "moyenne",
        "chiffre_affaires_annuel": "plus_50mdh",
        "possede_service_it": True,
        "possede_responsable_securite": "oui",
        "niveau_digitalisation": "eleve",
        "traite_donnees_sensibles": True,
        "historique_incident_cyber": "non",
        "budget_cybersecurite": "structure",
        "reglementations_applicables": [],
    }
    resp = client.post("/profil", json=payload)
    assert resp.status_code == 201, resp.text
    profil = resp.json()

    yield profil

    from app.models.pme_profil import PmeProfil
    row = db_session.query(PmeProfil).filter(PmeProfil.id_pme == profil["id_pme"]).first()
    if row is not None:
        db_session.delete(row)
        db_session.commit()


# --- Profil B : sans données sensibles -------------------------------------

def test_profil_sans_donnees_sensibles_declenche_regle_mere_seule(client, profil_sans_donnees_sensibles):
    id_pme = profil_sans_donnees_sensibles["id_pme"]
    client.post(f"/profil/{id_pme}/reponses", json={"reponses": [{"id_question": 23, "valeur_reponse": "1"}]})

    resp = client.post(f"/recommandations/{id_pme}?avec_rag=false")
    assert resp.status_code == 200, resp.text

    ids_regles = {r["id_regle"] for r in resp.json()["recommandations"]}
    assert 31 in ids_regles, "règle mère (sauvegarde régulière) doit se déclencher indépendamment du secteur"
    assert 32 not in ids_regles, "règle fille (données sensibles) ne doit PAS se déclencher ici"


# --- Profil C : RGPD applicable ---------------------------------------------

def test_profil_rgpd_declenche_regle_conditionnelle_51(client, profil_rgpd):
    id_pme = profil_rgpd["id_pme"]
    client.post(f"/profil/{id_pme}/reponses", json={"reponses": [{"id_question": 24, "valeur_reponse": "1"}]})

    resp = client.post(f"/recommandations/{id_pme}?avec_rag=false")
    assert resp.status_code == 200, resp.text

    ids_regles = {r["id_regle"] for r in resp.json()["recommandations"]}
    assert 51 in ids_regles, "règle conditionnelle RGPD doit se déclencher (reglementations_applicables contient 'rgpd')"
    assert 52 in ids_regles
    assert 53 in ids_regles


def test_profil_sans_rgpd_ne_declenche_pas_regle_51(client, profil_mature):
    """Contre-exemple direct : même question faible (Q24), mais
    reglementations_applicables=[] -> pas de règle 51."""
    id_pme = profil_mature["id_pme"]
    client.post(f"/profil/{id_pme}/reponses", json={"reponses": [{"id_question": 24, "valeur_reponse": "1"}]})

    resp = client.post(f"/recommandations/{id_pme}?avec_rag=false")
    ids_regles = {r["id_regle"] for r in resp.json()["recommandations"]}
    assert 51 not in ids_regles
    # 52/53 ne dépendent pas du RGPD, elles doivent quand même se déclencher sur Q24 faible
    assert 52 in ids_regles
    assert 53 in ids_regles


# --- Profil D : maturité élevée, aucune règle déclenchée --------------------

def test_profil_mature_avec_reponses_hautes_ne_declenche_rien(client, profil_mature):
    id_pme = profil_mature["id_pme"]
    reponses_hautes = [{"id_question": q, "valeur_reponse": "5"} for q in [10, 11, 13, 15, 16, 17, 18, 19, 20, 21, 22, 23]]
    reponses_hautes.append({"id_question": 12, "valeur_reponse": "4"})  # valeur_max=4 pour cette question (anomalie documentée)
    client.post(f"/profil/{id_pme}/reponses", json={"reponses": reponses_hautes})

    resp = client.post(f"/recommandations/{id_pme}?avec_rag=false")
    assert resp.status_code == 200, resp.text
    assert resp.json()["nb_recommandations"] == 0, (
        "un profil qui répond avec une maturité élevée partout ne doit déclencher "
        "aucune règle (toutes les conditions du corpus sont des seuils <=1)"
    )