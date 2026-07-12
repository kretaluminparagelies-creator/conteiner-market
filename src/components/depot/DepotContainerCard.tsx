/**
 * @file DepotContainerCard.tsx
 * @description Compact card for depot inventory list
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import type { DepotContainer } from "@/lib/depot/types";
import { depotStatusLabels } from "@/lib/depot/status";
import { containerTypeById } from "@/lib/constants/container-types";
import { cn } from "@/lib/utils";

type DepotContainerCardProps = {
  container: DepotContainer;
  href?: string;
  onClick?: () => void;
  selected?: boolean;
  action?: ReactNode;
};

export function DepotContainerCard({
  container,
  href,
  onClick,
  selected = false,
  action,
}: DepotContainerCardProps) {
  const typeLabel = containerTypeById[container.containerType]?.name.el ?? container.containerType;

  const body = (
    <article
      className={cn(
        "flex gap-3 rounded-2xl border bg-white p-3 shadow-cm-light-xs transition-colors",
        selected
          ? "border-cm-accent bg-cm-accent/8"
          : "border-cm-light-border-strong",
      )}
    >
      <div className="relative size-20 shrink-0 overflow-hidden rounded-xl bg-cm-light-bg">
        {container.images[0] ? (
          <Image
            src={container.images[0]}
            alt=""
            fill
            unoptimized
            sizes="80px"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center font-mono text-[10px] text-cm-ink-muted">
            No photo
          </div>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <p className="font-mono text-[11px] font-bold tracking-[0.08em] text-cm-ink">
          {container.containerNumber}
        </p>
        <p className="mt-0.5 text-sm font-semibold text-cm-ink-sub">{typeLabel}</p>
        <p className="mt-1 font-mono text-[10px] text-cm-ink-muted">
          Grade {container.grade} · {depotStatusLabels[container.status]}
        </p>
        {container.salePrice !== undefined ? (
          <p className="mt-1 text-sm font-bold text-cm-accent">
            €{container.salePrice.toLocaleString("el-GR")}
          </p>
        ) : null}
      </div>

      {action ? <div className="shrink-0 self-center">{action}</div> : null}
    </article>
  );

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className="block w-full text-left transition-transform active:scale-[0.99]"
      >
        {body}
      </button>
    );
  }

  if (!href) return body;

  return (
    <Link href={href} className="block transition-transform active:scale-[0.99]">
      {body}
    </Link>
  );
}
