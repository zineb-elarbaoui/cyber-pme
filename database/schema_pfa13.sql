-- =============================================================================
-- PFA N°13 — Système de recommandation IA pour la cyber-résilience des PME
-- Sprint 2 : Schéma de base de données (PostgreSQL) + données de test
-- =============================================================================
-- Extensions nécessaires
CREATE EXTENSION IF NOT EXISTS "pgcrypto";   -- pour gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS "vector";     -- pgvector, utilisé par le pipeline RAG (Sprint 4)

-- =============================================================================
-- 1. DOMAINE — les 15 domaines de sécurité couverts par Q10 à Q24
-- =============================================================================
CREATE TABLE domaine (
    id_domaine      SERIAL PRIMARY KEY,
    numero          SMALLINT NOT NULL UNIQUE CHECK (numero BETWEEN 1 AND 15),
    nom_domaine     VARCHAR(150) NOT NULL,
    section_guide   VARCHAR(150) NOT NULL,           -- référence(s) précise(s) du guide, parfois composite (ex: '3.1.2 / 3.1.3')
    remarque        TEXT                              -- couverture partielle ou absente dans le guide, à documenter comme limite
);

-- =============================================================================
-- 2. QUESTION — catalogue des 24 questions du questionnaire de maturité
-- =============================================================================
CREATE TABLE question (
    id_question     SERIAL PRIMARY KEY,
    numero          SMALLINT NOT NULL UNIQUE CHECK (numero BETWEEN 1 AND 24),
    type_question   VARCHAR(20) NOT NULL CHECK (type_question IN ('contextuelle', 'domaine')),
    id_domaine      INTEGER REFERENCES domaine(id_domaine),  -- NULL pour Q1-Q9 (contextuelles)
    intitule        TEXT NOT NULL,
    type_reponse    VARCHAR(20) NOT NULL DEFAULT 'echelle' CHECK (type_reponse IN ('booleen', 'enum', 'echelle')),
    valeur_max      SMALLINT NOT NULL,        -- 3 pour Q1-Q9 (échelle 0-3), 5 pour Q10-Q24 (échelle 0-5)
    options         JSONB,                     -- libellés de chaque valeur de l'échelle, ex: [{"valeur":0,"libelle":"..."}]
    -- cohérence : une question contextuelle n'a pas de domaine ; une question de domaine en a un
    CONSTRAINT chk_domaine_coherent CHECK (
        (type_question = 'contextuelle' AND id_domaine IS NULL) OR
        (type_question = 'domaine' AND id_domaine IS NOT NULL)
    )
);

-- =============================================================================
-- 3. PME_PROFIL — profil contextuel de la PME évaluée (Sprint 1)
-- =============================================================================
CREATE TABLE pme_profil (
    id_pme                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nom_entreprise              VARCHAR(200) NOT NULL,
    secteur_activite            VARCHAR(30) NOT NULL CHECK (secteur_activite IN
                                    ('services', 'industrie', 'commerce', 'tech_digital', 'sante', 'finance_assurance', 'autre')),
    taille_effectif             VARCHAR(20) NOT NULL CHECK (taille_effectif IN ('tpe', 'petite', 'moyenne')),
    chiffre_affaires_annuel     VARCHAR(20) NOT NULL CHECK (chiffre_affaires_annuel IN
                                    ('moins_3mdh', '3_10mdh', '10_50mdh', 'plus_50mdh')),
    possede_service_it          BOOLEAN NOT NULL DEFAULT FALSE,
    possede_responsable_securite VARCHAR(20) NOT NULL DEFAULT 'non' CHECK (possede_responsable_securite IN
                                    ('oui', 'non', 'externalise')),
    niveau_digitalisation       VARCHAR(20) NOT NULL CHECK (niveau_digitalisation IN ('faible', 'moyen', 'eleve')),
    traite_donnees_sensibles    BOOLEAN NOT NULL DEFAULT FALSE,
    historique_incident_cyber   VARCHAR(20) NOT NULL DEFAULT 'ne_sait_pas' CHECK (historique_incident_cyber IN
                                    ('oui', 'non', 'ne_sait_pas')),
    budget_cybersecurite        VARCHAR(20) NOT NULL CHECK (budget_cybersecurite IN
                                    ('aucun', 'faible', 'modere', 'structure')),
    reglementations_applicables TEXT[],              -- ex: ARRAY['loi_09_08','rgpd']
    date_evaluation             DATE NOT NULL DEFAULT CURRENT_DATE
);

