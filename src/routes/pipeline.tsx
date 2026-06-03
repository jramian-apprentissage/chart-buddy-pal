import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { talents, type Talent, type EtatTalent } from "@/lib/mock-data";
import { PageHeader } from "@/components/page-header";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/status-badge";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowRight, CheckCircle2, FileText, KanbanSquare, Link2, Plus, UserPlus, UsersRound } from "lucide-react";

export const Route = createFileRoute("/pipeline")({
  head: () => ({ meta: [{ title: "Pipeline talents — SIRH" }] }),
  component: PipelinePage,
});

type PipelineStep = "R0" | "R1" | "R2" | "R3" | "R4" | "R5" | "R6" | "R7";
type InternalTab = "nouvelles" | "vivier" | "kanban";

type TalentRecord = Talent & {
  dateCandidature: string;
  source: string;
  pipelineAssocie: string;
  statutCandidature: string;
  statutProcess: PipelineStep;
};

const PROCESS_STEPS: PipelineStep[] = ["R0", "R1", "R2", "R3", "R4", "R5", "R6", "R7"];

const STEP_LABELS: Record<PipelineStep, string> = {
  R0: "R0 · Réception",
  R1: "R1 · Sourcing",
  R2: "R2 · Qualification",
  R3: "R3 · Entretien",
  R4: "R4 · Présentation profil",
  R5: "R5 · Présentation client",
  R6: "R6 · Formalités",
  R7: "R7 · Onboarding",
};

const SOURCE_OPTIONS = ["Formulaire", "Facebook", "LinkedIn", "MadaJob", "Cooptation", "Sourcing RH", "Import manuel"];

const initialVivier: TalentRecord[] = talents.map((talent, index) => ({
  ...talent,
  dateCandidature: ["2026-05-20", "2026-05-22", "2026-04-10", "2026-03-15", "2026-02-05"][index] ?? "2026-05-01",
  source: ["Formulaire", "LinkedIn", "Sourcing RH", "MadaJob", "Cooptation"][index] ?? "Import manuel",
  pipelineAssocie: talent.client ? `${talent.client} · ${talent.poste}` : "Aucun pipeline",
  statutCandidature: talent.etat === "En place" ? "Intégré au vivier" : "Qualifié",
  statutProcess: (["R3", "R2", "R7", "R1", "R4"] as PipelineStep[])[index] ?? "R0",
}));

