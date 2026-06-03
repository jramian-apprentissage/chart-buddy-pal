import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { PageHeader } from "@/components/page-header";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileText, Plus, Search } from "lucide-react";

export const Route = createFileRoute("/templates-formulaires")({
  head: () => ({ meta: [{ title: "Templates Formulaires — SIRH" }] }),
  component: TemplatesFormulairesPage,
});

type StatutTemplate = "Actif" | "Inactif";
type TemplateFormulaire = {
  id: string;
  nom: string;
  categorie: string;
  statut: StatutTemplate;
  dateCreation: string;
  creePar: string;
  description: string;
};

const templatesInitials: TemplateFormulaire[] = [
  { id: "TPL-FORM-001", nom: "Candidature développeur confirmé", categorie: "Développement / Tech", statut: "Actif", dateCreation: "2026-05-20", creePar: "Jimmy Ramian", description: "Modèle de formulaire pour profils full-stack, back-end ou front-end confirmés." },
  { id: "TPL-FORM-002", nom: "Candidature data / BI", categorie: "Data", statut: "Actif", dateCreation: "2026-05-22", creePar: "Léa Martin", description: "Modèle orienté data engineer, analyste BI, analytics engineer et profils Snowflake / Airflow." },
  { id: "TPL-FORM-003", nom: "Candidature UX / Product", categorie: "Produit / Design", statut: "Actif", dateCreation: "2026-05-24", creePar: "Marie Dubois", description: "Modèle pour UX designer, product designer, product owner et profils discovery." },
  { id: "TPL-FORM-004", nom: "Cooptation ambassadeur", categorie: "Cooptation", statut: "Inactif", dateCreation: "2026-05-27", creePar: "Nora Benali", description: "Ancien modèle de cooptation, conservé dans la bibliothèque mais non proposé par défaut." },
];

