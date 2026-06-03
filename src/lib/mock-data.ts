// Mock data pour la démo SIRH Mon Ambassadeur

export type Priorite = "Haute" | "Moyenne" | "Basse";
export type StatutCommande = "Nouvelle" | "En cours" | "Profils présentés" | "Clôturée" | "Annulée";

export interface Commande {
  id: string;
  numero: string;
  dateCommande: string;
  client: string;
  contact: string;
  commercial: string;
  poste: string;
  nbProfils: number;
  datePresentation: string;
  dateDemarrage: string;
  priorite: Priorite;
  responsableRH: string;
  statut: StatutCommande;
  conditions: string;
  commentaires: string;
  secteur?: string;
  adresse?: string;
  contactFonction?: string;
  contactTel?: string;
  contactEmail?: string;
  missions?: string;
  objectifs?: string;
  hardSkills?: string[];
  softSkills?: string[];
  tarif?: string;
  modalites?: string;
}

export const commandes: Commande[] = [
  {
    id: "c1",
    numero: "FCC-2026-001",
    dateCommande: "2026-05-12",
    client: "Orange Business",
    contact: "Sophie Lambert",
    commercial: "Antoine Riva",
    poste: "Développeur Full-Stack",
    nbProfils: 2,
    datePresentation: "2026-06-10",
    dateDemarrage: "2026-07-01",
    priorite: "Haute",
    responsableRH: "Marie Dubois",
    statut: "En cours",
    conditions: "Forfait jour - TJM 650€",
    commentaires: "Client fidèle, besoin urgent renfort équipe Cloud",
    secteur: "Télécom",
    adresse: "78 rue Olivier de Serres, 75015 Paris",
    contactFonction: "Head of Engineering",
    contactTel: "+33 6 12 34 56 78",
    contactEmail: "sophie.lambert@orange.com",
    missions: "Développement de microservices, intégration API, refonte du portail B2B",
    objectifs: "Livrer la v2 du portail avant fin Q3",
    hardSkills: ["React", "Node.js", "AWS", "PostgreSQL"],
    softSkills: ["Autonomie", "Esprit d'équipe", "Communication"],
    tarif: "650€ HT / jour",
    modalites: "Mission longue 12 mois, 3j sur site / 2j télétravail",
  },
  {
    id: "c2",
    numero: "FCC-2026-002",
    dateCommande: "2026-05-18",
    client: "BNP Paribas",
    contact: "Julien Moreau",
    commercial: "Camille Petit",
    poste: "Data Engineer",
    nbProfils: 1,
    datePresentation: "2026-06-05",
    dateDemarrage: "2026-06-20",
    priorite: "Haute",
    responsableRH: "Léa Martin",
    statut: "Profils présentés",
    conditions: "Régie - TJM 720€",
    commentaires: "3 profils présentés, attente retour",
    secteur: "Banque",
    contactEmail: "j.moreau@bnpparibas.com",
    hardSkills: ["Spark", "Python", "Airflow", "Snowflake"],
    softSkills: ["Rigueur", "Pédagogie"],
    tarif: "720€ HT / jour",
  },
  {
    id: "c3",
    numero: "FCC-2026-003",
    dateCommande: "2026-05-22",
    client: "Decathlon",
    contact: "Anne Leroy",
    commercial: "Antoine Riva",
    poste: "UX Designer Senior",
    nbProfils: 1,
    datePresentation: "2026-06-15",
    dateDemarrage: "2026-07-15",
    priorite: "Moyenne",
    responsableRH: "Marie Dubois",
    statut: "Nouvelle",
    conditions: "Forfait projet",
    commentaires: "Refonte parcours app mobile",
  },
  {
    id: "c4",
    numero: "FCC-2026-004",
    dateCommande: "2026-04-30",
    client: "Air France",
    contact: "Pierre Roux",
    commercial: "Camille Petit",
    poste: "DevOps Engineer",
    nbProfils: 2,
    datePresentation: "2026-05-25",
    dateDemarrage: "2026-06-15",
    priorite: "Haute",
    responsableRH: "Léa Martin",
    statut: "Clôturée",
    conditions: "TJM 680€",
    commentaires: "2 talents placés",
  },
  {
    id: "c5",
    numero: "FCC-2026-005",
    dateCommande: "2026-05-28",
    client: "Carrefour",
    contact: "Nadia Bensaid",
    commercial: "Antoine Riva",
    poste: "Product Owner",
    nbProfils: 1,
    datePresentation: "2026-06-20",
    dateDemarrage: "2026-07-10",
    priorite: "Basse",
    responsableRH: "Marie Dubois",
    statut: "Nouvelle",
    conditions: "TJM 600€",
    commentaires: "",
  },
];

