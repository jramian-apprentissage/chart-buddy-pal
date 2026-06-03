import { createFileRoute, Link } from "@tanstack/react-router";
import { AlertTriangle, Briefcase, CalendarDays, CheckCircle2, Clock3, ClipboardList, FileText, Flame, LayoutDashboard, ListTodo, ShieldAlert, UserCheck, Users } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — Mon Ambassadeur SIRH" },
      { name: "description", content: "Tableau de bord opérationnel RH, recrutement et commandes clients." },
    ],
  }),
  component: Dashboard,
});

const taskStats = [
  { label: "À faire", value: 12, icon: ListTodo },
  { label: "En retard", value: 3, icon: Clock3, danger: true },
  { label: "Bloquées", value: 1, icon: ShieldAlert, warning: true },
  { label: "Terminées", value: 8, icon: CheckCircle2 },
];

const commandeStats = [
  { label: "Ouvertes", value: 18 },
  { label: "En retard", value: 4, danger: true },
  { label: "En attente client", value: 7, warning: true },
  { label: "Terminées ce mois", value: 12 },
];

const pipelineStats = [
  { step: "R0", value: 2, label: "Ouverture" },
  { step: "R1", value: 5, label: "Sourcing" },
  { step: "R2", value: 18, label: "Qualification" },
  { step: "R3", value: 11, label: "Entretien" },
  { step: "R4", value: 7, label: "Présentation candidat" },
  { step: "R5", value: 4, label: "Présentation client" },
  { step: "R6", value: 2, label: "Formalités" },
  { step: "R7", value: 1, label: "Onboarding" },
];

const recrutementsRisque = [
  { client: "Blacksheep", poste: "CSM", bloqueDepuis: "5 jours", etape: "R2" },
  { client: "ATC", poste: "SDR", bloqueDepuis: "3 jours", etape: "R5" },
  { client: "Nexity", poste: "Account Manager", bloqueDepuis: "2 jours", etape: "R3" },
];

const candidaturesStats = [
  { label: "Nouvelles", value: 43 },
  { label: "Non traitées", value: 17, warning: true },
  { label: "Traitées", value: 26 },
];

const vivierStats = [
  { label: "Actifs", value: 540 },
  { label: "Disponibles", value: 112 },
  { label: "En mission", value: 78 },
  { label: "Red flag", value: 9, danger: true },
  { label: "Ne plus présenter", value: 14, warning: true },
];

const activiteJour = [
  { time: "09:32", title: "Nouvelle commande créée", detail: "Client : Blacksheep" },
  { time: "09:45", title: "Nouveau candidat reçu", detail: "Pipeline SDR" },
  { time: "10:10", title: "Candidat validé R3", detail: "Pipeline CSM" },
  { time: "10:42", title: "Contrat signé", detail: "Pipeline ATC" },
];

const mesRecrutements = [
  { poste: "CSM", etape: "R3", echeance: "15 juin" },
  { poste: "SDR", etape: "R2", echeance: "18 juin" },
  { poste: "CS", etape: "R5", echeance: "12 juin" },
  { poste: "Data Engineer", etape: "R4", echeance: "20 juin" },
];

const calendrierJour = [
  { type: "Entretien candidat", count: 5, next: "11:00 · CSM" },
  { type: "Présentation client", count: 2, next: "14:30 · SDR" },
  { type: "Relances prévues", count: 9, next: "Avant 17:00" },
  { type: "Onboarding prévus", count: 1, next: "16:00 · ATC" },
];

const directionStats = [
  { label: "Commandes ouvertes", value: "18" },
  { label: "Recrutements actifs", value: "50" },
  { label: "Profils présentés", value: "34" },
  { label: "Profils recrutés", value: "12" },
  { label: "Temps moyen recrutement", value: "21 j" },
  { label: "Taux R2 → R3", value: "61%" },
  { label: "Taux R3 → R5", value: "44%" },
  { label: "Taux R5 → Placement", value: "29%" },
];