function TemplatesFormulairesPage() {
  const [templates, setTemplates] = useState(templatesInitials);
  const [q, setQ] = useState("");
  const [selected, setSelected] = useState<TemplateFormulaire | null>(null);
  const [creationOpen, setCreationOpen] = useState(false);
  const [draft, setDraft] = useState({ nom: "", categorie: "", statut: "Actif" as StatutTemplate, description: "" });
  const [createdDemo, setCreatedDemo] = useState(false);

  const filtered = useMemo(() => templates.filter((template) => [template.id, template.nom, template.categorie, template.statut, template.creePar].join(" ").toLowerCase().includes(q.toLowerCase())), [templates, q]);

  const addTemplateDemo = () => {
    setCreatedDemo(true);
    setTimeout(() => {
      setCreationOpen(false);
      setCreatedDemo(false);
      setDraft({ nom: "", categorie: "", statut: "Actif", description: "" });
    }, 900);
  };

  const toggleStatus = (id: string, statut: StatutTemplate) => {
    setTemplates((current) => current.map((template) => template.id === id ? { ...template, statut } : template));
  };

  return (
    <div>
      <PageHeader
        title="Templates Formulaires"
        description="Bibliothèque globale de modèles réutilisables. Aucun lien public ni candidature n’est généré depuis cet onglet."
        actionLabel="Créer un template"
        onAction={() => setCreationOpen(true)}
      >
        <div className="relative"><Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" /><Input className="w-80 pl-8" placeholder="Rechercher un template…" value={q} onChange={(e) => setQ(e.target.value)} /></div>
      </PageHeader>

      <div className="space-y-6 p-6">
        <section className="grid gap-4 md:grid-cols-3">
          <Kpi label="Templates" value={templates.length} />
          <Kpi label="Actifs" value={templates.filter((template) => template.statut === "Actif").length} />
          <Kpi label="Inactifs" value={templates.filter((template) => template.statut === "Inactif").length} />
        </section>

        <section className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-start gap-3">
            <div className="rounded-lg bg-primary/10 p-2 text-primary"><FileText className="h-5 w-5" /></div>
            <div>
              <h2 className="font-semibold">Rôle de cet onglet</h2>
              <p className="mt-1 text-sm text-muted-foreground">Créer et gérer une bibliothèque de modèles de formulaires réutilisables. Ces modèles ne sont pas liés à une commande. Les liens de candidature sont générés uniquement quand un template est rattaché à un pipeline de recrutement.</p>
            </div>
          </div>
        </section>

        <section className="overflow-hidden rounded-xl border border-border bg-card">
          <div className="border-b border-border px-4 py-3"><h2 className="font-semibold">Bibliothèque de templates</h2><p className="text-sm text-muted-foreground">Liste globale des modèles disponibles pour les pipelines de recrutement.</p></div>
          <Table>
            <TableHeader><TableRow><TableHead>ID Template Formulaire</TableHead><TableHead>Nom du formulaire</TableHead><TableHead>Poste / catégorie</TableHead><TableHead>Statut</TableHead><TableHead>Date création</TableHead><TableHead>Créé par</TableHead><TableHead>Action</TableHead></TableRow></TableHeader>
            <TableBody>{filtered.map((template) => <TableRow key={template.id} className="cursor-pointer" onClick={() => setSelected(template)}><TableCell className="font-medium">{template.id}</TableCell><TableCell>{template.nom}</TableCell><TableCell>{template.categorie}</TableCell><TableCell><StatusBadge value={template.statut} /></TableCell><TableCell>{template.dateCreation}</TableCell><TableCell>{template.creePar}</TableCell><TableCell onClick={(e) => e.stopPropagation()}><select className="rounded-md border border-input bg-background px-2 py-1 text-sm" value={template.statut} onChange={(e) => toggleStatus(template.id, e.target.value as StatutTemplate)}>{["Actif", "Inactif"].map((statut) => <option key={statut}>{statut}</option>)}</select></TableCell></TableRow>)}</TableBody>
          </Table>
        </section>
      </div>

      <Sheet open={creationOpen} onOpenChange={setCreationOpen}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-xl">
          <SheetHeader><SheetTitle>Créer un template formulaire</SheetTitle><SheetDescription>Le modèle créé ici reste global. Aucun lien de candidature n’est généré à cette étape.</SheetDescription></SheetHeader>
          <div className="mt-6 space-y-4">
            <Input placeholder="Nom du formulaire" value={draft.nom} onChange={(e) => setDraft({ ...draft, nom: e.target.value })} />
            <Input placeholder="Poste / catégorie" value={draft.categorie} onChange={(e) => setDraft({ ...draft, categorie: e.target.value })} />
            <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={draft.statut} onChange={(e) => setDraft({ ...draft, statut: e.target.value as StatutTemplate })}>{["Actif", "Inactif"].map((statut) => <option key={statut}>{statut}</option>)}</select>
            <Input placeholder="Description du modèle" value={draft.description} onChange={(e) => setDraft({ ...draft, description: e.target.value })} />
            {createdDemo && <p className="rounded-md bg-primary/10 px-3 py-2 text-sm text-primary">Template créé en démonstration. Il ne sera pas ajouté à la liste pour le moment.</p>}
            <Button className="w-full" onClick={addTemplateDemo}><Plus /> Créer le template</Button>
          </div>
        </SheetContent>
      </Sheet>

      <Sheet open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-xl">{selected && <><SheetHeader><SheetTitle>{selected.nom}</SheetTitle><SheetDescription>{selected.id} · {selected.categorie}</SheetDescription></SheetHeader><div className="mt-6 space-y-4 text-sm"><Info label="Statut" value={<StatusBadge value={selected.statut} />} /><Info label="Date création" value={selected.dateCreation} /><Info label="Créé par" value={selected.creePar} /><Info label="Description" value={selected.description} /><Info label="Important" value="Ce template ne reçoit aucune candidature directement. Il devient utilisable uniquement lorsqu’il est rattaché à un pipeline." /></div></>}</SheetContent>
      </Sheet>
    </div>
  );
}

function Kpi({ label, value }: { label: string; value: number }) { return <div className="rounded-xl border border-border bg-card p-4"><p className="text-sm text-muted-foreground">{label}</p><p className="mt-2 text-3xl font-semibold">{value}</p></div>; }
function Info({ label, value }: { label: string; value: React.ReactNode }) { return <div className="rounded-lg border border-border bg-muted/30 p-3"><p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</p><div className="mt-1">{value}</div></div>; }
