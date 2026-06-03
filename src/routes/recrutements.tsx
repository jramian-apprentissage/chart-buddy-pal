import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Check, Circle, Copy, ExternalLink, FilePlus2, Link2, Plus, UserPlus } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/recrutements")({
  head: () => ({ meta: [{ title: "Pipeline recrutement — SIRH" }] }),
  component: RecrutementsPage,
});

type EtapeCode = "R0" | "R1" | "R2" | "R3" | "R4" | "R5" | "R6" | "R7";
type StatutPipeline = "En cours" | "Bloqué" | "Terminé" | "Annulé";
type StatutTache = "À faire" | "En cours" | "Terminé" | "Bloqué";
type Priorite = "Haute" | "Moyenne" | "Basse";

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
  statut: string;
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

const templatesFormulaires = ["Candidature développeur confirmé", "Candidature data / BI", "Candidature UX / Product", "Cooptation ambassadeur"];
const responsablesDemo = ["Marie Dubois", "Léa Martin", "Nora Benali", "Jimmy Ramian"];
const currentUser = "Jimmy Ramian";

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

const TASK_TEMPLATES: { etape: EtapeCode; nom: string }[] = [
  { etape: "R0", nom: "Lecture fiche de commande" },
  { etape: "R0", nom: "Rédaction fiche de poste" },
  { etape: "R0", nom: "Validation DRH" },
  { etape: "R0", nom: "Insertion dans le tableau" },
  { etape: "R0", nom: "Lancement de recherche" },
  { etape: "R1", nom: "Recherche dans le vivier" },
  { etape: "R1", nom: "Campagne d’appel candidat" },
  { etape: "R1", nom: "Demande de CV à jour" },
  { etape: "R1", nom: "Centralisation des CV" },
  { etape: "R1", nom: "Rédaction des annonces" },
  { etape: "R1", nom: "Création des annonces" },
  { etape: "R1", nom: "Publication des annonces" },
  { etape: "R2", nom: "Appel candidat" },
  { etape: "R2", nom: "Vérification disponibilité" },
  { etape: "R2", nom: "Examen expérience" },
  { etape: "R2", nom: "Évaluation motivation / soft skills" },
  { etape: "R2", nom: "Scoring talent" },
  { etape: "R2", nom: "Compte rendu R2" },
  { etape: "R2", nom: "Invitation entretien R3" },
  { etape: "R2", nom: "Mail refus candidat non retenu" },
  { etape: "R3", nom: "Visio candidat R3" },
  { etape: "R3", nom: "Compte rendu obligatoire" },
  { etape: "R3", nom: "Sélection candidat" },
  { etape: "R3", nom: "Invitation étape client" },
  { etape: "R3", nom: "Mail refus candidat non retenu" },
  { etape: "R4", nom: "Anonymisation des CV" },
  { etape: "R4", nom: "Envoi CV anonymisés au commercial" },
  { etape: "R4", nom: "Récapitulatif tarifaire" },
  { etape: "R4", nom: "Préparation présentation profil" },
  { etape: "R4", nom: "Envoi invitation entretien client" },
  { etape: "R4", nom: "Envoi consignes salle d’attente candidat" },
  { etape: "R5", nom: "Gestion salle d’attente" },
  { etape: "R5", nom: "Présentation profil" },
  { etape: "R5", nom: "Utilisation Fireflies" },
  { etape: "R5", nom: "Rédaction compte rendu présentation" },
  { etape: "R5", nom: "Centralisation CR" },
  { etape: "R5", nom: "Restitution candidat" },
  { etape: "R6", nom: "Rédaction contrat client" },
  { etape: "R6", nom: "Dépôt contrat client Yousign" },
  { etape: "R6", nom: "Approbation DRH contrat client" },
  { etape: "R6", nom: "Première facturation" },
  { etape: "R6", nom: "Rédaction contrat talent" },
  { etape: "R6", nom: "Dépôt contrat talent Yousign" },
  { etape: "R6", nom: "Validation contrat talent" },
  { etape: "R6", nom: "Vérification paiement client" },
  { etape: "R6", nom: "Mise en relation talent / client" },
  { etape: "R7", nom: "Mise à jour liste collaborateurs" },
  { etape: "R7", nom: "Mail de bienvenue" },
  { etape: "R7", nom: "Programme onboarding" },
  { etape: "R7", nom: "Kit intégration collaborateur" },
  { etape: "R7", nom: "Suivi démarrage J0" },
  { etape: "R7", nom: "Suivi intégration J+5" },
];

