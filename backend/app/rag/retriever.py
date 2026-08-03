"""
PFA N°13 — Sprint 4 — retriever.py

Étant donné une mesure/règle (avec sa section_guide_precise) et/ou une requête
en texte libre, retrouve les passages du guide les plus pertinents dans
guide_chunk (pgvector), pour servir de contexte au LLM de justification.

Stratégie de récupération (cf. rapport Sprint 3, logique de traçabilité) :
  1. Priorité aux chunks dont section_guide correspond exactement ou est un
     préfixe de la section_guide_precise de la mesure (ex: mesure en '3.1.2'
     -> chunk en '3.1.2' ou '3.1').
  2. Complément par similarité sémantique (recherche vectorielle) sur la
     description de la mesure, pour couvrir les cas où le guide n'a pas de
     section dédiée (cf. domaines 4/12 rattachés par proximité thématique)
     ou pour enrichir le contexte au-delà de la seule section exacte.

Usage (exemple autonome, hors intégration avec recommender.py) :
    python retriever.py --db-url postgresql://... \
        --section 3.5.1 \
        --texte "Mettre en place une procédure de sauvegarde régulière et testée"
"""

import argparse
import sys

MODEL_NAME = "intfloat/multilingual-e5-base"
TOP_K_SEMANTIQUE = 3
TOP_K_SECTION = 3


def load_model():
    try:
        from sentence_transformers import SentenceTransformer
    except ImportError:
        sys.exit(
            "sentence-transformers n'est pas installé. Lance : "
            "pip install sentence-transformers --break-system-packages"
        )
    return SentenceTransformer(MODEL_NAME)


def embed_query(model, texte: str):
    # préfixe "query: " requis par les modèles E5 côté requête (différent de "passage: ")
    vec = model.encode([f"query: {texte}"], normalize_embeddings=True)[0]
    return vec.tolist()


def get_connection(db_url: str):
    import psycopg2

    return psycopg2.connect(db_url)


def retrieve_by_section(conn, section_guide_precise: str, top_k: int = TOP_K_SECTION):
    """
    Récupère les chunks dont section_guide correspond exactement ou est un
    préfixe hiérarchique de section_guide_precise (ex: '3.1' matche '3.1.2').
    """
    cur = conn.cursor()
    cur.execute(
        """
        SELECT id_chunk, section_guide, titre_section, texte
        FROM guide_chunk
        WHERE %s LIKE section_guide || '%%'
           OR section_guide LIKE %s || '%%'
        ORDER BY LENGTH(section_guide) DESC
        LIMIT %s
        """,
        (section_guide_precise, section_guide_precise, top_k),
    )
    rows = cur.fetchall()
    cur.close()
    return [
        {"id_chunk": r[0], "section_guide": r[1], "titre_section": r[2], "texte": r[3], "source": "section"}
        for r in rows
    ]


def retrieve_by_similarity(conn, model, texte_requete: str, top_k: int = TOP_K_SEMANTIQUE, exclude_ids=None):
    exclude_ids = exclude_ids or []
    query_vec = embed_query(model, texte_requete)

    cur = conn.cursor()
    if exclude_ids:
        cur.execute(
            """
            SELECT id_chunk, section_guide, titre_section, texte,
                   1 - (embedding <=> %s::vector) AS similarite
            FROM guide_chunk
            WHERE id_chunk != ALL(%s)
            ORDER BY embedding <=> %s::vector
            LIMIT %s
            """,
            (query_vec, exclude_ids, query_vec, top_k),
        )
    else:
        cur.execute(
            """
            SELECT id_chunk, section_guide, titre_section, texte,
                   1 - (embedding <=> %s::vector) AS similarite
            FROM guide_chunk
            ORDER BY embedding <=> %s::vector
            LIMIT %s
            """,
            (query_vec, query_vec, top_k),
        )
    rows = cur.fetchall()
    cur.close()
    return [
        {
            "id_chunk": r[0],
            "section_guide": r[1],
            "titre_section": r[2],
            "texte": r[3],
            "similarite": round(float(r[4]), 3),
            "source": "semantique",
        }
        for r in rows
    ]


def retrieve_context(conn, model, section_guide_precise: str, texte_mesure: str):
    """
    Point d'entrée principal : combine section exacte + complément sémantique.
    Retourne une liste de chunks dédupliquée, prête à être injectée dans le
    prompt du LLM (justification_generator.py).
    """
    chunks_section = retrieve_by_section(conn, section_guide_precise)
    ids_deja_trouves = [c["id_chunk"] for c in chunks_section]

    chunks_semantiques = retrieve_by_similarity(
        conn, model, texte_mesure, exclude_ids=ids_deja_trouves
    )

    return chunks_section + chunks_semantiques


def main():
    parser = argparse.ArgumentParser(description="Test manuel du retriever RAG")
    parser.add_argument("--db-url", type=str, required=True)
    parser.add_argument("--section", type=str, required=True, help="section_guide_precise de la mesure")
    parser.add_argument("--texte", type=str, required=True, help="description de la mesure")
    args = parser.parse_args()

    model = load_model()
    conn = get_connection(args.db_url)
    resultats = retrieve_context(conn, model, args.section, args.texte)
    conn.close()

    for r in resultats:
        print(f"[{r['source']}] section {r['section_guide']} — {r.get('titre_section') or ''}")
        print(f"  {r['texte'][:200]}...")
        print()


if __name__ == "__main__":
    main()