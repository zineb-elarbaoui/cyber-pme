import uuid

from sqlalchemy import Column, SmallInteger, Text, Boolean, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.database import Base


class Feedback(Base):
    __tablename__ = "feedback"

    id_feedback = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    id_recommandation = Column(
        UUID(as_uuid=True),
        ForeignKey("recommandation_generee.id_recommandation", ondelete="CASCADE"),
        unique=True,
        nullable=False,
    )
    note_pertinence = Column(SmallInteger, nullable=False)
    commentaire = Column(Text, nullable=True)
    recommandation_appliquee = Column(Boolean, nullable=True)
    score_avant = Column(SmallInteger, nullable=True)
    score_apres = Column(SmallInteger, nullable=True)
    date_feedback = Column(DateTime(timezone=False), server_default=func.now())

    recommandation = relationship("RecommandationGeneree", back_populates="feedback")