const getStepIndex = (code: EtapeCode) => ETAPES.findIndex((etape) => etape.code === code);

const buildMandatoryTasks = (pipeline: Pipeline): Tache[] =>
  TASK_TEMPLATES.map((template, index) => {
    const current = getStepIndex(pipeline.etapeActuelle);
    const step = getStepIndex(template.etape);
    const statut: StatutTache = pipeline.statut === "Bloqué" && template.nom.includes("Validation DRH")
      ? "Bloqué"
      : step < current
        ? "Terminé"
        : step === current
          ? "En cours"
          : "À faire";
    const day = String(10 + (index % 18)).padStart(2, "0");

    return {
      id: `${pipeline.id}-task-${index + 1}`,
      pipelineId: pipeline.id,
      etape: template.etape,
      nom: template.nom,
      responsable: responsablesDemo[index % responsablesDemo.length],
      statut,
      echeance: `2026-06-${day}`,
      dateRealisation: statut === "Terminé" ? `2026-05-${day}` : undefined,
      commentaire: statut === "À faire"
        ? "Étape obligatoire à réaliser."
        : statut === "Bloqué"
          ? "Point bloquant à lever avant la suite."
          : "Tâche obligatoire suivie dans le pipeline.",
      pieceJointe: index < 2 ? pipeline.ficheCommande : undefined,
    };
  });

const tachesInitiales: Tache[] = pipelinesInitial.flatMap(buildMandatoryTasks);

const candidaturesInitiales: Candidature[] = [
  { id: "cand-1", pipelineId: "pipe-001", date: "2026-05-26", nom: "Lefevre", prenom: "Laurent", email: "candidat.demo1@example.com", telephone: "+33 6 00 00 00 01", cv: "CV-Laurent.pdf", portfolio: "portfolio-demo-1", poste: "Développeur Full-Stack", francais: "Natif", anglais: "C1", experience: "7 ans", hardSkills: "React, Node.js, AWS", softSkills: "Autonomie, pédagogie", outils: "GitHub, Jira, Docker", disponibilite: "2 semaines", tarif8h: "640 €", tarif4h: "360 €", statut: "Qualifiée", source: "LinkedIn Fullstack" },
  { id: "cand-2", pipelineId: "pipe-001", date: "2026-05-27", nom: "Diallo", prenom: "Sarah", email: "candidat.demo2@example.com", telephone: "+33 6 00 00 00 02", cv: "CV-Sarah.pdf", portfolio: "portfolio-demo-2", poste: "Développeur Full-Stack", francais: "Courant", anglais: "B2", experience: "5 ans", hardSkills: "TypeScript, PostgreSQL, API", softSkills: "Rigueur, communication", outils: "GitLab, Notion", disponibilite: "Immédiate", tarif8h: "610 €", tarif4h: "340 €", statut: "À qualifier", source: "Jobboard React" },
  { id: "cand-3", pipelineId: "pipe-002", date: "2026-05-30", nom: "Martin", prenom: "Hugo", email: "candidat.demo3@example.com", telephone: "+33 6 00 00 00 03", cv: "CV-Hugo.pdf", portfolio: "portfolio-demo-3", poste: "Data Engineer", francais: "Natif", anglais: "B2", experience: "6 ans", hardSkills: "Spark, Python, Snowflake", softSkills: "Analyse, fiabilité", outils: "Airflow, dbt", disponibilite: "1 mois", tarif8h: "700 €", tarif4h: "390 €", statut: "Présentée", source: "Campagne data" },
];

const formulairesInitiaux: FormulaireRattache[] = [
  { id: "form-1", pipelineId: "pipe-001", nom: "Candidature développeur confirmé", lien: "https://demo.ma-sirh.fr/candidature/pipe-001-fullstack", statut: "Actif", candidatures: 2 },
  { id: "form-2", pipelineId: "pipe-002", nom: "Candidature data / BI", lien: "https://demo.ma-sirh.fr/candidature/pipe-002-data", statut: "Actif", candidatures: 1 },
];

