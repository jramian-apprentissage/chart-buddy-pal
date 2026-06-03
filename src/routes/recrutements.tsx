import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { PageHeader } from "@/components/page-header";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { Check, Circle, Copy, ExternalLink, FilePlus2, Link2, Plus, UserPlus } from "lucide-react";

export const Route = createFileRoute("/recrutements")({
  head: () => ({ meta: [{ title: "Pipeline recrutement — SIRH" }] }),
  component: RecrutementsPage,
});

type EtapeCode = "R0" | "R1" | "R2" | "R3" | "R4" | "R5" | "R6" | "R7";
type StatutPipeline = "En cours" | "Bloqué" | "Terminé" | "Annulé";
type StatutTache = "À faire" | "En cours" | "Terminé" | "Bloqué";
type Priorite = "Haute" | "Moyenne" | "Basse";
type CandidatureStatut = "Nouvelle" | "À qualifier" | "Qualifiée" | "Présentée" | "Refusée";

type Pipeline = {
  id: string;
  numeroCommande: string;
  entreprise: string;
  poste: string;
  responsable: string;
  etapeActuelle: EtapeCode;
  statut: StatutPipeline;
  progression: number;
  dateCreation: string;
  derniereMaj: string;
  commentaire: string;
  priorite: Priorite;
  nbProfils: number;
  budget: string;
  dateCommande: string;
  dateDemarrage: string;
  ficheCommande: string;
  fichePoste: string;
  statutCommande: string;
};

type Tache = {
  id: string;
  pipelineId: string;
  etape: EtapeCode;
  nom: string;
  responsable: string;
  statut: StatutTache;
  echeance: string;
  dateRealisation?: string;
  commentaire: string;
  pieceJointe?: string;
};

type Candidature = {
  id: string;
  pipelineId: string;
  date: string;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  cv: string;
  portfolio: string;
  poste: string;
  francais: string;
  anglais: string;
  experience: string;
  hardSkills: string;
  softSkills: string;
  outils: string;
  disponibilite: string;
  tarif8h: string;
  tarif4h: string;
  statut: CandidatureStatut;
  source: string;
};

type FormulaireRattache = {
  id: string;
  pipelineId: string;
  nom: string;
  lien: string;
  statut: "Actif" | "Fermé";
  candidatures: number;
};

const ETAPES: { code: EtapeCode; titre: string; aide: string }[] = [
  { code: "R0", titre: "Ouverture", aide: "Fiche de commande, poste et lancement" },
  { code: "R1", titre: "Sourcing", aide: "Vivier, annonces et centralisation CV" },
  { code: "R2", titre: "Qualification", aide: "Appels, scoring et premiers refus" },
  { code: "R3", titre: "Entretien approfondi", aide: "Visio, compte rendu et sélection" },
  { code: "R4", titre: "Présentation candidat", aide: "CV anonymisés et préparation profil" },
  { code: "R5", titre: "Présentation client", aide: "Présentation, Fireflies et restitution" },
  { code: "R6", titre: "Formalités", aide: "Contrats, facturation et paiement" },
  { code: "R7", titre: "Onboarding", aide: "Bienvenue, intégration et suivi J+5" },
];

const templatesFormulaires = [
  "Candidature développeur confirmé",
  "Candidature data / BI",
  "Candidature UX / Product",
  "Cooptation ambassadeur",
];

