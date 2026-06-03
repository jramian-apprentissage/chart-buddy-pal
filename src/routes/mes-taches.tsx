import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { PageHeader } from "@/components/page-header";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CheckCircle2, Paperclip, Plus, Search } from "lucide-react";

export const Route = createFileRoute("/mes-taches")({
  head: () => ({ meta: [{ title: "Mes tâches — SIRH" }] }),
  component: MesTachesPage,
});

type StatutTache = "À faire" | "En cours" | "Bloqué" | "Terminé";
type Priorite = "Haute" | "Moyenne" | "Basse";
type TacheUtilisateur = {
  id: string;
  nom: string;
  description: string;
  commande: string;
  client: string;
  poste: string;
  etape: string;
  responsable: string;
  statut: StatutTache;
  priorite: Priorite;
  dateCreation: string;
  echeance: string;
  dateRealisation: string;
  commentaire: string;
  pieceJointe: string;
  rattacheePipeline: boolean;
};

const currentUser = "Jimmy Ramian";

const initialTasks: TacheUtilisateur[] = [
  { id: "task-001", nom: "Rédaction compte rendu présentation", description: "Finaliser le CR après présentation client.", commande: "FCC-2026-002", client: "BNP Paribas", poste: "Data Engineer", etape: "R5", responsable: "Jimmy Ramian", statut: "En cours", priorite: "Haute", dateCreation: "2026-06-03", echeance: "2026-06-06", dateRealisation: "", commentaire: "CR à compléter après consolidation Fireflies.", pieceJointe: "", rattacheePipeline: true },
  { id: "task-002", nom: "Relancer candidat", description: "Relancer le candidat qualifié avant passage R3.", commande: "FCC-2026-001", client: "Orange Business", poste: "Développeur Full-Stack", etape: "R2", responsable: "Jimmy Ramian", statut: "À faire", priorite: "Moyenne", dateCreation: "2026-06-03", echeance: "2026-06-05", dateRealisation: "", commentaire: "Relance à faire avant 16h.", pieceJointe: "CV-Laurent.pdf", rattacheePipeline: true },
  { id: "task-003", nom: "Préparer reporting RH", description: "Préparer les chiffres hebdomadaires pour la réunion équipe.", commande: "Aucune", client: "—", poste: "—", etape: "Hors pipeline", responsable: "Jimmy Ramian", statut: "À faire", priorite: "Basse", dateCreation: "2026-06-03", echeance: "2026-06-07", dateRealisation: "", commentaire: "Inclure recrutements actifs, tâches bloquées et candidatures reçues.", pieceJointe: "", rattacheePipeline: false },
  { id: "task-004", nom: "Validation DRH", description: "Lever le point bloquant avant publication des annonces.", commande: "FCC-2026-003", client: "Decathlon", poste: "UX Designer Senior", etape: "R0", responsable: "Jimmy Ramian", statut: "Bloqué", priorite: "Haute", dateCreation: "2026-05-31", echeance: "2026-06-04", dateRealisation: "", commentaire: "Attente retour DRH.", pieceJointe: "FP-Decathlon-UX.pdf", rattacheePipeline: true },
];

