import uuid

from sqlalchemy import Column, String, Boolean, Date
from sqlalchemy.dialects.postgresql import UUID, ARRAY
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.database import Base


class PmeProfil(Base):
    __tablename__ = "pme_profil"

    id_pme = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    nom_entreprise = Column(String(200), nullable=False)
    secteur_activite = Column(String(30), nullable=False)
    taille_effectif = Column(String(20), nullable=False)
    chiffre_affaires_annuel = Column(String(20), nullable=False)
    possede_service_it = Column(Boolean, nullable=False, default=False)
    possede_responsable_securite = Column(String(20), nullable=False, default="non")
    niveau_digitalisation = Column(String(20), nullable=False)
    traite_donnees_sensibles = Column(Boolean, nullable=False, default=False)
    historique_incident_cyber = Column(String(20), nullable=False, default="ne_sait_pas")
    budget_cybersecurite = Column(String(20), nullable=False)
    reglementations_applicables = Column(ARRAY(String), nullable=True)
    date_evaluation = Column(Date, server_default=func.current_date())

    reponses = relationship("Reponse", back_populates="pme", cascade="all, delete-orphan")
    recommandations = relationship("RecommandationGeneree", back_populates="pme", cascade="all, delete-orphan")