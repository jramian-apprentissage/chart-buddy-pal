import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { talents, type Talent, type EtatTalent } from "@/lib/mock-data";
import { PageHeader } from "@/components/page-header";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/status-badge";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const Route = createFileRoute("/pipeline")({
  head: () => ({ meta: [{ title: "Pipeline talents — SIRH" }] }),
  component: PipelinePage,
});

const ETATS: (EtatTalent | "Tous")[] = ["Tous", "Actif", "Inactif", "En place", "Ne plus présenter", "Red Flag"];

function PipelinePage() {
  const [q, setQ] = useState("");
  const [etat, setEtat] = useState<string>("Tous");
  const [selected, setSelected] = useState<Talent | null>(null);

  const filtered = useMemo(
    () =>
      talents.filter((t) => {
        if (etat !== "Tous" && t.etat !== etat) return false;
        return [t.nom, t.prenom, t.email, t.poste, t.hardSkills, t.client]
          .join(" ").toLowerCase().includes(q.toLowerCase());
      }),
    [q, etat],
  );

  return (
    <div>
      <PageHeader
        title="Pipeline talents"
        description="Vivier officiel des candidats Mon Ambassadeur."
        actionLabel="Nouveau talent"
        onAction={() => alert("Création de talent — à brancher")}
      >
        <Input placeholder="Rechercher…" value={q} onChange={(e) => setQ(e.target.value)} className="w-56" />
      </PageHeader>

      <div className="p-6 space-y-4">
        <Tabs value={etat} onValueChange={setEtat}>
          <TabsList>
            {ETATS.map((e) => <TabsTrigger key={e} value={e}>{e}</TabsTrigger>)}
          </TabsList>
        </Tabs>

        <div className="overflow-x-auto rounded-lg border border-border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>État</TableHead>
                <TableHead>Nom</TableHead>
                <TableHead>Prénom</TableHead>
                <TableHead>Poste</TableHead>
                <TableHead>Expérience</TableHead>
                <TableHead>Hard skills</TableHead>
                <TableHead>Disponibilité</TableHead>
                <TableHead>TJM 8h</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>État R3</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((t) => (
                <TableRow key={t.id} className="cursor-pointer" onClick={() => setSelected(t)}>
                  <TableCell><StatusBadge value={t.etat} /></TableCell>
                  <TableCell className="font-medium">{t.nom}</TableCell>
                  <TableCell>{t.prenom}</TableCell>
                  <TableCell>{t.poste}</TableCell>
                  <TableCell>{t.experience}</TableCell>
                  <TableCell className="max-w-xs truncate text-muted-foreground">{t.hardSkills}</TableCell>
                  <TableCell>{t.disponibilite}</TableCell>
                  <TableCell>{t.tarif8h}</TableCell>
                  <TableCell>{t.client || "—"}</TableCell>
                  <TableCell>{t.etatR3 || "—"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <Sheet open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-2xl">
          {selected && (
            <>
              <SheetHeader>
                <SheetTitle>{selected.prenom} {selected.nom}</SheetTitle>
                <SheetDescription>{selected.poste} · <StatusBadge value={selected.etat} /></SheetDescription>
              </SheetHeader>

              <div className="mt-6 space-y-6 text-sm">
                <Section title="Contact">
                  <Field label="Email" value={selected.email} />
                  <Field label="Téléphone" value={selected.telephone} />
                  <Field label="CV" value={selected.cv} />
                  <Field label="Portfolio" value={selected.portfolio} />
                </Section>

                <Section title="Profil">
                  <Field label="Expérience" value={selected.experience} />
                  <Field label="Hard skills" value={selected.hardSkills} />
                  <Field label="Soft skills" value={selected.softSkills} />
                  <Field label="Logiciels & outils" value={selected.outils} />
                </Section>

                <Section title="Langues">
                  <Field label="Français" value={selected.francais ? `Oui · ${selected.niveauFrancais}` : "Non"} />
                  <Field label="Anglais" value={selected.anglais ? `Oui · ${selected.niveauAnglais}` : "Non"} />
                </Section>

                <Section title="Conditions">
                  <Field label="Disponibilité" value={selected.disponibilite} />
                  <Field label="Tarif 8h" value={selected.tarif8h} />
                  <Field label="Tarif 4h" value={selected.tarif4h} />
                  <Field label="Tarif négocié" value={selected.tarifNegocie} />
                </Section>

                <Section title="Suivi">
                  <Field label="Date R2" value={selected.dateR2} />
                  <Field label="Date R3" value={selected.dateR3} />
                  <Field label="État R3" value={selected.etatR3} />
                  <Field label="Client en cours" value={selected.client} />
                  <Field label="Historique" value={selected.historique} />
                  <Field label="Remarque RH" value={selected.remarqueRH} />
                </Section>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{title}</h3>
      <div className="space-y-2 rounded-lg border border-border bg-muted/30 p-4">{children}</div>
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
