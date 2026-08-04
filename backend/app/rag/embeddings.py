import argparse
import json
import sys

MODEL_NAME = "intfloat/multilingual-e5-base"
BATCH_SIZE = 32


def load_model():
    try:
        from sentence_transformers import SentenceTransformer
    except ImportError:
        sys.exit(
            "sentence-transformers n'est pas installé. Lance : "
            "pip install sentence-transformers --break-system-packages"
        )
    print(f"Chargement du modèle {MODEL_NAME} (premier lancement = téléchargement, peut prendre quelques minutes)...")
    return SentenceTransformer(MODEL_NAME)


def embed_chunks(model, chunks):
    # préfixe "passage: " requis par les modèles E5 pour le texte indexé
    texts = [f"passage: {c['texte']}" for c in chunks]
    embeddings = model.encode(
        texts,
        batch_size=BATCH_SIZE,
        show_progress_bar=True,
        normalize_embeddings=True,  # nécessaire pour une similarité cosinus cohérente
    )
    return embeddings


def insert_into_db(chunks, embeddings, db_url):
    try:
        import psycopg2
        from psycopg2.extras import execute_values
    except ImportError:
        sys.exit(
            "psycopg2 n'est pas installé. Lance : pip install psycopg2-binary --break-system-packages"
        )

    conn = psycopg2.connect(db_url)
    cur = conn.cursor()

    # on repart d'une table propre à chaque réindexation complète du guide
    cur.execute("TRUNCATE TABLE guide_chunk RESTART IDENTITY;")

    rows = [
        (c["numero"], c["titre"], c["texte"], embeddings[i].tolist(), c["ordre"])
        for i, c in enumerate(chunks)
    ]

    execute_values(
        cur,
        """
        INSERT INTO guide_chunk (section_guide, titre_section, texte, embedding, ordre)
        VALUES %s
        """,
        rows,
        template="(%s, %s, %s, %s::vector, %s)",
    )

    conn.commit()
    cur.close()
    conn.close()
    print(f"{len(rows)} chunks insérés dans guide_chunk.")


def main():
    parser = argparse.ArgumentParser(description="Vectorisation du guide CMRPI/AUSIM dans pgvector")
    parser.add_argument("chunks_path", type=str, help="Fichier chunks.json produit par chunking.py")
    parser.add_argument(
        "--db-url",
        type=str,
        required=True,
        help="URL de connexion PostgreSQL, ex: postgresql://user:pass@localhost:5432/pfa13_db",
    )
    args = parser.parse_args()

    with open(args.chunks_path, "r", encoding="utf-8") as f:
        chunks = json.load(f)

    if not chunks:
        sys.exit("chunks.json est vide — relance chunking.py d'abord.")

    model = load_model()
    embeddings = embed_chunks(model, chunks)
    insert_into_db(chunks, embeddings, args.db_url)


if __name__ == "__main__":
    main()