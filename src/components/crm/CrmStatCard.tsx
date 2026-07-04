/**
 * @file CrmStatCard.tsx
 * @description Dashboard stat tile
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

type CrmStatCardProps = {
  label: string;
  value: string | number;
  hint?: string;
  accent?: "orange" | "blue" | "neutral";
};

export function CrmStatCard({ label, value, hint, accent = "neutral" }: CrmStatCardProps) {
  const accentClass =
    accent === "orange" ? "text-cm-accent" : accent === "blue" ? "text-cm-rent" : "text-cm-text";

  return (
    <div className="rounded-xl border border-cm-border bg-cm-card/60 p-5">
      <p className="font-mono text-[10px] tracking-[0.18em] text-cm-muted uppercase">{label}</p>
      <p className={`mt-2 font-display text-3xl font-bold ${accentClass}`}>{value}</p>
      {hint ? <p className="mt-2 text-xs text-cm-sub">{hint}</p> : null}
    </div>
  );
}
