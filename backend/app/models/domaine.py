from sqlalchemy import Column, Integer, SmallInteger, String, Text
from sqlalchemy.orm import relationship

from app.database import Base


class Domaine(Base):
    __tablename__ = "domaine"

    id_domaine = Column(Integer, primary_key=True)
    numero = Column(SmallInteger, unique=True, nullable=False)
    nom_domaine = Column(String(150), nullable=False)
    section_guide = Column(String(150), nullable=False)
    remarque = Column(Text, nullable=True)

    questions = relationship("Question", back_populates="domaine")
    regles = relationship("RegleExperte", back_populates="domaine")