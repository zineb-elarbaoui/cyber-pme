"""
ATTENTION : table absente de schema_pfa13.sql — à ajouter avant de lancer l'API :

    CREATE TABLE guide_chunk (
        id_chunk        SERIAL PRIMARY KEY,
        section_guide   VARCHAR(20) NOT NULL,
        titre_section   VARCHAR(200),
        texte           TEXT NOT NULL,
        embedding       vector(768) NOT NULL,
        ordre           INTEGER NOT NULL
    );
    CREATE INDEX idx_guide_chunk_section ON guide_chunk(section_guide);

Nécessite : pip install pgvector --break-system-packages
"""
from pgvector.sqlalchemy import Vector
from sqlalchemy import Column, Integer, String, Text

from app.database import Base


class GuideChunk(Base):
    __tablename__ = "guide_chunk"

    id_chunk = Column(Integer, primary_key=True)
    section_guide = Column(String(20), nullable=False)
    titre_section = Column(String(200), nullable=True)
    texte = Column(Text, nullable=False)
    embedding = Column(Vector(768), nullable=False)
    ordre = Column(Integer, nullable=False)