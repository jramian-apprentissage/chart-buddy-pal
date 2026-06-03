import type { Commande } from "@/lib/mock-data";

export type FccOrderInput = {
  idEntreprise?: string;
  nomEntreprise: string;
  secteurActivite?: string;
  siret?: string;
  adresse?: string;
  nomContact?: string;
  prenomContact?: string;
  interlocuteurPrincipal: string;
  presentationEntreprise?: string;
  cibleCommerciale?: string;
  intitulePoste: string;
  categoriePoste?: string;
  offreSelectionnee?: string;
  nombreProfils?: string;
  objectifPrincipal?: string;
  missionsPrincipales?: string;
  competencesTechniques?: string;
  softSkills?: string;
  dateDemarrage?: string;
  datePresentationProfil?: string;
  typeContratTemps?: string;
  budgetMission?: string;
  engagementDuree?: string;
};

const STORAGE_KEY = "mon-ambassadeur:fcc-commandes";

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

function splitLines(value?: string) {
  return (value ?? "")
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

export function generateCommandeNumber(existingCount = 0) {
  const now = new Date();
  const datePart = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(
    now.getDate(),
  ).padStart(2, "0")}`;
  const sequence = String(existingCount + 1).padStart(3, "0");

  return `FCC-${datePart}-${sequence}`;
}

export function readStoredFccCommandes(): Commande[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error("Impossible de lire les commandes FCC stockées", error);
    return [];
  }
}

export function saveStoredFccCommandes(commandes: Commande[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(commandes));
}

export function createCommandeFromFccForm(input: FccOrderInput): Commande {
  const existing = readStoredFccCommandes();
  const numero = generateCommandeNumber(existing.length);
  const fullContact = input.interlocuteurPrincipal || [input.prenomContact, input.nomContact].filter(Boolean).join(" ");
  const createdAt = todayIso();

  return {
    id: `fcc-${Date.now()}`,
    numero,
    dateCommande: createdAt,
    client: input.nomEntreprise,
    contact: fullContact || "Contact non renseigné",
    commercial: "À renseigner",
    poste: input.intitulePoste,
    nbProfils: Number(input.nombreProfils || 1),
    datePresentation: input.datePresentationProfil || "",
    dateDemarrage: input.dateDemarrage || "",
    priorite: "Moyenne",
    responsableRH: "À affecter",
    statut: "Nouvelle",
    conditions: [input.typeContratTemps, input.budgetMission, input.engagementDuree].filter(Boolean).join(" · "),
    commentaires: "Commande créée depuis le formulaire FCC.",
    secteur: input.secteurActivite,
    adresse: input.adresse,
    contactFonction: input.cibleCommerciale,
    missions: input.missionsPrincipales,
    objectifs: input.objectifPrincipal,
    hardSkills: splitLines(input.competencesTechniques),
    softSkills: splitLines(input.softSkills),
    tarif: input.budgetMission,
    modalites: input.engagementDuree || input.typeContratTemps,
  };
}

export function addFccCommande(input: FccOrderInput) {
  const existing = readStoredFccCommandes();
  const commande = createCommandeFromFccForm(input);
  const updated = [commande, ...existing];
  saveStoredFccCommandes(updated);

  return commande;
}
