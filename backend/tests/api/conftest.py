
import pytest
from fastapi.testclient import TestClient

from app.main import app
from app.database import SessionLocal


@pytest.fixture(scope="module")
def client():
    # scope="module" : le lifespan (chargement RuleEngine + modèle RAG) ne
    # tourne qu'une fois pour tout le fichier de test, pas à chaque fonction.
    with TestClient(app) as c:
        yield c


@pytest.fixture()
def db_session():
    """Session DB directe, pour insérer des fixtures ou vérifier l'état
    persisté sans repasser par l'API. Fermée après chaque test."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@pytest.fixture()
def payload_profil_valide():
    """Profil PME minimal valide (tous les champs requis par PmeProfilCreate),
    secteur santé + données sensibles pour déclencher les règles filles
    conditionnelles (cf. test_recommandations_endpoints.py)."""
    return {
        "nom_entreprise": "PME Test Pytest",
        "secteur_activite": "sante",
        "taille_effectif": "petite",
        "chiffre_affaires_annuel": "3_10mdh",
        "possede_service_it": False,
        "possede_responsable_securite": "non",
        "niveau_digitalisation": "moyen",
        "traite_donnees_sensibles": True,
        "historique_incident_cyber": "non",
        "budget_cybersecurite": "aucun",
        "reglementations_applicables": ["loi_09_08"],
    }


@pytest.fixture()
def profil_cree(client, db_session, payload_profil_valide):
    """Crée un profil via l'API, le retourne, et le supprime après le test
    (cascade sur reponse/recommandation_generee/feedback via ON DELETE
    CASCADE défini dans schema_pfa13.sql)."""
    resp = client.post("/profil", json=payload_profil_valide)
    assert resp.status_code == 201, resp.text
    profil = resp.json()

    yield profil

    from app.models.pme_profil import PmeProfil
    row = db_session.query(PmeProfil).filter(PmeProfil.id_pme == profil["id_pme"]).first()
    if row is not None:
        db_session.delete(row)
        db_session.commit()