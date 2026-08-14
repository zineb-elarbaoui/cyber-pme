# backend/app/schemas/auth.py
from uuid import UUID
from pydantic import BaseModel


class ConnexionRequest(BaseModel):
    email: str
    mot_de_passe: str


class ConnexionResponse(BaseModel):
    id_pme: UUID
    nom_entreprise: str
    questionnaire_complete: bool  # True si les 24 réponses existent déjà -> frontend peut aller direct à /results