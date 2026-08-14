
import argparse
import sys

from sqlalchemy import text as sql_text

from app.database import SessionLocal

# Marqueurs typiques du mojibake UTF-8 interprété comme Latin-1/CP1252.
MOJIBAKE_MARKERS = ["Ã", "â€", "Å"]


def est_corrompu(valeur: str | None) -> bool:
    if not valeur:
        return False
    return any(marqueur in valeur for marqueur in MOJIBAKE_MARKERS)


def reparer(valeur: str) -> str | None:
    """Inverse un double encodage UTF-8 -> Latin-1 -> UTF-8."""
    try:
        return valeur.encode("latin1").decode("utf-8")
    except (UnicodeDecodeError, UnicodeEncodeError):
        return None  # ne correspond pas au schéma de corruption attendu, on laisse tel quel


def reparer_texte(valeur: str | None) -> tuple[str | None, bool]:
    if not est_corrompu(valeur):
        return valeur, False
    corrige = reparer(valeur)
    if corrige is None or corrige == valeur:
        return valeur, False
    return corrige, True


def reparer_options_jsonb(options: list | None) -> tuple[list | None, bool]:
    """Le champ `options` de `question` est une liste de {"valeur": int, "libelle": str}."""
    if not options:
        return options, False
    changed = False
    nouvelles_options = []
    for opt in options:
        libelle = opt.get("libelle")
        nouveau_libelle, ok = reparer_texte(libelle)
        if ok:
            changed = True
        nouvelles_options.append({**opt, "libelle": nouveau_libelle})
    return nouvelles_options, changed


def main(apply: bool):
    db = SessionLocal()
    total_changes = 0

    try:
        # --- domaine ---------------------------------------------------
        rows = db.execute(sql_text("SELECT id_domaine, nom_domaine, section_guide, remarque FROM domaine")).fetchall()
        for r in rows:
            nom, c1 = reparer_texte(r.nom_domaine)
            section, c2 = reparer_texte(r.section_guide)
            remarque, c3 = reparer_texte(r.remarque)
            if c1 or c2 or c3:
                total_changes += 1
                print(f"[domaine #{r.id_domaine}] '{r.nom_domaine}' -> '{nom}'")
                if apply:
                    db.execute(
                        sql_text(
                            "UPDATE domaine SET nom_domaine=:nom, section_guide=:section, remarque=:remarque "
                            "WHERE id_domaine=:id"
                        ),
                        {"nom": nom, "section": section, "remarque": remarque, "id": r.id_domaine},
                    )

        # --- question (intitule + options JSONB) ------------------------
        rows = db.execute(sql_text("SELECT id_question, intitule, options FROM question")).fetchall()
        for r in rows:
            intitule, c1 = reparer_texte(r.intitule)
            options, c2 = reparer_options_jsonb(r.options)
            if c1 or c2:
                total_changes += 1
                print(f"[question #{r.id_question}] '{r.intitule}' -> '{intitule}'")
                if apply:
                    db.execute(
                        sql_text("UPDATE question SET intitule=:intitule, options=:options WHERE id_question=:id"),
                        {"intitule": intitule, "options": __import__("json").dumps(options), "id": r.id_question},
                    )

        # --- mesure (au cas où, si peuplée via un import concerné) ------
        rows = db.execute(sql_text("SELECT id_mesure, titre, description, section_guide_precise FROM mesure")).fetchall()
        for r in rows:
            titre, c1 = reparer_texte(r.titre)
            description, c2 = reparer_texte(r.description)
            section, c3 = reparer_texte(r.section_guide_precise)
            if c1 or c2 or c3:
                total_changes += 1
                print(f"[mesure #{r.id_mesure}] '{r.titre}' -> '{titre}'")
                if apply:
                    db.execute(
                        sql_text(
                            "UPDATE mesure SET titre=:titre, description=:description, "
                            "section_guide_precise=:section WHERE id_mesure=:id"
                        ),
                        {"titre": titre, "description": description, "section": section, "id": r.id_mesure},
                    )

        if apply:
            db.commit()
            print(f"\n✅ {total_changes} ligne(s) corrigée(s) et validée(s) en base.")
        else:
            db.rollback()
            print(f"\n👀 Aperçu : {total_changes} ligne(s) seraient corrigées.")
            print("Relance avec --apply pour écrire les changements.")

    finally:
        db.close()


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--apply", action="store_true", help="Applique réellement les corrections (sinon dry-run)")
    args = parser.parse_args()
    main(apply=args.apply)