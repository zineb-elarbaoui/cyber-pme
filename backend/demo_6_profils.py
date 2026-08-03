

import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))  # pour `from app.engine...` en exécution directe

from app.engine.rule_engine import RuleEngine
from app.engine.recommender import generer_plan_action


def charger_json(path):
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


def trouver_dossier_seeds():
    """Cherche database/seeds/ dans les emplacements plausibles du repo."""
    ici = Path(__file__).resolve().parent  # backend/
    candidats = [
        ici.parent / "database" / "seeds",  # cyber-pme/database/seeds/
        ici / "database" / "seeds",          # variante si database/ est sous backend/
        Path("/mnt/project"),                # environnement de dev Claude
    ]
    for c in candidats:
        if (c / "mesures.json").exists():
            return c
    raise FileNotFoundError(
        "mesures.json / regles_expertes.json introuvables. "
        "Placez-les dans database/seeds/ à la racine du repo (sibling de backend/)."
    )


seeds_dir = trouver_dossier_seeds()
mesures = charger_json(seeds_dir / "mesures.json")
regles = charger_json(seeds_dir / "regles_expertes.json")
engine = RuleEngine(regles=regles, mesures=mesures)


# =============================================================================
# PROFIL 1 — Clinique Santé Nord
# Secteur sensible, données de santé, budget nul, maturité faible partout.
# Cas le plus critique en volume ET en score (impact tres_eleve + secteur
# sensible + contexte à risque se cumulent).
# =============================================================================
profil_1 = {
    "nom_entreprise": "Clinique Santé Nord",
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
reponses_1 = {
    1: 2, 2: 3, 3: 2, 4: 3, 5: 1, 6: 0, 7: 2, 8: 1, 9: 2,
    10: 1, 11: 0, 12: 1, 13: 1, 14: 0, 15: 1, 16: 1, 17: 1,
    18: 2, 19: 1, 20: 1, 21: 1, 22: 0, 23: 1, 24: 1,
}

# =============================================================================
# PROFIL 2 — Cabinet Compta Rif
# Secteur non sensible, pas de données sensibles, maturité globalement
# correcte SAUF sensibilisation du personnel. Doit déclencher très peu de
# règles, toutes concentrées sur le domaine 7.
# =============================================================================
profil_2 = {
    "nom_entreprise": "Cabinet Compta Rif",
    "secteur_activite": "services",
    "taille_effectif": "tpe",
    "chiffre_affaires_annuel": "moins_3mdh",
    "possede_service_it": True,
    "possede_responsable_securite": "externalise",
    "niveau_digitalisation": "faible",
    "traite_donnees_sensibles": False,
    "historique_incident_cyber": "ne_sait_pas",
    "budget_cybersecurite": "faible",
    "reglementations_applicables": ["loi_09_08"],
}
reponses_2 = {
    1: 1, 2: 1, 3: 1, 4: 1, 5: 0, 6: 0, 7: 1, 8: 0, 9: 0,
    10: 3, 11: 2, 12: 2, 13: 3, 14: 2, 15: 2, 16: 1, 17: 3,
    18: 3, 19: 3, 20: 3, 21: 3, 22: 2, 23: 2, 24: 2,
}

# =============================================================================
# PROFIL 3 — Usine Textile Atlas
# Secteur industriel, pas de données sensibles. Bonne sécurité physique
# (logique dans une usine), mais lacunes en contrôle d'accès logique,
# cryptographie et gestion des incidents. Teste un profil "à trous ciblés"
# plutôt qu'uniformément faible.
# =============================================================================
profil_3 = {
    "nom_entreprise": "Usine Textile Atlas",
    "secteur_activite": "industrie",
    "taille_effectif": "moyenne",
    "chiffre_affaires_annuel": "10_50mdh",
    "possede_service_it": True,
    "possede_responsable_securite": "oui",
    "niveau_digitalisation": "moyen",
    "traite_donnees_sensibles": False,
    "historique_incident_cyber": "non",
    "budget_cybersecurite": "modere",
    "reglementations_applicables": [],
}
reponses_3 = {
    1: 1, 2: 1, 3: 1, 4: 1, 5: 1, 6: 0, 7: 1, 8: 1, 9: 1,
    10: 2, 11: 2, 12: 2, 13: 2, 14: 1, 15: 2, 16: 2, 17: 4,
    18: 2, 19: 1, 20: 2, 21: 0, 22: 1, 23: 2, 24: 3,
}

# =============================================================================
# PROFIL 4 — Startup FinTech Wave
# Secteur tech, forte digitalisation, données sensibles, RGPD applicable
# (clients européens), ET un incident déjà survenu. Malgré un budget
# structuré, lacunes en cryptographie et gestion des incidents : teste le
# cas d'une entreprise "tech-savvy" mais avec des angles morts précis.
# =============================================================================
profil_4 = {
    "nom_entreprise": "Startup FinTech Wave",
    "secteur_activite": "tech_digital",
    "taille_effectif": "tpe",
    "chiffre_affaires_annuel": "moins_3mdh",
    "possede_service_it": True,
    "possede_responsable_securite": "oui",
    "niveau_digitalisation": "eleve",
    "traite_donnees_sensibles": True,
    "historique_incident_cyber": "oui",
    "budget_cybersecurite": "structure",
    "reglementations_applicables": ["loi_09_08", "rgpd"],
}
reponses_4 = {
    1: 3, 2: 3, 3: 2, 4: 2, 5: 2, 6: 3, 7: 3, 8: 3, 9: 1,
    10: 3, 11: 3, 12: 2, 13: 3, 14: 2, 15: 3, 16: 3, 17: 2,
    18: 3, 19: 3, 20: 3, 21: 1, 22: 1, 23: 3, 24: 1,
}

# =============================================================================
# PROFIL 5 — Boutique Multimode
# Secteur non sensible, aucune donnée sensible, quasi-absence totale de
# cybersécurité. Pire cas en VOLUME de règles déclenchées (presque toutes
# les règles indépendantes), mais sans aucune règle fille (pas de données
# sensibles) -> teste la largeur du corpus sans sa profondeur.
# =============================================================================
profil_5 = {
    "nom_entreprise": "Boutique Multimode",
    "secteur_activite": "commerce",
    "taille_effectif": "petite",
    "chiffre_affaires_annuel": "moins_3mdh",
    "possede_service_it": False,
    "possede_responsable_securite": "non",
    "niveau_digitalisation": "faible",
    "traite_donnees_sensibles": False,
    "historique_incident_cyber": "ne_sait_pas",
    "budget_cybersecurite": "aucun",
    "reglementations_applicables": [],
}
reponses_5 = {
    1: 0, 2: 1, 3: 1, 4: 1, 5: 0, 6: 0, 7: 0, 8: 0, 9: 1,
    10: 0, 11: 0, 12: 0, 13: 0, 14: 0, 15: 0, 16: 0, 17: 0,
    18: 0, 19: 0, 20: 0, 21: 0, 22: 0, 23: 0, 24: 0,
}

# =============================================================================
# PROFIL 6 — Assurance Maghreb
# Secteur financier sensible, données sensibles, RGPD applicable, budget
# structuré, entreprise globalement mature avec seulement 2-3 lacunes
# ciblées (sensibilisation, cryptographie, conformité RGPD). Teste que le
# moteur reste PRÉCIS sur une entreprise mature -- peu de règles, mais
# scores élevés sur celles qui restent pertinentes.
# =============================================================================
profil_6 = {
    "nom_entreprise": "Assurance Maghreb",
    "secteur_activite": "finance_assurance",
    "taille_effectif": "moyenne",
    "chiffre_affaires_annuel": "plus_50mdh",
    "possede_service_it": True,
    "possede_responsable_securite": "oui",
    "niveau_digitalisation": "eleve",
    "traite_donnees_sensibles": True,
    "historique_incident_cyber": "ne_sait_pas",
    "budget_cybersecurite": "structure",
    "reglementations_applicables": ["loi_09_08", "rgpd"],
}
reponses_6 = {
    1: 3, 2: 3, 3: 3, 4: 3, 5: 2, 6: 2, 7: 2, 8: 2, 9: 1,
    10: 4, 11: 4, 12: 3, 13: 4, 14: 3, 15: 4, 16: 1, 17: 5,
    18: 4, 19: 4, 20: 4, 21: 1, 22: 4, 23: 4, 24: 1,
}


PROFILS = [
    (profil_1, reponses_1),
    (profil_2, reponses_2),
    (profil_3, reponses_3),
    (profil_4, reponses_4),
    (profil_5, reponses_5),
    (profil_6, reponses_6),
]


def afficher_resume(profil, plan):
    print(f"\n{'=' * 95}")
    print(f"{profil['nom_entreprise']}  —  {profil['secteur_activite']} / {profil['taille_effectif']} "
          f"/ budget={profil['budget_cybersecurite']} / données sensibles={profil['traite_donnees_sensibles']}")
    print(f"{'=' * 95}")
    print(f"{len(plan)} recommandation(s) déclenchée(s)")
    if not plan:
        print("Aucune recommandation.")
        return
    print("\nTop 5 par score :")
    for i, r in enumerate(plan[:5], start=1):
        print(f"  {i}. [score={r['score_priorite']:6.2f}] domaine={r['id_domaine']:2d} "
              f"règle={r['id_regle']:2d} — {r['titre_mesure']}")


resultats_globaux = []
for profil, reponses in PROFILS:
    plan = generer_plan_action(engine, reponses, profil)
    afficher_resume(profil, plan)
    resultats_globaux.append((profil["nom_entreprise"], len(plan),
                               plan[0]["score_priorite"] if plan else 0.0))

print(f"\n{'=' * 95}\nTableau récapitulatif\n{'=' * 95}")
print(f"{'Entreprise':<25} {'Nb recommandations':<22} {'Score max'}")
for nom, nb, score_max in resultats_globaux:
    print(f"{nom:<25} {nb:<22} {score_max}")