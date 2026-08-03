"""
Sprint 5 — Schémas Pydantic pour /feedback.
"""
from typing import Optional
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class FeedbackCreate(BaseModel):
    id_recommandation: UUID
    note_pertinence: int = Field(..., ge=1, le=5)
    commentaire: Optional[str] = None
    recommandation_appliquee: Optional[bool] = None
    score_avant: Optional[int] = Field(default=None, ge=0, le=100)
    score_apres: Optional[int] = Field(default=None, ge=0, le=100)


class FeedbackOut(FeedbackCreate):
    model_config = ConfigDict(from_attributes=True)

    id_feedback: UUID