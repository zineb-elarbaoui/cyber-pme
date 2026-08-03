from sqlalchemy import Column, Integer, SmallInteger, ForeignKey
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import relationship

from app.database import Base


class RegleExperte(Base):
    __tablename__ = "regle_experte"

    id_regle = Column(Integer, primary_key=True)
    id_domaine = Column(Integer, ForeignKey("domaine.id_domaine"), nullable=False)
    id_regle_parent = Column(Integer, ForeignKey("regle_experte.id_regle"), nullable=True)
    condition = Column(JSONB, nullable=False)
    id_mesure = Column(Integer, ForeignKey("mesure.id_mesure"), nullable=False)
    priorite_base = Column(SmallInteger, nullable=False)

    domaine = relationship("Domaine", back_populates="regles")
    mesure = relationship("Mesure", back_populates="regles")
    regle_parent = relationship("RegleExperte", remote_side=[id_regle])