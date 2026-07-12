/**
 * @file CrmStatCard.tsx
 * @description Dashboard stat tile
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

import Link from "next/link";

type CrmStatCardProps = {
  label: string;
  value: string | number;
  hint?: string;
  accent?: "orange" | "blue" | "neutral" | "amber";
  href?: string;
};

export function CrmStatCard({ label, value, hint, accent = "neutral", href }: CrmStatCardProps) {
  const accentClass =
    accent === "orange"
      ? "text-cm-accent"
      : accent === "blue"
        ? "text-cm-rent"
        : accent === "amber"
          ? "text-amber-800"
          : "text-cm-text";

  const className = [
    "rounded-xl border border-cm-border bg-cm-card p-5 shadow-cm-light-xs",
    href ? "transition-colors hover:border-cm-accent/35 hover:bg-cm-accent/5" : "",
  ].join(" ");

  const content = (
    <>
      <p className="font-mono text-[10px] font-semibold tracking-[0.14em] text-cm-muted uppercase">
        {label}
      </p>
      <p className={`mt-2 font-display text-3xl font-bold ${accentClass}`}>{value}</p>
      {hint ? <p className="mt-2 text-xs text-cm-ink-sub">{hint}</p> : null}
    </>
  );

  if (href) {
    return (
      <Link href={href} className={className}>
        {content}
      </Link>
    );
  }

  return <div className={className}>{content}</div>;
}
