import { cn } from "@/lib/utils";

type Tone = "neutral" | "info" | "success" | "warning" | "danger" | "accent";

const toneClasses: Record<Tone, string> = {
  neutral: "bg-muted text-muted-foreground border-border",
  info: "bg-[oklch(0.93_0.04_240)] text-[oklch(0.35_0.1_240)] border-transparent",
  success: "bg-[oklch(0.92_0.08_150)] text-[oklch(0.32_0.12_150)] border-transparent",
  warning: "bg-accent text-accent-foreground border-transparent",
  danger: "bg-[oklch(0.92_0.08_25)] text-[oklch(0.4_0.18_25)] border-transparent",
  accent: "bg-primary text-primary-foreground border-transparent",
};

const map: Record<string, Tone> = {
  // commandes
  Nouvelle: "info",
  "En cours": "warning",
  "Profils présentés": "accent",
  Clôturée: "success",
  Annulée: "neutral",
  // fiches
  Brouillon: "neutral",
  Active: "success",
  Archivée: "neutral",
  // recrutements
  Ouvert: "info",
  "Stand-by": "warning",
  Pourvu: "success",
  Annulé: "neutral",
  // talents
  Actif: "success",
  Inactif: "neutral",
  "En place": "accent",
  "Ne plus présenter": "danger",
  "Red Flag": "danger",
  Sorti: "neutral",
  // priorité
  Haute: "danger",
  Moyenne: "warning",
  Basse: "neutral",
};

export function StatusBadge({ value, tone }: { value: string; tone?: Tone }) {
  const t = tone ?? map[value] ?? "neutral";
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium whitespace-nowrap",
        toneClasses[t],
      )}
    >
      {value}
    </span>
  );
}
