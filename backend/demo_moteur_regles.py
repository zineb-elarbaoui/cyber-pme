"""
Démo Sprint 3 : charge mesures.json + regles_expertes.json, simule deux
profils PME fictifs représentatifs, et affiche le plan d'action priorisé
généré par le moteur pour chacun.
"""

import json
import sys
sys.path.insert(0, "/home/claude/backend")

from app.engine.rule_engine import RuleEngine
from app.engine.recommender import generer_plan_action


def charger_json(path):
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


mesures = charger_json("../database/seeds/mesures.json")
regles = charger_json("../database/seeds/regles_expertes.json")

engine = RuleEngine(regles=regles, mesures=mesures)

# ---------------------------------------------------------------------------
# Profil 1 : clinique - secteur sensible, données sensibles, maturité faible
# quasi partout -> doit déclencher beaucoup de règles, y compris les
# sous-règles mère/fille (17->4, 21->23, 23->32)
# ---------------------------------------------------------------------------
profil_clinique = {
    "nom_entreprise": "Clinique Al Amal SARL",
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

reponses_clinique = {
    # Q1-Q9 contextuelles (0-3) : SI plutôt critique -> contexte à risque
    1: 2, 2: 3, 3: 2, 4: 3, 5: 1, 6: 0, 7: 2, 8: 1, 9: 2,
    # Q10-Q24 domaine (0-5) : maturité très faible sur presque tout
    10: 1,   # politique sécurité
    11: 0,   # organisation
    12: 1,   # gestion des risques
    13: 1,   # gestion des actifs
    14: 0,   # documentation
    15: 1,   # RH
    16: 1,   # sensibilisation
    17: 1,   # sécurité physique -> déclenche 3, 4 (donnees sensibles), 5
    18: 2,   # exploitation/réseaux -> ne déclenche pas (seuil <=1)
    19: 1,   # contrôle d'accès -> déclenche 13-18
    20: 1,   # acquisition/dev/maintenance
    21: 1,   # cryptographie -> déclenche 22, 23 (donnees sensibles), 24, 25
    22: 0,   # gestion incidents
    23: 1,   # PCA -> déclenche 31, 32 (donnees sensibles)
    24: 1,   # conformité légale
}

# ---------------------------------------------------------------------------
# Profil 2 : cabinet comptable - secteur non sensible, pas de données
# sensibles, maturité correcte sur la plupart des domaines -> doit déclencher
# beaucoup moins de règles, et aucune sous-règle liée à traite_donnees_sensibles
# ---------------------------------------------------------------------------
profil_cabinet = {
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

reponses_cabinet = {
    1: 1, 2: 1, 3: 1, 4: 1, 5: 0, 6: 0, 7: 1, 8: 0, 9: 0,
    10: 3, 11: 2, 12: 2, 13: 3, 14: 2, 15: 2, 16: 1,   # sensibilisation faible -> déclenche règles 45-50
    17: 3, 18: 3, 19: 3, 20: 3, 21: 3, 22: 2, 23: 2, 24: 2,
}


def afficher_plan(nom_profil, plan):
    print(f"\n{'=' * 90}\nPlan d'action priorisé — {nom_profil}\n{'=' * 90}")
    print(f"{len(plan)} recommandation(s) déclenchée(s)\n")
    for i, r in enumerate(plan, start=1):
        print(f"{i:2d}. [score={r['score_priorite']:5.2f}] (prio_base={r['priorite_base']}, "
              f"impact={r['impact']}) domaine={r['id_domaine']:2d} règle={r['id_regle']:2d} "
              f"mesure={r['id_mesure']:2d} — {r['titre_mesure']}")


plan_clinique = generer_plan_action(engine, reponses_clinique, profil_clinique)
afficher_plan(profil_clinique["nom_entreprise"], plan_clinique)

plan_cabinet = generer_plan_action(engine, reponses_cabinet, profil_cabinet)
afficher_plan(profil_cabinet["nom_entreprise"], plan_cabinet)

# ---------------------------------------------------------------------------
# Vérifications de cohérence attendues
# ---------------------------------------------------------------------------
print(f"\n{'=' * 90}\nVérifications de cohérence\n{'=' * 90}")

ids_clinique = {r["id_regle"] for r in plan_clinique}
assert 4 in ids_clinique, "Règle fille 4 (données sensibles) doit se déclencher pour la clinique"
assert 23 in ids_clinique, "Règle fille 23 (crypto + données sensibles) doit se déclencher"
assert 32 in ids_clinique, "Règle fille 32 (PCA + données sensibles) doit se déclencher"
assert 6 not in ids_clinique, "Règle 6 (Q18<=1) NE doit PAS se déclencher (Q18=2 pour la clinique)"
print("OK — règles filles liées à traite_donnees_sensibles=true déclenchées pour la clinique")
print("OK — règle 6 correctement absente (condition Q18<=1 non satisfaite)")

ids_cabinet = {r["id_regle"] for r in plan_cabinet}
assert 4 not in ids_cabinet, "Règle fille 4 ne doit PAS se déclencher (cabinet: pas de données sensibles)"
assert 23 not in ids_cabinet, "Règle fille 23 ne doit PAS se déclencher (cabinet: pas de données sensibles)"
print("OK — règles filles liées à traite_donnees_sensibles=true absentes pour le cabinet (cohérent)")

# Le score le plus élevé de la clinique doit correspondre à une mesure à impact
# tres_eleve, vu son contexte à risque + secteur sensible + données sensibles
top_clinique = plan_clinique[0]
print(f"\nTop recommandation clinique : mesure {top_clinique['id_mesure']} "
      f"(impact={top_clinique['impact']}, score={top_clinique['score_priorite']})")

print("\nTous les tests de cohérence sont passés.")