-- =============================================================================
-- 4. REPONSE — réponse d'une PME donnée à une question donnée
-- =============================================================================
CREATE TABLE reponse (
    id_reponse      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    id_pme          UUID NOT NULL REFERENCES pme_profil(id_pme) ON DELETE CASCADE,
    id_question     INTEGER NOT NULL REFERENCES question(id_question),
    valeur_reponse  VARCHAR(50) NOT NULL,             -- 'oui'/'non'/valeur d'échelle/enum
    date_reponse    TIMESTAMP NOT NULL DEFAULT NOW(),
    UNIQUE (id_pme, id_question)                      -- une PME répond une fois par question et par évaluation
);

-- =============================================================================
-- 5. MESURE — catalogue des mesures de sécurité (découplé des règles pour éviter
--    la duplication et permettre la réutilisation d'une mesure par plusieurs règles)
-- =============================================================================
CREATE TABLE mesure (
    id_mesure                      SERIAL PRIMARY KEY,
    titre                          VARCHAR(150) NOT NULL,
    description                    TEXT NOT NULL,
    cout_estime                    VARCHAR(20) CHECK (cout_estime IN ('faible', 'moyen', 'eleve')),
    difficulte_estimee             VARCHAR(20) CHECK (difficulte_estimee IN ('facile', 'moyenne', 'difficile')),
    impact                         VARCHAR(20) CHECK (impact IN ('faible', 'moyen', 'eleve', 'tres_eleve')),
    section_guide_precise          VARCHAR(60) NOT NULL,
    tags                           TEXT[],
    -- IMPORTANT : cout_estime et difficulte_estimee sont des ESTIMATIONS QUALITATIVES,
    -- le guide CMRPI/AUSIM ne fournit pas ces valeurs explicitement. A affiner lors
    -- des tests pilotes (Sprint 7). Seuls impact et section_guide_precise sont
    -- directement déductibles/traçables au guide.
    estimation_non_issue_du_guide  BOOLEAN NOT NULL DEFAULT TRUE
);

-- =============================================================================
-- 6. REGLE_EXPERTE — règles (et sous-règles) issues du guide CMRPI/AUSIM
-- =============================================================================
CREATE TABLE regle_experte (
    id_regle                SERIAL PRIMARY KEY,
    id_domaine              INTEGER NOT NULL REFERENCES domaine(id_domaine),
    id_regle_parent         INTEGER REFERENCES regle_experte(id_regle),  -- NULL = règle mère
    condition                JSONB NOT NULL,           -- ex: {"id_question": 12, "operateur": "<=", "valeur": 1}
    id_mesure               INTEGER NOT NULL REFERENCES mesure(id_mesure),
    priorite_base            SMALLINT NOT NULL CHECK (priorite_base BETWEEN 1 AND 5)
);

-- =============================================================================
-- 7. RECOMMANDATION_GENEREE — recommandation produite pour une PME
-- =============================================================================
CREATE TABLE recommandation_generee (
    id_recommandation   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    id_pme              UUID NOT NULL REFERENCES pme_profil(id_pme) ON DELETE CASCADE,
    id_regle            INTEGER NOT NULL REFERENCES regle_experte(id_regle),
    score_priorite       NUMERIC(5,2) NOT NULL,        -- urgence x difficulté x pertinence secteur/taille
    justification_rag   TEXT,                          -- généré par le pipeline RAG (Sprint 4), nullable au Sprint 2
    date_generation      TIMESTAMP NOT NULL DEFAULT NOW()
);

-- =============================================================================
-- 8. FEEDBACK — retour PME sur une recommandation, et apprentissage continu (Sprint 7)
-- =============================================================================
CREATE TABLE feedback (
    id_feedback              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    id_recommandation        UUID NOT NULL UNIQUE REFERENCES recommandation_generee(id_recommandation) ON DELETE CASCADE,
    note_pertinence          SMALLINT NOT NULL CHECK (note_pertinence BETWEEN 1 AND 5),
    commentaire               TEXT,
    recommandation_appliquee BOOLEAN,                  -- la PME a-t-elle mis en œuvre la mesure ?
    score_avant               SMALLINT,                 -- score de maturité du domaine avant application (0-100)
    score_apres               SMALLINT,                 -- score de maturité du domaine après application (0-100)
    date_feedback             TIMESTAMP NOT NULL DEFAULT NOW()
);
CREATE TABLE guide_chunk (
    id_chunk        SERIAL PRIMARY KEY,
    section_guide   VARCHAR(20) NOT NULL,
    titre_section   VARCHAR(200),
    texte           TEXT NOT NULL,
    embedding       vector(768) NOT NULL,   -- 768 dim = intfloat/multilingual-e5-base
    ordre           INTEGER NOT NULL
);


-- Index utiles pour les requêtes fréquentes du moteur de règles
CREATE INDEX idx_reponse_pme ON reponse(id_pme);
CREATE INDEX idx_regle_domaine ON regle_experte(id_domaine);
CREATE INDEX idx_recommandation_pme ON recommandation_generee(id_pme);
CREATE INDEX idx_regle_mesure ON regle_experte(id_mesure);
CREATE INDEX idx_guide_chunk_section ON guide_chunk(section_guide);
-- =============================================================================
-- DONNÉES DE TEST
-- =============================================================================

-- 15 domaines — intitulés et sections réels, validés à partir du guide CMRPI/AUSIM
INSERT INTO domaine (numero, nom_domaine, section_guide, remarque) VALUES
(1,  'Politique de sécurité',
     '2.1.1 Politique de sécurité des SI', NULL),
(2,  'Organisation de la sécurité',
     '2.1.3 Gouvernance des SI et aspect organisationnel', NULL),
(3,  'Gestion des risques SSI',
     '2.5 Norme ISO 27005 — gestion des risques SI',
     'Le niveau 5 (« amélioration continue ») est absent de l''échelle de maturité pour cette question dans le document source (section 4) — seuls les niveaux 0 à 4 y figurent ; valeur_max fixé à 4 en conséquence.'),
(4,  'Gestion des actifs',
     '3.1 Sécurité du poste de travail et des serveurs',
     'Pas de section dédiée dans le sommaire du guide — rattaché à 3.1 par proximité thématique. Le niveau 5 de l''échelle de maturité (section 4) mentionne littéralement « gestion des risques SSI » plutôt que « gestion des actifs » : probable coquille du document source, corrigée par cohérence dans le libellé stocké ici.'),
(5,  'Documentation',
     '2.1 (rattachement indicatif)',
     'Non couvert explicitement par le guide — limite à documenter dans le rapport final.'),
(6,  'Sécurité des ressources humaines',
     '2.1.2 Charte d''usage des SI', NULL),
(7,  'Sensibilisation et formation',
     '2.1.5 Sensibilisation à la cybersécurité', NULL),
(8,  'Sécurité physique et environnementale',
     '3.1.1 Sécurité du poste de travail (aspect physique)', NULL),
(9,  'Exploitation et réseaux',
     '3.1.2 Les virus, antivirus et firewall / 3.1.3 Sécurité des serveurs', NULL),
(10, 'Contrôle d''accès logique / Authentification',
     '3.1.4 Authentification des utilisateurs / 3.1.5 Permissions d''accès', NULL),
(11, 'Acquisition, développement et maintenance des SI',
     '3.1.7 Politique de mise à jour des systèmes d''exploitation et logiciels', NULL),
(12, 'Cryptographie et IGC',
     '3.5.2 Transfert des données et Cloud computing / virtualisation',
     'Pas de section crypto dédiée — rattaché à 3.5.2 (chiffrement des échanges) par proximité thématique.'),
(13, 'Gestion des incidents SSI',
     '5.2 Les bons réflexes en cas d''incident', NULL),
(14, 'Plan de continuité d''activité',
     '3.5.1 Stockage, sauvegarde et restauration des données', NULL),
(15, 'Conformité légale & réglementaire',
     '2.6 Aspect juridique et conventionnel', NULL);

-- 24 questions : Q1-Q9 contextuelles (echelle 0-3), Q10-Q24 de domaine (echelle 0-5) — texte exact du guide, section 4
INSERT INTO question (numero, type_question, id_domaine, intitule, type_reponse, valeur_max, options) VALUES
(1, 'contextuelle', NULL, 'Comment qualifieriez-vous votre système d''information ?', 'echelle', 3, '[{"valeur": 0, "libelle": "Le système d''information est un outil facilitant le travail sans intervenir directement dans les directions métiers"}, {"valeur": 1, "libelle": "Le système d''information est le moyen d''avoir une vision transverse des processus et de l''organisation de l''organisme, il constitue une aide à la décision"}, {"valeur": 2, "libelle": "Le système d''information est un outil de transformation organisationnelle et d''amélioration de la performance opérationnelle"}, {"valeur": 3, "libelle": "Le système d''information est un outil indispensable au fonctionnement de l''organisation, mais sa contribution est difficile à mesurer, bien que les dépenses informatiques doivent être maîtrisées"}]'),
(2, 'contextuelle', NULL, 'Quel est l''effet de la perte du SI (Indisponibilité) sur le fonctionnement ?', 'echelle', 3, '[{"valeur": 0, "libelle": "Aucun effet"}, {"valeur": 1, "libelle": "Un effet faible, l''activité est faiblement déstabilisée puis s''autorégule"}, {"valeur": 2, "libelle": "Un effet majeur, l''activité est fortement entravée dans l''attente d''un retour à la normale"}, {"valeur": 3, "libelle": "Un effet bloquant, provoque l''arrêt de l''activité dans l''attente d''un retour à la normale"}]'),
(3, 'contextuelle', NULL, 'Quel est l''effet d''une perte d''intégrité de l''information sur le fonctionnement ?', 'echelle', 3, '[{"valeur": 0, "libelle": "La perte d''intégrité n''a pas d''effet sur le fonctionnement"}, {"valeur": 1, "libelle": "La perte d''intégrité a un effet faible, elle n''engendre que peu de dysfonctionnements"}, {"valeur": 2, "libelle": "La perte d''intégrité a un effet majeur, les dysfonctionnements sont importants et remettent en cause temporairement la poursuite de l''activité"}, {"valeur": 3, "libelle": "La perte d''intégrité a un effet bloquant, des dysfonctionnements majeurs (arrêt d''activité, perte d''image, perte de clients, etc.) sont à craindre"}]'),
(4, 'contextuelle', NULL, 'Quel est l''effet de la divulgation d''informations sur le fonctionnement ?', 'echelle', 3, '[{"valeur": 0, "libelle": "La divulgation d''informations n''a aucun effet sur le fonctionnement"}, {"valeur": 1, "libelle": "La divulgation d''information a un effet faible, la pérennité de l''activité en serait peu menacée, pas de risque juridique"}, {"valeur": 2, "libelle": "La divulgation d''information a un effet majeur, entraînant la perte d''un avantage concurrentiel important, une perte de crédibilité importante ou un risque juridique important"}, {"valeur": 3, "libelle": "La divulgation d''information a un effet bloquant, la survie de l''activité est remise en cause ou un risque majeur existe"}]'),
(5, 'contextuelle', NULL, 'Comment décririez-vous l''environnement concurrentiel de votre entreprise ?', 'echelle', 3, '[{"valeur": 0, "libelle": "Pas concurrentiel ou pas de menace d''agence gouvernementale (administration)"}, {"valeur": 1, "libelle": "Peu concurrentiel ou menace d''agence faible"}, {"valeur": 2, "libelle": "Concurrentiel ou menace d''agence classique"}, {"valeur": 3, "libelle": "Concurrence féroce ou menace d''agence majeure"}]'),
(6, 'contextuelle', NULL, 'Le secteur d''activité est-il innovant ?', 'echelle', 3, '[{"valeur": 0, "libelle": "Secteur non innovant / pas d''avance technologique"}, {"valeur": 1, "libelle": "Secteur à faible innovation / avance technologique peu significative"}, {"valeur": 2, "libelle": "Secteur à forte innovation / avance technologique importante"}, {"valeur": 3, "libelle": "Secteur de type R&D exclusivement / avance technologique déterminante"}]'),
(7, 'contextuelle', NULL, 'Quel est le niveau d''interconnexion du SI ?', 'echelle', 3, '[{"valeur": 0, "libelle": "Système isolé"}, {"valeur": 1, "libelle": "Système intranet ou connexions restreintes avec partenaires identifiés"}, {"valeur": 2, "libelle": "Système extranet fortement interconnecté"}, {"valeur": 3, "libelle": "Système et/ou services sur Internet"}]'),
(8, 'contextuelle', NULL, 'Quel est le niveau d''homogénéité du SI ?', 'echelle', 3, '[{"valeur": 0, "libelle": "Système très standardisé"}, {"valeur": 1, "libelle": "Système peu hétérogène"}, {"valeur": 2, "libelle": "Système hétérogène"}, {"valeur": 3, "libelle": "Système fortement hétérogène"}]'),
(9, 'contextuelle', NULL, 'Sous-traitance d''exploitation et/ou exploitation interne du SI ?', 'echelle', 3, '[{"valeur": 0, "libelle": "Autonomie, pas d''appel à sous-traitance"}, {"valeur": 1, "libelle": "Utilisation limitée de la sous-traitance et/ou mise en place de contrats et de procédures rigoureuses concernant les exploitants"}, {"valeur": 2, "libelle": "Utilisation relativement importante de la sous-traitance et/ou mise en œuvre de clauses contractuelles spécifiques de « qualité » du personnel exploitant"}, {"valeur": 3, "libelle": "Utilisation importante de la sous-traitance et/ou aucune règle mise en place concernant le personnel exploitant"}]'),
(10, 'domaine', 1, 'Politique de Sécurité', 'echelle', 5, '[{"valeur": 0, "libelle": "Aucune politique de sécurité, l''entreprise n''est pas sensibilisée à la sécurité"}, {"valeur": 1, "libelle": "Un usage occasionnel et informel de bonnes pratiques fait office de référentiel SSI"}, {"valeur": 2, "libelle": "Un référentiel des meilleures pratiques existe et permet la gestion de la SSI (planification, vérification, actions correctives)"}, {"valeur": 3, "libelle": "La politique de sécurité est formalisée à l''aide d''outils méthodologiques définis"}, {"valeur": 4, "libelle": "Des objectifs mesurables sont définis, une organisation prévoit le suivi de ces objectifs"}, {"valeur": 5, "libelle": "La politique de sécurité est inscrite dans un processus d''amélioration continu"}]'),
(11, 'domaine', 2, 'Organisation de la sécurité', 'echelle', 5, '[{"valeur": 0, "libelle": "Organisation inexistante"}, {"valeur": 1, "libelle": "Organisation SSI informelle"}, {"valeur": 2, "libelle": "La SSI est gérée (planification, vérification, actions correctives)"}, {"valeur": 3, "libelle": "Responsabilités et procédures SSI formalisées et généralisées"}, {"valeur": 4, "libelle": "Définition d''objectifs mesurables et suivi de la mise en œuvre de l''organisation SSI"}, {"valeur": 5, "libelle": "Amélioration continue de l''organisation SSI"}]'),
(12, 'domaine', 3, 'Gestion des risques SSI', 'echelle', 4, '[{"valeur": 0, "libelle": "Aucune gestion des risques SSI"}, {"valeur": 1, "libelle": "Usage occasionnel de meilleures pratiques pour gérer les risques SSI"}, {"valeur": 2, "libelle": "Gestion des meilleures pratiques pour gérer les risques SSI (planification, vérification, actions correctives)"}, {"valeur": 3, "libelle": "Usage généralisé d''outils méthodologiques pour gérer les risques SSI"}, {"valeur": 4, "libelle": "Définition d''objectifs mesurables et suivi de la gestion des risques SSI (indicateurs, tableaux de bord SSI, audits...)"}]'),
(13, 'domaine', 4, 'Gestion des actifs', 'echelle', 5, '[{"valeur": 0, "libelle": "Aucune gestion des actifs"}, {"valeur": 1, "libelle": "Usage occasionnel de meilleures pratiques pour gérer les actifs"}, {"valeur": 2, "libelle": "Gestion des meilleures pratiques pour gérer les actifs (responsabilité, classification, etc.)"}, {"valeur": 3, "libelle": "Usage généralisé d''outils méthodologiques pour gérer les actifs"}, {"valeur": 4, "libelle": "Définition d''objectifs mesurables et suivi de la gestion des actifs (indicateurs, tableaux de bord, audit...)"}, {"valeur": 5, "libelle": "Réitération régulière des processus de gestion des actifs"}]'),
(14, 'domaine', 5, 'Documentation', 'echelle', 5, '[{"valeur": 0, "libelle": "Aucune documentation de la SSI"}, {"valeur": 1, "libelle": "Rédaction occasionnelle de documentation SSI (ex : conception, recette, exploitation...)"}, {"valeur": 2, "libelle": "Gestion d''une documentation SSI homogène (planification, vérification, actions correctives)"}, {"valeur": 3, "libelle": "Formalisation d''un cadre de gestion documentaire de la SSI"}, {"valeur": 4, "libelle": "Comparaison régulière de la documentation SSI avec la réalité"}, {"valeur": 5, "libelle": "La documentation SSI est mise à jour régulièrement et comporte un volet d''enregistrement des événements et du reporting conforme ISO 27001"}]'),
(15, 'domaine', 6, 'Sécurité des ressources humaines', 'echelle', 5, '[{"valeur": 0, "libelle": "Les aspects humains ne sont pas pris en compte dans la SSI"}, {"valeur": 1, "libelle": "Prise en compte occasionnelle des aspects humains dans la SSI (ex : recrutements, habilitations...)"}, {"valeur": 2, "libelle": "Intégration systématique des aspects humains dans la SSI"}, {"valeur": 3, "libelle": "Un processus défini de gestion des aspects humains est mis en œuvre, les procédures RH tiennent compte de la SSI (embauches, modifications, fin de contrat...)"}, {"valeur": 4, "libelle": "Définition d''objectifs mesurables et suivi du personnel"}, {"valeur": 5, "libelle": "Optimisation continue des processus SSI liés aux ressources humaines"}]'),
(16, 'domaine', 7, 'Sensibilisation et formation', 'echelle', 5, '[{"valeur": 0, "libelle": "Aucune sensibilisation ni formation en matière de SSI"}, {"valeur": 1, "libelle": "Sensibilisations et formations occasionnelles (auto-formations...)"}, {"valeur": 2, "libelle": "Sensibilisations et formations gérées formellement"}, {"valeur": 3, "libelle": "Formalisation d''un plan de formation défini, adapté aux profils des personnels ou éventuellement usage de « certification » des individus"}, {"valeur": 4, "libelle": "Définition d''objectifs mesurables et évaluation des personnels suite aux sessions de sensibilisation et de formations"}, {"valeur": 5, "libelle": "Amélioration continue du plan de formation en fonction des retours d''expériences"}]'),
(17, 'domaine', 8, 'Sécurité physique et environnementale', 'echelle', 5, '[{"valeur": 0, "libelle": "Aucune règle de protection d''accès physique aux locaux ou à des zones sécurisées spécifique à la SSI"}, {"valeur": 1, "libelle": "Mise en œuvre de mesures relatives aux aspects de sécurité physique ou environnementaux sur la base de l''expertise individuelle"}, {"valeur": 2, "libelle": "Mise en œuvre de mesures relatives aux aspects de sécurité physique ou environnementaux sur la base de meilleures pratiques partagées"}, {"valeur": 3, "libelle": "Exploitation des résultats d''une analyse des risques SSI pour la définition et la mise en œuvre des mesures de sécurité relatives aux aspects physiques et environnementaux"}, {"valeur": 4, "libelle": "Définition d''objectifs mesurables et suivi de la mise en œuvre des mesures de sécurité relatives aux aspects physiques et environnementaux"}, {"valeur": 5, "libelle": "Amélioration continue des procédures de mise en œuvre des mesures de sécurité relatives aux aspects physiques et environnementaux"}]'),
(18, 'domaine', 9, 'Exploitation et Réseaux', 'echelle', 5, '[{"valeur": 0, "libelle": "Aucune procédure ou règle d''exploitation ou réseau spécifique à la SSI"}, {"valeur": 1, "libelle": "Mise en œuvre des règles et procédures d''exploitation ou réseau relatives à la SSI sur la base de l''expertise individuelle"}, {"valeur": 2, "libelle": "Mise en œuvre des règles et procédures d''exploitation ou réseau relatives à la SSI sur la base de meilleures pratiques partagées (gestion des modifications, séparation des tâches avec les études, sauvegardes, sécurité des réseaux...)"}, {"valeur": 3, "libelle": "Exploitation des résultats d''une analyse des risques pour la définition et la mise en œuvre des règles et procédures d''exploitation ou réseau relatives à la SSI"}, {"valeur": 4, "libelle": "Définition d''objectifs mesurables et suivi de la mise en œuvre des règles et procédures d''exploitation ou réseau relatives à la SSI"}, {"valeur": 5, "libelle": "Amélioration continue des procédures et règles d''exploitation ou réseau"}]'),
(19, 'domaine', 10, 'Contrôles d''accès logique, Identification / Authentification', 'echelle', 5, '[{"valeur": 0, "libelle": "Pas de règle ni de procédure pour la mise en œuvre des mécanismes de contrôle d''accès et d''identification / authentification"}, {"valeur": 1, "libelle": "Définition de règles et procédures pour la mise en œuvre de mécanismes de contrôle d''accès logique et d''identification / authentification sur la base de l''expertise individuelle"}, {"valeur": 2, "libelle": "Définition de règles et procédures pour la mise en œuvre de mécanismes de contrôle d''accès logique et d''identification / authentification sur la base de meilleures pratiques partagées"}, {"valeur": 3, "libelle": "Exploitation des résultats d''une analyse des risques SSI pour la définition des mécanismes de contrôle d''accès logique, d''identification / authentification et règles ou procédures associées"}, {"valeur": 4, "libelle": "Définition d''objectifs mesurables et suivi des mécanismes de contrôle d''accès logique, d''identification / authentification et règles ou procédures associées"}, {"valeur": 5, "libelle": "Amélioration continue des mécanismes de contrôle d''accès logique, identification / authentification et règles ou procédures associées"}]'),
(20, 'domaine', 11, 'Acquisition, développement et maintenance des SI', 'echelle', 5, '[{"valeur": 0, "libelle": "Aucune prise en compte de la SSI dans les projets"}, {"valeur": 1, "libelle": "Usage occasionnel de meilleures pratiques dans le cadre des projets"}, {"valeur": 2, "libelle": "Gestion de meilleures pratiques dans le cadre des projets (planification, vérification, actions correctives)"}, {"valeur": 3, "libelle": "Définition d''un dossier de sécurité et de l''intégration de la SSI dans les projets (ex : utilisation d''une méthode...)"}, {"valeur": 4, "libelle": "Définition d''objectifs mesurables et suivi de l''intégration de la SSI dans les projets (ex : tableaux de bord projets intégrant la SSI, audits...)"}, {"valeur": 5, "libelle": "Amélioration continue de l''intégration de la SSI dans les projets"}]'),
(21, 'domaine', 12, 'Cryptographie et infrastructure de gestion de clés cryptographiques (IGC)', 'echelle', 5, '[{"valeur": 0, "libelle": "Aucune IGC"}, {"valeur": 1, "libelle": "Mise en place de fonctionnalités de gestion de clés cryptographiques sans procédure formalisée"}, {"valeur": 2, "libelle": "Mise en place de fonctionnalités de gestion de clés cryptographiques de manière cohérente et mutualisée (planification, vérification, actions correctives)"}, {"valeur": 3, "libelle": "Définition d''un dossier de sécurité des IGC (ex : politique de certification, déclaration des procédures de certification...)"}, {"valeur": 4, "libelle": "Définition d''objectifs mesurables et suivi de la mise en œuvre des IGC"}, {"valeur": 5, "libelle": "Amélioration continue des IGC (politique, procédures et mise en œuvre)"}]'),
(22, 'domaine', 13, 'Gestion des incidents liés à la sécurité des systèmes d''information', 'echelle', 5, '[{"valeur": 0, "libelle": "Incidents SSI non traités"}, {"valeur": 1, "libelle": "Remontée occasionnelle et informelle d''incidents SSI"}, {"valeur": 2, "libelle": "Incidents gérés systématiquement, mais de manière non formalisée (planification, vérification, actions correctives)"}, {"valeur": 3, "libelle": "Gestion des incidents formalisée (ex : changements d''états, réseau de détection et d''alerte, procédure d''escalade, procédure de traitement...), exploitation des données des CSIRTs"}, {"valeur": 4, "libelle": "Définition d''objectifs mesurables et suivi de la gestion des incidents (ex : helpdesk...)"}, {"valeur": 5, "libelle": "Gestion des incidents en constante amélioration, alimentation de bases de données d''incidents et de traitements d''incidents et interaction"}]'),
(23, 'domaine', 14, 'Plan de continuité d''activité', 'echelle', 5, '[{"valeur": 0, "libelle": "Aucun plan pour assurer la continuité des opérations"}, {"valeur": 1, "libelle": "Mise en œuvre occasionnelle et de manière non formalisée de mesures de sécurité relatives à la disponibilité du système d''information (ex : sauvegardes, redondance, transfert de compétences...)"}, {"valeur": 2, "libelle": "Gestion de meilleures pratiques relatives à la planification de la continuité (planification, tests, actions correctives)"}, {"valeur": 3, "libelle": "Planification de la continuité formalisée (changements d''états, récupération des données, des applications, des machines, des personnels)"}, {"valeur": 4, "libelle": "Définition d''objectifs mesurables relatifs à la planification de la continuité"}, {"valeur": 5, "libelle": "Amélioration continue de la planification de la continuité"}]'),
(24, 'domaine', 15, 'Conformité légale & réglementaire', 'echelle', 5, '[{"valeur": 0, "libelle": "Aucune mesure formalisée concernant le respect des lois et règlements relatifs aux TIC"}, {"valeur": 1, "libelle": "Définition de règles et procédures pour le respect des lois et règlements relatifs aux TIC sur la base de l''expertise individuelle"}, {"valeur": 2, "libelle": "Mise en œuvre de mesures relatives au respect des lois et règlements relatifs aux TIC sur la base des meilleures pratiques partagées"}, {"valeur": 3, "libelle": "Exploitation des résultats d''une analyse des risques SSI pour la définition et la mise en œuvre des mesures de sécurité relatives au respect des lois et règlements relatifs aux TIC"}, {"valeur": 4, "libelle": "Définition d''objectifs mesurables et suivi de la mise en œuvre des mesures de sécurité"}, {"valeur": 5, "libelle": "Amélioration continue des procédures de mise en œuvre des mesures de sécurité relatives au respect des lois et règlements relatifs aux TIC"}]');

-- 2 profils PME de test (voir aussi le futur fichier profils_types.json du Sprint 2)
INSERT INTO pme_profil (nom_entreprise, secteur_activite, taille_effectif, chiffre_affaires_annuel,
    possede_service_it, possede_responsable_securite, niveau_digitalisation, traite_donnees_sensibles,
    historique_incident_cyber, budget_cybersecurite, reglementations_applicables)
VALUES
('Clinique test SARL', 'sante', 'petite', '3_10mdh',
    FALSE, 'non', 'moyen', TRUE, 'non', 'aucun', ARRAY['loi_09_08']),
('Cabinet compta test', 'services', 'tpe', 'moins_3mdh',
    TRUE, 'externalise', 'faible', FALSE, 'ne_sait_pas', 'faible', ARRAY['loi_09_08']);

-- Quelques réponses de test pour le 1er profil (id récupéré dynamiquement)
INSERT INTO reponse (id_pme, id_question, valeur_reponse)
SELECT id_pme, 7, '2' FROM pme_profil WHERE nom_entreprise = 'Clinique test SARL';
INSERT INTO reponse (id_pme, id_question, valeur_reponse)
SELECT id_pme, 23, '1' FROM pme_profil WHERE nom_entreprise = 'Clinique test SARL';

-- 2 mesures + 2 règles expertes de test (une mère + une sous-règle) liées au domaine 14
-- "Plan de continuité d'activité" (section 3.5.1 — stockage, sauvegarde et restauration des données)
-- NB : le catalogue complet (53 mesures + 53 règles, toutes traçables au guide) vit dans
-- mesures.json et regles_expertes_v2.json ; ces lignes ne servent qu'à valider le schéma seul.
INSERT INTO mesure (titre, description, cout_estime, difficulte_estimee, impact, section_guide_precise)
VALUES
('Sauvegarde régulière et testée', 'Mettre en place une procédure de sauvegarde régulière et testée.', 'faible', 'moyenne', 'moyen', '3.5.1'),
('Sauvegarde chiffrée hors site', 'Prioriser en urgence la sauvegarde chiffrée des données sensibles.', 'moyen', 'moyenne', 'tres_eleve', '3.5.1');

INSERT INTO regle_experte (id_domaine, id_regle_parent, condition, id_mesure, priorite_base)
VALUES
(14, NULL,
    '{"id_question": 23, "operateur": "<=", "valeur": 1}',
    (SELECT id_mesure FROM mesure WHERE titre = 'Sauvegarde régulière et testée'), 3),
(14, 1,
    '{"id_question": 23, "operateur": "<=", "valeur": 1, "et": {"champ": "traite_donnees_sensibles", "valeur": true}}',
    (SELECT id_mesure FROM mesure WHERE titre = 'Sauvegarde chiffrée hors site'), 5);

-- Une recommandation de test générée pour le profil "Clinique test SARL"
INSERT INTO recommandation_generee (id_pme, id_regle, score_priorite, justification_rag)
SELECT p.id_pme, r.id_regle, 4.50, NULL
FROM pme_profil p, regle_experte r
WHERE p.nom_entreprise = 'Clinique test SARL' AND r.id_regle_parent = 1;

-- =============================================================================
-- VÉRIFICATIONS RAPIDES
-- =============================================================================
-- SELECT * FROM pme_profil;
-- SELECT * FROM reponse;
-- SELECT * FROM regle_experte;
-- SELECT * FROM recommandation_generee;