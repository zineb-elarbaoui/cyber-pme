from sqlalchemy import Column, Integer, String, Text, Boolean
from sqlalchemy.dialects.postgresql import ARRAY
from sqlalchemy.orm import relationship

from app.database import Base


class Mesure(Base):
    __tablename__ = "mesure"

    id_mesure = Column(Integer, primary_key=True)
    titre = Column(String(150), nullable=False)
    description = Column(Text, nullable=False)
    cout_estime = Column(String(20), nullable=True)
    difficulte_estimee = Column(String(20), nullable=True)
    impact = Column(String(20), nullable=True)
    section_guide_precise = Column(String(60), nullable=False)
    tags = Column(ARRAY(String), nullable=True)
    estimation_non_issue_du_guide = Column(Boolean, nullable=False, default=True)

    regles = relationship("RegleExperte", back_populates="mesure")