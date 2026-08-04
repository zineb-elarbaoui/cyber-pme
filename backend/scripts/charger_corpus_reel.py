
import json
import sys
from pathlib import Path

import psycopg2
from psycopg2.extras import execute_values, Json

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))  # pour importer app.config
from app.config import settings  # noqa: E402


def charger_json(path: str):
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


def main():
    mesures = charger_json(settings.MESURES_JSON_PATH)
    regles = charger_json(settings.REGLES_JSON_PATH)

    print(f"{len(mesures)} mesures et {len(regles)} règles à charger depuis le JSON.")

    conn = psycopg2.connect(settings.DATABASE_URL)
    cur = conn.cursor()

    print("TRUNCATE recommandation_generee, feedback, regle_experte, mesure (CASCADE)...")
    cur.execute(
        "TRUNCATE TABLE feedback, recommandation_generee, regle_experte, mesure "
        "RESTART IDENTITY CASCADE;"
    )

    print("Insertion des mesures...")
    rows_mesures = [
        (
            m["id_mesure"],
            m["titre"],
            m["description"],
            m.get("cout_estime"),
            m.get("difficulte_estimee"),
            m.get("impact"),
            m["section_guide_precise"],
            m.get("tags"),
            m.get("estimation_non_issue_du_guide", True),
        )
        for m in mesures
    ]
    execute_values(
        cur,
        """
        INSERT INTO mesure
            (id_mesure, titre, description, cout_estime, difficulte_estimee,
             impact, section_guide_precise, tags, estimation_non_issue_du_guide)
        VALUES %s
        """,
        rows_mesures,
    )

    print("Insertion des règles...")
    rows_regles = [
        (
            r["id_regle"],
            r["id_domaine"],
            r.get("id_regle_parent"),
            Json(r["condition"]),
            r["id_mesure"],
            r["priorite_base"],
        )
        for r in regles
    ]
    execute_values(
        cur,
        """
        INSERT INTO regle_experte
            (id_regle, id_domaine, id_regle_parent, condition, id_mesure, priorite_base)
        VALUES %s
        """,
        rows_regles,
        template="(%s, %s, %s, %s, %s, %s)",
    )

    print("Resynchronisation des séquences SERIAL (pour les prochains INSERT sans id explicite)...")
    cur.execute("SELECT setval('mesure_id_mesure_seq', (SELECT MAX(id_mesure) FROM mesure));")
    cur.execute("SELECT setval('regle_experte_id_regle_seq', (SELECT MAX(id_regle) FROM regle_experte));")

    conn.commit()
    cur.execute("SELECT COUNT(*) FROM mesure;")
    n_mesures = cur.fetchone()[0]
    cur.execute("SELECT COUNT(*) FROM regle_experte;")
    n_regles = cur.fetchone()[0]
    cur.close()
    conn.close()

    print(f"OK — {n_mesures} mesures et {n_regles} règles en base.")


if __name__ == "__main__":
    main()