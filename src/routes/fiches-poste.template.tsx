import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  BriefcaseBusiness,
  ClipboardList,
  FileText,
  Flag,
  GraduationCap,
  HeartHandshake,
  PenLine,
  Rocket,
  Sparkles,
  Target,
  UsersRound,
} from "lucide-react";

import logoMark from "@/assets/logos/logo-mark-soleil.svg";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/fiches-poste/template")({
  head: () => ({ meta: [{ title: "Template fiche de poste talent — SIRH" }] }),
  component: FichePosteTemplatePage,
});

function FichePosteTemplatePage() {
  return (
    <div className="min-h-full bg-[#f8f7f2] text-[#2b001b]">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute left-[-10rem] top-[-10rem] h-[30rem] w-[30rem] rounded-full bg-[#fff45f]/30 blur-3xl" />
        <div className="absolute right-[-8rem] top-28 h-[28rem] w-[28rem] rounded-full bg-[#2b001b]/10 blur-3xl" />
      </div>

      <header className="mx-auto flex w-full max-w-7xl items-center justify-between px-5 py-7 sm:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-black/10">
            <img src={logoMark} alt="Mon Ambassadeur" className="h-8 w-8" />
          </div>
          <div>
            <p className="text-sm font-bold leading-none text-[#2b001b]">Mon Ambassadeur</p>
            <p className="mt-1 text-xs font-medium text-[#6d5f68]">Template fiche de poste talent</p>
          </div>
        </div>
        <Button asChild variant="outline" className="rounded-full border-black/10 bg-white text-[#2b001b] shadow-sm hover:bg-white">
          <Link to="/fiches-poste">
            <ArrowLeft className="mr-2 h-4 w-4" /> Retour aux fiches
          </Link>
        </Button>
      </header>

      <main className="mx-auto grid w-full max-w-7xl gap-8 px-5 pb-10 sm:px-8 xl:grid-cols-[360px_minmax(0,1fr)]">
        <aside className="space-y-5 xl:sticky xl:top-8 xl:self-start">
          <div className="rounded-[2rem] bg-[#2b001b] p-7 text-white shadow-2xl shadow-[#2b001b]/20">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-bold text-[#fff45f]">
              <Sparkles className="h-4 w-4" /> Modèle prêt à personnaliser
            </div>
            <h1 className="mt-6 text-4xl font-black leading-tight tracking-tight">
              Fiche de poste talent
            </h1>
            <p className="mt-4 text-sm leading-6 text-white/75">
              Un template propre, structuré et directement exploitable pour cadrer le poste avant la recherche de talents.
            </p>
          </div>

          <Card className="rounded-[1.75rem] border-white bg-white/95 shadow-xl shadow-[#2b001b]/8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base text-[#2b001b]">
                <ClipboardList className="h-4 w-4" /> Structure du template
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-[#594a54]">
              <NavItem number="01" label="Informations clés" />
              <NavItem number="02" label="Contexte du recrutement" />
              <NavItem number="03" label="Objectifs principaux" />
              <NavItem number="04" label="Périmètre des missions" />
              <NavItem number="05" label="Évolution du poste" />
              <NavItem number="06" label="Profil & compétences" />
              <NavItem number="07" label="Enjeux clés" />
              <NavItem number="08" label="Informations internes" />
            </CardContent>
          </Card>
        </aside>

        <section className="overflow-hidden rounded-[2rem] border border-white/80 bg-white/95 shadow-2xl shadow-[#2b001b]/10 backdrop-blur">
          <div className="border-b border-[#eee7dc] bg-gradient-to-br from-white to-[#fffdf0] p-7 sm:p-9">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <Badge className="mb-4 rounded-full bg-[#2b001b] px-4 py-1.5 text-white hover:bg-[#2b001b]">
                  FPT · Template
                </Badge>
                <h2 className="text-3xl font-black tracking-tight text-[#2b001b] sm:text-4xl">
                  Template fiche de poste talent
                </h2>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-[#594a54]">
                  Ce modèle reprend la structure de la fiche de poste fournie et servira de base pour créer des fiches personnalisées dans la suite du projet.
                </p>
              </div>
              <div className="rounded-2xl bg-[#fff45f]/45 px-4 py-3 text-sm font-bold text-[#2b001b] ring-1 ring-[#fff45f]">
                FPT-TEMPLATE
              </div>
            </div>
          </div>

          <div className="divide-y divide-[#eee7dc]">
            <TemplateSection
              number="01"
              icon={BriefcaseBusiness}
              title="Informations clés"
              description="Les données de cadrage visibles dès le début de la fiche."
            >
              <div className="grid gap-4 md:grid-cols-3">
                <PlaceholderField label="Intitulé du poste" value="Nom du poste ICI" />
                <PlaceholderField label="Type de contrat" value="Temps plein, mi-temps, freelance, alternance…" />
                <PlaceholderField label="Lieu de travail" value="À distance, hybride ou sur site" />
              </div>
            </TemplateSection>

            <TemplateSection
              number="02"
              icon={FileText}
              title="Contexte du recrutement"
              description="Pourquoi ce poste est ouvert et quel enjeu il porte pour l’entreprise."
            >
              <TextBlock>
                Décrivez le contexte du recrutement et l’enjeu du poste. Exemple : une entreprise opérant dans le secteur de [secteur] cherche à recruter un profil [poste] afin de renforcer son équipe [équipe/service].
              </TextBlock>
            </TemplateSection>

            <TemplateSection
              number="03"
              icon={Target}
              title="Objectifs principaux du poste"
              description="Les résultats attendus à court et moyen terme."
            >
              <BulletList items={["[Objectif 1]", "[Objectif 2]", "[Objectif 3]"]} />
            </TemplateSection>

            <TemplateSection
              number="04"
              icon={ClipboardList}
              title="Périmètre des missions"
              description="Les responsabilités concrètes confiées au talent."
            >
              <div className="grid gap-4 lg:grid-cols-3">
                <MissionCard title="Mission 1" items={["Détail 1", "Détail 2", "Détail 3"]} />
                <MissionCard title="Mission 2" items={["Détail 1", "Détail 2", "Détail 3"]} />
                <MissionCard title="Mission 3" items={["Détail 1", "Détail 2", "Détail 3"]} />
              </div>
            </TemplateSection>

            <TemplateSection
              number="05"
              icon={Rocket}
              title="Évolution du poste"
              description="Perspectives, responsabilités futures et trajectoire possible."
            >
              <TextBlock>
                Décrivez les perspectives d’évolution ou les responsabilités qui seront ajoutées à moyen/long terme.
              </TextBlock>
            </TemplateSection>

            <TemplateSection
              number="06"
              icon={GraduationCap}
              title="Profil et compétences recherchés"
              description="Compétences techniques, comportementales et profil idéal."
            >
              <div className="grid gap-4 lg:grid-cols-3">
                <SkillCard title="Compétences techniques" items={["[Compétence technique 1]", "[Compétence technique 2]", "[Compétence technique 3]"]} />
                <SkillCard title="Soft skills" items={["[Soft skill 1]", "[Soft skill 2]", "[Soft skill 3]"]} />
                <SkillCard title="Profil idéal" items={["[Caractéristique 1]", "[Caractéristique 2]", "[Disponibilité / contrainte spécifique]"]} />
              </div>
            </TemplateSection>

            <TemplateSection
              number="07"
              icon={Flag}
              title="Enjeux clés du poste"
              description="Les points critiques à valider pour réussir le recrutement."
            >
              <BulletList items={["[Enjeu clé 1]", "[Enjeu clé 2]", "[Enjeu clé 3]"]} />
            </TemplateSection>

            <TemplateSection
              number="08"
              icon={HeartHandshake}
              title="Informations internes"
              description="Champs utiles au suivi interne de la fiche."
            >
              <div className="grid gap-4 md:grid-cols-2">
                <PlaceholderField label="Nom du chargé RH" value="À compléter" />
                <PlaceholderField label="Nom du commercial" value="À compléter" />
              </div>
            </TemplateSection>
          </div>
        </section>
      </main>
    </div>
  );
}

function NavItem({ number, label }: { number: string; label: string }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-[#eee7dc] bg-[#fffdf0] px-3 py-2">
      <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-[#2b001b] text-xs font-black text-white">{number}</span>
      <span className="font-medium text-[#2b001b]">{label}</span>
    </div>
  );
}

function TemplateSection({
  number,
  icon: Icon,
  title,
  description,
  children,
}: {
  number: string;
  icon: typeof PenLine;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="grid gap-6 p-7 sm:p-9 lg:grid-cols-[210px_minmax(0,1fr)]">
      <div>
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#2b001b] text-sm font-black text-white shadow-lg shadow-[#2b001b]/20">
            {number}
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#fff45f]/55 text-[#2b001b]">
            <Icon className="h-5 w-5" />
          </div>
        </div>
        <h3 className="mt-4 text-xl font-black text-[#2b001b]">{title}</h3>
        <p className="mt-2 text-sm leading-5 text-[#6d5f68]">{description}</p>
      </div>
      <div>{children}</div>
    </section>
  );
}

function PlaceholderField({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-3xl border border-[#ded6dd] bg-white p-5 shadow-sm">
      <p className="text-xs font-black uppercase tracking-[0.18em] text-[#6d5f68]">{label}</p>
      <p className="mt-3 text-sm font-semibold text-[#2b001b]">{value}</p>
    </div>
  );
}

function TextBlock({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-3xl border border-dashed border-[#cfc4cc] bg-[#fffdf0] p-6 text-sm leading-7 text-[#594a54]">
      {children}
    </div>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-3 rounded-3xl border border-[#ded6dd] bg-white p-5 shadow-sm">
      {items.map((item) => (
        <li key={item} className="flex gap-3 text-sm text-[#594a54]">
          <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-[#fff45f] ring-2 ring-[#2b001b]" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function MissionCard({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-3xl border border-[#eee7dc] bg-white p-5 shadow-sm">
      <p className="font-black text-[#2b001b]">{title}</p>
      <ul className="mt-4 space-y-2 text-sm text-[#594a54]">
        {items.map((item) => (
          <li key={item} className="flex gap-2">
            <span className="text-[#2b001b]">•</span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function SkillCard({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-3xl border border-[#eee7dc] bg-white p-5 shadow-sm">
      <p className="font-black text-[#2b001b]">{title}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {items.map((item) => (
          <Badge key={item} variant="secondary" className="rounded-full bg-[#fff45f]/60 px-3 py-1 text-[#2b001b] hover:bg-[#fff45f]/60">
            {item}
          </Badge>
        ))}
      </div>
    </div>
  );
}
