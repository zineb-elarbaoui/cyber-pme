import uuid

from sqlalchemy import Column, String, DateTime, ForeignKey, UniqueConstraint
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.database import Base


class Reponse(Base):
    __tablename__ = "reponse"
    __table_args__ = (UniqueConstraint("id_pme", "id_question", name="uq_pme_question"),)

    id_reponse = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    id_pme = Column(UUID(as_uuid=True), ForeignKey("pme_profil.id_pme", ondelete="CASCADE"), nullable=False)
    id_question = Column(ForeignKey("question.id_question"), nullable=False)
    valeur_reponse = Column(String(50), nullable=False)
    date_reponse = Column(DateTime(timezone=False), server_default=func.now())

    pme = relationship("PmeProfil", back_populates="reponses")
    question = relationship("Question", back_populates="reponses")