// === Fiches de poste ===
export type StatutFiche = "Brouillon" | "Active" | "Archivée";

export interface FichePoste {
  id: string;
  client: string;
  poste: string;
  responsableRH: string;
  dateCreation: string;
  dateMaj: string;
  statut: StatutFiche;
  departement?: string;
  localisation?: string;
  typeMission?: string;
  missionsPrincipales?: string;
  responsabilites?: string;
  experience?: string;
  niveauEtudes?: string;
  hardSkills?: string[];
  softSkills?: string[];
  outils?: string[];
  francais?: string;
  anglais?: string;
  autresLangues?: string;
  evolution?: string;
}

export const fichesPoste: FichePoste[] = [
  {
    id: "FP-001",
    client: "Orange Business",
    poste: "Développeur Full-Stack",
    responsableRH: "Marie Dubois",
    dateCreation: "2026-05-13",
    dateMaj: "2026-05-29",
    statut: "Active",
    departement: "IT - Cloud",
    localisation: "Paris 15e",
    typeMission: "Régie longue",
    missionsPrincipales: "Concevoir et développer les services back-end, contribuer à l'architecture front React",
    responsabilites: "Code reviews, mentorat juniors, qualité logicielle",
    experience: "5 ans minimum",
    niveauEtudes: "Bac+5 école d'ingénieur",
    hardSkills: ["React", "TypeScript", "Node.js", "AWS"],
    softSkills: ["Autonomie", "Curiosité"],
    outils: ["GitHub", "Jira", "Datadog"],
    francais: "Natif",
    anglais: "Courant (C1)",
    evolution: "Tech Lead à 18 mois",
  },
  {
    id: "FP-002",
    client: "BNP Paribas",
    poste: "Data Engineer",
    responsableRH: "Léa Martin",
    dateCreation: "2026-05-19",
    dateMaj: "2026-05-30",
    statut: "Active",
    departement: "Data Platform",
    localisation: "Montreuil",
    typeMission: "Régie 6 mois",
    hardSkills: ["Spark", "Python", "Snowflake", "Airflow"],
    francais: "Courant",
    anglais: "Professionnel (B2)",
  },
  {
    id: "FP-003",
    client: "Decathlon",
    poste: "UX Designer Senior",
    responsableRH: "Marie Dubois",
    dateCreation: "2026-05-23",
    dateMaj: "2026-05-23",
    statut: "Brouillon",
  },
  {
    id: "FP-004",
    client: "Carrefour",
    poste: "Product Owner",
    responsableRH: "Marie Dubois",
    dateCreation: "2026-05-29",
    dateMaj: "2026-05-29",
    statut: "Brouillon",
  },
];

// === Recrutements ===
export type EtapeRecrutement =
  | "R0 Ouverture"
  | "R1 Sourcing"
  | "R2 Qualification"
  | "R3 Entretien"
  | "R4 Présentation profil"
  | "R5 Présentation client"
  | "R6 Formalités"
  | "R7 Onboarding";

export type StatutRecrutement = "Ouvert" | "En cours" | "Stand-by" | "Pourvu" | "Annulé";

