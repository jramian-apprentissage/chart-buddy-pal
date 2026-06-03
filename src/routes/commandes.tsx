import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { ClipboardPlus } from "lucide-react";
import { commandes as demoCommandes, type Commande } from "@/lib/mock-data";
import { readStoredFccCommandes } from "@/lib/fcc-orders";
import { PageHeader } from "@/components/page-header";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/status-badge";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/commandes")({
  head: () => ({ meta: [{ title: "Commandes clients — SIRH" }] }),
  component: CommandesPage,
});

function CommandesPage() {
  const [q, setQ] = useState("");
  const [selected, setSelected] = useState<Commande | null>(null);
  const [localCommandes, setLocalCommandes] = useState<Commande[]>([]);

  const refreshLocalCommandes = () => {
    setLocalCommandes(readStoredFccCommandes());
  };

  useEffect(() => {
    refreshLocalCommandes();

    const handleFocus = () => refreshLocalCommandes();
    const handleStorage = (event: StorageEvent) => {
      if (event.key === "mon-ambassadeur:fcc-commandes") refreshLocalCommandes();
    };

    window.addEventListener("focus", handleFocus);
    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  const allCommandes = useMemo(() => [...localCommandes, ...demoCommandes], [localCommandes]);

  const filtered = useMemo(
    () =>
      allCommandes.filter((c) =>
        [c.numero, c.client, c.poste, c.commercial, c.responsableRH]
          .join(" ")
          .toLowerCase()
          .includes(q.toLowerCase()),
      ),
    [allCommandes, q],
  );

  return (
    <div>
      <PageHeader
        title="Commandes clients (FCC)"
        description="Toutes les commandes recrutement reçues par l'équipe Sales."
      >
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <Input
            placeholder="Rechercher…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="w-full sm:w-56"
          />
          <Button asChild className="gap-2 whitespace-nowrap">
            <Link to="/commandes/formulaire-fcc">
              <ClipboardPlus className="h-4 w-4" />
              Créer une commande FCC
            </Link>
          </Button>
        </div>
      </PageHeader>

      <div className="p-6">
        <div className="mb-4 rounded-lg border border-border bg-card p-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-sm font-semibold text-foreground">Démarrer une nouvelle commande client</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Remplis le formulaire FCC : la commande sera enregistrée localement puis affichée dans cet onglet.
              </p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button variant="outline" onClick={refreshLocalCommandes}>
                Actualiser
              </Button>
              <Button asChild variant="outline" className="gap-2 whitespace-nowrap">
                <Link to="/commandes/formulaire-fcc">
                  <ClipboardPlus className="h-4 w-4" />
                  Ouvrir le formulaire
                </Link>
              </Button>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-lg border border-border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>N° Commande</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Commercial</TableHead>
                <TableHead>Poste</TableHead>
                <TableHead className="text-center">Profils</TableHead>
                <TableHead>Démarrage</TableHead>
                <TableHead>Priorité</TableHead>
                <TableHead>Responsable RH</TableHead>
                <TableHead>Statut</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((c) => (
                <TableRow
                  key={c.id}
                  className="cursor-pointer"
                  onClick={() => setSelected(c)}
                >
                  <TableCell className="font-medium">{c.numero}</TableCell>
                  <TableCell>{c.dateCommande}</TableCell>
                  <TableCell>{c.client}</TableCell>
                  <TableCell>{c.contact}</TableCell>
                  <TableCell>{c.commercial}</TableCell>
                  <TableCell>{c.poste}</TableCell>
                  <TableCell className="text-center">{c.nbProfils}</TableCell>
                  <TableCell>{c.dateDemarrage}</TableCell>
                  <TableCell><StatusBadge value={c.priorite} /></TableCell>
                  <TableCell>{c.responsableRH}</TableCell>
                  <TableCell><StatusBadge value={c.statut} /></TableCell>
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
                <SheetTitle>{selected.numero} · {selected.poste}</SheetTitle>
                <SheetDescription>Fiche commande client</SheetDescription>
              </SheetHeader>

              <div className="mt-6 space-y-6 text-sm">
                <Section title="Informations entreprise">
                  <Field label="Nom" value={selected.client} />
                  <Field label="Secteur d'activité" value={selected.secteur} />
                  <Field label="Adresse" value={selected.adresse} />
                </Section>

                <Section title="Contact client">
                  <Field label="Nom" value={selected.contact} />
                  <Field label="Fonction" value={selected.contactFonction} />
                  <Field label="Téléphone" value={selected.contactTel} />
                  <Field label="Email" value={selected.contactEmail} />
                </Section>

                <Section title="Besoin">
                  <Field label="Poste recherché" value={selected.poste} />
                  <Field label="Nombre de profils" value={String(selected.nbProfils)} />
                  <Field label="Missions" value={selected.missions} />
                  <Field label="Objectifs" value={selected.objectifs} />
                </Section>

                <Section title="Compétences">
                  <div>
                    <p className="mb-1 text-xs uppercase tracking-wide text-muted-foreground">Hard skills</p>
                    <div className="flex flex-wrap gap-1.5">
                      {(selected.hardSkills ?? []).map((s) => <Badge key={s} variant="secondary">{s}</Badge>)}
                    </div>
                  </div>
                  <div>
                    <p className="mb-1 mt-2 text-xs uppercase tracking-wide text-muted-foreground">Soft skills</p>
                    <div className="flex flex-wrap gap-1.5">
                      {(selected.softSkills ?? []).map((s) => <Badge key={s} variant="outline">{s}</Badge>)}
                    </div>
                  </div>
                </Section>

                <Section title="Planning">
                  <Field label="Date commande" value={selected.dateCommande} />
                  <Field label="Date présentation" value={selected.datePresentation} />
                  <Field label="Date démarrage" value={selected.dateDemarrage} />
                </Section>

                <Section title="Conditions commerciales">
                  <Field label="Tarif" value={selected.tarif} />
                  <Field label="Modalités" value={selected.modalites} />
                </Section>

                <Section title="Suivi">
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">Statut :</span>
                    <StatusBadge value={selected.statut} />
                    <span className="ml-3 text-muted-foreground">Priorité :</span>
                    <StatusBadge value={selected.priorite} />
                  </div>
                  <Field label="Commentaires" value={selected.commentaires} />
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
