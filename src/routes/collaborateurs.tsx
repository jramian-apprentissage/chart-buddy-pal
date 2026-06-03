import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { collaborateurs, type Collaborateur } from "@/lib/mock-data";
import { PageHeader } from "@/components/page-header";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/status-badge";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { FileText } from "lucide-react";

export const Route = createFileRoute("/collaborateurs")({
  head: () => ({ meta: [{ title: "Collaborateurs — SIRH" }] }),
  component: CollaborateursPage,
});

function CollaborateursPage() {
  const [q, setQ] = useState("");
  const [selected, setSelected] = useState<Collaborateur | null>(null);

  const filtered = useMemo(
    () =>
      collaborateurs.filter((c) =>
        [c.idMA, c.nom, c.prenom, c.email].join(" ").toLowerCase().includes(q.toLowerCase()),
      ),
    [q],
  );

  return (
    <div>
      <PageHeader
        title="Collaborateurs"
        description="Référentiel officiel des collaborateurs Mon Ambassadeur."
        actionLabel="Nouveau collaborateur"
        onAction={() => alert("Création — à brancher")}
      >
        <Input placeholder="Rechercher…" value={q} onChange={(e) => setQ(e.target.value)} className="w-56" />
      </PageHeader>

      <div className="p-6">
        <div className="overflow-x-auto rounded-lg border border-border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>État</TableHead>
                <TableHead>ID MA</TableHead>
                <TableHead>Nom</TableHead>
                <TableHead>Prénom</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Téléphone</TableHead>
                <TableHead>Date entrée</TableHead>
                <TableHead>CIN</TableHead>
                <TableHead>Onboarding</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((c) => (
                <TableRow key={c.id} className="cursor-pointer" onClick={() => setSelected(c)}>
                  <TableCell><StatusBadge value={c.etat} /></TableCell>
                  <TableCell className="font-medium">{c.idMA}</TableCell>
                  <TableCell>{c.nom}</TableCell>
                  <TableCell>{c.prenom}</TableCell>
                  <TableCell className="text-muted-foreground">{c.email}</TableCell>
                  <TableCell>{c.tel1}</TableCell>
                  <TableCell>{c.dateEntree}</TableCell>
                  <TableCell>{c.numeroCIN}</TableCell>
                  <TableCell>{c.onboarding}</TableCell>
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
                <SheetDescription>{selected.idMA} · <StatusBadge value={selected.etat} /></SheetDescription>
              </SheetHeader>

              <div className="mt-6 space-y-6 text-sm">
                <Section title="Informations générales">
                  <Field label="Date de naissance" value={selected.dateNaissance} />
                  <Field label="Email" value={selected.email} />
                  <Field label="Téléphone 1" value={selected.tel1} />
                  <Field label="Téléphone 2" value={selected.tel2} />
                  <Field label="Contact d'urgence" value={selected.contactUrgence} />
                </Section>

                <Section title="Administratif">
                  <Field label="Numéro CIN" value={selected.numeroCIN} />
                  <Field label="Validité CIN" value={selected.dateValiditeCIN} />
                  <Field label="Date d'entrée" value={selected.dateEntree} />
                  <Doc label="Contrat" value={selected.contrat} />
                  <Doc label="Avenant 1" value={selected.avenant1} />
                  <Doc label="Avenant 2" value={selected.avenant2} />
                  <Doc label="Avenant 3" value={selected.avenant3} />
                  <Doc label="Attestation" value={selected.attestation} />
                </Section>

                <Section title="Onboarding">
                  <Field label="Statut" value={selected.onboarding} />
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
function Doc({ label, value }: { label: string; value?: string }) {
  return (
    <div className="grid grid-cols-3 gap-3">
      <span className="text-muted-foreground">{label}</span>
      <span className="col-span-2">
        {value
          ? <a href="#" className="inline-flex items-center gap-1.5 text-sm text-foreground underline-offset-2 hover:underline"><FileText className="h-3.5 w-3.5" /> {value}</a>
          : <span className="text-muted-foreground italic">non fourni</span>}
      </span>
    </div>
  );
}
