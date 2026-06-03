import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, ClipboardList, FileText, Send } from "lucide-react";
import { type FormEvent, useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/commandes/formulaire-fcc")({
  head: () => ({ meta: [{ title: "Formulaire FCC — SIRH" }] }),
  component: FormulaireFccPage,
});

type FccForm = {
  nomEntreprise: string;
  secteurActivite: string;
  siret: string;
  adresse: string;
  nomContact: string;
  prenomContact: string;
  interlocuteurPrincipal: string;
  presentationEntreprise: string;
  cibleCommerciale: string;
  intitulePoste: string;
  categoriePoste: string;
  offreSelectionnee: string;
  nombreProfils: string;
  objectifPrincipal: string;
  missionsPrincipales: string;
  competencesTechniques: string;
  softSkills: string;
  dateDemarrage: string;
  datePresentationProfil: string;
  typeContratTemps: string;
  budgetMission: string;
  engagementDuree: string;
};

const initialForm: FccForm = {
  nomEntreprise: "",
  secteurActivite: "",
  siret: "",
  adresse: "",
  nomContact: "",
  prenomContact: "",
  interlocuteurPrincipal: "",
  presentationEntreprise: "",
  cibleCommerciale: "",
  intitulePoste: "",
  categoriePoste: "",
  offreSelectionnee: "",
  nombreProfils: "1",
  objectifPrincipal: "",
  missionsPrincipales: "",
  competencesTechniques: "",
  softSkills: "",
  dateDemarrage: "",
  datePresentationProfil: "",
  typeContratTemps: "",
  budgetMission: "",
  engagementDuree: "",
};

function FormulaireFccPage() {
  const [form, setForm] = useState<FccForm>(initialForm);
  const [submitted, setSubmitted] = useState(false);

  const commandeNumber = useMemo(() => {
    const now = new Date();
    return `FCC-${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}${String(
      now.getDate(),
    ).padStart(2, "0")}`;
  }, []);

  const updateField = (field: keyof FccForm, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-full bg-background">
      <div className="border-b border-border bg-card px-6 py-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <Badge variant="secondary" className="bg-accent text-accent-foreground">
                FCC
              </Badge>
              <span className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                Commandes clients
              </span>
            </div>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              Formulaire de création de commande client
            </h1>
            <p className="mt-1 max-w-3xl text-sm text-muted-foreground">
              Lien à transmettre depuis Monday pour créer une commande de recrutement et alimenter l’onglet
              Commandes Clients / FCC.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" asChild>
              <Link to="/commandes">Retour aux commandes</Link>
            </Button>
            <Button type="submit" form="fcc-form" className="gap-2">
              <Send className="h-4 w-4" /> Créer la commande
            </Button>
          </div>
        </div>
      </div>

      <div className="grid gap-6 p-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <form id="fcc-form" onSubmit={handleSubmit} className="space-y-6">
          <FormSection
            eyebrow="Section 1"
            title="Informations entreprise"
            description="Données issues du modèle de fiche de commande."
          >
            <div className="grid gap-4 md:grid-cols-2">
              <TextField label="Nom entreprise" value={form.nomEntreprise} onChange={(value) => updateField("nomEntreprise", value)} required />
              <TextField label="Secteur d’activité" value={form.secteurActivite} onChange={(value) => updateField("secteurActivite", value)} />
              <TextField label="Numéro de SIRET" value={form.siret} onChange={(value) => updateField("siret", value)} />
              <TextAreaField label="Adresse" value={form.adresse} onChange={(value) => updateField("adresse", value)} className="md:col-span-2" />
            </div>
          </FormSection>

          <FormSection eyebrow="Section 2" title="Contact client">
            <div className="grid gap-4 md:grid-cols-3">
              <TextField label="Nom" value={form.nomContact} onChange={(value) => updateField("nomContact", value)} />
              <TextField label="Prénom" value={form.prenomContact} onChange={(value) => updateField("prenomContact", value)} />
              <TextField label="Interlocuteur principal" value={form.interlocuteurPrincipal} onChange={(value) => updateField("interlocuteurPrincipal", value)} required />
            </div>
          </FormSection>

          <FormSection eyebrow="Section 3" title="Positionnement & cible">
            <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_220px]">
              <TextAreaField label="Présentation de l’entreprise" value={form.presentationEntreprise} onChange={(value) => updateField("presentationEntreprise", value)} />
              <SelectField label="Cible commerciale" value={form.cibleCommerciale} onChange={(value) => updateField("cibleCommerciale", value)} options={["BtoB", "BtoC", "BtoB / BtoC"]} />
            </div>
          </FormSection>

          <FormSection eyebrow="Section 4" title="Détails du poste">
            <div className="grid gap-4 md:grid-cols-2">
              <TextField label="Intitulé du poste" value={form.intitulePoste} onChange={(value) => updateField("intitulePoste", value)} required />
              <SelectField label="Catégorie de poste" value={form.categoriePoste} onChange={(value) => updateField("categoriePoste", value)} options={["Commercial", "Marketing", "RH", "Support", "Direction", "Autre"]} />
              <TextField label="Offre sélectionnée" value={form.offreSelectionnee} onChange={(value) => updateField("offreSelectionnee", value)} />
              <TextField label="Nombre de profils recherchés" type="number" value={form.nombreProfils} onChange={(value) => updateField("nombreProfils", value)} />
              <TextAreaField label="Objectif principal" value={form.objectifPrincipal} onChange={(value) => updateField("objectifPrincipal", value)} className="md:col-span-2" />
              <TextAreaField label="Missions principales" value={form.missionsPrincipales} onChange={(value) => updateField("missionsPrincipales", value)} className="md:col-span-2" placeholder="Une mission par ligne" />
              <TextAreaField label="Compétences techniques" value={form.competencesTechniques} onChange={(value) => updateField("competencesTechniques", value)} placeholder="Une compétence par ligne" />
              <TextAreaField label="Soft skills" value={form.softSkills} onChange={(value) => updateField("softSkills", value)} placeholder="Une soft skill par ligne" />
            </div>
          </FormSection>

          <FormSection eyebrow="Section 5" title="Planning & process">
            <div className="grid gap-4 md:grid-cols-2">
              <TextField label="Date de démarrage souhaitée" type="date" value={form.dateDemarrage} onChange={(value) => updateField("dateDemarrage", value)} />
              <TextField label="Date de présentation de profil" type="date" value={form.datePresentationProfil} onChange={(value) => updateField("datePresentationProfil", value)} />
            </div>
          </FormSection>

          <FormSection eyebrow="Section 6" title="Conditions commerciales">
            <div className="grid gap-4 md:grid-cols-3">
              <SelectField label="Type de contrat / temps" value={form.typeContratTemps} onChange={(value) => updateField("typeContratTemps", value)} options={["CDI · Temps plein", "CDI · Temps partiel", "CDD", "Freelance", "Alternance", "Stage"]} />
              <TextField label="Budget de la mission" value={form.budgetMission} onChange={(value) => updateField("budgetMission", value)} placeholder="Ex. 8 000 €" />
              <TextField label="Engagement / durée" value={form.engagementDuree} onChange={(value) => updateField("engagementDuree", value)} />
            </div>
          </FormSection>
        </form>

        <aside className="space-y-6">
          <Card className="border-border bg-card shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <ClipboardList className="h-4 w-4" /> Lien formulaire FCC
              </CardTitle>
              <CardDescription>
                Ce lien est celui à renseigner dans la colonne Monday “Lien formulaire FCC”.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="rounded-lg border border-border bg-muted/40 p-3 font-mono text-xs text-foreground">
                /commandes/formulaire-fcc
              </div>
              <p className="text-xs text-muted-foreground">
                La connexion Monday sera branchée ensuite pour générer un lien pré-rempli par opportunité.
              </p>
            </CardContent>
          </Card>

          <Card className="border-border bg-card shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <FileText className="h-4 w-4" /> Fiche générée
              </CardTitle>
              <CardDescription>Aperçu de la fiche de commande qui sera rattachée à la colonne “Fiche de commande”.</CardDescription>
            </CardHeader>
            <CardContent>
              {submitted ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 rounded-lg border border-accent bg-accent/30 p-3 text-sm font-medium text-foreground">
                    <CheckCircle2 className="h-4 w-4" /> Commande prête à créer
                  </div>
                  <PreviewBlock label="Numéro commande" value={commandeNumber} />
                  <PreviewBlock label="Entreprise" value={form.nomEntreprise} />
                  <PreviewBlock label="Référent client" value={form.interlocuteurPrincipal} />
                  <PreviewBlock label="Nom du poste" value={form.intitulePoste} />
                  <PreviewBlock label="# Profil" value={form.nombreProfils} />
                  <PreviewBlock label="Budget mission" value={form.budgetMission} />
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Complète le formulaire puis clique sur “Créer la commande” pour afficher l’aperçu de génération.
                </p>
              )}
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}

