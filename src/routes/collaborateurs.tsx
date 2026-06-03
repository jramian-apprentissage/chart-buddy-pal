import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { collaborateurs, talents, type Collaborateur, type Talent } from "@/lib/mock-data";
import { PageHeader } from "@/components/page-header";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/status-badge";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ArrowRight, CheckCircle2, FileText, Link2, Plus, UserRoundCheck } from "lucide-react";

export const Route = createFileRoute("/collaborateurs")({
  head: () => ({ meta: [{ title: "Collaborateurs — SIRH" }] }),
  component: CollaborateursPage,
});

type EditableCollaborateur = Collaborateur & {
  talentId?: string;
  poste?: string;
  niveauFrancais?: string;
  niveauAnglais?: string;
  experience?: string;
  hardSkills?: string;
  softSkills?: string;
  outils?: string;
  disponibilite?: string;
  tarif8h?: string;
  tarif4h?: string;
  historique?: string;
  remarqueRH?: string;
  cv?: string;
  portfolio?: string;
};

const onboardingSteps = ["Contrat", "CIN", "Attestation", "Matériel", "Brief mission"];

function CollaborateursPage() {
  const [q, setQ] = useState("");
  const [selected, setSelected] = useState<EditableCollaborateur | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [sourceTalent, setSourceTalent] = useState<Talent | null>(null);
  const [records, setRecords] = useState<EditableCollaborateur[]>(() =>
    collaborateurs.map((collaborateur) => enrichCollaborateur(collaborateur)),
  );

  const talentsDisponibles = useMemo(
    () => talents.filter((talent) => !records.some((record) => record.talentId === talent.id)),
    [records],
  );

  const filtered = useMemo(
    () =>
      records.filter((c) =>
        [c.idMA, c.nom, c.prenom, c.email, c.poste, c.etat]
          .join(" ")
          .toLowerCase()
          .includes(q.toLowerCase()),
      ),
    [records, q],
  );

  const stats = useMemo(
    () => [
      { label: "Collaborateurs actifs", value: records.filter((c) => c.etat === "Actif").length },
      { label: "Talents liés", value: records.filter((c) => c.talentId).length },
      { label: "Onboarding à suivre", value: records.filter((c) => c.onboarding !== "Terminé").length },
      { label: "Documents manquants", value: records.filter((c) => !c.attestation || !c.contrat).length },
    ],
    [records],
  );

  const startCreation = (talent?: Talent) => {
    const selectedTalent = talent ?? talentsDisponibles[0] ?? talents[0];
    setSourceTalent(selectedTalent);
    setIsCreating(true);
  };

  const createFromTalent = () => {
    if (!sourceTalent) return;

    const created: EditableCollaborateur = enrichCollaborateur({
      id: `co-demo-${Date.now()}`,
      etat: "Actif",
      idMA: `MA-${String(records.length + 46).padStart(4, "0")}`,
      nom: sourceTalent.nom,
      prenom: sourceTalent.prenom,
      dateNaissance: "",
      email: sourceTalent.email,
      tel1: sourceTalent.telephone,
      tel2: "",
      contactUrgence: "",
      numeroCIN: "",
      dateValiditeCIN: "",
      dateEntree: new Date().toISOString().slice(0, 10),
      contrat: "",
      avenant1: "",
      avenant2: "",
      avenant3: "",
      attestation: "",
      onboarding: "Planifié",
    }, sourceTalent);

    setRecords((current) => [created, ...current]);
    setSelected(created);
    setIsCreating(false);
  };

  const updateSelected = (field: keyof EditableCollaborateur, value: string) => {
    if (!selected) return;
    const updated = { ...selected, [field]: value };
    setSelected(updated);
    setRecords((current) => current.map((record) => (record.id === updated.id ? updated : record)));
  };

  return (
    <div>
      <PageHeader
        title="Collaborateurs"
        description="Référentiel administratif des talents devenus collaborateurs, toujours liés au Pipeline Talents."
      >
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <Input
            placeholder="Rechercher un collaborateur…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="w-full sm:w-64"
          />
          <Button onClick={() => startCreation()} className="gap-2 whitespace-nowrap">
            <Plus className="h-4 w-4" />
            Créer depuis un talent
          </Button>
        </div>
      </PageHeader>

      <div className="space-y-6 p-6">
        <div className="grid gap-3 md:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="rounded-xl border border-border bg-card p-4 shadow-sm">
              <p className="text-2xl font-semibold text-foreground">{stat.value}</p>
              <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <UserRoundCheck className="h-5 w-5 text-primary" />
                <h2 className="text-base font-semibold text-foreground">Parcours cible</h2>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                Commandes clients → Pipeline recrutement → Candidatures → Pipeline talents → Fiche talent → Collaborateur lié.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {["Talent conservé", "Infos récupérées", "Admin complété"].map((item) => (
                <Badge key={item} variant="secondary" className="gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5" /> {item}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
          <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>État</TableHead>
                  <TableHead>ID MA</TableHead>
                  <TableHead>Collaborateur</TableHead>
                  <TableHead>Poste</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Date entrée</TableHead>
                  <TableHead>Documents</TableHead>
                  <TableHead>Onboarding</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((c) => (
                  <TableRow key={c.id} className="cursor-pointer" onClick={() => setSelected(c)}>
                    <TableCell><StatusBadge value={c.etat} /></TableCell>
                    <TableCell className="font-medium">{c.idMA}</TableCell>
                    <TableCell>
                      <div className="font-medium text-foreground">{c.prenom} {c.nom}</div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Link2 className="h-3 w-3" /> Fiche talent liée
                      </div>
                    </TableCell>
                    <TableCell>{c.poste || "—"}</TableCell>
                    <TableCell className="text-muted-foreground">{c.email}</TableCell>
                    <TableCell>{c.dateEntree || "—"}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <DocPill ok={!!c.contrat} label="Contrat" />
                        <DocPill ok={!!c.attestation} label="Attestation" />
                      </div>
                    </TableCell>
                    <TableCell><StatusBadge value={c.onboarding} /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
            <h2 className="text-sm font-semibold text-foreground">Créer un collaborateur depuis un talent</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Sélectionne une fiche talent : l'identité, le poste, les compétences, tarifs et remarques RH sont repris automatiquement.
            </p>

            <div className="mt-4 space-y-3">
              {talentsDisponibles.slice(0, 4).map((talent) => (
                <button
                  key={talent.id}
                  type="button"
                  onClick={() => startCreation(talent)}
                  className="w-full rounded-lg border border-border p-3 text-left transition hover:border-primary hover:bg-muted/50"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-medium text-foreground">{talent.prenom} {talent.nom}</p>
                      <p className="text-sm text-muted-foreground">{talent.poste} · {talent.disponibilite}</p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Sheet open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-3xl">
          {selected && (
            <>
              <SheetHeader>
                <SheetTitle>{selected.prenom} {selected.nom}</SheetTitle>
                <SheetDescription>
                  {selected.idMA} · fiche collaborateur liée au talent · <StatusBadge value={selected.etat} />
                </SheetDescription>
              </SheetHeader>

              <div className="mt-6 space-y-6 text-sm">
                <Section title="Informations générales">
                  <EditableField label="État" value={selected.etat} onChange={(value) => updateSelected("etat", value)} />
                  <EditableField label="ID MA" value={selected.idMA} onChange={(value) => updateSelected("idMA", value)} />
                  <Field label="Nom" value={selected.nom} />
                  <Field label="Prénom" value={selected.prenom} />
                  <EditableField label="Date de naissance" value={selected.dateNaissance} onChange={(value) => updateSelected("dateNaissance", value)} />
                  <Field label="Email" value={selected.email} />
                  <Field label="Téléphone" value={selected.tel1} />
                  <EditableField label="Téléphone 2" value={selected.tel2} onChange={(value) => updateSelected("tel2", value)} />
                  <EditableField label="Contact d'urgence" value={selected.contactUrgence} onChange={(value) => updateSelected("contactUrgence", value)} />
                </Section>

                <Section title="Informations récupérées depuis le talent">
                  <Field label="Poste" value={selected.poste} />
                  <Field label="Niveau français" value={selected.niveauFrancais} />
                  <Field label="Niveau anglais" value={selected.niveauAnglais} />
                  <Field label="Expérience" value={selected.experience} />
                  <TagField label="Hard skills" value={selected.hardSkills} />
                  <TagField label="Soft skills" value={selected.softSkills} />
                  <TagField label="Outils maîtrisés" value={selected.outils} />
                  <Field label="Disponibilité" value={selected.disponibilite} />
                  <Field label="Tarif 8h" value={selected.tarif8h} />
                  <Field label="Tarif 4h" value={selected.tarif4h} />
                  <Field label="Historique" value={selected.historique} />
                  <Field label="Remarque RH" value={selected.remarqueRH} />
                  <Doc label="CV" value={selected.cv} />
                  <Doc label="Portfolio" value={selected.portfolio} />
                </Section>

                <Section title="Informations administratives">
                  <EditableField label="Numéro CIN" value={selected.numeroCIN} onChange={(value) => updateSelected("numeroCIN", value)} />
                  <EditableField label="Date validité CIN" value={selected.dateValiditeCIN} onChange={(value) => updateSelected("dateValiditeCIN", value)} />
                  <EditableField label="Date entrée" value={selected.dateEntree} onChange={(value) => updateSelected("dateEntree", value)} />
                </Section>

                <Section title="Documents">
                  <EditableField label="Lien contrat" value={selected.contrat} onChange={(value) => updateSelected("contrat", value)} />
                  <EditableField label="Avenant 1" value={selected.avenant1} onChange={(value) => updateSelected("avenant1", value)} />
                  <EditableField label="Avenant 2" value={selected.avenant2} onChange={(value) => updateSelected("avenant2", value)} />
                  <EditableField label="Avenant 3" value={selected.avenant3} onChange={(value) => updateSelected("avenant3", value)} />
                  <EditableField label="Attestation" value={selected.attestation} onChange={(value) => updateSelected("attestation", value)} />
                </Section>

                <Section title="Onboarding">
                  <EditableField label="Statut onboarding" value={selected.onboarding} onChange={(value) => updateSelected("onboarding", value)} />
                  <div className="grid gap-2 sm:grid-cols-5">
                    {onboardingSteps.map((step, index) => (
                      <button
                        key={step}
                        type="button"
                        onClick={() => updateSelected("onboarding", index >= 3 ? "Terminé" : "En cours")}
                        className="rounded-lg border border-border bg-background p-3 text-left hover:bg-muted/60"
                      >
                        <CheckCircle2 className="mb-2 h-4 w-4 text-primary" />
                        <span className="text-xs font-medium">{step}</span>
                      </button>
                    ))}
                  </div>
                </Section>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      <Sheet open={isCreating} onOpenChange={setIsCreating}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-xl">
          <SheetHeader>
            <SheetTitle>Créer un collaborateur</SheetTitle>
            <SheetDescription>Création démo depuis une fiche talent existante.</SheetDescription>
          </SheetHeader>

          {sourceTalent && (
            <div className="mt-6 space-y-5 text-sm">
              <Section title="Talent source">
                <Field label="Nom" value={`${sourceTalent.prenom} ${sourceTalent.nom}`} />
                <Field label="Email" value={sourceTalent.email} />
                <Field label="Poste" value={sourceTalent.poste} />
                <Field label="Disponibilité" value={sourceTalent.disponibilite} />
                <Field label="Tarif 8h" value={sourceTalent.tarif8h} />
              </Section>

              <Section title="Informations à compléter côté collaborateur">
                <Field label="État" value="Actif" />
                <Field label="ID MA" value={`MA-${String(records.length + 46).padStart(4, "0")}`} />
                <Field label="Date entrée" value={new Date().toISOString().slice(0, 10)} />
                <Field label="Documents" value="À compléter après création" />
              </Section>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsCreating(false)}>Annuler</Button>
                <Button onClick={createFromTalent} className="gap-2">
                  <UserRoundCheck className="h-4 w-4" />
                  Créer la fiche collaborateur
                </Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}

function enrichCollaborateur(collaborateur: Collaborateur, talentOverride?: Talent): EditableCollaborateur {
  const talent = talentOverride ?? talents.find((item) => item.nom === collaborateur.nom && item.prenom === collaborateur.prenom);

  return {
    ...collaborateur,
    talentId: talent?.id,
    poste: talent?.poste,
    niveauFrancais: talent?.niveauFrancais,
    niveauAnglais: talent?.niveauAnglais,
    experience: talent?.experience,
    hardSkills: talent?.hardSkills,
    softSkills: talent?.softSkills,
    outils: talent?.outils,
    disponibilite: talent?.disponibilite,
    tarif8h: talent?.tarif8h,
    tarif4h: talent?.tarif4h,
    historique: talent?.historique,
    remarqueRH: talent?.remarqueRH,
    cv: talent?.cv,
    portfolio: talent?.portfolio,
  };
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{title}</h3>
      <div className="space-y-3 rounded-xl border border-border bg-muted/30 p-4">{children}</div>
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

function EditableField({ label, value, onChange }: { label: string; value?: string; onChange: (value: string) => void }) {
  return (
    <label className="grid grid-cols-3 items-center gap-3">
      <span className="text-muted-foreground">{label}</span>
      <Input value={value ?? ""} onChange={(event) => onChange(event.target.value)} className="col-span-2 h-9" />
    </label>
  );
}

function TagField({ label, value }: { label: string; value?: string }) {
  const tags = value?.split(",").map((tag) => tag.trim()).filter(Boolean) ?? [];
  return (
    <div className="grid grid-cols-3 gap-3">
      <span className="text-muted-foreground">{label}</span>
      <div className="col-span-2 flex flex-wrap gap-1.5">
        {tags.length ? tags.map((tag) => <Badge key={tag} variant="secondary">{tag}</Badge>) : <span className="text-muted-foreground italic">—</span>}
      </div>
    </div>
  );
}

function Doc({ label, value }: { label: string; value?: string }) {
  return (
    <div className="grid grid-cols-3 gap-3">
      <span className="text-muted-foreground">{label}</span>
      <span className="col-span-2">
        {value ? (
          <button
            type="button"
            onClick={() => alert(`Ouverture du document : ${value}`)}
            className="inline-flex items-center gap-1.5 text-sm text-foreground underline-offset-2 hover:underline"
          >
            <FileText className="h-3.5 w-3.5" /> {value}
          </button>
        ) : (
          <span className="text-muted-foreground italic">non fourni</span>
        )}
      </span>
    </div>
  );
}

function DocPill({ ok, label }: { ok: boolean; label: string }) {
  return (
    <Badge variant={ok ? "secondary" : "outline"} className="whitespace-nowrap">
      {ok ? "OK" : "Manquant"} · {label}
    </Badge>
  );
}
