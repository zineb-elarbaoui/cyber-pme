-- =============================================================================
-- PFA N°13 — Sprint 4 : migration pour le pipeline RAG
-- À exécuter APRÈS schema_pfa13.sql (Sprint 2), sur la même base.
-- =============================================================================

-- L'extension vector est déjà créée en Sprint 2 (schema_pfa13.sql), mais on
-- s'assure qu'elle est bien là si cette migration est jouée sur une base fraîche.
CREATE EXTENSION IF NOT EXISTS "vector";

-- =============================================================================
-- GUIDE_CHUNK — passages du guide CMRPI/AUSIM, découpés et vectorisés
-- =============================================================================
-- IMPORTANT : la dimension du vecteur (768) correspond au modèle d'embeddings
-- retenu (intfloat/multilingual-e5-base). Si tu changes de modèle, adapte cette
-- dimension AVANT de créer la table (pgvector ne permet pas de la modifier après
-- coup sans DROP/recreate de la colonne).
CREATE TABLE IF NOT EXISTS guide_chunk (
    id_chunk        SERIAL PRIMARY KEY,
    section_guide   VARCHAR(30) NOT NULL,     -- ex: '3.1.2', '5.2' — numéro de section détecté
    titre_section   TEXT,                      -- titre de la section si détecté (ex: "Les virus, antivirus et firewall")
    texte           TEXT NOT NULL,             -- contenu brut du chunk
    embedding       vector(768) NOT NULL,
    ordre           INTEGER NOT NULL,          -- position du chunk dans le document source (pour retrouver le contexte)
    date_indexation TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Index pour la recherche par similarité cosinus (pertinent au volume attendu
-- pour un guide d'une centaine de pages ; ivfflat est suffisant, pas besoin de hnsw)
CREATE INDEX IF NOT EXISTS idx_guide_chunk_embedding
    ON guide_chunk USING ivfflat (embedding vector_cosine_ops)
    WITH (lists = 10);

-- Index pour filtrer rapidement par section (utilisé par le retriever pour
-- privilégier les chunks de la section_guide_precise d'une mesure)
CREATE INDEX IF NOT EXISTS idx_guide_chunk_section ON guide_chunk(section_guide);

-- =============================================================================
-- VÉRIFICATION RAPIDE
-- =============================================================================
-- SELECT section_guide, titre_section, LEFT(texte, 80) FROM guide_chunk ORDER BY ordre LIMIT 20;