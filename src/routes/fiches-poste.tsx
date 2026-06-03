import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { FilePlus2 } from "lucide-react";
import { fichesPoste, type FichePoste } from "@/lib/mock-data";
import { PageHeader } from "@/components/page-header";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/status-badge";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/fiches-poste")({
  head: () => ({ meta: [{ title: "Fiches de poste — SIRH" }] }),
  component: FichesPostePage,
});

function FichesPostePage() {
  const [q, setQ] = useState("");
  const [selected, setSelected] = useState<FichePoste | null>(null);

  const filtered = useMemo(
    () =>
      fichesPoste.filter((f) =>
        [f.id, f.client, f.poste, f.responsableRH].join(" ").toLowerCase().includes(q.toLowerCase()),
      ),
    [q],
  );

  return (
    <div>
      <PageHeader
        title="Fiches de poste talents"
        description="Référentiel standardisé des besoins recrutement."
      >
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <Input placeholder="Rechercher…" value={q} onChange={(e) => setQ(e.target.value)} className="w-full sm:w-56" />
          <Button asChild className="gap-2 whitespace-nowrap">
            <Link to="/fiches-poste/template">
              <FilePlus2 className="h-4 w-4" />
              Nouvelle fiche
            </Link>
          </Button>
        </div>
      </PageHeader>

      <div className="p-6">
        <div className="overflow-hidden rounded-lg border border-border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Poste</TableHead>
                <TableHead>Responsable RH</TableHead>
                <TableHead>Création</TableHead>
                <TableHead>Mise à jour</TableHead>
                <TableHead>Statut</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((f) => (
                <TableRow key={f.id} className="cursor-pointer" onClick={() => setSelected(f)}>
                  <TableCell className="font-medium">{f.id}</TableCell>
                  <TableCell>{f.client}</TableCell>
                  <TableCell>{f.poste}</TableCell>
                  <TableCell>{f.responsableRH}</TableCell>
                  <TableCell>{f.dateCreation}</TableCell>
                  <TableCell>{f.dateMaj}</TableCell>
                  <TableCell><StatusBadge value={f.statut} /></TableCell>
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
                <SheetTitle>{selected.id} · {selected.poste}</SheetTitle>
                <SheetDescription>{selected.client}</SheetDescription>
              </SheetHeader>

              <div className="mt-6 space-y-6 text-sm">
                <Section title="Informations générales">
                  <Field label="Intitulé" value={selected.poste} />
                  <Field label="Département" value={selected.departement} />
                  <Field label="Localisation" value={selected.localisation} />
                  <Field label="Type de mission" value={selected.typeMission} />
                </Section>

                <Section title="Missions">
                  <Field label="Missions principales" value={selected.missionsPrincipales} />
                  <Field label="Responsabilités" value={selected.responsabilites} />
                </Section>

                <Section title="Profil recherché">
                  <Field label="Expérience" value={selected.experience} />
                  <Field label="Niveau d'études" value={selected.niveauEtudes} />
                </Section>

                <Section title="Compétences">
                  <SkillRow label="Hard skills" items={selected.hardSkills} variant="secondary" />
                  <SkillRow label="Soft skills" items={selected.softSkills} variant="outline" />
                  <SkillRow label="Outils" items={selected.outils} variant="outline" />
                </Section>

                <Section title="Langues">
                  <Field label="Français" value={selected.francais} />
                  <Field label="Anglais" value={selected.anglais} />
                  <Field label="Autres" value={selected.autresLangues} />
                </Section>

                <Section title="Évolution">
                  <Field label="Perspectives" value={selected.evolution} />
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
      <span className="col-span-2 text-foreground">{value || <span className="text-muted-foreground italic">non renseigné</span>}</span>
    </div>
  );
}

function SkillRow({ label, items, variant }: { label: string; items?: string[]; variant: "secondary" | "outline" }) {
  return (
    <div>
      <p className="mb-1 text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
      <div className="flex flex-wrap gap-1.5">
        {(items ?? []).length === 0
          ? <span className="text-muted-foreground italic">non renseigné</span>
          : items!.map((s) => <Badge key={s} variant={variant}>{s}</Badge>)}
      </div>
    </div>
  );
}