function Dashboard() {
  return (
    <div className="min-h-full bg-muted/30 p-6">
      <header className="mb-6 rounded-2xl border border-border bg-card p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              <LayoutDashboard className="h-3.5 w-3.5" /> Dashboard opérationnel
            </div>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight">Pilotage RH, commandes et recrutement</h1>
            <p className="mt-2 max-w-3xl text-sm text-muted-foreground">Vue de synthèse pour suivre la charge opérationnelle, les recrutements à risque, les candidatures du jour et les priorités de l’équipe.</p>
          </div>
          <div className="rounded-xl border border-border bg-background px-4 py-3 text-sm">
            <p className="font-medium">Aujourd’hui</p>
            <p className="text-muted-foreground">Mercredi 3 juin 2026</p>
          </div>
        </div>
      </header>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.6fr)_minmax(360px,0.9fr)]">
        <main className="space-y-6">
          <section className="grid gap-4 md:grid-cols-2">
            <DashboardBlock title="Mes tâches" description="Affichage immédiat de ce qui doit être traité aujourd’hui." icon={ListTodo} to="/mes-taches">
              <div className="grid gap-3 sm:grid-cols-2">{taskStats.map((item) => <MiniStat key={item.label} {...item} />)}</div>
            </DashboardBlock>
            <DashboardBlock title="Commandes clients" description="Suivi des commandes ouvertes, en retard ou en attente client." icon={Briefcase} to="/commandes">
              <div className="grid gap-3 sm:grid-cols-2">{commandeStats.map((item) => <MiniStat key={item.label} {...item} />)}</div>
            </DashboardBlock>
          </section>

          <DashboardBlock title="Pipeline recrutement" description="Répartition de la charge opérationnelle par étape R0 à R7." icon={ClipboardList} to="/recrutements">
            <div className="grid gap-3 md:grid-cols-4 xl:grid-cols-8">
              {pipelineStats.map((item) => <PipelineStep key={item.step} {...item} />)}
            </div>
          </DashboardBlock>

          <section className="grid gap-4 lg:grid-cols-2">
            <DashboardBlock title="Recrutements à risque" description="Pipelines bloqués ou sensibles à traiter en priorité." icon={AlertTriangle} accent="danger" to="/recrutements">
              <div className="space-y-3">{recrutementsRisque.map((item) => <RiskRow key={`${item.client}-${item.poste}`} {...item} />)}</div>
            </DashboardBlock>
            <DashboardBlock title="Candidatures" description="Flux candidat du jour : nouvelles, non traitées et traitées." icon={FileText}>
              <div className="grid gap-3 sm:grid-cols-3">{candidaturesStats.map((item) => <MiniStat key={item.label} {...item} />)}</div>
            </DashboardBlock>
          </section>

          <DashboardBlock title="Vivier talents" description="État global du vivier et signaux de vigilance." icon={Users} to="/pipeline">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">{vivierStats.map((item) => <MiniStat key={item.label} {...item} />)}</div>
          </DashboardBlock>

          <DashboardBlock title="Vue Direction" description="Synthèse OPS réservée à la direction : activité, transformation et performance." icon={Flame} accent="direction">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{directionStats.map((item) => <DirectionStat key={item.label} {...item} />)}</div>
          </DashboardBlock>
        </main>

        <aside className="space-y-6">
          <DashboardBlock title="Activité du jour" description="Fil d’activité opérationnelle." icon={Clock3}>
            <div className="space-y-4">{activiteJour.map((item) => <ActivityItem key={`${item.time}-${item.title}`} {...item} />)}</div>
          </DashboardBlock>

          <DashboardBlock title="Mes recrutements" description="Vue RH personnelle : poste, étape actuelle et échéance." icon={UserCheck} to="/recrutements">
            <div className="space-y-3">{mesRecrutements.map((item) => <RecruitmentRow key={item.poste} {...item} />)}</div>
          </DashboardBlock>

          <DashboardBlock title="Calendrier du jour" description="Rendez-vous et actions planifiées." icon={CalendarDays}>
            <div className="space-y-3">{calendrierJour.map((item) => <CalendarRow key={item.type} {...item} />)}</div>
          </DashboardBlock>
        </aside>
      </div>
    </div>
  );
}