export interface Recrutement {
  id: string;
  reference: string;
  client: string;
  poste: string;
  responsableRH: string;
  dateOuverture: string;
  dateEcheance: string;
  statut: StatutRecrutement;
  etape: EtapeRecrutement;
  commentaires: string;
  derniereMaj: string;
}

export const recrutements: Recrutement[] = [
  {
    id: "r1",
    reference: "REC-2026-014",
    client: "Orange Business",
    poste: "Développeur Full-Stack",
    responsableRH: "Marie Dubois",
    dateOuverture: "2026-05-14",
    dateEcheance: "2026-07-01",
    statut: "En cours",
    etape: "R3 Entretien",
    commentaires: "2 candidats qualifiés, entretien R3 cette semaine",
    derniereMaj: "2026-06-01",
  },
  {
    id: "r2",
    reference: "REC-2026-015",
    client: "BNP Paribas",
    poste: "Data Engineer",
    responsableRH: "Léa Martin",
    dateOuverture: "2026-05-19",
    dateEcheance: "2026-06-20",
    statut: "En cours",
    etape: "R5 Présentation client",
    commentaires: "3 profils présentés, retour client mercredi",
    derniereMaj: "2026-06-02",
  },
  {
    id: "r3",
    reference: "REC-2026-016",
    client: "Decathlon",
    poste: "UX Designer Senior",
    responsableRH: "Marie Dubois",
    dateOuverture: "2026-05-23",
    dateEcheance: "2026-07-15",
    statut: "Ouvert",
    etape: "R1 Sourcing",
    commentaires: "Sourcing LinkedIn en cours",
    derniereMaj: "2026-05-30",
  },
  {
    id: "r4",
    reference: "REC-2026-012",
    client: "Air France",
    poste: "DevOps Engineer",
    responsableRH: "Léa Martin",
    dateOuverture: "2026-05-02",
    dateEcheance: "2026-06-15",
    statut: "Pourvu",
    etape: "R7 Onboarding",
    commentaires: "2 talents placés, onboarding en cours",
    derniereMaj: "2026-06-01",
  },
  {
    id: "r5",
    reference: "REC-2026-017",
    client: "Carrefour",
    poste: "Product Owner",
    responsableRH: "Marie Dubois",
    dateOuverture: "2026-05-29",
    dateEcheance: "2026-07-10",
    statut: "Ouvert",
    etape: "R0 Ouverture",
    commentaires: "Brief client à valider",
    derniereMaj: "2026-05-29",
  },
];

// === Pipeline Talents ===
export type EtatTalent = "Actif" | "Inactif" | "En place" | "Ne plus présenter" | "Red Flag";

export interface Talent {
  id: string;
  etat: EtatTalent;
  cv: string;
  portfolio: string;
  dateR2: string;
  dateR3: string;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  poste: string;
  francais: boolean;
  niveauFrancais: string;
  anglais: boolean;
  niveauAnglais: string;
  experience: string;
  hardSkills: string;
  softSkills: string;
  outils: string;
  disponibilite: string;
  tarif8h: string;
  tarif4h: string;
  tarifNegocie: string;
  client: string;
  etatR3: string;
  historique: string;
  remarqueRH: string;
}

