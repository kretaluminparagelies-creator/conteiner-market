/**
 * @file SellFlowBackLink.tsx
 * @description Back navigation within sell (polisi) flow
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

import { ChevronLeft } from "lucide-react";
import Link from "next/link";

type SellFlowBackLinkProps = {
  href: string;
  label: string;
  className?: string;
};

export function SellFlowBackLink({ href, label, className }: SellFlowBackLinkProps) {
  return (
    <Link
      href={href}
      className={[
        "inline-flex items-center gap-1.5 rounded-full border border-cm-light-border-strong",
        "bg-white/96 px-3 py-1.5 font-display text-xs font-semibold text-cm-ink sm:text-sm",
        "shadow-cm-light-sm transition-colors hover:border-cm-ink-muted/40 hover:text-cm-ink-sub",
        className,
      ].join(" ")}
    >
      <ChevronLeft className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4" aria-hidden="true" />
      {label}
    </Link>
  );
}
