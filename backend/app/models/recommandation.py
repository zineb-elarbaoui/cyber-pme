import uuid

from sqlalchemy import Column, Numeric, Text, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.database import Base


class RecommandationGeneree(Base):
    __tablename__ = "recommandation_generee"

    id_recommandation = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    id_pme = Column(UUID(as_uuid=True), ForeignKey("pme_profil.id_pme", ondelete="CASCADE"), nullable=False)
    id_regle = Column(ForeignKey("regle_experte.id_regle"), nullable=False)
    score_priorite = Column(Numeric(5, 2), nullable=False)
    justification_rag = Column(Text, nullable=True)
    date_generation = Column(DateTime(timezone=False), server_default=func.now())

    pme = relationship("PmeProfil", back_populates="recommandations")
    regle = relationship("RegleExperte")
    feedback = relationship(
        "Feedback", back_populates="recommandation", uselist=False, cascade="all, delete-orphan"
    )