export const talents: Talent[] = [
  {
    id: "t1",
    etat: "Actif",
    cv: "cv-laurent.pdf",
    portfolio: "laurent.dev",
    dateR2: "2026-05-20",
    dateR3: "2026-05-27",
    nom: "Lefevre",
    prenom: "Laurent",
    email: "laurent.lefevre@email.com",
    telephone: "+33 6 11 22 33 44",
    poste: "Développeur Full-Stack",
    francais: true,
    niveauFrancais: "Natif",
    anglais: true,
    niveauAnglais: "C1",
    experience: "7 ans",
    hardSkills: "React, Node.js, AWS, Docker",
    softSkills: "Autonomie, Leadership",
    outils: "VS Code, GitHub, Jira",
    disponibilite: "Sous 2 semaines",
    tarif8h: "650€",
    tarif4h: "380€",
    tarifNegocie: "620€",
    client: "Orange Business",
    etatR3: "Validé",
    historique: "Mission précédente: Société Générale (2024-2025)",
    remarqueRH: "Très bon feeling, profil senior fiable",
  },
  {
    id: "t2",
    etat: "Actif",
    cv: "cv-amelie.pdf",
    portfolio: "",
    dateR2: "2026-05-22",
    dateR3: "",
    nom: "Garnier",
    prenom: "Amélie",
    email: "amelie.g@email.com",
    telephone: "+33 6 22 33 44 55",
    poste: "Data Engineer",
    francais: true,
    niveauFrancais: "Natif",
    anglais: true,
    niveauAnglais: "B2",
    experience: "5 ans",
    hardSkills: "Spark, Python, Snowflake",
    softSkills: "Rigueur, Pédagogie",
    outils: "Airflow, dbt, GitLab",
    disponibilite: "Immédiate",
    tarif8h: "700€",
    tarif4h: "400€",
    tarifNegocie: "",
    client: "BNP Paribas",
    etatR3: "À planifier",
    historique: "1 mission via MA en 2024",
    remarqueRH: "Excellent profil data, motivée",
  },
  {
    id: "t3",
    etat: "En place",
    cv: "cv-karim.pdf",
    portfolio: "karim.design",
    dateR2: "2026-04-10",
    dateR3: "2026-04-18",
    nom: "Benali",
    prenom: "Karim",
    email: "karim.benali@email.com",
    telephone: "+33 6 33 44 55 66",
    poste: "DevOps Engineer",
    francais: true,
    niveauFrancais: "Natif",
    anglais: true,
    niveauAnglais: "C1",
    experience: "8 ans",
    hardSkills: "Kubernetes, Terraform, AWS, GCP",
    softSkills: "Autonomie, Pragmatisme",
    outils: "ArgoCD, Helm, Datadog",
    disponibilite: "Indisponible",
    tarif8h: "720€",
    tarif4h: "",
    tarifNegocie: "680€",
    client: "Air France",
    etatR3: "Validé",
    historique: "En mission depuis juin 2026",
    remarqueRH: "Top performer",
  },
  {
    id: "t4",
    etat: "Red Flag",
    cv: "cv-marc.pdf",
    portfolio: "",
    dateR2: "2026-03-15",
    dateR3: "",
    nom: "Durand",
    prenom: "Marc",
    email: "marc.durand@email.com",
    telephone: "+33 6 44 55 66 77",
    poste: "Développeur Back-End",
    francais: true,
    niveauFrancais: "Natif",
    anglais: false,
    niveauAnglais: "A2",
    experience: "4 ans",
    hardSkills: "Java, Spring",
    softSkills: "",
    outils: "IntelliJ",
    disponibilite: "Immédiate",
    tarif8h: "550€",
    tarif4h: "",
    tarifNegocie: "",
    client: "",
    etatR3: "",
    historique: "Mission Société Générale 2024 - rupture anticipée",
    remarqueRH: "Comportement inadéquat sur mission, ne plus présenter",
  },
  {
    id: "t5",
    etat: "Inactif",
    cv: "cv-clara.pdf",
    portfolio: "clara.ux",
    dateR2: "2026-02-05",
    dateR3: "2026-02-12",
    nom: "Petit",
    prenom: "Clara",
    email: "clara.petit@email.com",
    telephone: "+33 6 55 66 77 88",
    poste: "UX Designer Senior",
    francais: true,
    niveauFrancais: "Natif",
    anglais: true,
    niveauAnglais: "C2",
    experience: "9 ans",
    hardSkills: "Figma, Design system, Research",
    softSkills: "Empathie, Communication",
    outils: "Figma, Maze, Notion",
    disponibilite: "Septembre 2026",
    tarif8h: "680€",
    tarif4h: "390€",
    tarifNegocie: "",
    client: "",
    etatR3: "Validé",
    historique: "2 missions précédentes",
    remarqueRH: "À recontacter août",
  },
];