const pipelinesInitial: Pipeline[] = [
  {
    id: "pipe-001",
    numeroCommande: "FCC-2026-001",
    entreprise: "Orange Business",
    poste: "Développeur Full-Stack",
    responsable: "Marie Dubois",
    etapeActuelle: "R3",
    statut: "En cours",
    progression: 48,
    dateCreation: "2026-05-14",
    derniereMaj: "2026-06-02",
    commentaire: "Deux candidats qualifiés, entretien approfondi cette semaine.",
    priorite: "Haute",
    nbProfils: 2,
    budget: "650 € HT / jour",
    dateCommande: "2026-05-12",
    dateDemarrage: "2026-07-01",
    ficheCommande: "FCC-2026-001.pdf",
    fichePoste: "FP-Orange-Fullstack.pdf",
    statutCommande: "En cours",
  },
  {
    id: "pipe-002",
    numeroCommande: "FCC-2026-002",
    entreprise: "BNP Paribas",
    poste: "Data Engineer",
    responsable: "Léa Martin",
    etapeActuelle: "R5",
    statut: "En cours",
    progression: 66,
    dateCreation: "2026-05-19",
    derniereMaj: "2026-06-03",
    commentaire: "Présentation client planifiée, trois profils retenus.",
    priorite: "Haute",
    nbProfils: 1,
    budget: "720 € HT / jour",
    dateCommande: "2026-05-18",
    dateDemarrage: "2026-06-20",
    ficheCommande: "FCC-2026-002.pdf",
    fichePoste: "FP-BNP-DataEngineer.pdf",
    statutCommande: "Profils présentés",
  },
  {
    id: "pipe-003",
    numeroCommande: "FCC-2026-003",
    entreprise: "Decathlon",
    poste: "UX Designer Senior",
    responsable: "Marie Dubois",
    etapeActuelle: "R1",
    statut: "Bloqué",
    progression: 19,
    dateCreation: "2026-05-23",
    derniereMaj: "2026-05-31",
    commentaire: "Validation DRH manquante avant publication des annonces.",
    priorite: "Moyenne",
    nbProfils: 1,
    budget: "Forfait projet",
    dateCommande: "2026-05-22",
    dateDemarrage: "2026-07-15",
    ficheCommande: "FCC-2026-003.pdf",
    fichePoste: "FP-Decathlon-UX.pdf",
    statutCommande: "Nouvelle",
  },
];

const tachesInitiales: Tache[] = [
  { id: "t1", pipelineId: "pipe-001", etape: "R0", nom: "Lecture fiche de commande", responsable: "Marie Dubois", statut: "Terminé", echeance: "2026-05-15", dateRealisation: "2026-05-15", commentaire: "Commande comprise.", pieceJointe: "FCC-2026-001.pdf" },
  { id: "t2", pipelineId: "pipe-001", etape: "R0", nom: "Rédaction fiche de poste", responsable: "Marie Dubois", statut: "Terminé", echeance: "2026-05-16", dateRealisation: "2026-05-16", commentaire: "Fiche prête.", pieceJointe: "FP-Orange-Fullstack.pdf" },
  { id: "t3", pipelineId: "pipe-001", etape: "R1", nom: "Recherche dans le vivier", responsable: "Léa Martin", statut: "Terminé", echeance: "2026-05-21", dateRealisation: "2026-05-20", commentaire: "18 profils identifiés." },
  { id: "t4", pipelineId: "pipe-001", etape: "R1", nom: "Publication des annonces", responsable: "Nora Benali", statut: "Terminé", echeance: "2026-05-22", dateRealisation: "2026-05-22", commentaire: "LinkedIn et jobboard." },
  { id: "t5", pipelineId: "pipe-001", etape: "R2", nom: "Appel candidat", responsable: "Léa Martin", statut: "Terminé", echeance: "2026-05-27", dateRealisation: "2026-05-27", commentaire: "4 candidats joints." },
  { id: "t6", pipelineId: "pipe-001", etape: "R2", nom: "Scoring talent", responsable: "Léa Martin", statut: "Terminé", echeance: "2026-05-29", dateRealisation: "2026-05-29", commentaire: "2 profils au-dessus de 80 %." },
  { id: "t7", pipelineId: "pipe-001", etape: "R3", nom: "Visio candidat R3", responsable: "Marie Dubois", statut: "En cours", echeance: "2026-06-05", commentaire: "Entretien à réaliser demain." },
  { id: "t8", pipelineId: "pipe-001", etape: "R3", nom: "Compte rendu obligatoire", responsable: "Marie Dubois", statut: "À faire", echeance: "2026-06-06", commentaire: "À compléter après la visio." },
  { id: "t9", pipelineId: "pipe-002", etape: "R5", nom: "Gestion salle d’attente", responsable: "Léa Martin", statut: "À faire", echeance: "2026-06-05", commentaire: "Préparer le lien Meet." },
  { id: "t10", pipelineId: "pipe-002", etape: "R5", nom: "Rédaction compte rendu présentation", responsable: "Jimmy Ramian", statut: "En cours", echeance: "2026-06-06", commentaire: "CR de synthèse attendu après la présentation." },
  { id: "t11", pipelineId: "pipe-003", etape: "R0", nom: "Validation DRH", responsable: "Marie Dubois", statut: "Bloqué", echeance: "2026-06-04", commentaire: "Attente retour DRH." },
  { id: "t12", pipelineId: "pipe-003", etape: "R1", nom: "Rédaction des annonces", responsable: "Nora Benali", statut: "À faire", echeance: "2026-06-07", commentaire: "Démarrer après validation." },
];