const getPipelineFromUrl = () => new URLSearchParams(window.location.search).get("pipeline") ?? "";

function RecrutementsPage() {
  const [q, setQ] = useState("");
  const [pipelines, setPipelines] = useState(pipelinesInitial);
  const [taches, setTaches] = useState(tachesInitiales);
  const [candidatures] = useState(candidaturesInitiales);
  const [formulaires, setFormulaires] = useState(formulairesInitiaux);
  const [selectedId, setSelectedId] = useState(getPipelineFromUrl);
  const [selectedCandidature, setSelectedCandidature] = useState<Candidature | null>(null);
  const [templateSelectionne, setTemplateSelectionne] = useState(templatesFormulaires[0]);

  useEffect(() => {
    const syncRoute = () => setSelectedId(getPipelineFromUrl());
    window.addEventListener("popstate", syncRoute);
    return () => window.removeEventListener("popstate", syncRoute);
  }, []);

  const filtered = useMemo(
    () => pipelines.filter((pipeline) => [pipeline.numeroCommande, pipeline.entreprise, pipeline.poste, pipeline.responsable, pipeline.statut].join(" ").toLowerCase().includes(q.toLowerCase())),
    [pipelines, q],
  );

  const selected = pipelines.find((pipeline) => pipeline.id === selectedId) ?? null;
  const selectedTaches = taches.filter((tache) => tache.pipelineId === selected?.id);
  const selectedCandidatures = candidatures.filter((candidature) => candidature.pipelineId === selected?.id);
  const selectedFormulaires = formulaires.filter((formulaire) => formulaire.pipelineId === selected?.id);
  const isDetailMode = Boolean(selectedId);

  const mesTachesGlobales = taches.filter((tache) => tache.responsable === currentUser && tache.statut !== "Terminé");
  const mesTachesAffichees = selected
    ? mesTachesGlobales.filter((tache) => tache.pipelineId === selected.id)
    : mesTachesGlobales;

  const openPipeline = (pipelineId: string) => {
    setSelectedId(pipelineId);
    window.history.pushState(null, "", `/recrutements?pipeline=${pipelineId}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const backToList = () => {
    setSelectedId("");
    window.history.pushState(null, "", "/recrutements");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const updateTask = (taskId: string, patch: Partial<Tache>) => {
    setTaches((current) => current.map((task) => (
      task.id === taskId
        ? {
            ...task,
            ...patch,
            dateRealisation: patch.statut === "Terminé" ? task.dateRealisation ?? new Date().toISOString().slice(0, 10) : task.dateRealisation,
          }
        : task
    )));
  };

  const addTask = () => selected && setTaches((current) => [{
    id: `t-${Date.now()}`,
    pipelineId: selected.id,
    etape: selected.etapeActuelle,
    nom: "Nouvelle tâche complémentaire",
    responsable: currentUser,
    statut: "À faire",
    echeance: new Date(Date.now() + 259200000).toISOString().slice(0, 10),
    commentaire: "Tâche complémentaire ajoutée en plus du socle obligatoire.",
  }, ...current]);

  const addFormulaire = () => selected && setFormulaires((current) => [...current, {
    id: `form-${Date.now()}`,
    pipelineId: selected.id,
    nom: templateSelectionne,
    lien: `https://demo.ma-sirh.fr/candidature/${selected.id}-${Date.now()}`,
    statut: "Actif",
    candidatures: 0,
  }]);

  const advancePipeline = () => selected && setPipelines((current) => current.map((pipeline) => {
    if (pipeline.id !== selected.id) return pipeline;
    const next = ETAPES[Math.min(ETAPES.findIndex((etape) => etape.code === selected.etapeActuelle) + 1, ETAPES.length - 1)];
    return {
      ...pipeline,
      etapeActuelle: next.code,
      progression: Math.min(100, pipeline.progression + 12),
      derniereMaj: new Date().toISOString().slice(0, 10),
      statut: next.code === "R7" ? "Terminé" : "En cours",
    };
  }));

  return (
    <div>
      <PageHeader
        title={isDetailMode && selected ? `${selected.numeroCommande} · ${selected.entreprise}` : "Pipeline recrutement"}
        description={isDetailMode && selected ? `${selected.poste} · ${selectedTaches.length} tâches rattachées à ce pipeline` : "Liste des commandes en pipeline. Chaque pipeline contient son propre socle de tâches obligatoires."}
        actionLabel={isDetailMode ? "Retour aux pipelines" : "Nouvelle commande FCC"}
        onAction={isDetailMode ? backToList : () => alert("Démo : création d’une commande FCC, d’un pipeline et des tâches associées.")}
      >
        {!isDetailMode && (
          <Input placeholder="Rechercher commande, client, poste…" value={q} onChange={(event) => setQ(event.target.value)} className="w-72" />
        )}
      </PageHeader>

      <div className="grid gap-6 p-6 xl:grid-cols-[minmax(0,1fr)_340px]">
        <main className="space-y-6">
          {!isDetailMode && (
            <ListView
              pipelines={pipelines}
              filtered={filtered}
              candidaturesCount={candidatures.length}
              mesTachesCount={mesTachesGlobales.length}
              openPipeline={openPipeline}
            />
          )}

          {isDetailMode && !selected && (
            <section className="rounded-xl border border-border bg-card p-6">
              <h2 className="text-lg font-semibold">Pipeline introuvable</h2>
              <p className="mt-1 text-sm text-muted-foreground">Ce lien ne correspond à aucun pipeline de démonstration.</p>
              <Button className="mt-4" onClick={backToList}><ArrowLeft /> Retour aux pipelines</Button>
            </section>
          )}

          {isDetailMode && selected && (
            <PipelineDetail
              selected={selected}
              selectedTaches={selectedTaches}
              selectedCandidatures={selectedCandidatures}
              selectedFormulaires={selectedFormulaires}
              templateSelectionne={templateSelectionne}
              setTemplateSelectionne={setTemplateSelectionne}
              updateTask={updateTask}
              addTask={addTask}
              addFormulaire={addFormulaire}
              advancePipeline={advancePipeline}
              setSelectedCandidature={setSelectedCandidature}
              backToList={backToList}
            />
          )}
        </main>

        <TasksPanel
          mesTaches={mesTachesAffichees}
          pipelines={pipelines}
          selectedPipeline={selected}
          openPipeline={openPipeline}
        />
      </div>

      <CandidateSheet candidature={selectedCandidature} onClose={() => setSelectedCandidature(null)} />
    </div>
  );
}