// === Collaborateurs ===
export type EtatCollaborateur = "Actif" | "Inactif" | "Sorti";

export interface Collaborateur {
  id: string;
  etat: EtatCollaborateur;
  idMA: string;
  nom: string;
  prenom: string;
  dateNaissance: string;
  email: string;
  tel1: string;
  tel2: string;
  contactUrgence: string;
  numeroCIN: string;
  dateValiditeCIN: string;
  dateEntree: string;
  contrat: string;
  avenant1: string;
  avenant2: string;
  avenant3: string;
  attestation: string;
  onboarding: string;
}

export const collaborateurs: Collaborateur[] = [
  {
    id: "co1",
    etat: "Actif",
    idMA: "MA-0042",
    nom: "Lefevre",
    prenom: "Laurent",
    dateNaissance: "1989-03-14",
    email: "laurent.lefevre@monambassadeur.com",
    tel1: "+33 6 11 22 33 44",
    tel2: "",
    contactUrgence: "Marie Lefevre - +33 6 99 88 77 66",
    numeroCIN: "12345678",
    dateValiditeCIN: "2032-05-10",
    dateEntree: "2026-06-15",
    contrat: "contrat-lefevre.pdf",
    avenant1: "",
    avenant2: "",
    avenant3: "",
    attestation: "attestation-lefevre.pdf",
    onboarding: "Terminé",
  },
  {
    id: "co2",
    etat: "Actif",
    idMA: "MA-0038",
    nom: "Benali",
    prenom: "Karim",
    dateNaissance: "1985-09-22",
    email: "karim.benali@monambassadeur.com",
    tel1: "+33 6 33 44 55 66",
    tel2: "",
    contactUrgence: "Yasmine Benali - +33 6 11 11 22 22",
    numeroCIN: "87654321",
    dateValiditeCIN: "2030-11-04",
    dateEntree: "2026-06-01",
    contrat: "contrat-benali.pdf",
    avenant1: "avenant1-benali.pdf",
    avenant2: "",
    avenant3: "",
    attestation: "attestation-benali.pdf",
    onboarding: "En cours",
  },
  {
    id: "co3",
    etat: "Sorti",
    idMA: "MA-0021",
    nom: "Durand",
    prenom: "Marc",
    dateNaissance: "1990-12-01",
    email: "marc.durand@monambassadeur.com",
    tel1: "+33 6 44 55 66 77",
    tel2: "",
    contactUrgence: "",
    numeroCIN: "11223344",
    dateValiditeCIN: "2029-01-20",
    dateEntree: "2024-09-01",
    contrat: "contrat-durand.pdf",
    avenant1: "",
    avenant2: "",
    avenant3: "",
    attestation: "attestation-durand.pdf",
    onboarding: "Terminé",
  },
  {
    id: "co4",
    etat: "Actif",
    idMA: "MA-0045",
    nom: "Garnier",
    prenom: "Amélie",
    dateNaissance: "1992-07-08",
    email: "amelie.garnier@monambassadeur.com",
    tel1: "+33 6 22 33 44 55",
    tel2: "",
    contactUrgence: "Paul Garnier - +33 6 77 66 55 44",
    numeroCIN: "44556677",
    dateValiditeCIN: "2031-03-15",
    dateEntree: "2026-06-20",
    contrat: "contrat-garnier.pdf",
    avenant1: "",
    avenant2: "",
    avenant3: "",
    attestation: "",
    onboarding: "Planifié",
  },
];