const candidaturesInitiales: Candidature[] = [
  { id: "cand-1", pipelineId: "pipe-001", date: "2026-05-26", nom: "Lefevre", prenom: "Laurent", email: "laurent.lefevre@email.fr", telephone: "+33 6 10 20 30 40", cv: "CV-Laurent.pdf", portfolio: "laurent.dev", poste: "Développeur Full-Stack", francais: "Natif", anglais: "C1", experience: "7 ans", hardSkills: "React, Node.js, AWS", softSkills: "Autonomie, pédagogie", outils: "GitHub, Jira, Docker", disponibilite: "2 semaines", tarif8h: "640 €", tarif4h: "360 €", statut: "Qualifiée", source: "LinkedIn Fullstack" },
  { id: "cand-2", pipelineId: "pipe-001", date: "2026-05-27", nom: "Diallo", prenom: "Sarah", email: "sarah.diallo@email.fr", telephone: "+33 6 98 76 54 32", cv: "CV-Sarah.pdf", portfolio: "github.com/sarahd", poste: "Développeur Full-Stack", francais: "Courant", anglais: "B2", experience: "5 ans", hardSkills: "TypeScript, PostgreSQL, API", softSkills: "Rigueur, communication", outils: "GitLab, Notion", disponibilite: "Immédiate", tarif8h: "610 €", tarif4h: "340 €", statut: "À qualifier", source: "Jobboard React" },
  { id: "cand-3", pipelineId: "pipe-002", date: "2026-05-30", nom: "Martin", prenom: "Hugo", email: "hugo.martin@email.fr", telephone: "+33 7 11 22 33 44", cv: "CV-Hugo.pdf", portfolio: "hugo-data.io", poste: "Data Engineer", francais: "Natif", anglais: "B2", experience: "6 ans", hardSkills: "Spark, Python, Snowflake", softSkills: "Analyse, fiabilité", outils: "Airflow, dbt", disponibilite: "1 mois", tarif8h: "700 €", tarif4h: "390 €", statut: "Présentée", source: "Campagne data" },
];

const formulairesInitiaux: FormulaireRattache[] = [
  { id: "form-1", pipelineId: "pipe-001", nom: "Candidature développeur confirmé", lien: "https://demo.ma-sirh.fr/candidature/pipe-001-fullstack", statut: "Actif", candidatures: 2 },
  { id: "form-2", pipelineId: "pipe-002", nom: "Candidature data / BI", lien: "https://demo.ma-sirh.fr/candidature/pipe-002-data", statut: "Actif", candidatures: 1 },
];

const currentUser = "Jimmy Ramian";