function ListView({ pipelines, filtered, candidaturesCount, mesTachesCount, openPipeline }: { pipelines: Pipeline[]; filtered: Pipeline[]; candidaturesCount: number; mesTachesCount: number; openPipeline: (id: string) => void }) {
  return (
    <>
      <section className="grid gap-4 md:grid-cols-4">
        <Kpi label="Pipelines actifs" value={pipelines.filter((pipeline) => pipeline.statut === "En cours").length} />
        <Kpi label="Commandes bloquées" value={pipelines.filter((pipeline) => pipeline.statut === "Bloqué").length} tone="warning" />
        <Kpi label="Candidatures reçues" value={candidaturesCount} />
        <Kpi label="Mes tâches ouvertes" value={mesTachesCount} tone="accent" />
      </section>

      <section className="overflow-hidden rounded-xl border border-border bg-card">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <div>
            <h2 className="font-semibold">Commandes en pipeline</h2>
            <p className="text-sm text-muted-foreground">Clique sur une ligne pour ouvrir le pipeline avec uniquement ses tâches rattachées.</p>
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
              <TableRow key={pipeline.id} className="cursor-pointer hover:bg-muted/60" onClick={() => openPipeline(pipeline.id)}>
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
    </>
  );
}

function PipelineDetail({ selected, selectedTaches, selectedCandidatures, selectedFormulaires, templateSelectionne, setTemplateSelectionne, updateTask, addTask, addFormulaire, advancePipeline, setSelectedCandidature, backToList }: { selected: Pipeline; selectedTaches: Tache[]; selectedCandidatures: Candidature[]; selectedFormulaires: FormulaireRattache[]; templateSelectionne: string; setTemplateSelectionne: (value: string) => void; updateTask: (taskId: string, patch: Partial<Tache>) => void; addTask: () => void; addFormulaire: () => void; advancePipeline: () => void; setSelectedCandidature: (candidature: Candidature) => void; backToList: () => void }) {
  return (
    <section className="rounded-xl border border-border bg-card p-4">
      <div className="flex flex-col gap-4 border-b border-border pb-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <Button variant="ghost" size="sm" className="mb-2 -ml-2" onClick={backToList}><ArrowLeft /> Retour</Button>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-xl font-semibold">{selected.numeroCommande} · {selected.entreprise}</h2>
            <StatusBadge value={selected.priorite} />
            <StatusBadge value={selected.statut} />
            <span className="rounded-full border border-border px-2.5 py-0.5 text-xs font-medium">{selectedTaches.length} tâches du pipeline</span>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">{selected.poste} · {selected.commentaire}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={addTask}><Plus /> Ajouter tâche complémentaire</Button>
          <Button size="sm" onClick={advancePipeline}><Check /> Avancer étape</Button>
        </div>
      </div>

      <StepGrid selected={selected} />

      <Tabs defaultValue="details" className="w-full">
        <TabsList className="flex h-auto flex-wrap justify-start">
          <TabsTrigger value="details">Détails commande</TabsTrigger>
          <TabsTrigger value="taches">Tâches rattachées</TabsTrigger>
          <TabsTrigger value="candidatures">Candidatures</TabsTrigger>
          <TabsTrigger value="formulaires">Formulaires rattachés</TabsTrigger>
        </TabsList>
        <TabsContent value="details" className="mt-4"><DetailsTab selected={selected} /></TabsContent>
        <TabsContent value="taches" className="mt-4"><TasksTable selectedTaches={selectedTaches} updateTask={updateTask} /></TabsContent>
        <TabsContent value="candidatures" className="mt-4"><CandidatesTable candidatures={selectedCandidatures} setSelectedCandidature={setSelectedCandidature} /></TabsContent>
        <TabsContent value="formulaires" className="mt-4"><FormsTab formulaires={selectedFormulaires} templateSelectionne={templateSelectionne} setTemplateSelectionne={setTemplateSelectionne} addFormulaire={addFormulaire} /></TabsContent>
      </Tabs>
    </section>
  );
}