const initialNouvelles: TalentRecord[] = [
  {
    id: "nc1",
    etat: "Actif",
    cv: "cv-sarah-rakoto.pdf",
    portfolio: "sarah-rakoto.design",
    dateR2: "",
    dateR3: "",
    nom: "Rakoto",
    prenom: "Sarah",
    email: "sarah.rakoto@email.com",
    telephone: "+261 34 12 345 67",
    poste: "Product Designer",
    francais: true,
    niveauFrancais: "C1",
    anglais: true,
    niveauAnglais: "B2",
    experience: "6 ans",
    hardSkills: "UX research, UI design, Design system",
    softSkills: "Empathie, Synthèse, Communication",
    outils: "Figma, Miro, Notion",
    disponibilite: "Immédiate",
    tarif8h: "420€",
    tarif4h: "240€",
    tarifNegocie: "",
    client: "Decathlon",
    etatR3: "À planifier",
    historique: "Nouvelle candidature reçue via formulaire pipeline UX.",
    remarqueRH: "Portfolio intéressant, à qualifier rapidement.",
    dateCandidature: "2026-06-03",
    source: "Formulaire",
    pipelineAssocie: "Decathlon · UX Designer Senior",
    statutCandidature: "Nouveau",
    statutProcess: "R0",
  },
  {
    id: "nc2",
    etat: "Actif",
    cv: "cv-nicolas-martin.pdf",
    portfolio: "github.com/nmartin-data",
    dateR2: "",
    dateR3: "",
    nom: "Martin",
    prenom: "Nicolas",
    email: "nicolas.martin@email.com",
    telephone: "+33 6 70 80 90 10",
    poste: "Data Engineer",
    francais: true,
    niveauFrancais: "Natif",
    anglais: true,
    niveauAnglais: "C1",
    experience: "4 ans",
    hardSkills: "Python, Airflow, BigQuery, dbt",
    softSkills: "Rigueur, Curiosité",
    outils: "GitLab, Snowflake, Looker Studio",
    disponibilite: "Sous 1 mois",
    tarif8h: "620€",
    tarif4h: "350€",
    tarifNegocie: "",
    client: "BNP Paribas",
    etatR3: "",
    historique: "Contact LinkedIn suite campagne sourcing.",
    remarqueRH: "À rapprocher du pipeline Data Engineer.",
    dateCandidature: "2026-06-02",
    source: "LinkedIn",
    pipelineAssocie: "BNP Paribas · Data Engineer",
    statutCandidature: "Nouveau",
    statutProcess: "R0",
  },
  {
    id: "nc3",
    etat: "Actif",
    cv: "cv-hery-devops.pdf",
    portfolio: "",
    dateR2: "",
    dateR3: "",
    nom: "Andriamasy",
    prenom: "Hery",
    email: "hery.andriamasy@email.com",
    telephone: "+261 32 44 555 66",
    poste: "DevOps Engineer",
    francais: true,
    niveauFrancais: "B2",
    anglais: true,
    niveauAnglais: "B2",
    experience: "5 ans",
    hardSkills: "Docker, Kubernetes, Terraform, AWS",
    softSkills: "Autonomie, Fiabilité",
    outils: "GitHub Actions, ArgoCD, Grafana",
    disponibilite: "Sous 2 semaines",
    tarif8h: "560€",
    tarif4h: "320€",
    tarifNegocie: "",
    client: "Air France",
    etatR3: "",
    historique: "Candidature MadaJob.",
    remarqueRH: "Profil technique à vérifier en R2.",
    dateCandidature: "2026-06-01",
    source: "MadaJob",
    pipelineAssocie: "Air France · DevOps Engineer",
    statutCandidature: "Nouveau",
    statutProcess: "R0",
  },
];

