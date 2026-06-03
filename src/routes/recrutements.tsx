import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { recrutements, type Recrutement, type EtapeRecrutement } from "@/lib/mock-data";
import { PageHeader } from "@/components/page-header";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/status-badge";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Check, Circle } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/recrutements")({
  head: () => ({ meta: [{ title: "Recrutements — SIRH" }] }),
  component: RecrutementsPage,
});

const ETAPES: EtapeRecrutement[] = [
  "R0 Ouverture",
  "R1 Sourcing",
  "R2 Qualification",
  "R3 Entretien",
  "R4 Présentation profil",
  "R5 Présentation client",
  "R6 Formalités",
  "R7 Onboarding",
];

function RecrutementsPage() {
  const [q, setQ] = useState("");
  const [selected, setSelected] = useState<Recrutement | null>(null);

  const filtered = useMemo(
    () =>
      recrutements.filter((r) =>
        [r.reference, r.client, r.poste, r.responsableRH].join(" ").toLowerCase().includes(q.toLowerCase()),
      ),
    [q],
  );

  return (
    <div>
      <PageHeader
        title="Gestion des recrutements"
        description="Suivi des recrutements actifs et de leur workflow R0 → R7."
        actionLabel="Nouveau recrutement"
        onAction={() => alert("Création de recrutement — à brancher")}
      >
        <Input placeholder="Rechercher…" value={q} onChange={(e) => setQ(e.target.value)} className="w-56" />
      </PageHeader>

      <div className="p-6">
        <div className="overflow-hidden rounded-lg border border-border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Référence</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Poste</TableHead>
                <TableHead>Responsable RH</TableHead>
                <TableHead>Ouverture</TableHead>
                <TableHead>Échéance</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Étape</TableHead>
                <TableHead>Dernière MAJ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((r) => (
                <TableRow key={r.id} className="cursor-pointer" onClick={() => setSelected(r)}>
                  <TableCell className="font-medium">{r.reference}</TableCell>
                  <TableCell>{r.client}</TableCell>
                  <TableCell>{r.poste}</TableCell>
                  <TableCell>{r.responsableRH}</TableCell>
                  <TableCell>{r.dateOuverture}</TableCell>
                  <TableCell>{r.dateEcheance}</TableCell>
                  <TableCell><StatusBadge value={r.statut} /></TableCell>
                  <TableCell><span className="rounded bg-muted px-2 py-0.5 text-xs font-medium">{r.etape}</span></TableCell>
                  <TableCell>{r.derniereMaj}</TableCell>
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
                <SheetTitle>{selected.reference}</SheetTitle>
                <SheetDescription>{selected.client} · {selected.poste}</SheetDescription>
              </SheetHeader>

              <div className="mt-6 space-y-6 text-sm">
                <div className="grid grid-cols-2 gap-4 rounded-lg border border-border bg-muted/30 p-4">
                  <Info label="Responsable RH" value={selected.responsableRH} />
                  <Info label="Statut" value={<StatusBadge value={selected.statut} />} />
                  <Info label="Ouverture" value={selected.dateOuverture} />
                  <Info label="Échéance" value={selected.dateEcheance} />
                  <Info label="Dernière MAJ" value={selected.derniereMaj} />
                  <Info label="Étape actuelle" value={<span className="rounded bg-primary/10 px-2 py-0.5 text-xs font-medium">{selected.etape}</span>} />
                </div>

                <div>
                  <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Workflow</h3>
                  <ol className="space-y-2">
                    {ETAPES.map((etape, idx) => {
                      const currentIdx = ETAPES.indexOf(selected.etape);
                      const done = idx < currentIdx;
                      const current = idx === currentIdx;
                      return (
                        <li key={etape} className={cn(
                          "flex items-center gap-3 rounded-md border border-border bg-card px-3 py-2",
                          current && "border-primary bg-primary/5",
                        )}>
                          <span className={cn(
                            "flex h-6 w-6 items-center justify-center rounded-full text-xs",
                            done && "bg-primary text-primary-foreground",
                            current && "bg-accent text-accent-foreground",
                            !done && !current && "bg-muted text-muted-foreground",
                          )}>
                            {done ? <Check className="h-3 w-3" /> : <Circle className="h-2.5 w-2.5 fill-current" />}
                          </span>
                          <span className={cn("text-sm", current && "font-medium")}>{etape}</span>
                        </li>
                      );
                    })}
                  </ol>
                </div>

                <div>
                  <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Commentaires</h3>
                  <p className="rounded-lg border border-border bg-muted/30 p-4 text-sm">{selected.commentaires || "—"}</p>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}

function Info({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
      <div className="mt-0.5 text-sm">{value}</div>
    </div>
  );
}