function StepGrid({ selected }: { selected: Pipeline }) {
  return (
    <div className="my-5 grid gap-2 md:grid-cols-8">
      {ETAPES.map((etape, index) => {
        const currentIndex = ETAPES.findIndex((item) => item.code === selected.etapeActuelle);
        const done = index < currentIndex;
        const current = index === currentIndex;
        return (
          <div key={etape.code} className={cn("rounded-lg border p-3", done && "border-primary bg-primary/10", current && "border-accent bg-accent/20", !done && !current && "bg-muted/40")}>
            <div className="flex items-center gap-2">
              <span className={cn("flex h-6 w-6 items-center justify-center rounded-full text-xs", done ? "bg-primary text-primary-foreground" : "bg-background")}>
                {done ? <Check className="h-3 w-3" /> : <Circle className="h-2.5 w-2.5 fill-current" />}
              </span>
              <span className="font-semibold">{etape.code}</span>
            </div>
            <p className="mt-2 text-xs font-medium">{etape.titre}</p>
            <p className="mt-1 text-[11px] text-muted-foreground">{etape.aide}</p>
          </div>
        );
      })}
    </div>
  );
}

function DetailsTab({ selected }: { selected: Pipeline }) {
  return (
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
  );
}

function TasksTable({ selectedTaches, updateTask }: { selectedTaches: Tache[]; updateTask: (taskId: string, patch: Partial<Tache>) => void }) {
  return (
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
                <select className="rounded-md border border-input bg-background px-2 py-1 text-sm" value={task.responsable} onChange={(event) => updateTask(task.id, { responsable: event.target.value })}>
                  {responsablesDemo.map((person) => <option key={person}>{person}</option>)}
                </select>
              </TableCell>
              <TableCell>
                <select className="rounded-md border border-input bg-background px-2 py-1 text-sm" value={task.statut} onChange={(event) => updateTask(task.id, { statut: event.target.value as StatutTache })}>
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
  );
}

