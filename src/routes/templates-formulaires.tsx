import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { PageHeader } from "@/components/page-header";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, CheckCircle2, FileText, GripVertical, Plus, Search, Settings2, Trash2 } from "lucide-react";

export const Route = createFileRoute("/templates-formulaires")({
  head: () => ({ meta: [{ title: "Templates Formulaires — SIRH" }] }),
  component: TemplatesFormulairesPage,
});

type StatutTemplate = "Actif" | "Inactif";
type TypeChamp = "Réponse courte" | "Paragraphe" | "Choix multiple" | "Cases à cocher" | "Liste déroulante" | "Fichier";
type TemplateFormulaire = { id: string; nom: string; categorie: string; statut: StatutTemplate; dateCreation: string; creePar: string; description: string };
type ChampFormulaire = { id: string; titre: string; type: TypeChamp; obligatoire: boolean; aide: string };

const templatesInitials: TemplateFormulaire[] = [
  { id: "TPL-FORM-001", nom: "Candidature développeur confirmé", categorie: "Développement / Tech", statut: "Actif", dateCreation: "2026-05-20", creePar: "Jimmy Ramian", description: "Modèle de formulaire pour profils full-stack, back-end ou front-end confirmés." },
  { id: "TPL-FORM-002", nom: "Candidature data / BI", categorie: "Data", statut: "Actif", dateCreation: "2026-05-22", creePar: "Léa Martin", description: "Modèle orienté data engineer, analyste BI, analytics engineer et profils Snowflake / Airflow." },
  { id: "TPL-FORM-003", nom: "Candidature UX / Product", categorie: "Produit / Design", statut: "Actif", dateCreation: "2026-05-24", creePar: "Marie Dubois", description: "Modèle pour UX designer, product designer, product owner et profils discovery." },
  { id: "TPL-FORM-004", nom: "Cooptation ambassadeur", categorie: "Cooptation", statut: "Inactif", dateCreation: "2026-05-27", creePar: "Nora Benali", description: "Ancien modèle de cooptation, conservé dans la bibliothèque mais non proposé par défaut." },
];

const champsInitiaux: ChampFormulaire[] = [
  { id: "field-1", titre: "Nom", type: "Réponse courte", obligatoire: true, aide: "Nom de famille du candidat" },
  { id: "field-2", titre: "Prénom", type: "Réponse courte", obligatoire: true, aide: "Prénom du candidat" },
  { id: "field-3", titre: "Email", type: "Réponse courte", obligatoire: true, aide: "Adresse email de contact" },
  { id: "field-4", titre: "Téléphone", type: "Réponse courte", obligatoire: true, aide: "Numéro de téléphone" },
  { id: "field-5", titre: "CV", type: "Fichier", obligatoire: true, aide: "Import du CV à jour" },
  { id: "field-6", titre: "Portfolio / LinkedIn", type: "Réponse courte", obligatoire: false, aide: "Lien utile pour évaluer le profil" },
  { id: "field-7", titre: "Expérience", type: "Paragraphe", obligatoire: true, aide: "Résumé du parcours professionnel" },
  { id: "field-8", titre: "Disponibilité", type: "Liste déroulante", obligatoire: true, aide: "Immédiate, 2 semaines, 1 mois…" },
];

