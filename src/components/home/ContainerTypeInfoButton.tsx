/**
 * @file ContainerTypeInfoButton.tsx
 * @description (i) info popover for a container type in hero multi-select
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

"use client";

import { Info } from "lucide-react";
import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { ContainerTypeSpec } from "@/lib/constants/container-types";
import { useIsClient } from "@/lib/hooks/useIsClient";
import { useLocale } from "@/lib/i18n/locale-context";
import { buildContainerTypeInfoRows } from "@/lib/utils/container-type-info";
import { cn } from "@/lib/utils";

const POPOVER_WIDTH = 260;

type ContainerTypeInfoButtonProps = {
  spec: ContainerTypeSpec;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function ContainerTypeInfoButton({ spec, open, onOpenChange }: ContainerTypeInfoButtonProps) {
  const { t, locale } = useLocale();
  const mounted = useIsClient();
  const popoverId = useId();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const [style, setStyle] = useState<{ top: number; left: number }>({ top: 0, left: 0 });

  const name = locale === "en" ? spec.name.en : spec.name.el;
  const summary = locale === "en" ? spec.shortDescription.en : spec.shortDescription.el;
  const rows = buildContainerTypeInfoRows(spec, t.heroSearch.containerTypeInfo, locale);

  const updatePosition = () => {
    const button = buttonRef.current;
    if (!button) return;

    const rect = button.getBoundingClientRect();
    const popoverHeight = popoverRef.current?.offsetHeight ?? 200;
    const margin = 12;
    let left = rect.right + 8;
    if (left + POPOVER_WIDTH > window.innerWidth - margin) {
      left = rect.left - POPOVER_WIDTH - 8;
    }
    left = Math.max(margin, Math.min(left, window.innerWidth - POPOVER_WIDTH - margin));

    let top = rect.top - 4;
    if (top + popoverHeight > window.innerHeight - margin) {
      top = window.innerHeight - popoverHeight - margin;
    }
    top = Math.max(margin, top);

    setStyle({ top, left });
  };

  useLayoutEffect(() => {
    if (!open) return;
    updatePosition();
    const frame = requestAnimationFrame(() => updatePosition());
    return () => cancelAnimationFrame(frame);
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target as Node;
      if (buttonRef.current?.contains(target) || popoverRef.current?.contains(target)) return;
      onOpenChange(false);
    };

    window.addEventListener("mousedown", handlePointerDown);
    return () => window.removeEventListener("mousedown", handlePointerDown);
  }, [open, onOpenChange]);

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls={popoverId}
        aria-label={`${t.heroSearch.containerTypeInfo.infoAria}: ${name}`}
        onClick={(event) => {
          event.stopPropagation();
          onOpenChange(!open);
        }}
        className={cn(
          "mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-md border transition-colors",
          open
            ? "border-cm-accent/50 bg-cm-accent/12 text-cm-accent"
            : "border-cm-light-border-strong bg-white text-cm-ink-muted hover:border-cm-accent/35 hover:text-cm-accent",
        )}
      >
        <Info className="size-3.5" strokeWidth={2.2} aria-hidden="true" />
      </button>

      {mounted && open
        ? createPortal(
            <div
              ref={popoverRef}
              id={popoverId}
              role="dialog"
              aria-label={name}
              style={{ top: style.top, left: style.left, width: POPOVER_WIDTH }}
              className="fixed z-[300] rounded-xl border border-cm-light-border-strong bg-white p-3 shadow-cm-light-lg"
              data-container-type-info=""
              onClick={(event) => event.stopPropagation()}
            >
              <p className="font-display text-sm font-bold leading-tight text-cm-ink">{name}</p>
              <p className="mt-1 font-mono text-[10px] leading-snug text-cm-ink-muted">{summary}</p>

              <dl className="mt-2.5 space-y-1.5 border-t border-cm-light-border-strong pt-2.5">
                {rows.map((row) => (
                  <div key={row.label}>
                    <dt className="font-mono text-[8px] font-bold tracking-[0.14em] text-cm-ink-muted uppercase">
                      {row.label}
                    </dt>
                    <dd className="font-display text-xs leading-snug text-cm-ink">{row.value}</dd>
                  </div>
                ))}
              </dl>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
