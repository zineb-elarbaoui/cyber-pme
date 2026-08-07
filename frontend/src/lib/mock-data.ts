export type Priority = "critical" | "high" | "medium" | "low";
export type Level = "faible" | "moyen" | "eleve";

export const domains = [
  { id: "policy", name: "Politique de sécurité", score: 2, max: 5 },
  { id: "risk", name: "Gestion des risques", score: 1, max: 5 },
  { id: "assets", name: "Gestion des actifs", score: 3, max: 5 },
  { id: "hr", name: "Ressources humaines", score: 2, max: 5 },
  { id: "awareness", name: "Sensibilisation", score: 1, max: 5 },
  { id: "physical", name: "Sécurité physique", score: 3, max: 5 },
  { id: "network", name: "Sécurité des réseaux", score: 2, max: 5 },
  { id: "access", name: "Contrôle d'accès", score: 2, max: 5 },
  { id: "dev", name: "Développement sécurisé", score: 1, max: 5 },
  { id: "crypto", name: "Cryptographie", score: 2, max: 5 },
  { id: "incident", name: "Gestion des incidents", score: 1, max: 5 },
  { id: "continuity", name: "Continuité d'activité", score: 2, max: 5 },
  { id: "compliance", name: "Conformité légale", score: 2, max: 5 },
  { id: "supplier", name: "Fournisseurs & tiers", score: 2, max: 5 },
  { id: "monitoring", name: "Surveillance & audit", score: 1, max: 5 },
] as const;

export const globalScore = domains.reduce((s, d) => s + d.score, 0) + 27; // + contextual 9*3
export const maxGlobalScore = 102;

export function maturityLabel(score: number) {
  const pct = score / maxGlobalScore;
  if (pct < 0.25) return { label: "Maturité initiale", tone: "critical" as const };
  if (pct < 0.5) return { label: "Maturité émergente", tone: "warning" as const };
  if (pct < 0.75) return { label: "Maturité maîtrisée", tone: "primary" as const };
  return { label: "Maturité optimisée", tone: "success" as const };
}

export const scaleLabels5 = [
  { value: 0, title: "Inexistant", desc: "Aucune pratique ni processus en place." },
  { value: 1, title: "Initial", desc: "Actions isolées, non documentées, dépendantes des personnes." },
  { value: 2, title: "Répétable", desc: "Pratiques informelles reproduites mais non formalisées." },
  { value: 3, title: "Défini", desc: "Processus documentés et communiqués dans l'entreprise." },
  { value: 4, title: "Maîtrisé", desc: "Processus mesurés, contrôlés et améliorés régulièrement." },
  { value: 5, title: "Optimisé", desc: "Amélioration continue basée sur des indicateurs." },
];

export const scaleLabels3 = [
  { value: 0, title: "Nul", desc: "Aucun impact identifié." },
  { value: 1, title: "Faible", desc: "Impact limité sur l'activité." },
  { value: 2, title: "Modéré", desc: "Impact significatif nécessitant une réaction." },
  { value: 3, title: "Élevé", desc: "Impact critique sur la continuité d'activité." },
];

export const contextualQuestions = [
  "Dépendance du chiffre d'affaires au système d'information",
  "Traitement de données personnelles ou sensibles",
  "Exposition à Internet des services métier",
  "Impact financier d'une interruption de 24h",
  "Impact réputationnel d'une fuite de données",
  "Obligations contractuelles envers les clients",
  "Contraintes réglementaires (loi 09-08, RGPD…)",
  "Volume de transactions numériques quotidiennes",
  "Dépendance envers des prestataires informatiques",
];

export const domainQuestions = domains.map((d) => ({
  domainId: d.id,
  domainName: d.name,
  question: `Quel est votre niveau de maturité sur : ${d.name.toLowerCase()} ?`,
}));

export type Recommendation = {
  id: string;
  title: string;
  domainId: string;
  domainName: string;
  priority: Priority;
  cost: Level;
  difficulty: Level;
  impact: Level;
  guideRef: string;
  summary: string;
  rationale: string;
  description: string;
};