function TemplatesFormulairesPage() {
  const [templates, setTemplates] = useState(templatesInitials);
  const [q, setQ] = useState("");
  const [selected, setSelected] = useState<TemplateFormulaire | null>(null);
  const [creationOpen, setCreationOpen] = useState(false);
  const [builderOpen, setBuilderOpen] = useState(false);
  const [draft, setDraft] = useState({ nom: "", categorie: "", statut: "Actif" as StatutTemplate, description: "" });
  const [fields, setFields] = useState(champsInitiaux);
  const [savedDemo, setSavedDemo] = useState(false);

  const filtered = useMemo(() => templates.filter((template) => [template.id, template.nom, template.categorie, template.statut, template.creePar].join(" ").toLowerCase().includes(q.toLowerCase())), [templates, q]);

  const openBuilder = () => {
    setCreationOpen(false);
    setBuilderOpen(true);
  };

  const addField = () => {
    setFields((current) => [...current, { id: `field-${Date.now()}`, titre: "Nouvelle question", type: "Réponse courte", obligatoire: false, aide: "Texte d’aide optionnel" }]);
  };

  const updateField = (id: string, patch: Partial<ChampFormulaire>) => {
    setFields((current) => current.map((field) => field.id === id ? { ...field, ...patch } : field));
  };

  const deleteField = (id: string) => {
    setFields((current) => current.filter((field) => field.id !== id));
  };

  const saveTemplateDemo = () => {
    setSavedDemo(true);
    setTimeout(() => setSavedDemo(false), 1200);
  };

  const toggleStatus = (id: string, statut: StatutTemplate) => {
    setTemplates((current) => current.map((template) => template.id === id ? { ...template, statut } : template));
  };

  if (builderOpen) {
    return (
      <FormBuilder
        draft={draft}
        setDraft={setDraft}
        fields={fields}
        addField={addField}
        updateField={updateField}
        deleteField={deleteField}
        savedDemo={savedDemo}
        saveTemplateDemo={saveTemplateDemo}
        back={() => setBuilderOpen(false)}
      />
    );
  }

  return (
    <div>
      <PageHeader title="Templates Formulaires" description="Bibliothèque globale de modèles réutilisables. Aucun lien public ni candidature n’est généré depuis cet onglet." actionLabel="Créer un template" onAction={() => setCreationOpen(true)}>
        <div className="relative"><Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" /><Input className="w-80 pl-8" placeholder="Rechercher un template…" value={q} onChange={(e) => setQ(e.target.value)} /></div>
      </PageHeader>

      <div className="space-y-6 p-6">
        <section className="grid gap-4 md:grid-cols-3"><Kpi label="Templates" value={templates.length} /><Kpi label="Actifs" value={templates.filter((template) => template.statut === "Actif").length} /><Kpi label="Inactifs" value={templates.filter((template) => template.statut === "Inactif").length} /></section>
        <section className="rounded-xl border border-border bg-card p-4"><div className="flex items-start gap-3"><div className="rounded-lg bg-primary/10 p-2 text-primary"><FileText className="h-5 w-5" /></div><div><h2 className="font-semibold">Rôle de cet onglet</h2><p className="mt-1 text-sm text-muted-foreground">Créer et gérer une bibliothèque de modèles de formulaires réutilisables. Ces modèles ne sont pas liés à une commande. Les liens de candidature sont générés uniquement quand un template est rattaché à un pipeline de recrutement.</p></div></div></section>
        <section className="overflow-hidden rounded-xl border border-border bg-card"><div className="border-b border-border px-4 py-3"><h2 className="font-semibold">Bibliothèque de templates</h2><p className="text-sm text-muted-foreground">Liste globale des modèles disponibles pour les pipelines de recrutement.</p></div><Table><TableHeader><TableRow><TableHead>ID Template Formulaire</TableHead><TableHead>Nom du formulaire</TableHead><TableHead>Poste / catégorie</TableHead><TableHead>Statut</TableHead><TableHead>Date création</TableHead><TableHead>Créé par</TableHead><TableHead>Action</TableHead></TableRow></TableHeader><TableBody>{filtered.map((template) => <TableRow key={template.id} className="cursor-pointer" onClick={() => setSelected(template)}><TableCell className="font-medium">{template.id}</TableCell><TableCell>{template.nom}</TableCell><TableCell>{template.categorie}</TableCell><TableCell><StatusBadge value={template.statut} /></TableCell><TableCell>{template.dateCreation}</TableCell><TableCell>{template.creePar}</TableCell><TableCell onClick={(e) => e.stopPropagation()}><select className="rounded-md border border-input bg-background px-2 py-1 text-sm" value={template.statut} onChange={(e) => toggleStatus(template.id, e.target.value as StatutTemplate)}>{["Actif", "Inactif"].map((statut) => <option key={statut}>{statut}</option>)}</select></TableCell></TableRow>)}</TableBody></Table></section>
      </div>

      <Sheet open={creationOpen} onOpenChange={setCreationOpen}><SheetContent className="w-full overflow-y-auto sm:max-w-xl"><SheetHeader><SheetTitle>Créer un template formulaire</SheetTitle><SheetDescription>Le modèle créé ici reste global. Aucun lien de candidature n’est généré à cette étape.</SheetDescription></SheetHeader><div className="mt-6 space-y-4"><Input placeholder="Nom du formulaire" value={draft.nom} onChange={(e) => setDraft({ ...draft, nom: e.target.value })} /><Input placeholder="Poste / catégorie" value={draft.categorie} onChange={(e) => setDraft({ ...draft, categorie: e.target.value })} /><select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={draft.statut} onChange={(e) => setDraft({ ...draft, statut: e.target.value as StatutTemplate })}>{["Actif", "Inactif"].map((statut) => <option key={statut}>{statut}</option>)}</select><Input placeholder="Description du modèle" value={draft.description} onChange={(e) => setDraft({ ...draft, description: e.target.value })} /><Button className="w-full" onClick={openBuilder}><Plus /> Créer le template</Button></div></SheetContent></Sheet>
      <Sheet open={!!selected} onOpenChange={(open) => !open && setSelected(null)}><SheetContent className="w-full overflow-y-auto sm:max-w-xl">{selected && <><SheetHeader><SheetTitle>{selected.nom}</SheetTitle><SheetDescription>{selected.id} · {selected.categorie}</SheetDescription></SheetHeader><div className="mt-6 space-y-4 text-sm"><Info label="Statut" value={<StatusBadge value={selected.statut} />} /><Info label="Date création" value={selected.dateCreation} /><Info label="Créé par" value={selected.creePar} /><Info label="Description" value={selected.description} /><Info label="Important" value="Ce template ne reçoit aucune candidature directement. Il devient utilisable uniquement lorsqu’il est rattaché à un pipeline." /></div></>}</SheetContent></Sheet>
    </div>
  );
}

