
from typing import List, Optional
from uuid import UUID

from pydantic import BaseModel, ConfigDict


class RecommandationOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id_recommandation: Optional[UUID] = None  # None tant que non persistée
    id_regle: int
    id_mesure: int
    titre_mesure: str
    description_mesure: str
    nom_domaine: str
    impact: Optional[str] = None
    cout_estime: Optional[str] = None
    difficulte_estimee: Optional[str] = None
    score_priorite: float
    justification_rag: Optional[str] = None


class PlanActionOut(BaseModel):
    id_pme: UUID
    nb_recommandations: int
    recommandations: List[RecommandationOut]