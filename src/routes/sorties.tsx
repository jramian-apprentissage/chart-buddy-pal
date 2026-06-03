import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { sorties } from "@/lib/mock-data";
import { PageHeader } from "@/components/page-header";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/status-badge";

export const Route = createFileRoute("/sorties")({
  head: () => ({ meta: [{ title: "Suivi sorties — SIRH" }] }),
  component: SortiesPage,
});

function SortiesPage() {
  const [q, setQ] = useState("");
  const filtered = useMemo(
    () =>
      sorties.filter((s) =>
        [s.idMA, s.nom, s.prenom, s.entreprise, s.missions, s.motif].join(" ").toLowerCase().includes(q.toLowerCase()),
      ),
    [q],
  );

  return (
    <div>
      <PageHeader
        title="Suivi sorties"
        description="Historique des collaborateurs sortis."
        actionLabel="Nouvelle sortie"
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
                <TableHead>Entreprise</TableHead>
                <TableHead>Nom</TableHead>
                <TableHead>Prénom</TableHead>
                <TableHead>Début</TableHead>
                <TableHead>Fin</TableHead>
                <TableHead>Missions</TableHead>
                <TableHead>Contrat</TableHead>
                <TableHead>Lieu</TableHead>
                <TableHead>Ancienneté</TableHead>
                <TableHead>Motif</TableHead>
                <TableHead>Accompagnateur</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((s) => (
                <TableRow key={s.id}>
                  <TableCell><StatusBadge value={s.etat} /></TableCell>
                  <TableCell className="font-medium">{s.idMA}</TableCell>
                  <TableCell>{s.entreprise}</TableCell>
                  <TableCell>{s.nom}</TableCell>
                  <TableCell>{s.prenom}</TableCell>
                  <TableCell>{s.dateDebut}</TableCell>
                  <TableCell>{s.dateFin}</TableCell>
                  <TableCell className="text-muted-foreground">{s.missions}</TableCell>
                  <TableCell>{s.typeContrat}</TableCell>
                  <TableCell>{s.lieuTravail}</TableCell>
                  <TableCell>{s.anciennete}</TableCell>
                  <TableCell>{s.motif}</TableCell>
                  <TableCell>{s.accompagnateur}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
