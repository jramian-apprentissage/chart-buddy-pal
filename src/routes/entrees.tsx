import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { entrees } from "@/lib/mock-data";
import { PageHeader } from "@/components/page-header";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/status-badge";

export const Route = createFileRoute("/entrees")({
  head: () => ({ meta: [{ title: "Suivi entrées — SIRH" }] }),
  component: EntreesPage,
});

function EntreesPage() {
  const [q, setQ] = useState("");
  const filtered = useMemo(
    () =>
      entrees.filter((e) =>
        [e.idMA, e.nom, e.prenom, e.entreprise, e.missions].join(" ").toLowerCase().includes(q.toLowerCase()),
      ),
    [q],
  );

  return (
    <div>
      <PageHeader
        title="Suivi entrées"
        description="Collaborateurs actuellement en mission."
        actionLabel="Nouvelle entrée"
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
                <TableHead>Date entrée</TableHead>
                <TableHead>Missions</TableHead>
                <TableHead>Type contrat</TableHead>
                <TableHead>Lieu</TableHead>
                <TableHead>Ancienneté</TableHead>
                <TableHead>Accompagnateur</TableHead>
                <TableHead>Commentaire</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((e) => (
                <TableRow key={e.id}>
                  <TableCell><StatusBadge value={e.etat} /></TableCell>
                  <TableCell className="font-medium">{e.idMA}</TableCell>
                  <TableCell>{e.entreprise}</TableCell>
                  <TableCell>{e.nom}</TableCell>
                  <TableCell>{e.prenom}</TableCell>
                  <TableCell>{e.dateEntree}</TableCell>
                  <TableCell className="text-muted-foreground">{e.missions}</TableCell>
                  <TableCell>{e.typeContrat}</TableCell>
                  <TableCell>{e.lieuTravail}</TableCell>
                  <TableCell>{e.anciennete}</TableCell>
                  <TableCell>{e.accompagnateur}</TableCell>
                  <TableCell className="text-muted-foreground">{e.commentaire}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