function MesTachesPage() {
  const [tasks, setTasks] = useState(initialTasks);
  const [q, setQ] = useState("");
  const [selected, setSelected] = useState<TacheUtilisateur | null>(null);
  const [draft, setDraft] = useState({ nom: "", description: "", responsable: currentUser, priorite: "Moyenne" as Priorite, echeance: "2026-06-10", commentaire: "", pieceJointe: "", commande: "" });

  const filtered = useMemo(() => tasks.filter((task) => [task.nom, task.commande, task.client, task.poste, task.etape, task.statut, task.commentaire].join(" ").toLowerCase().includes(q.toLowerCase())), [tasks, q]);
  const openTasks = tasks.filter((task) => task.statut !== "Terminé");

  const updateTask = (id: string, patch: Partial<TacheUtilisateur>) => {
    setTasks((current) => current.map((task) => {
      if (task.id !== id) return task;
      const next = { ...task, ...patch };
      if (patch.statut === "Terminé" && !task.dateRealisation) next.dateRealisation = new Date().toISOString().slice(0, 10);
      return next;
    }));
  };

  const addManualTask = () => {
    if (!draft.nom.trim()) return;
    const hasCommande = draft.commande.trim().length > 0;
    setTasks((current) => [{
      id: `task-${Date.now()}`,
      nom: draft.nom,
      description: draft.description,
      commande: hasCommande ? draft.commande : "Aucune",
      client: hasCommande ? "Client à préciser" : "—",
      poste: hasCommande ? "Poste à préciser" : "—",
      etape: hasCommande ? "À qualifier" : "Hors pipeline",
      responsable: draft.responsable,
      statut: "À faire",
      priorite: draft.priorite,
      dateCreation: new Date().toISOString().slice(0, 10),
      echeance: draft.echeance,
      dateRealisation: "",
      commentaire: draft.commentaire,
      pieceJointe: draft.pieceJointe,
      rattacheePipeline: hasCommande,
    }, ...current]);
    setDraft({ nom: "", description: "", responsable: currentUser, priorite: "Moyenne", echeance: "2026-06-10", commentaire: "", pieceJointe: "", commande: "" });
  };

  return (
    <div>
      <PageHeader title="Mes tâches" description="Centre de travail quotidien : toutes les tâches attribuées à l’utilisateur connecté, toutes commandes confondues." actionLabel="Ajouter une tâche" onAction={addManualTask}>
        <div className="relative"><Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" /><Input className="w-80 pl-8" placeholder="Rechercher une tâche…" value={q} onChange={(e) => setQ(e.target.value)} /></div>
      </PageHeader>

      <div className="space-y-6 p-6">
        <section className="grid gap-4 md:grid-cols-4">
          <Kpi label="Tâches ouvertes" value={openTasks.length} />
          <Kpi label="À faire" value={tasks.filter((t) => t.statut === "À faire").length} />
          <Kpi label="Bloquées" value={tasks.filter((t) => t.statut === "Bloqué").length} />
          <Kpi label="Terminées" value={tasks.filter((t) => t.statut === "Terminé").length} />
        </section>

        <section className="rounded-xl border border-border bg-card p-4">
          <h2 className="font-semibold">Création manuelle de tâche</h2>
          <p className="text-sm text-muted-foreground">Une tâche peut être rattachée à une commande ou rester indépendante.</p>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            <Input placeholder="Nom tâche" value={draft.nom} onChange={(e) => setDraft({ ...draft, nom: e.target.value })} />
            <Input placeholder="Description" value={draft.description} onChange={(e) => setDraft({ ...draft, description: e.target.value })} />
            <Input placeholder="Commande liée, optionnel" value={draft.commande} onChange={(e) => setDraft({ ...draft, commande: e.target.value })} />
            <Input placeholder="Responsable" value={draft.responsable} onChange={(e) => setDraft({ ...draft, responsable: e.target.value })} />
            <select className="rounded-md border border-input bg-background px-3 py-2 text-sm" value={draft.priorite} onChange={(e) => setDraft({ ...draft, priorite: e.target.value as Priorite })}>{["Haute", "Moyenne", "Basse"].map((p) => <option key={p}>{p}</option>)}</select>
            <Input type="date" value={draft.echeance} onChange={(e) => setDraft({ ...draft, echeance: e.target.value })} />
            <Input placeholder="Commentaire" value={draft.commentaire} onChange={(e) => setDraft({ ...draft, commentaire: e.target.value })} />
            <Input placeholder="Pièce jointe ou lien" value={draft.pieceJointe} onChange={(e) => setDraft({ ...draft, pieceJointe: e.target.value })} />
            <Button onClick={addManualTask}><Plus /> Ajouter la tâche</Button>
          </div>
        </section>

        <section className="overflow-hidden rounded-xl border border-border bg-card">
          <div className="border-b border-border px-4 py-3"><h2 className="font-semibold">Tâches attribuées à {currentUser}</h2><p className="text-sm text-muted-foreground">Les tâches pipeline et les tâches indépendantes sont regroupées ici.</p></div>
          <Table>
            <TableHeader><TableRow><TableHead>Tâche</TableHead><TableHead>Commande</TableHead><TableHead>Client</TableHead><TableHead>Poste</TableHead><TableHead>Étape</TableHead><TableHead>Responsable</TableHead><TableHead>Statut</TableHead><TableHead>Priorité</TableHead><TableHead>Date création</TableHead><TableHead>Échéance</TableHead><TableHead>Date réalisation</TableHead><TableHead>Commentaire</TableHead><TableHead>Pièce jointe</TableHead></TableRow></TableHeader>
            <TableBody>{filtered.map((task) => <TableRow key={task.id} className="cursor-pointer" onClick={() => setSelected(task)}><TableCell className="min-w-56 font-medium">{task.nom}</TableCell><TableCell>{task.commande}</TableCell><TableCell>{task.client}</TableCell><TableCell>{task.poste}</TableCell><TableCell><span className="rounded bg-muted px-2 py-1 text-xs font-medium">{task.etape}</span></TableCell><TableCell>{task.responsable}</TableCell><TableCell onClick={(e) => e.stopPropagation()}><select className="rounded-md border border-input bg-background px-2 py-1 text-sm" value={task.statut} onChange={(e) => updateTask(task.id, { statut: e.target.value as StatutTache })}>{["À faire", "En cours", "Bloqué", "Terminé"].map((s) => <option key={s}>{s}</option>)}</select></TableCell><TableCell><StatusBadge value={task.priorite} /></TableCell><TableCell>{task.dateCreation}</TableCell><TableCell>{task.echeance}</TableCell><TableCell>{task.dateRealisation || "—"}</TableCell><TableCell className="max-w-64 truncate">{task.commentaire}</TableCell><TableCell>{task.pieceJointe ? <span className="inline-flex items-center gap-1"><Paperclip className="h-3.5 w-3.5" />{task.pieceJointe}</span> : "—"}</TableCell></TableRow>)}</TableBody>
          </Table>
        </section>
      </div>

      <Sheet open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-xl">{selected && <><SheetHeader><SheetTitle>{selected.nom}</SheetTitle><SheetDescription>{selected.rattacheePipeline ? `${selected.commande} · ${selected.client} · ${selected.etape}` : "Tâche indépendante"}</SheetDescription></SheetHeader><div className="mt-6 space-y-4 text-sm"><Info label="Description" value={selected.description || "—"} /><Info label="Commentaire" value={selected.commentaire || "—"} /><Info label="Pièce jointe" value={selected.pieceJointe || "—"} /><div className="grid gap-3 sm:grid-cols-2"><Info label="Statut" value={<StatusBadge value={selected.statut} />} /><Info label="Priorité" value={<StatusBadge value={selected.priorite} />} /><Info label="Échéance" value={selected.echeance} /><Info label="Date réalisation" value={selected.dateRealisation || "—"} /></div><Button onClick={() => { updateTask(selected.id, { statut: "Terminé" }); setSelected({ ...selected, statut: "Terminé", dateRealisation: new Date().toISOString().slice(0, 10) }); }}><CheckCircle2 /> Marquer comme terminé</Button></div></>}</SheetContent>
      </Sheet>
    </div>
  );
}

function Kpi({ label, value }: { label: string; value: number }) { return <div className="rounded-xl border border-border bg-card p-4"><p className="text-sm text-muted-foreground">{label}</p><p className="mt-2 text-3xl font-semibold">{value}</p></div>; }
function Info({ label, value }: { label: string; value: React.ReactNode }) { return <div className="rounded-lg border border-border bg-muted/30 p-3"><p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</p><div className="mt-1">{value}</div></div>; }