// === Entrées ===
export interface Entree {
  id: string;
  etat: "Actif" | "Stand-by";
  idMA: string;
  entreprise: string;
  nom: string;
  prenom: string;
  dateEntree: string;
  missions: string;
  typeContrat: string;
  lieuTravail: string;
  dateSortie: string;
  anciennete: string;
  motif: string;
  commentaire: string;
  accompagnateur: string;
}

export const entrees: Entree[] = [
  {
    id: "e1",
    etat: "Actif",
    idMA: "MA-0042",
    entreprise: "Orange Business",
    nom: "Lefevre",
    prenom: "Laurent",
    dateEntree: "2026-06-15",
    missions: "Développement portail B2B",
    typeContrat: "CDI",
    lieuTravail: "Paris 15e",
    dateSortie: "",
    anciennete: "0 mois",
    motif: "",
    commentaire: "Intégration prévue lundi",
    accompagnateur: "Marie Dubois",
  },
  {
    id: "e2",
    etat: "Actif",
    idMA: "MA-0038",
    entreprise: "Air France",
    nom: "Benali",
    prenom: "Karim",
    dateEntree: "2026-06-01",
    missions: "Plateforme DevOps",
    typeContrat: "CDI",
    lieuTravail: "Roissy",
    dateSortie: "",
    anciennete: "0 mois",
    motif: "",
    commentaire: "Onboarding en cours",
    accompagnateur: "Léa Martin",
  },
  {
    id: "e3",
    etat: "Actif",
    idMA: "MA-0045",
    entreprise: "BNP Paribas",
    nom: "Garnier",
    prenom: "Amélie",
    dateEntree: "2026-06-20",
    missions: "Data platform Snowflake",
    typeContrat: "Freelance",
    lieuTravail: "Montreuil",
    dateSortie: "",
    anciennete: "0 mois",
    motif: "",
    commentaire: "Démarrage confirmé",
    accompagnateur: "Léa Martin",
  },
];

// === Sorties ===
export interface Sortie {
  id: string;
  etat: "Sorti";
  idMA: string;
  entreprise: string;
  nom: string;
  prenom: string;
  dateDebut: string;
  missions: string;
  typeContrat: string;
  lieuTravail: string;
  dateFin: string;
  anciennete: string;
  motif: string;
  commentaire: string;
  accompagnateur: string;
}

export const sorties: Sortie[] = [
  {
    id: "s1",
    etat: "Sorti",
    idMA: "MA-0021",
    entreprise: "Société Générale",
    nom: "Durand",
    prenom: "Marc",
    dateDebut: "2024-09-01",
    missions: "Backend Java",
    typeContrat: "CDI",
    lieuTravail: "La Défense",
    dateFin: "2025-12-31",
    anciennete: "1 an 4 mois",
    motif: "Rupture anticipée",
    commentaire: "Comportement inadéquat",
    accompagnateur: "Marie Dubois",
  },
  {
    id: "s2",
    etat: "Sorti",
    idMA: "MA-0014",
    entreprise: "Renault",
    nom: "Moreau",
    prenom: "Julie",
    dateDebut: "2023-04-01",
    missions: "Product Management",
    typeContrat: "CDI",
    lieuTravail: "Boulogne",
    dateFin: "2025-09-30",
    anciennete: "2 ans 6 mois",
    motif: "Démission",
    commentaire: "Départ pour création d'entreprise",
    accompagnateur: "Léa Martin",
  },
  {
    id: "s3",
    etat: "Sorti",
    idMA: "MA-0019",
    entreprise: "L'Oréal",
    nom: "Chen",
    prenom: "Wei",
    dateDebut: "2022-11-15",
    missions: "Data Analytics",
    typeContrat: "Freelance",
    lieuTravail: "Clichy",
    dateFin: "2025-06-30",
    anciennete: "2 ans 8 mois",
    motif: "Fin de mission",
    commentaire: "Excellent retour client",
    accompagnateur: "Marie Dubois",
  },
];
