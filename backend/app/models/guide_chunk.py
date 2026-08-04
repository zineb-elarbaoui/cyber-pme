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