export const recommendations: Recommendation[] = [
  {
    id: "mfa-comptes-critiques",
    title: "Activer l'authentification multifacteur (MFA) sur les comptes critiques",
    domainId: "access",
    domainName: "Contrôle d'accès",
    priority: "critical",
    cost: "faible",
    difficulty: "faible",
    impact: "eleve",
    guideRef: "Guide ANRT — §4.2 Contrôle d'accès",
    summary:
      "Protégez les comptes administrateurs, la messagerie et les accès distants par une authentification à deux facteurs.",
    rationale:
      "Votre profil déclare une exposition Internet forte et l'absence de MFA sur les accès administrateurs. 81 % des compromissions PME exploitent des identifiants volés (source : rapport CMRPI 2024). Cette mesure élimine le risque principal à un coût quasi nul.",
    description:
      "Déployez une solution MFA (Microsoft Authenticator, Google Authenticator, ou clé physique FIDO2) sur : comptes administrateurs, messagerie professionnelle, VPN et accès aux applications SaaS métier. Documentez la procédure d'enrôlement et prévoyez une procédure de récupération sécurisée.",
  },
  {
    id: "sauvegardes-3-2-1",
    title: "Mettre en place une stratégie de sauvegarde 3-2-1",
    domainId: "continuity",
    domainName: "Continuité d'activité",
    priority: "critical",
    cost: "moyen",
    difficulty: "moyen",
    impact: "eleve",
    guideRef: "Guide ANRT — §11 Continuité",
    summary: "3 copies, sur 2 supports différents, dont 1 hors-site et hors-ligne.",
    rationale:
      "Aucune sauvegarde testée n'a été déclarée. En cas de rançongiciel — première cause d'incident chez les PME marocaines — une restauration fiable est la seule garantie de continuité.",
    description:
      "Automatisez des sauvegardes quotidiennes (données métier + configurations). Conservez une copie hors-ligne (bande, disque déconnecté ou stockage immutable cloud). Testez la restauration au moins une fois par trimestre et documentez le RTO/RPO.",
  },
  {
    id: "sensibilisation-phishing",
    title: "Programme de sensibilisation au phishing",
    domainId: "awareness",
    domainName: "Sensibilisation",
    priority: "high",
    cost: "faible",
    difficulty: "faible",
    impact: "eleve",
    guideRef: "Guide ANRT — §5 RH & Sensibilisation",
    summary: "Formation trimestrielle et campagnes de phishing simulé pour tous les collaborateurs.",
    rationale:
      "Le questionnaire indique qu'aucune sensibilisation formelle n'existe. L'humain reste le vecteur d'attaque n°1 : une réduction de 60 % des clics malveillants est observée dès 6 mois de programme.",
    description:
      "Mettez en place un module e-learning de 30 min à l'arrivée de chaque collaborateur, complété par 4 campagnes de phishing simulé par an et un canal de signalement rapide (bouton « Signaler » dans la messagerie).",
  },
  {
    id: "politique-securite",
    title: "Rédiger et diffuser une politique de sécurité",
    domainId: "policy",
    domainName: "Politique de sécurité",
    priority: "high",
    cost: "faible",
    difficulty: "moyen",
    impact: "moyen",
    guideRef: "Guide ANRT — §1 Politique",
    summary: "Un document court, validé par la direction, encadrant les règles de sécurité.",
    rationale:
      "Sans politique formalisée, les responsabilités et règles de bon usage restent implicites. C'est aussi un prérequis pour toute conformité (loi 09-08, ISO 27001).",
    description:
      "Rédigez une politique de 4 à 6 pages couvrant : usage des équipements, mots de passe, gestion des données personnelles, procédure incident. Faites-la signer par la direction et remettez-la à chaque nouvel embauché.",
  },
  {
    id: "inventaire-actifs",
    title: "Établir un inventaire des actifs informatiques",
    domainId: "assets",
    domainName: "Gestion des actifs",
    priority: "medium",
    cost: "faible",
    difficulty: "faible",
    impact: "moyen",
    guideRef: "Guide ANRT — §3 Gestion des actifs",
    summary: "Un tableau tenu à jour de tous les postes, serveurs, applications et données sensibles.",
    rationale:
      "On ne peut pas protéger ce qu'on ne connaît pas. L'inventaire est la base de toute analyse de risque.",
    description:
      "Recensez postes, serveurs, équipements réseau, applications SaaS, licences, comptes à privilèges, données sensibles. Nommez un propriétaire par actif. Revoyez le tableau chaque trimestre.",
  },
  {
    id: "plan-incident",
    title: "Formaliser un plan de réponse aux incidents",
    domainId: "incident",
    domainName: "Gestion des incidents",
    priority: "high",
    cost: "faible",
    difficulty: "moyen",
    impact: "eleve",
    guideRef: "Guide ANRT — §10 Incidents",
    summary: "Qui contacter, dans quel ordre, avec quels outils, en cas d'incident cyber.",
    rationale:
      "Aucun processus incident n'est documenté. Sans plan, la réaction dépend de l'improvisation, ce qui aggrave l'impact.",
    description:
      "Rédigez une fiche d'une page : détection → confinement → éradication → restauration → retour d'expérience. Listez les contacts internes/externes (hébergeur, CERT-MA, avocat) et l'annuaire de crise.",
  },
  {
    id: "segmentation-reseau",
    title: "Segmenter le réseau interne",
    domainId: "network",
    domainName: "Sécurité des réseaux",
    priority: "medium",
    cost: "moyen",
    difficulty: "eleve",
    impact: "eleve",
    guideRef: "Guide ANRT — §7 Réseaux",
    summary: "Isoler les serveurs, le Wi-Fi invité et les postes utilisateurs sur des VLAN distincts.",
    rationale:
      "Un réseau plat permet à une compromission de se propager latéralement. La segmentation limite le rayon d'impact.",
    description:
      "Créez au minimum 3 VLAN : serveurs, postes utilisateurs, invités/IoT. Filtrez les flux inter-VLAN par ACL. Documentez la matrice de flux autorisés.",
  },
  {
    id: "conformite-09-08",
    title: "Se mettre en conformité avec la loi 09-08",
    domainId: "compliance",
    domainName: "Conformité légale",
    priority: "high",
    cost: "moyen",
    difficulty: "moyen",
    impact: "moyen",
    guideRef: "CNDP — Guide de conformité 09-08",
    summary: "Déclaration CNDP, registre des traitements, information des personnes.",
    rationale:
      "Vous traitez des données personnelles (clients, salariés) sans déclaration CNDP identifiée. Risque légal et financier direct.",
    description:
      "Réalisez un registre des traitements, déposez les déclarations CNDP applicables, mettez à jour vos mentions d'information et vos contrats sous-traitants.",
  },
  {
    id: "chiffrement-postes",
    title: "Chiffrer les postes portables",
    domainId: "crypto",
    domainName: "Cryptographie",
    priority: "medium",
    cost: "faible",
    difficulty: "faible",
    impact: "moyen",
    guideRef: "Guide ANRT — §9 Cryptographie",
    summary: "Activer BitLocker (Windows) ou FileVault (macOS) sur tous les portables.",
    rationale:
      "Un portable non chiffré perdu ou volé expose l'ensemble de ses données. Le chiffrement disque est gratuit et transparent.",
    description:
      "Activez le chiffrement natif de l'OS sur tous les postes portables, séquestrez les clés de récupération dans un coffre-fort (Bitwarden, KeePass, AD).",
  },
  {
    id: "revue-acces",
    title: "Instaurer une revue trimestrielle des accès",
    domainId: "access",
    domainName: "Contrôle d'accès",
    priority: "medium",
    cost: "faible",
    difficulty: "faible",
    impact: "moyen",
    guideRef: "Guide ANRT — §4.5 Revue d'accès",
    summary: "Vérifier chaque trimestre que les droits accordés correspondent au poste réel.",
    rationale:
      "Les droits s'accumulent au fil des changements de poste. Une revue régulière élimine les accès dormants exploitables.",
    description:
      "Extrayez chaque trimestre la liste des comptes actifs et de leurs droits, faites valider par les managers, désactivez les comptes obsolètes.",
  },
];

export const contextualImpact = 27; // demo

export const historyPoints = [
  { date: "Jan 2025", score: 42 },
  { date: "Avr 2025", score: 51 },
  { date: "Juil 2025", score: 58 },
  { date: "Oct 2025", score: globalScore },
];