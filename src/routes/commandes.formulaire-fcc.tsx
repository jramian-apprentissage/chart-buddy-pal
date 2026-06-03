import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, BriefcaseBusiness, CheckCircle2, ClipboardCheck, Sparkles, UsersRound } from "lucide-react";
import { type FormEvent, useMemo, useState } from "react";

import logoMark from "@/assets/logos/logo-mark-soleil.svg";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/commandes/formulaire-fcc")({
  head: () => ({ meta: [{ title: "Demande de recrutement — Mon Ambassadeur" }] }),
  component: FormulaireFccPage,
});

type FccForm = {
  idEntreprise: string;
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
  idEntreprise: "",
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
    <div className="min-h-screen overflow-hidden bg-[#f7f3ea] text-[#1f1933]">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute left-[-12rem] top-[-12rem] h-[34rem] w-[34rem] rounded-full bg-[#ffd84d]/40 blur-3xl" />
        <div className="absolute right-[-10rem] top-24 h-[32rem] w-[32rem] rounded-full bg-[#4c2a85]/20 blur-3xl" />
        <div className="absolute bottom-[-12rem] left-1/3 h-[26rem] w-[26rem] rounded-full bg-white/70 blur-3xl" />
      </div>

      <header className="mx-auto flex w-full max-w-7xl items-center justify-between px-5 py-6 sm:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-black/5">
            <img src={logoMark} alt="Mon Ambassadeur" className="h-8 w-8" />
          </div>
          <div>
            <p className="text-sm font-bold leading-none text-[#2e2352]">Mon Ambassadeur</p>
            <p className="mt-1 text-xs font-medium text-[#6f6680]">Demande de recrutement</p>
          </div>
        </div>
        <Badge className="hidden rounded-full bg-white px-4 py-2 text-[#2e2352] shadow-sm ring-1 ring-black/5 hover:bg-white sm:inline-flex">
          Formulaire sécurisé
        </Badge>
      </header>

      <main className="mx-auto grid w-full max-w-7xl gap-8 px-5 pb-14 sm:px-8 lg:grid-cols-[0.9fr_1.25fr] lg:items-start">
        <section className="pt-6 lg:sticky lg:top-8 lg:pt-16">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-sm font-semibold text-[#4c2a85] shadow-sm ring-1 ring-black/5 backdrop-blur">
            <Sparkles className="h-4 w-4" /> Nouvelle commande client
          </div>

          <h1 className="mt-7 max-w-xl text-4xl font-black tracking-tight text-[#251b45] sm:text-5xl lg:text-6xl">
            Lancez une recherche de talents en quelques minutes.
          </h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-[#675f76] sm:text-lg">
            Complétez cette fiche pour permettre à l’équipe Mon Ambassadeur de comprendre le besoin,
            cadrer le poste et démarrer la recherche avec les bonnes informations.
          </p>

          <div className="mt-8 grid gap-3 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
            <FeatureCard icon={ClipboardCheck} title="Brief clair" text="Toutes les infos utiles au lancement." />
            <FeatureCard icon={UsersRound} title="Ciblage RH" text="Profil, missions et compétences attendues." />
            <FeatureCard icon={BriefcaseBusiness} title="Suivi interne" text="Création d’une commande FCC exploitable." />
          </div>

          <div className="mt-8 rounded-3xl bg-[#2e2352] p-6 text-white shadow-2xl shadow-[#2e2352]/20">
            <p className="text-sm font-semibold text-[#ffd84d]">À préparer avant de commencer</p>
            <ul className="mt-4 space-y-3 text-sm text-white/80">
              <li className="flex gap-3"><span className="text-[#ffd84d]">•</span> Informations entreprise et contact client.</li>
              <li className="flex gap-3"><span className="text-[#ffd84d]">•</span> Description du poste et compétences attendues.</li>
              <li className="flex gap-3"><span className="text-[#ffd84d]">•</span> Planning souhaité, budget et conditions commerciales.</li>
            </ul>
          </div>
        </section>

        <section>
          {submitted && (
            <div className="mb-6 rounded-3xl border border-[#bca7ff]/40 bg-white/90 p-5 shadow-xl shadow-[#4c2a85]/10 backdrop-blur">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 rounded-full bg-[#dff7e8] p-2 text-[#15803d]">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-bold text-[#251b45]">Demande prête à être enregistrée</p>
                    <p className="mt-1 text-sm text-[#675f76]">
                      Aperçu : {commandeNumber} · {form.nomEntreprise || "Entreprise non renseignée"} · {form.intitulePoste || "Poste non renseigné"}
                    </p>
                  </div>
                </div>
                <Badge className="w-fit rounded-full bg-[#ffd84d] px-4 py-2 text-[#251b45] hover:bg-[#ffd84d]">
                  Brouillon validé
                </Badge>
              </div>
            </div>
          )}

          <Card className="overflow-hidden rounded-[2rem] border-white/80 bg-white/95 shadow-2xl shadow-[#4c2a85]/12 backdrop-blur">
            <CardHeader className="border-b border-[#efeaf7] bg-gradient-to-br from-white to-[#fbf7ea] p-7 sm:p-9">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <Badge className="mb-4 rounded-full bg-[#4c2a85] px-4 py-1.5 text-white hover:bg-[#4c2a85]">
                    FCC · Commande client
                  </Badge>
                  <CardTitle className="text-2xl font-black tracking-tight text-[#251b45] sm:text-3xl">
                    Formulaire de demande
                  </CardTitle>
                  <CardDescription className="mt-3 max-w-2xl text-sm leading-6 text-[#675f76]">
                    Les champs marqués comme essentiels permettent de créer la commande client et de générer la fiche associée.
                  </CardDescription>
                </div>
                <div className="rounded-2xl bg-[#ffd84d]/30 px-4 py-3 text-sm font-bold text-[#3b2a08] ring-1 ring-[#ffd84d]/50">
                  {commandeNumber}
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-0">
              <form id="fcc-form" onSubmit={handleSubmit} className="divide-y divide-[#efeaf7]">
                <FormSection number="01" title="Informations entreprise" description="Identité de l’entreprise cliente.">
                  <div className="grid gap-5 md:grid-cols-2">
                    <TextField label="ID entreprise" value={form.idEntreprise} onChange={(value) => updateField("idEntreprise", value)} placeholder="Ex. ENT-000123" required />
                    <TextField label="Nom entreprise" value={form.nomEntreprise} onChange={(value) => updateField("nomEntreprise", value)} required />
                    <TextField label="Secteur d’activité" value={form.secteurActivite} onChange={(value) => updateField("secteurActivite", value)} />
                    <TextField label="Numéro de SIRET" value={form.siret} onChange={(value) => updateField("siret", value)} />
                    <TextAreaField label="Adresse" value={form.adresse} onChange={(value) => updateField("adresse", value)} className="md:col-span-2" />
                  </div>
                </FormSection>

                <FormSection number="02" title="Contact client" description="Personne référente pour la commande.">
                  <div className="grid gap-5 md:grid-cols-3">
                    <TextField label="Nom" value={form.nomContact} onChange={(value) => updateField("nomContact", value)} />
                    <TextField label="Prénom" value={form.prenomContact} onChange={(value) => updateField("prenomContact", value)} />
                    <TextField label="Interlocuteur principal" value={form.interlocuteurPrincipal} onChange={(value) => updateField("interlocuteurPrincipal", value)} required />
                  </div>
                </FormSection>

                <FormSection number="03" title="Positionnement & cible" description="Contexte de l’entreprise et cible commerciale.">
                  <div className="grid gap-5 md:grid-cols-[minmax(0,1fr)_240px]">
                    <TextAreaField label="Présentation de l’entreprise" value={form.presentationEntreprise} onChange={(value) => updateField("presentationEntreprise", value)} />
                    <SelectField label="Cible commerciale" value={form.cibleCommerciale} onChange={(value) => updateField("cibleCommerciale", value)} options={["BtoB", "BtoC", "BtoB / BtoC"]} />
                  </div>
                </FormSection>

                <FormSection number="04" title="Détails du poste" description="Besoin à recruter, missions et compétences attendues.">
                  <div className="grid gap-5 md:grid-cols-2">
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

                <FormSection number="05" title="Planning & process" description="Dates cibles pour organiser la recherche.">
                  <div className="grid gap-5 md:grid-cols-2">
                    <TextField label="Date de démarrage souhaitée" type="date" value={form.dateDemarrage} onChange={(value) => updateField("dateDemarrage", value)} />
                    <TextField label="Date de présentation de profil" type="date" value={form.datePresentationProfil} onChange={(value) => updateField("datePresentationProfil", value)} />
                  </div>
                </FormSection>

                <FormSection number="06" title="Conditions commerciales" description="Cadre contractuel et budget de la mission.">
                  <div className="grid gap-5 md:grid-cols-3">
                    <SelectField label="Type de contrat / temps" value={form.typeContratTemps} onChange={(value) => updateField("typeContratTemps", value)} options={["CDI · Temps plein", "CDI · Temps partiel", "CDD", "Freelance", "Alternance", "Stage"]} />
                    <TextField label="Budget de la mission" value={form.budgetMission} onChange={(value) => updateField("budgetMission", value)} placeholder="Ex. 8 000 €" />
                    <TextField label="Engagement / durée" value={form.engagementDuree} onChange={(value) => updateField("engagementDuree", value)} />
                  </div>
                </FormSection>

                <div className="flex flex-col gap-4 bg-[#fbf7ea] p-7 sm:flex-row sm:items-center sm:justify-between sm:p-9">
                  <p className="max-w-xl text-sm leading-6 text-[#675f76]">
                    En validant, la demande sera prête à alimenter l’onglet Commandes Clients / FCC et à générer la fiche de commande.
                  </p>
                  <Button type="submit" size="lg" className="h-12 rounded-full bg-[#4c2a85] px-7 text-white hover:bg-[#3c216a]">
                    Créer la demande <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, text }: { icon: typeof ClipboardCheck; title: string; text: string }) {
  return (
    <div className="rounded-3xl bg-white/85 p-5 shadow-lg shadow-[#4c2a85]/8 ring-1 ring-black/5 backdrop-blur">
      <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-[#ffd84d]/35 text-[#4c2a85]">
        <Icon className="h-5 w-5" />
      </div>
      <p className="font-bold text-[#251b45]">{title}</p>
      <p className="mt-1 text-sm leading-5 text-[#675f76]">{text}</p>
    </div>
  );
}

function FormSection({ number, title, description, children }: { number: string; title: string; description?: string; children: React.ReactNode }) {
  return (
    <section className="grid gap-6 p-7 sm:p-9 lg:grid-cols-[170px_minmax(0,1fr)]">
      <div>
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#4c2a85] text-sm font-black text-white shadow-lg shadow-[#4c2a85]/20">
          {number}
        </div>
        <h2 className="mt-4 text-lg font-black text-[#251b45]">{title}</h2>
        {description && <p className="mt-2 text-sm leading-5 text-[#756d83]">{description}</p>}
      </div>
      <div>{children}</div>
    </section>
  );
}

function TextField({ label, value, onChange, type = "text", placeholder, required = false, className = "" }: { label: string; value: string; onChange: (value: string) => void; type?: string; placeholder?: string; required?: boolean; className?: string }) {
  return (
    <div className={className}>
      <Label className="text-sm font-bold text-[#2e2352]">{label}{required && <span className="ml-1 text-[#4c2a85]">*</span>}</Label>
      <Input className="mt-2 h-12 rounded-2xl border-[#e6dff0] bg-white text-[#251b45] shadow-sm transition focus-visible:ring-[#4c2a85]" type={type} value={value} placeholder={placeholder} required={required} onChange={(event) => onChange(event.target.value)} />
    </div>
  );
}

function TextAreaField({ label, value, onChange, placeholder, className = "" }: { label: string; value: string; onChange: (value: string) => void; placeholder?: string; className?: string }) {
  return (
    <div className={className}>
      <Label className="text-sm font-bold text-[#2e2352]">{label}</Label>
      <Textarea className="mt-2 min-h-28 rounded-2xl border-[#e6dff0] bg-white text-[#251b45] shadow-sm transition focus-visible:ring-[#4c2a85]" value={value} placeholder={placeholder} onChange={(event) => onChange(event.target.value)} />
    </div>
  );
}

function SelectField({ label, value, onChange, options }: { label: string; value: string; onChange: (value: string) => void; options: string[] }) {
  return (
    <div>
      <Label className="text-sm font-bold text-[#2e2352]">{label}</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="mt-2 h-12 rounded-2xl border-[#e6dff0] bg-white text-[#251b45] shadow-sm focus:ring-[#4c2a85]">
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