function DashboardBlock({ title, description, icon: Icon, children, to, accent }: { title: string; description: string; icon: typeof ListTodo; children: React.ReactNode; to?: string; accent?: "danger" | "direction" }) {
  const content = (
    <section className={`rounded-2xl border bg-card p-5 shadow-sm ${accent === "danger" ? "border-destructive/30" : accent === "direction" ? "border-primary/30" : "border-border"}`}>
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className={`rounded-lg p-2 ${accent === "danger" ? "bg-destructive/10 text-destructive" : "bg-primary/10 text-primary"}`}><Icon className="h-4 w-4" /></span>
            <h2 className="font-semibold">{title}</h2>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">{description}</p>
        </div>
        {to && <span className="text-xs font-medium text-primary">Ouvrir</span>}
      </div>
      {children}
    </section>
  );
  return to ? <Link to={to}>{content}</Link> : content;
}

function MiniStat({ label, value, icon: Icon, danger, warning }: { label: string; value: number; icon?: typeof ListTodo; danger?: boolean; warning?: boolean }) {
  return <div className={`rounded-xl border p-4 ${danger ? "border-destructive/20 bg-destructive/5" : warning ? "border-amber-300/40 bg-amber-50" : "border-border bg-background"}`}><div className="flex items-center justify-between"><p className="text-sm text-muted-foreground">{label}</p>{Icon && <Icon className="h-4 w-4 text-muted-foreground" />}</div><p className="mt-2 text-3xl font-semibold">{value}</p></div>;
}

function PipelineStep({ step, value, label }: { step: string; value: number; label: string }) {
  const max = 18;
  return <div className="rounded-xl border border-border bg-background p-3"><div className="flex items-center justify-between"><span className="font-semibold">{step}</span><span className="text-2xl font-semibold">{value}</span></div><div className="mt-3 h-2 rounded-full bg-muted"><div className="h-2 rounded-full bg-primary" style={{ width: `${Math.max(8, (value / max) * 100)}%` }} /></div><p className="mt-2 text-xs text-muted-foreground">{label}</p></div>;
}

function RiskRow({ client, poste, bloqueDepuis, etape }: { client: string; poste: string; bloqueDepuis: string; etape: string }) {
  return <div className="flex items-center justify-between rounded-xl border border-destructive/20 bg-destructive/5 p-3"><div><p className="font-medium">{client}</p><p className="text-sm text-muted-foreground">{poste} · {etape}</p></div><div className="text-right"><p className="text-sm font-semibold text-destructive">{bloqueDepuis}</p><p className="text-xs text-muted-foreground">bloqué depuis</p></div></div>;
}

function ActivityItem({ time, title, detail }: { time: string; title: string; detail: string }) {
  return <div className="flex gap-3"><div className="w-12 shrink-0 text-sm font-semibold text-primary">{time}</div><div className="border-l border-border pl-3"><p className="font-medium">{title}</p><p className="text-sm text-muted-foreground">{detail}</p></div></div>;
}

function RecruitmentRow({ poste, etape, echeance }: { poste: string; etape: string; echeance: string }) {
  return <div className="grid grid-cols-[1fr_64px_80px] items-center gap-2 rounded-xl border border-border bg-background p-3 text-sm"><span className="font-medium">{poste}</span><span className="rounded bg-muted px-2 py-1 text-center text-xs font-semibold">{etape}</span><span className="text-right text-muted-foreground">{echeance}</span></div>;
}

function CalendarRow({ type, count, next }: { type: string; count: number; next: string }) {
  return <div className="flex items-center justify-between rounded-xl border border-border bg-background p-3"><div><p className="font-medium">{type}</p><p className="text-sm text-muted-foreground">{next}</p></div><span className="text-2xl font-semibold">{count}</span></div>;
}

function DirectionStat({ label, value }: { label: string; value: string }) {
  return <div className="rounded-xl border border-primary/20 bg-primary/5 p-4"><p className="text-sm text-muted-foreground">{label}</p><p className="mt-2 text-2xl font-semibold">{value}</p></div>;
}