function RecrutementsPage() {
  const [q, setQ] = useState("");
  const [pipelines, setPipelines] = useState(pipelinesInitial);
  const [taches, setTaches] = useState(tachesInitiales);
  const [candidatures] = useState(candidaturesInitiales);
  const [formulaires, setFormulaires] = useState(formulairesInitiaux);
  const [selectedId, setSelectedId] = useState(pipelinesInitial[0]?.id ?? "");
  const [selectedCandidature, setSelectedCandidature] = useState<Candidature | null>(null);
  const [templateSelectionne, setTemplateSelectionne] = useState(templatesFormulaires[0]);

  const filtered = useMemo(
    () =>
      pipelines.filter((p) =>
        [p.numeroCommande, p.entreprise, p.poste, p.responsable, p.statut]
          .join(" ")
          .toLowerCase()
          .includes(q.toLowerCase()),
      ),
    [pipelines, q],
  );

  const selected = pipelines.find((p) => p.id === selectedId) ?? filtered[0] ?? pipelines[0];
  const selectedTaches = taches.filter((t) => t.pipelineId === selected?.id);
  const selectedCandidatures = candidatures.filter((c) => c.pipelineId === selected?.id);
  const selectedFormulaires = formulaires.filter((f) => f.pipelineId === selected?.id);
  const mesTaches = taches.filter((t) => t.responsable === currentUser && t.statut !== "Terminé");

  const updateTask = (taskId: string, patch: Partial<Tache>) => {
    setTaches((current) =>
      current.map((task) => {
        if (task.id !== taskId) return task;
        const next = { ...task, ...patch };
        if (patch.statut === "Terminé" && !task.dateRealisation) {
          next.dateRealisation = new Date().toISOString().slice(0, 10);
        }
        return next;
      }),
    );
  };

  const addTask = () => {
    if (!selected) return;
    const task: Tache = {
      id: `t-${Date.now()}`,
      pipelineId: selected.id,
      etape: selected.etapeActuelle,
      nom: "Nouvelle tâche de démo",
      responsable: currentUser,
      statut: "À faire",
      echeance: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
      commentaire: "Tâche ajoutée depuis l’interface de démonstration.",
    };
    setTaches((current) => [task, ...current]);
  };

  const addFormulaire = () => {
    if (!selected) return;
    const slug = `${selected.id}-${templateSelectionne.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
    setFormulaires((current) => [
      ...current,
      {
        id: `form-${Date.now()}`,
        pipelineId: selected.id,
        nom: templateSelectionne,
        lien: `https://demo.ma-sirh.fr/candidature/${slug}`,
        statut: "Actif",
        candidatures: 0,
      },
    ]);
  };

  const advancePipeline = () => {
    if (!selected) return;
    const currentIndex = ETAPES.findIndex((e) => e.code === selected.etapeActuelle);
    const next = ETAPES[Math.min(currentIndex + 1, ETAPES.length - 1)];
    setPipelines((current) =>
      current.map((pipeline) =>
        pipeline.id === selected.id
          ? {
              ...pipeline,
              etapeActuelle: next.code,
              progression: Math.min(100, pipeline.progression + 12),
              derniereMaj: new Date().toISOString().slice(0, 10),
              statut: next.code === "R7" ? "Terminé" : "En cours",
            }
          : pipeline,
      ),
    );
  };

  return (
    <div>
      <PageHeader
        title="Pipeline recrutement"
        description="Vue de démonstration pour suivre chaque commande, ses tâches R0 à R7, ses candidatures et ses formulaires rattachés."
        actionLabel="Nouvelle commande FCC"
        onAction={() => alert("Démo : création d’une commande FCC, d’un pipeline et des tâches associées.")}
      >
        <Input placeholder="Rechercher commande, client, poste…" value={q} onChange={(e) => setQ(e.target.value)} className="w-72" />
      </PageHeader>

      <div className="grid gap-6 p-6 xl:grid-cols-[minmax(0,1fr)_340px]">
        <main className="space-y-6">
          <section className="grid gap-4 md:grid-cols-4">
            <Kpi label="Pipelines actifs" value={pipelines.filter((p) => p.statut === "En cours").length} />
            <Kpi label="Commandes bloquées" value={pipelines.filter((p) => p.statut === "Bloqué").length} tone="warning" />
            <Kpi label="Candidatures reçues" value={candidatures.length} />
            <Kpi label="Mes tâches ouvertes" value={mesTaches.length} tone="accent" />
          </section>

          <section className="overflow-hidden rounded-xl border border-border bg-card">
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <div>
                <h2 className="font-semibold">Commandes en pipeline</h2>
                <p className="text-sm text-muted-foreground">Clique sur une ligne pour afficher le détail opérationnel.</p>
              </div>
              <Button variant="outline" size="sm" onClick={() => alert("Démo : export pipeline généré.")}>Exporter</Button>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID Pipeline</TableHead>
                  <TableHead>N° commande</TableHead>
                  <TableHead>Entreprise</TableHead>
                  <TableHead>Poste</TableHead>
                  <TableHead>Responsable</TableHead>
                  <TableHead>Étape</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Progression</TableHead>
                  <TableHead>Dernière MAJ</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((pipeline) => (
                  <TableRow
                    key={pipeline.id}
                    className={cn("cursor-pointer", selected?.id === pipeline.id && "bg-primary/5")}
                    onClick={() => setSelectedId(pipeline.id)}
                  >
                    <TableCell className="font-medium">{pipeline.id}</TableCell>
                    <TableCell>{pipeline.numeroCommande}</TableCell>
                    <TableCell>{pipeline.entreprise}</TableCell>
                    <TableCell>{pipeline.poste}</TableCell>
                    <TableCell>{pipeline.responsable}</TableCell>
                    <TableCell><span className="rounded bg-muted px-2 py-1 text-xs font-medium">{pipeline.etapeActuelle}</span></TableCell>
                    <TableCell><StatusBadge value={pipeline.statut} /></TableCell>
                    <TableCell><Progress value={pipeline.progression} /></TableCell>
                    <TableCell>{pipeline.derniereMaj}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </section>

          {selected && (
            <section className="rounded-xl border border-border bg-card p-4">
              <div className="flex flex-col gap-4 border-b border-border pb-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-xl font-semibold">{selected.numeroCommande} · {selected.entreprise}</h2>
                    <StatusBadge value={selected.priorite} />
                    <StatusBadge value={selected.statut} />
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{selected.poste} · {selected.commentaire}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" size="sm" onClick={addTask}><Plus /> Ajouter tâche</Button>
                  <Button size="sm" onClick={advancePipeline}><Check /> Avancer étape</Button>
                </div>
              </div>

              <div className="my-5 grid gap-2 md:grid-cols-8">
                {ETAPES.map((etape, index) => {
                  const currentIndex = ETAPES.findIndex((item) => item.code === selected.etapeActuelle);
                  const done = index < currentIndex;
                  const current = index === currentIndex;
                  return (
                    <div key={etape.code} className={cn("rounded-lg border p-3", done && "border-primary bg-primary/10", current && "border-accent bg-accent/20", !done && !current && "bg-muted/40")}>
                      <div className="flex items-center gap-2">
                        <span className={cn("flex h-6 w-6 items-center justify-center rounded-full text-xs", done ? "bg-primary text-primary-foreground" : "bg-background")}>{done ? <Check className="h-3 w-3" /> : <Circle className="h-2.5 w-2.5 fill-current" />}</span>
                        <span className="font-semibold">{etape.code}</span>
                      </div>
                      <p className="mt-2 text-xs font-medium">{etape.titre}</p>
                      <p className="mt-1 text-[11px] text-muted-foreground">{etape.aide}</p>
                    </div>
                  );
                })}
              </div>

              <Tabs defaultValue="details" className="w-full">
                <TabsList className="flex h-auto flex-wrap justify-start">
                  <TabsTrigger value="details">Détails commande</TabsTrigger>
                  <TabsTrigger value="taches">Tâches du pipeline</TabsTrigger>
                  <TabsTrigger value="candidatures">Candidatures</TabsTrigger>
                  <TabsTrigger value="formulaires">Formulaires rattachés</TabsTrigger>
                </TabsList>

                <TabsContent value="details" className="mt-4">
                  <div className="grid gap-4 md:grid-cols-3">
                    <Info label="Client" value={selected.entreprise} />
                    <Info label="Poste" value={selected.poste} />
                    <Info label="Nombre de profils" value={selected.nbProfils} />
                    <Info label="Budget" value={selected.budget} />
                    <Info label="Date commande" value={selected.dateCommande} />
                    <Info label="Date démarrage" value={selected.dateDemarrage} />
                    <Info label="Fiche de commande" value={selected.ficheCommande} icon={<ExternalLink className="h-3.5 w-3.5" />} />
                    <Info label="Fiche de poste" value={selected.fichePoste} icon={<ExternalLink className="h-3.5 w-3.5" />} />
                    <Info label="Responsable recherche" value={selected.responsable} />
                    <Info label="Priorité" value={<StatusBadge value={selected.priorite} />} />
                    <Info label="Statut commande" value={selected.statutCommande} />
                    <Info label="Création pipeline" value={selected.dateCreation} />
                  </div>
                </TabsContent>

                <TabsContent value="taches" className="mt-4">
                  <div className="overflow-hidden rounded-lg border border-border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Étape</TableHead>
                          <TableHead>Nom tâche</TableHead>
                          <TableHead>Responsable</TableHead>
                          <TableHead>Statut</TableHead>
                          <TableHead>Échéance</TableHead>
                          <TableHead>Date réalisation</TableHead>
                          <TableHead>Commentaire</TableHead>
                          <TableHead>Pièce jointe</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedTaches.map((task) => (
                          <TableRow key={task.id}>
                            <TableCell><span className="rounded bg-muted px-2 py-1 text-xs font-medium">{task.etape}</span></TableCell>
                            <TableCell className="min-w-52 font-medium">{task.nom}</TableCell>
                            <TableCell>
                              <select className="rounded-md border border-input bg-background px-2 py-1 text-sm" value={task.responsable} onChange={(e) => updateTask(task.id, { responsable: e.target.value })}>
                                {["Marie Dubois", "Léa Martin", "Nora Benali", "Jimmy Ramian"].map((person) => <option key={person}>{person}</option>)}
                              </select>
                            </TableCell>
                            <TableCell>
                              <select className="rounded-md border border-input bg-background px-2 py-1 text-sm" value={task.statut} onChange={(e) => updateTask(task.id, { statut: e.target.value as StatutTache })}>
                                {["À faire", "En cours", "Terminé", "Bloqué"].map((statut) => <option key={statut}>{statut}</option>)}
                              </select>
                            </TableCell>
                            <TableCell>{task.echeance}</TableCell>
                            <TableCell>{task.dateRealisation ?? "—"}</TableCell>
                            <TableCell className="max-w-64 text-muted-foreground">{task.commentaire}</TableCell>
                            <TableCell>{task.pieceJointe ?? "—"}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>

                <TabsContent value="candidatures" className="mt-4">
                  <div className="overflow-hidden rounded-lg border border-border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Candidat</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Expérience</TableHead>
                          <TableHead>Hard skills</TableHead>
                          <TableHead>Disponibilité</TableHead>
                          <TableHead>Tarif 8h</TableHead>
                          <TableHead>Statut</TableHead>
                          <TableHead>Source</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedCandidatures.map((candidat) => (
                          <TableRow key={candidat.id} className="cursor-pointer" onClick={() => setSelectedCandidature(candidat)}>
                            <TableCell>{candidat.date}</TableCell>
                            <TableCell className="font-medium">{candidat.prenom} {candidat.nom}</TableCell>
                            <TableCell>{candidat.email}</TableCell>
                            <TableCell>{candidat.experience}</TableCell>
                            <TableCell>{candidat.hardSkills}</TableCell>
                            <TableCell>{candidat.disponibilite}</TableCell>
                            <TableCell>{candidat.tarif8h}</TableCell>
                            <TableCell><StatusBadge value={candidat.statut} /></TableCell>
                            <TableCell>{candidat.source}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>

                <TabsContent value="formulaires" className="mt-4 space-y-4">
                  <div className="flex flex-col gap-3 rounded-lg border border-border bg-muted/30 p-4 md:flex-row md:items-end">
                    <div className="flex-1">
                      <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Nom du formulaire</label>
                      <select className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={templateSelectionne} onChange={(e) => setTemplateSelectionne(e.target.value)}>
                        {templatesFormulaires.map((template) => <option key={template}>{template}</option>)}
                      </select>
                    </div>
                    <Button onClick={addFormulaire}><FilePlus2 /> Ajouter un formulaire</Button>
                  </div>
                  <div className="overflow-hidden rounded-lg border border-border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Nom du formulaire</TableHead>
                          <TableHead>Lien unique</TableHead>
                          <TableHead>Statut</TableHead>
                          <TableHead>Nombre candidatures</TableHead>
                          <TableHead>Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedFormulaires.map((formulaire) => (
                          <TableRow key={formulaire.id}>
                            <TableCell className="font-medium">{formulaire.nom}</TableCell>
                            <TableCell className="max-w-96 truncate"><Link2 className="mr-1 inline h-3.5 w-3.5" />{formulaire.lien}</TableCell>
                            <TableCell><StatusBadge value={formulaire.statut} /></TableCell>
                            <TableCell>{formulaire.candidatures}</TableCell>
                            <TableCell><Button variant="outline" size="sm" onClick={() => navigator.clipboard?.writeText(formulaire.lien)}><Copy /> Copier</Button></TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>
              </Tabs>
            </section>
          )}
        </main>

        <aside className="sticky top-4 h-fit rounded-xl border border-border bg-card p-4">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="font-semibold">Mes tâches</h2>
              <p className="text-sm text-muted-foreground">Utilisateur connecté : {currentUser}</p>
            </div>
            <UserPlus className="h-5 w-5 text-muted-foreground" />
          </div>
          <div className="space-y-3">
            {mesTaches.map((task) => {
              const pipeline = pipelines.find((p) => p.id === task.pipelineId);
              return (
                <button key={task.id} className="w-full rounded-lg border border-border bg-muted/30 p-3 text-left transition hover:bg-muted" onClick={() => pipeline && setSelectedId(pipeline.id)}>
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-medium">{task.nom}</p>
                    <span className="rounded bg-background px-2 py-0.5 text-xs">{task.etape}</span>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{pipeline?.entreprise} · {pipeline?.poste}</p>
                  <div className="mt-3 flex items-center justify-between text-xs">
                    <span>Échéance : {task.echeance}</span>
                    <StatusBadge value={task.statut} />
                  </div>
                </button>
              );
            })}
            {mesTaches.length === 0 && <p className="rounded-lg bg-muted p-3 text-sm text-muted-foreground">Aucune tâche ouverte pour le moment.</p>}
          </div>
        </aside>
      </div>

      <Sheet open={!!selectedCandidature} onOpenChange={(open) => !open && setSelectedCandidature(null)}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-2xl">
          {selectedCandidature && (
            <>
              <SheetHeader>
                <SheetTitle>{selectedCandidature.prenom} {selectedCandidature.nom}</SheetTitle>
                <SheetDescription>{selectedCandidature.poste} · Source : {selectedCandidature.source}</SheetDescription>
              </SheetHeader>
              <div className="mt-6 grid gap-4 text-sm sm:grid-cols-2">
                <Info label="Email" value={selectedCandidature.email} />
                <Info label="Téléphone" value={selectedCandidature.telephone} />
                <Info label="Niveau français" value={selectedCandidature.francais} />
                <Info label="Niveau anglais" value={selectedCandidature.anglais} />
                <Info label="Expérience" value={selectedCandidature.experience} />
                <Info label="Disponibilité" value={selectedCandidature.disponibilite} />
                <Info label="Hard skills" value={selectedCandidature.hardSkills} />
                <Info label="Soft skills" value={selectedCandidature.softSkills} />
                <Info label="Outils maîtrisés" value={selectedCandidature.outils} />
                <Info label="Statut candidature" value={<StatusBadge value={selectedCandidature.statut} />} />
                <Info label="Tarif 8h" value={selectedCandidature.tarif8h} />
                <Info label="Tarif 4h" value={selectedCandidature.tarif4h} />
                <Info label="CV" value={selectedCandidature.cv} icon={<ExternalLink className="h-3.5 w-3.5" />} />
                <Info label="Portfolio" value={selectedCandidature.portfolio} icon={<ExternalLink className="h-3.5 w-3.5" />} />
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}

function Kpi({ label, value, tone }: { label: string; value: number; tone?: "warning" | "accent" }) {
  return (
    <div className={cn("rounded-xl border border-border bg-card p-4", tone === "warning" && "bg-accent/10", tone === "accent" && "bg-primary/10")}>
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-2 text-3xl font-semibold">{value}</p>
    </div>
  );
}

function Progress({ value }: { value: number }) {
  return (
    <div className="min-w-28">
      <div className="mb-1 flex justify-between text-xs text-muted-foreground"><span>{value}%</span></div>
      <div className="h-2 rounded-full bg-muted">
        <div className="h-2 rounded-full bg-primary" style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

function Info({ label, value, icon }: { label: string; value: React.ReactNode; icon?: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-border bg-muted/30 p-3">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</p>
      <div className="mt-1 flex items-center gap-1 text-sm">{value}{icon}</div>
    </div>
  );
}
