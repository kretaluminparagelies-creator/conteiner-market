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
    <div className="rounded-xl border border-cm-border bg-cm-card p-5 shadow-cm-light-xs">
      <p className="font-mono text-[10px] font-semibold tracking-[0.14em] text-cm-muted uppercase">
        {label}
      </p>
      <p className={`mt-2 font-display text-3xl font-bold ${accentClass}`}>{value}</p>
      {hint ? <p className="mt-2 text-xs text-cm-ink-sub">{hint}</p> : null}
    </div>
  );
}
