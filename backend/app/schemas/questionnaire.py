"""
Sprint 5 — Schémas Pydantic pour /questionnaire (lecture seule : catalogue
des 15 domaines et 24 questions, statique, sert à générer le formulaire côté
frontend au Sprint 6).
"""
from typing import Any, List, Optional

from pydantic import BaseModel, ConfigDict


class DomaineOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id_domaine: int
    numero: int
    nom_domaine: str
    section_guide: str
    remarque: Optional[str] = None


class QuestionOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id_question: int
    numero: int
    type_question: str
    id_domaine: Optional[int] = None
    intitule: str
    type_reponse: str
    valeur_max: int
    options: Optional[List[Any]] = None


class QuestionnaireOut(BaseModel):
    """Vue combinée renvoyée par GET /questionnaire — évite au frontend de
    devoir faire deux appels (domaines + questions) pour construire le
    formulaire complet."""
    domaines: List[DomaineOut]
    questions: List[QuestionOut]