function PipelinePage() {
  const [activeTab, setActiveTab] = useState<InternalTab>("nouvelles");
  const [q, setQ] = useState("");
  const [selected, setSelected] = useState<TalentRecord | null>(null);
  const [nouvelles, setNouvelles] = useState<TalentRecord[]>(initialNouvelles);
  const [vivier, setVivier] = useState<TalentRecord[]>(initialVivier);

  const allTalents = useMemo(() => [...nouvelles, ...vivier], [nouvelles, vivier]);

  const filteredNouvelles = useMemo(() => filterTalents(nouvelles, q), [nouvelles, q]);
  const filteredVivier = useMemo(() => filterTalents(vivier, q), [vivier, q]);
  const filteredAll = useMemo(() => filterTalents(allTalents, q), [allTalents, q]);

  const stats = [
    { label: "Nouvelles candidatures", value: nouvelles.length },
    { label: "Talents dans le vivier", value: vivier.length },
    { label: "Sources connectées", value: SOURCE_OPTIONS.length },
    { label: "Pipelines représentés", value: new Set(allTalents.map((t) => t.pipelineAssocie).filter((p) => p !== "Aucun pipeline")).size },
  ];

  const integrateCandidate = (candidate: TalentRecord) => {
    const integrated = {
      ...candidate,
      statutCandidature: "Intégré au vivier",
      statutProcess: "R1" as PipelineStep,
    };
    setNouvelles((current) => current.filter((item) => item.id !== candidate.id));
    setVivier((current) => [integrated, ...current]);
    setSelected(integrated);
    setActiveTab("vivier");
  };

  const rejectCandidate = (candidate: TalentRecord) => {
    setNouvelles((current) => current.filter((item) => item.id !== candidate.id));
    setSelected(null);
  };

  const moveTalent = (talent: TalentRecord, direction: "prev" | "next") => {
    const currentIndex = PROCESS_STEPS.indexOf(talent.statutProcess);
    const nextIndex = direction === "next" ? Math.min(currentIndex + 1, PROCESS_STEPS.length - 1) : Math.max(currentIndex - 1, 0);
    const updated = { ...talent, statutProcess: PROCESS_STEPS[nextIndex] };
    updateTalent(updated);
  };

  const updateTalent = (updated: TalentRecord) => {
    setSelected((current) => (current?.id === updated.id ? updated : current));
    setNouvelles((current) => current.map((item) => (item.id === updated.id ? updated : item)));
    setVivier((current) => current.map((item) => (item.id === updated.id ? updated : item)));
  };

  const createManualCandidate = () => {
    const created: TalentRecord = {
      ...initialNouvelles[0],
      id: `nc-demo-${Date.now()}`,
      dateCandidature: new Date().toISOString().slice(0, 10),
      nom: "Nouveau",
      prenom: "Talent",
      email: `talent.demo.${Date.now()}@email.com`,
      telephone: "+261 00 00 000 00",
      poste: "Profil à qualifier",
      source: "Import manuel",
      pipelineAssocie: "Aucun pipeline",
      statutCandidature: "Nouveau",
      statutProcess: "R0",
      historique: "Créé manuellement pour la démonstration.",
      remarqueRH: "À compléter par l'équipe RH.",
    };
    setNouvelles((current) => [created, ...current]);
    setSelected(created);
    setActiveTab("nouvelles");
  };

  return (
    <div>
      <PageHeader
        title="Pipeline talents"
        description="Base unique pour centraliser toutes les candidatures et tous les talents MonAmbassadeur."
      >
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <Input
            placeholder="Rechercher nom, poste, source…"
            value={q}
            onChange={(event) => setQ(event.target.value)}
            className="w-full sm:w-72"
          />
          <Button onClick={createManualCandidate} className="gap-2 whitespace-nowrap">
            <Plus className="h-4 w-4" />
            Ajouter une candidature
          </Button>
        </div>
      </PageHeader>

      <div className="space-y-6 p-6">
        <div className="grid gap-3 md:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="rounded-xl border border-border bg-card p-4 shadow-sm">
              <p className="text-2xl font-semibold text-foreground">{stat.value}</p>
              <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <UsersRound className="h-5 w-5 text-primary" />
                <h2 className="text-base font-semibold text-foreground">Référentiel global des profils</h2>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                Toutes les candidatures, peu importe leur source ou leur pipeline d'origine, arrivent ici. Un profil ne doit exister qu'une seule fois.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {SOURCE_OPTIONS.map((source) => (
                <Badge key={source} variant="secondary">{source}</Badge>
              ))}
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as InternalTab)}>
          <TabsList className="grid w-full grid-cols-3 lg:w-[640px]">
            <TabsTrigger value="nouvelles">Nouvelles candidatures</TabsTrigger>
            <TabsTrigger value="vivier">Vivier</TabsTrigger>
            <TabsTrigger value="kanban">Vue Kanban</TabsTrigger>
          </TabsList>
        </Tabs>

        {activeTab === "nouvelles" && (
          <TablePanel
            title="Nouvelles candidatures"
            description="Candidatures reçues depuis les formulaires, réseaux, jobboards, cooptation, sourcing RH ou import manuel avant traitement RH."
          >
            <TalentTable records={filteredNouvelles} mode="nouvelles" onSelect={setSelected} onIntegrate={integrateCandidate} />
          </TablePanel>
        )}

        {activeTab === "vivier" && (
          <TablePanel
            title="Vivier"
            description="Base principale des talents connus, disponibles, qualifiés ou déjà rattachés à un ou plusieurs pipelines recrutement."
          >
            <TalentTable records={filteredVivier} mode="vivier" onSelect={setSelected} onIntegrate={integrateCandidate} />
          </TablePanel>
        )}

        {activeTab === "kanban" && (
          <KanbanView records={filteredAll} onSelect={setSelected} onMove={moveTalent} />
        )}
      </div>

      <Sheet open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-3xl">
          {selected && (
            <>
              <SheetHeader>
                <SheetTitle>{selected.prenom} {selected.nom}</SheetTitle>
                <SheetDescription>
                  {selected.poste} · {STEP_LABELS[selected.statutProcess]} · <StatusBadge value={selected.etat} />
                </SheetDescription>
              </SheetHeader>

              <div className="mt-6 space-y-6 text-sm">
                <Section title="Origine de la candidature">
                  <Field label="Date candidature" value={selected.dateCandidature} />
                  <Field label="Source" value={selected.source} />
                  <Field label="Pipeline associé" value={selected.pipelineAssocie} />
                  <Field label="Statut candidature" value={selected.statutCandidature} />
                  <Field label="Statut process" value={STEP_LABELS[selected.statutProcess]} />
                </Section>

                <Section title="Identité et contact">
                  <Field label="Nom" value={selected.nom} />
                  <Field label="Prénom" value={selected.prenom} />
                  <Field label="Email" value={selected.email} />
                  <Field label="Téléphone" value={selected.telephone} />
                  <Doc label="CV" value={selected.cv} />
                  <Doc label="Portfolio" value={selected.portfolio} />
                </Section>

                <Section title="Profil talent">
                  <Field label="Poste" value={selected.poste} />
                  <Field label="Français" value={selected.francais ? `Oui · ${selected.niveauFrancais}` : `Non · ${selected.niveauFrancais}`} />
                  <Field label="Anglais" value={selected.anglais ? `Oui · ${selected.niveauAnglais}` : `Non · ${selected.niveauAnglais}`} />
                  <Field label="Expérience" value={selected.experience} />
                  <TagField label="Hard skills" value={selected.hardSkills} />
                  <TagField label="Soft skills" value={selected.softSkills} />
                  <TagField label="Logiciels et outils" value={selected.outils} />
                </Section>

                <Section title="Disponibilité et tarifs">
                  <Field label="Disponibilité" value={selected.disponibilite} />
                  <Field label="Tarif 8h" value={selected.tarif8h} />
                  <Field label="Tarif 4h" value={selected.tarif4h} />
                  <Field label="Tarif négocié" value={selected.tarifNegocie} />
                </Section>

                <Section title="Suivi RH">
                  <Field label="Date entretien R2" value={selected.dateR2} />
                  <Field label="Date entretien R3" value={selected.dateR3} />
                  <Field label="Client" value={selected.client} />
                  <Field label="État R3" value={selected.etatR3} />
                  <Field label="Historique" value={selected.historique} />
                  <Field label="Remarque RH" value={selected.remarqueRH} />
                </Section>

                <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
                  {nouvelles.some((item) => item.id === selected.id) && (
                    <>
                      <Button variant="outline" onClick={() => rejectCandidate(selected)}>Écarter la candidature</Button>
                      <Button onClick={() => integrateCandidate(selected)} className="gap-2">
                        <UserPlus className="h-4 w-4" />
                        Intégrer au vivier
                      </Button>
                    </>
                  )}
                  <Button variant="outline" onClick={() => moveTalent(selected, "prev")}>Reculer statut</Button>
                  <Button onClick={() => moveTalent(selected, "next")} className="gap-2">
                    Avancer statut <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}

function filterTalents(records: TalentRecord[], query: string) {
  return records.filter((talent) =>
    [
      talent.nom,
      talent.prenom,
      talent.email,
      talent.telephone,
      talent.poste,
      talent.source,
      talent.pipelineAssocie,
      talent.hardSkills,
      talent.softSkills,
      talent.outils,
      talent.client,
      talent.statutCandidature,
      talent.statutProcess,
    ]
      .join(" ")
      .toLowerCase()
      .includes(query.toLowerCase()),
  );
}

function TablePanel({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      <div className="border-b border-border p-4">
        <h2 className="font-semibold text-foreground">{title}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </div>
      {children}
    </div>
  );
}

function TalentTable({
  records,
  mode,
  onSelect,
  onIntegrate,
}: {
  records: TalentRecord[];
  mode: "nouvelles" | "vivier";
  onSelect: (record: TalentRecord) => void;
  onIntegrate: (record: TalentRecord) => void;
}) {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{mode === "nouvelles" ? "Date candidature" : "État"}</TableHead>
            <TableHead>CV</TableHead>
            <TableHead>Portfolio</TableHead>
            <TableHead>Date R2</TableHead>
            {mode === "vivier" && <TableHead>Date R3</TableHead>}
            <TableHead>Nom</TableHead>
            <TableHead>Prénom</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Téléphone</TableHead>
            <TableHead>Poste</TableHead>
            <TableHead>FR</TableHead>
            <TableHead>Niveau FR</TableHead>
            <TableHead>EN</TableHead>
            <TableHead>Niveau EN</TableHead>
            <TableHead>Expérience</TableHead>
            <TableHead>Hard skills</TableHead>
            <TableHead>Soft skills</TableHead>
            <TableHead>Outils maîtrisés</TableHead>
            <TableHead>Disponibilité</TableHead>
            <TableHead>Tarif 8h</TableHead>
            <TableHead>Tarif 4h</TableHead>
            <TableHead>Négocié</TableHead>
            <TableHead>Client</TableHead>
            <TableHead>État R3</TableHead>
            <TableHead>Historique</TableHead>
            <TableHead>Remarque RH</TableHead>
            <TableHead>{mode === "nouvelles" ? "Action" : "Statut"}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {records.map((talent) => (
            <TableRow key={talent.id} className="cursor-pointer" onClick={() => onSelect(talent)}>
              <TableCell>{mode === "nouvelles" ? talent.dateCandidature : <StatusBadge value={talent.etat} />}</TableCell>
              <TableCell><DocButton value={talent.cv} /></TableCell>
              <TableCell><DocButton value={talent.portfolio} /></TableCell>
              <TableCell>{talent.dateR2 || "—"}</TableCell>
              {mode === "vivier" && <TableCell>{talent.dateR3 || "—"}</TableCell>}
              <TableCell className="font-medium">{talent.nom}</TableCell>
              <TableCell>{talent.prenom}</TableCell>
              <TableCell className="text-muted-foreground">{talent.email}</TableCell>
              <TableCell>{talent.telephone}</TableCell>
              <TableCell>{talent.poste}</TableCell>
              <TableCell>{talent.francais ? "Oui" : "Non"}</TableCell>
              <TableCell>{talent.niveauFrancais}</TableCell>
              <TableCell>{talent.anglais ? "Oui" : "Non"}</TableCell>
              <TableCell>{talent.niveauAnglais}</TableCell>
              <TableCell>{talent.experience}</TableCell>
              <TableCell className="min-w-56 text-muted-foreground">{talent.hardSkills}</TableCell>
              <TableCell className="min-w-48 text-muted-foreground">{talent.softSkills || "—"}</TableCell>
              <TableCell className="min-w-48 text-muted-foreground">{talent.outils}</TableCell>
              <TableCell>{talent.disponibilite}</TableCell>
              <TableCell>{talent.tarif8h}</TableCell>
              <TableCell>{talent.tarif4h || "—"}</TableCell>
              <TableCell>{talent.tarifNegocie || "—"}</TableCell>
              <TableCell>{talent.client || "—"}</TableCell>
              <TableCell>{talent.etatR3 || "—"}</TableCell>
              <TableCell className="min-w-64 text-muted-foreground">{talent.historique}</TableCell>
              <TableCell className="min-w-64 text-muted-foreground">{talent.remarqueRH}</TableCell>
              <TableCell>
                {mode === "nouvelles" ? (
                  <Button
                    size="sm"
                    onClick={(event) => {
                      event.stopPropagation();
                      onIntegrate(talent);
                    }}
                  >
                    Intégrer
                  </Button>
                ) : (
                  <Badge variant="secondary">{STEP_LABELS[talent.statutProcess]}</Badge>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function KanbanView({
  records,
  onSelect,
  onMove,
}: {
  records: TalentRecord[];
  onSelect: (record: TalentRecord) => void;
  onMove: (record: TalentRecord, direction: "prev" | "next") => void;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <KanbanSquare className="h-5 w-5 text-primary" />
        <div>
          <h2 className="font-semibold text-foreground">Vue Kanban par statut</h2>
          <p className="text-sm text-muted-foreground">Même base que le vivier et les candidatures, simplement regroupée par statut R0 à R7.</p>
        </div>
      </div>

      <div className="grid gap-3 xl:grid-cols-4 2xl:grid-cols-8">
        {PROCESS_STEPS.map((step) => {
          const stepRecords = records.filter((record) => record.statutProcess === step);
          return (
            <div key={step} className="min-h-72 rounded-xl border border-border bg-muted/30 p-3">
              <div className="mb-3 flex items-center justify-between gap-2">
                <h3 className="text-sm font-semibold text-foreground">{STEP_LABELS[step]}</h3>
                <Badge variant="secondary">{stepRecords.length}</Badge>
              </div>
              <div className="space-y-3">
                {stepRecords.map((talent) => (
                  <div key={talent.id} className="rounded-lg border border-border bg-card p-3 shadow-sm">
                    <button type="button" onClick={() => onSelect(talent)} className="w-full text-left">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="font-medium text-foreground">{talent.prenom} {talent.nom}</p>
                          <p className="text-xs text-muted-foreground">{talent.poste}</p>
                        </div>
                        <StatusBadge value={talent.etat} />
                      </div>
                      <p className="mt-2 text-xs text-muted-foreground">{talent.pipelineAssocie}</p>
                      <div className="mt-2 flex flex-wrap gap-1">
                        {talent.hardSkills.split(",").slice(0, 3).map((skill) => (
                          <Badge key={skill.trim()} variant="outline">{skill.trim()}</Badge>
                        ))}
                      </div>
                    </button>
                    <div className="mt-3 flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1" onClick={() => onMove(talent, "prev")}>←</Button>
                      <Button size="sm" className="flex-1" onClick={() => onMove(talent, "next")}>→</Button>
                    </div>
                  </div>
                ))}
                {!stepRecords.length && <p className="rounded-lg border border-dashed border-border p-3 text-center text-xs text-muted-foreground">Aucun profil</p>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{title}</h3>
      <div className="space-y-3 rounded-xl border border-border bg-muted/30 p-4">{children}</div>
    </div>
  );
}

function Field({ label, value }: { label: string; value?: string }) {
  return (
    <div className="grid grid-cols-3 gap-3">
      <span className="text-muted-foreground">{label}</span>
      <span className="col-span-2 text-foreground">{value || <span className="text-muted-foreground italic">—</span>}</span>
    </div>
  );
}

function TagField({ label, value }: { label: string; value?: string }) {
  const tags = value?.split(",").map((tag) => tag.trim()).filter(Boolean) ?? [];
  return (
    <div className="grid grid-cols-3 gap-3">
      <span className="text-muted-foreground">{label}</span>
      <div className="col-span-2 flex flex-wrap gap-1.5">
        {tags.length ? tags.map((tag) => <Badge key={tag} variant="secondary">{tag}</Badge>) : <span className="text-muted-foreground italic">—</span>}
      </div>
    </div>
  );
}

function Doc({ label, value }: { label: string; value?: string }) {
  return (
    <div className="grid grid-cols-3 gap-3">
      <span className="text-muted-foreground">{label}</span>
      <span className="col-span-2"><DocButton value={value} /></span>
    </div>
  );
}

function DocButton({ value }: { value?: string }) {
  if (!value) return <span className="text-muted-foreground italic">—</span>;
  return (
    <button
      type="button"
      onClick={(event) => {
        event.stopPropagation();
        alert(`Ouverture du document : ${value}`);
      }}
      className="inline-flex items-center gap-1.5 text-sm text-foreground underline-offset-2 hover:underline"
    >
      {value.includes(".") ? <FileText className="h-3.5 w-3.5" /> : <Link2 className="h-3.5 w-3.5" />}
      {value}
    </button>
  );
}