function FormBuilder({ draft, setDraft, fields, addField, updateField, deleteField, savedDemo, saveTemplateDemo, back }: { draft: { nom: string; categorie: string; statut: StatutTemplate; description: string }; setDraft: (draft: { nom: string; categorie: string; statut: StatutTemplate; description: string }) => void; fields: ChampFormulaire[]; addField: () => void; updateField: (id: string, patch: Partial<ChampFormulaire>) => void; deleteField: (id: string) => void; savedDemo: boolean; saveTemplateDemo: () => void; back: () => void }) {
  return (
    <div className="min-h-full bg-[#f8f7f2] text-[#2b001b]">
      <header className="mx-auto flex w-full max-w-7xl items-center justify-between px-5 py-7 sm:px-8"><div><p className="text-sm font-bold text-[#6d5f68]">Templates Formulaires</p><h1 className="text-2xl font-black tracking-tight">Création du modèle</h1></div><div className="flex gap-2"><Button variant="outline" className="rounded-full border-black/10 bg-white" onClick={back}><ArrowLeft className="mr-2 h-4 w-4" /> Retour</Button><Button className="rounded-full bg-[#2b001b] text-white hover:bg-[#2b001b]/90" onClick={saveTemplateDemo}><CheckCircle2 className="mr-2 h-4 w-4" /> Enregistrer</Button></div></header>
      <main className="mx-auto grid w-full max-w-7xl gap-8 px-5 pb-10 sm:px-8 xl:grid-cols-[340px_minmax(0,1fr)]">
        <aside className="space-y-5 xl:sticky xl:top-8 xl:self-start"><div className="rounded-[2rem] bg-[#2b001b] p-7 text-white shadow-2xl shadow-[#2b001b]/20"><div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-bold text-[#fff45f]"><Settings2 className="h-4 w-4" /> Builder type Google Form</div><h2 className="mt-6 text-4xl font-black leading-tight tracking-tight">{draft.nom || "Nouveau template"}</h2><p className="mt-4 text-sm leading-6 text-white/75">Construis ici la structure du formulaire réutilisable. Aucun lien candidat n’est généré tant que ce template n’est pas rattaché à un pipeline.</p></div><div className="rounded-[1.75rem] border-white bg-white/95 p-5 shadow-xl"><h3 className="font-black">Paramètres du template</h3><div className="mt-4 space-y-3"><Input placeholder="Nom du formulaire" value={draft.nom} onChange={(e) => setDraft({ ...draft, nom: e.target.value })} /><Input placeholder="Poste / catégorie" value={draft.categorie} onChange={(e) => setDraft({ ...draft, categorie: e.target.value })} /><Input placeholder="Description" value={draft.description} onChange={(e) => setDraft({ ...draft, description: e.target.value })} /><select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={draft.statut} onChange={(e) => setDraft({ ...draft, statut: e.target.value as StatutTemplate })}>{["Actif", "Inactif"].map((statut) => <option key={statut}>{statut}</option>)}</select>{savedDemo && <p className="rounded-xl bg-[#fff45f]/50 px-3 py-2 text-sm font-bold">Template enregistré en démonstration.</p>}</div></div></aside>
        <section className="overflow-hidden rounded-[2rem] border border-white/80 bg-white/95 shadow-2xl shadow-[#2b001b]/10"><div className="border-b border-[#eee7dc] bg-gradient-to-br from-white to-[#fffdf0] p-7 sm:p-9"><div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between"><div><span className="mb-4 inline-flex rounded-full bg-[#2b001b] px-4 py-1.5 text-xs font-bold text-white">FORM · TEMPLATE</span><h2 className="text-3xl font-black tracking-tight sm:text-4xl">{draft.nom || "Nom du formulaire"}</h2><p className="mt-3 max-w-2xl text-sm leading-6 text-[#594a54]">{draft.description || "Description du modèle de formulaire. Ce formulaire sert uniquement de template réutilisable."}</p></div><Button className="rounded-full bg-[#fff45f] text-[#2b001b] hover:bg-[#fff45f]/80" onClick={addField}><Plus className="mr-2 h-4 w-4" /> Ajouter une question</Button></div></div><div className="divide-y divide-[#eee7dc]">{fields.map((field, index) => <div key={field.id} className="grid gap-6 p-7 sm:p-9 lg:grid-cols-[70px_minmax(0,1fr)_150px]"><div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#2b001b] text-sm font-black text-white">{String(index + 1).padStart(2, "0")}</div><div className="space-y-3"><div className="flex items-center gap-2 text-[#6d5f68]"><GripVertical className="h-4 w-4" /><span className="text-xs font-bold uppercase tracking-[0.18em]">Question</span></div><Input value={field.titre} onChange={(e) => updateField(field.id, { titre: e.target.value })} className="border-[#ded6dd] bg-white text-base font-bold" /><Input value={field.aide} onChange={(e) => updateField(field.id, { aide: e.target.value })} className="border-[#ded6dd] bg-[#fffdf0]" placeholder="Texte d’aide" /></div><div className="space-y-3"><select className="w-full rounded-md border border-[#ded6dd] bg-white px-3 py-2 text-sm" value={field.type} onChange={(e) => updateField(field.id, { type: e.target.value as TypeChamp })}>{["Réponse courte", "Paragraphe", "Choix multiple", "Cases à cocher", "Liste déroulante", "Fichier"].map((type) => <option key={type}>{type}</option>)}</select><label className="flex items-center gap-2 text-sm font-medium"><input type="checkbox" checked={field.obligatoire} onChange={(e) => updateField(field.id, { obligatoire: e.target.checked })} /> Obligatoire</label><Button variant="outline" size="sm" className="w-full" onClick={() => deleteField(field.id)}><Trash2 className="mr-2 h-4 w-4" /> Supprimer</Button></div></div>)}</div></section>
      </main>
    </div>
  );
}

function Kpi({ label, value }: { label: string; value: number }) { return <div className="rounded-xl border border-border bg-card p-4"><p className="text-sm text-muted-foreground">{label}</p><p className="mt-2 text-3xl font-semibold">{value}</p></div>; }
function Info({ label, value }: { label: string; value: React.ReactNode }) { return <div className="rounded-lg border border-border bg-muted/30 p-3"><p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</p><div className="mt-1">{value}</div></div>; }
