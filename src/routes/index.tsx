import { createFileRoute, Link } from "@tanstack/react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, FileText, ShoppingCart, Users, UserCheck, LogIn, LogOut } from "lucide-react";
import logoFull from "@/assets/logos/logo-full-dark.svg";
import { commandes, fichesPoste, recrutements, talents, collaborateurs, entrees, sorties } from "@/lib/mock-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Mon Ambassadeur — SIRH" },
      { name: "description", content: "Tableau de bord du SIRH Mon Ambassadeur." },
    ],
  }),
  component: Dashboard,
});

const tiles = [
  { label: "Commandes clients", value: () => commandes.length, to: "/commandes", icon: ShoppingCart, sub: "Pilotage Sales" },
  { label: "Fiches de poste", value: () => fichesPoste.length, to: "/fiches-poste", icon: FileText, sub: "Référentiel postes" },
  { label: "Recrutements actifs", value: () => recrutements.filter(r => r.statut !== "Pourvu" && r.statut !== "Annulé").length, to: "/recrutements", icon: Briefcase, sub: "Workflow R0 → R7" },
  { label: "Talents en pipeline", value: () => talents.length, to: "/pipeline", icon: Users, sub: "Vivier candidats" },
  { label: "Collaborateurs", value: () => collaborateurs.filter(c => c.etat === "Actif").length, to: "/collaborateurs", icon: UserCheck, sub: "Actifs" },
  { label: "Entrées", value: () => entrees.length, to: "/entrees", icon: LogIn, sub: "En mission" },
  { label: "Sorties", value: () => sorties.length, to: "/sorties", icon: LogOut, sub: "Historique" },
];

function Dashboard() {
  return (
    <div className="p-6">
      <div className="mb-8 flex items-center gap-6 rounded-2xl bg-primary p-8 text-primary-foreground">
        <img src={logoFull} alt="Mon Ambassadeur" className="hidden h-16 sm:block brightness-0 invert" />
        <div>
          <p className="text-xs uppercase tracking-widest text-primary-foreground/70">SIRH · Démo équipe</p>
          <h1 className="mt-2 text-3xl font-semibold">Bienvenue dans le SIRH Mon Ambassadeur</h1>
          <p className="mt-2 max-w-2xl text-sm text-primary-foreground/80">
            Centralisez les commandes clients, gérez vos recrutements de bout en bout, suivez votre vivier
            de talents et la vie de vos collaborateurs — le tout depuis une interface unique.
          </p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {tiles.map((t) => (
          <Link key={t.to} to={t.to}>
            <Card className="h-full transition-shadow hover:shadow-md">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{t.label}</CardTitle>
                <t.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-semibold">{t.value()}</div>
                <CardDescription className="mt-1">{t.sub}</CardDescription>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Périmètre Sales</CardTitle>
            <CardDescription>Accès commandes clients & consultation des fiches de poste.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <Link to="/commandes" className="rounded-md border border-border px-3 py-1.5 text-sm hover:bg-muted">Commandes clients</Link>
            <Link to="/fiches-poste" className="rounded-md border border-border px-3 py-1.5 text-sm hover:bg-muted">Fiches de poste</Link>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Périmètre RH</CardTitle>
            <CardDescription>Recrutements, pipeline, collaborateurs, entrées et sorties.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <Link to="/recrutements" className="rounded-md border border-border px-3 py-1.5 text-sm hover:bg-muted">Recrutements</Link>
            <Link to="/pipeline" className="rounded-md border border-border px-3 py-1.5 text-sm hover:bg-muted">Pipeline talents</Link>
            <Link to="/collaborateurs" className="rounded-md border border-border px-3 py-1.5 text-sm hover:bg-muted">Collaborateurs</Link>
            <Link to="/entrees" className="rounded-md border border-border px-3 py-1.5 text-sm hover:bg-muted">Entrées</Link>
            <Link to="/sorties" className="rounded-md border border-border px-3 py-1.5 text-sm hover:bg-muted">Sorties</Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