function CandidatesTable({ candidatures, setSelectedCandidature }: { candidatures: Candidature[]; setSelectedCandidature: (candidature: Candidature) => void }) {
  return (
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
          {candidatures.map((candidat) => (
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
  );
}

function FormsTab({ formulaires, templateSelectionne, setTemplateSelectionne, addFormulaire }: { formulaires: FormulaireRattache[]; templateSelectionne: string; setTemplateSelectionne: (value: string) => void; addFormulaire: () => void }) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 rounded-lg border border-border bg-muted/30 p-4 md:flex-row md:items-end">
        <div className="flex-1">
          <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Nom du formulaire</label>
          <select className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={templateSelectionne} onChange={(event) => setTemplateSelectionne(event.target.value)}>
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
            {formulaires.map((formulaire) => (
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
    </div>
  );
}

function TasksPanel({ mesTaches, pipelines, selectedPipeline, openPipeline }: { mesTaches: Tache[]; pipelines: Pipeline[]; selectedPipeline: Pipeline | null; openPipeline: (id: string) => void }) {
  return (
    <aside className="sticky top-4 h-fit rounded-xl border border-border bg-card p-4">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="font-semibold">{selectedPipeline ? "Mes tâches du pipeline" : "Mes tâches"}</h2>
          <p className="text-sm text-muted-foreground">
            {selectedPipeline ? `${selectedPipeline.numeroCommande} · ${selectedPipeline.entreprise}` : `Utilisateur connecté : ${currentUser}`}
          </p>
        </div>
        <UserPlus className="h-5 w-5 text-muted-foreground" />
      </div>

      <div className="space-y-3">
        {mesTaches.map((task) => {
          const pipeline = pipelines.find((item) => item.id === task.pipelineId);
          return (
            <button key={task.id} className="w-full rounded-lg border border-border bg-muted/30 p-3 text-left transition hover:bg-muted" onClick={() => pipeline && openPipeline(pipeline.id)}>
              <div className="flex items-start justify-between gap-2">
                <p className="font-medium">{task.nom}</p>
                <span className="rounded bg-background px-2 py-0.5 text-xs">{task.etape}</span>
              </div>
              {!selectedPipeline && <p className="mt-1 text-sm text-muted-foreground">{pipeline?.entreprise} · {pipeline?.poste}</p>}
              <div className="mt-3 flex items-center justify-between text-xs">
                <span>Échéance : {task.echeance}</span>
                <StatusBadge value={task.statut} />
              </div>
            </button>
          );
        })}
        {mesTaches.length === 0 && (
          <p className="rounded-lg bg-muted p-3 text-sm text-muted-foreground">
            {selectedPipeline ? "Aucune tâche ouverte pour toi sur ce pipeline." : "Aucune tâche ouverte pour le moment."}
          </p>
        )}
      </div>
    </aside>
  );
}

function CandidateSheet({ candidature, onClose }: { candidature: Candidature | null; onClose: () => void }) {
  return (
    <Sheet open={!!candidature} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-2xl">
        {candidature && (
          <>
            <SheetHeader>
              <SheetTitle>{candidature.prenom} {candidature.nom}</SheetTitle>
              <SheetDescription>{candidature.poste} · Source : {candidature.source}</SheetDescription>
            </SheetHeader>
            <div className="mt-6 grid gap-4 text-sm sm:grid-cols-2">
              <Info label="Email" value={candidature.email} />
              <Info label="Téléphone" value={candidature.telephone} />
              <Info label="Niveau français" value={candidature.francais} />
              <Info label="Niveau anglais" value={candidature.anglais} />
              <Info label="Expérience" value={candidature.experience} />
              <Info label="Disponibilité" value={candidature.disponibilite} />
              <Info label="Hard skills" value={candidature.hardSkills} />
              <Info label="Soft skills" value={candidature.softSkills} />
              <Info label="Outils maîtrisés" value={candidature.outils} />
              <Info label="Statut candidature" value={<StatusBadge value={candidature.statut} />} />
              <Info label="Tarif 8h" value={candidature.tarif8h} />
              <Info label="Tarif 4h" value={candidature.tarif4h} />
              <Info label="CV" value={candidature.cv} icon={<ExternalLink className="h-3.5 w-3.5" />} />
              <Info label="Portfolio" value={candidature.portfolio} icon={<ExternalLink className="h-3.5 w-3.5" />} />
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
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
      <div className="h-2 rounded-full bg-muted"><div className="h-2 rounded-full bg-primary" style={{ width: `${value}%` }} /></div>
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
