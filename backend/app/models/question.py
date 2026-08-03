from sqlalchemy import Column, Integer, SmallInteger, String, Text, ForeignKey
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import relationship

from app.database import Base


class Question(Base):
    __tablename__ = "question"

    id_question = Column(Integer, primary_key=True)
    numero = Column(SmallInteger, unique=True, nullable=False)
    type_question = Column(String(20), nullable=False)
    id_domaine = Column(Integer, ForeignKey("domaine.id_domaine"), nullable=True)
    intitule = Column(Text, nullable=False)
    type_reponse = Column(String(20), nullable=False, default="echelle")
    valeur_max = Column(SmallInteger, nullable=False)
    options = Column(JSONB, nullable=True)

    domaine = relationship("Domaine", back_populates="questions")
    reponses = relationship("Reponse", back_populates="question")