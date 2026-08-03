"""
Sprint 5 — Schémas Pydantic pour /profil.

Les enums reprennent exactement les CHECK constraints de pme_profil dans
schema_pfa13.sql — toute valeur hors de cette liste est rejetée par l'API
avant même d'atteindre la base (double sécurité avec les CHECK SQL).
"""
from datetime import date
from enum import Enum
from typing import List, Optional
from uuid import UUID

from pydantic import BaseModel, Field, ConfigDict


class SecteurActivite(str, Enum):
    services = "services"
    industrie = "industrie"
    commerce = "commerce"
    tech_digital = "tech_digital"
    sante = "sante"
    finance_assurance = "finance_assurance"
    autre = "autre"


class TailleEffectif(str, Enum):
    tpe = "tpe"
    petite = "petite"
    moyenne = "moyenne"


class ChiffreAffaires(str, Enum):
    moins_3mdh = "moins_3mdh"
    de_3_a_10mdh = "3_10mdh"
    de_10_a_50mdh = "10_50mdh"
    plus_50mdh = "plus_50mdh"


class ResponsableSecurite(str, Enum):
    oui = "oui"
    non = "non"
    externalise = "externalise"


class NiveauDigitalisation(str, Enum):
    faible = "faible"
    moyen = "moyen"
    eleve = "eleve"


class HistoriqueIncident(str, Enum):
    oui = "oui"
    non = "non"
    ne_sait_pas = "ne_sait_pas"


class BudgetCybersecurite(str, Enum):
    aucun = "aucun"
    faible = "faible"
    modere = "modere"
    structure = "structure"


class PmeProfilCreate(BaseModel):
    nom_entreprise: str = Field(..., max_length=200)
    secteur_activite: SecteurActivite
    taille_effectif: TailleEffectif
    chiffre_affaires_annuel: ChiffreAffaires
    possede_service_it: bool = False
    possede_responsable_securite: ResponsableSecurite = ResponsableSecurite.non
    niveau_digitalisation: NiveauDigitalisation
    traite_donnees_sensibles: bool = False
    historique_incident_cyber: HistoriqueIncident = HistoriqueIncident.ne_sait_pas
    budget_cybersecurite: BudgetCybersecurite
    reglementations_applicables: Optional[List[str]] = None


class PmeProfilOut(PmeProfilCreate):
    model_config = ConfigDict(from_attributes=True)

    id_pme: UUID
    date_evaluation: date


class ReponseCreate(BaseModel):
    id_question: int
    valeur_reponse: str = Field(..., max_length=50)


class ReponseBulkCreate(BaseModel):
    """Soumission groupée des réponses au questionnaire (24 questions d'un coup)."""
    reponses: List[ReponseCreate]


class ReponseOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id_reponse: UUID
    id_question: int
    valeur_reponse: str