function FormSection({ eyebrow, title, description, children }: { eyebrow: string; title: string; description?: string; children: React.ReactNode }) {
  return (
    <Card className="border-border bg-card shadow-sm">
      <CardHeader>
        <div className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">{eyebrow}</div>
        <CardTitle className="text-lg text-foreground">{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

function TextField({ label, value, onChange, type = "text", placeholder, required = false, className = "" }: { label: string; value: string; onChange: (value: string) => void; type?: string; placeholder?: string; required?: boolean; className?: string }) {
  return (
    <div className={className}>
      <Label className="text-sm font-medium text-foreground">{label}</Label>
      <Input className="mt-2 bg-background" type={type} value={value} placeholder={placeholder} required={required} onChange={(event) => onChange(event.target.value)} />
    </div>
  );
}

function TextAreaField({ label, value, onChange, placeholder, className = "" }: { label: string; value: string; onChange: (value: string) => void; placeholder?: string; className?: string }) {
  return (
    <div className={className}>
      <Label className="text-sm font-medium text-foreground">{label}</Label>
      <Textarea className="mt-2 min-h-28 bg-background" value={value} placeholder={placeholder} onChange={(event) => onChange(event.target.value)} />
    </div>
  );
}

function SelectField({ label, value, onChange, options }: { label: string; value: string; onChange: (value: string) => void; options: string[] }) {
  return (
    <div>
      <Label className="text-sm font-medium text-foreground">{label}</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="mt-2 bg-background">
          <SelectValue placeholder="Sélectionner" />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option} value={option}>{option}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

function PreviewBlock({ label, value }: { label: string; value?: string }) {
  return (
    <div className="rounded-lg border border-border bg-muted/30 p-3">
      <div className="text-xs uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className="mt-1 text-sm font-medium text-foreground">{value || "Non renseigné"}</div>
    </div>
  );
}
