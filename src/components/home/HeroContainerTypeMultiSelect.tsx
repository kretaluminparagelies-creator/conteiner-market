/**
 * @file HeroContainerTypeMultiSelect.tsx
 * @description Multi-select container types — opens below & right of hero field
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

"use client";

import { Check, ChevronDownIcon, Package } from "lucide-react";
import { useEffect, useId, useLayoutEffect, useRef, useState, type RefObject } from "react";
import { createPortal } from "react-dom";
import { ContainerTypeInfoButton } from "@/components/home/ContainerTypeInfoButton";
import { Label } from "@/components/ui/label";
import { containerTypeGroups, getContainerTypeById } from "@/lib/constants/container-types";
import { useIsClient } from "@/lib/hooks/useIsClient";
import { useIsMobileLayout } from "@/lib/hooks/useIsMobileLayout";
import { useLocale } from "@/lib/i18n/locale-context";
import { cn } from "@/lib/utils";

const PANEL_WIDTH = 540;
const MOBILE_PANEL_MARGIN = 12;
/** Panel left edge starts this many px to the right of the trigger's right edge */
const PANEL_OFFSET_RIGHT = 28;
const GAP_BELOW = 28;

const allContainerTypeIds = containerTypeGroups.flatMap((group) => group.ids);

type PanelStyle = {
  top: number;
  left: number;
  width: number;
};

type HeroContainerTypeMultiSelectProps = {
  selectedIds: string[];
  onChange: (ids: string[]) => void;
  triggerClass: string;
  labelClass: string;
  /** Drop panel below this element (e.g. whole search form) instead of the trigger only */
  panelAnchorRef?: RefObject<HTMLElement | null>;
};

export function HeroContainerTypeMultiSelect({
  selectedIds,
  onChange,
  triggerClass,
  labelClass,
  panelAnchorRef,
}: HeroContainerTypeMultiSelectProps) {
  const { t, locale } = useLocale();
  const mounted = useIsClient();
  const isMobileLayout = useIsMobileLayout();
  const listboxId = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [activeInfoId, setActiveInfoId] = useState<string | null>(null);
  const [panelStyle, setPanelStyle] = useState<PanelStyle>({
    top: 0,
    left: 0,
    width: PANEL_WIDTH,
  });

  const triggerLabel =
    selectedIds.length === 0
      ? t.heroSearch.containerTypeAll
      : selectedIds.length === 1
        ? (() => {
            const spec = getContainerTypeById(selectedIds[0]!);
            if (!spec) return t.heroSearch.containerTypeAll;
            return locale === "en" ? spec.name.en : spec.name.el;
          })()
        : t.heroSearch.containerTypesSelected.replace("{count}", String(selectedIds.length));

  const updatePanelPosition = () => {
    const trigger = triggerRef.current;
    if (!trigger) return;

    const rect = trigger.getBoundingClientRect();
    const anchorRect = panelAnchorRef?.current?.getBoundingClientRect() ?? rect;
    const panelHeight = panelRef.current?.offsetHeight ?? 420;
    const margin = MOBILE_PANEL_MARGIN;
    const viewportBottom = window.innerHeight - margin;
    const mobileLayout = window.matchMedia("(max-width: 767px)").matches;

    if (mobileLayout) {
      const width = window.innerWidth - margin * 2;
      let top = rect.bottom + 8;
      if (top + panelHeight > viewportBottom) {
        top = Math.max(margin, viewportBottom - panelHeight);
      }
      setPanelStyle({ top, left: margin, width });
      return;
    }

    // Always below the anchor (form bottom when provided) — never flip above.
    let top = anchorRect.bottom + GAP_BELOW;
    if (top + panelHeight > viewportBottom) {
      top = Math.max(margin, viewportBottom - panelHeight);
    }

    // Spill to the right of the search card.
    let left = anchorRect.right + PANEL_OFFSET_RIGHT;
    if (left + PANEL_WIDTH > window.innerWidth - margin) {
      left = window.innerWidth - PANEL_WIDTH - margin;
    }
    left = Math.max(margin, left);

    setPanelStyle({ top, left, width: PANEL_WIDTH });
  };

  useLayoutEffect(() => {
    if (!open) return;
    updatePanelPosition();
    const frame = requestAnimationFrame(() => updatePanelPosition());
    return () => cancelAnimationFrame(frame);
  }, [open, selectedIds.length]);

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target as Node;
      if (triggerRef.current?.contains(target) || panelRef.current?.contains(target)) return;
      if ((target as Element).closest?.("[data-container-type-info]")) return;
      setActiveInfoId(null);
      setOpen(false);
    };

    const handleResize = () => updatePanelPosition();
    const handleScroll = (event: Event) => {
      const target = event.target as Node;
      if (panelRef.current?.contains(target)) return;
      if ((target as Element).closest?.("[data-container-type-info]")) return;
      setOpen(false);
    };
    const isMobileLayoutNow = window.matchMedia("(max-width: 767px)").matches;

    window.addEventListener("mousedown", handlePointerDown);
    window.addEventListener("resize", handleResize);
    if (!isMobileLayoutNow) {
      window.addEventListener("scroll", handleScroll, true);
    }

    return () => {
      window.removeEventListener("mousedown", handlePointerDown);
      window.removeEventListener("resize", handleResize);
      if (!isMobileLayoutNow) {
        window.removeEventListener("scroll", handleScroll, true);
      }
    };
  }, [open]);

  const toggleId = (id: string) => {
    const next = selectedIds.includes(id)
      ? selectedIds.filter((entry) => entry !== id)
      : [...selectedIds, id];

    if (next.length >= allContainerTypeIds.length) {
      onChange([]);
      return;
    }

    onChange(next);
  };

  const selectAllTypes = () => onChange([]);

  return (
    <div className="space-y-1.5">
      <Label id={`${listboxId}-label`} className={labelClass}>
        {t.heroSearch.containerTypeLabel}
      </Label>

      <button
        ref={triggerRef}
        type="button"
        id="hero-container-type"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listboxId}
        data-popup-open={open ? "" : undefined}
        onClick={() => {
          setActiveInfoId(null);
          setOpen((value) => !value);
        }}
        className={triggerClass}
      >
        <span className="flex min-w-0 items-center gap-2">
          <Package className="size-4 shrink-0 text-cm-rent" aria-hidden="true" />
          <span className="line-clamp-1 flex flex-1 text-left">{triggerLabel}</span>
        </span>
        <ChevronDownIcon
          className="pointer-events-none size-4 shrink-0 text-muted-foreground"
          aria-hidden="true"
        />
      </button>

      {mounted && open
        ? createPortal(
            <div
              ref={panelRef}
              id={listboxId}
              role="listbox"
              aria-labelledby={`${listboxId}-label`}
              aria-multiselectable="true"
              style={{ top: panelStyle.top, left: panelStyle.left, width: panelStyle.width }}
              className={cn(
                "fixed z-[250] overflow-hidden rounded-xl border border-cm-light-border-strong",
                "bg-white shadow-cm-light-lg",
                isMobileLayout && "max-h-[min(70dvh,32rem)]",
              )}
            >
              <div className="flex items-center justify-between border-b border-cm-light-border-strong px-3 py-2">
                <p className="font-mono text-[9px] font-bold tracking-[0.16em] text-cm-ink-muted uppercase">
                  {t.heroSearch.containerTypePick}
                </p>
                <div className="flex items-center gap-3">
                  {isMobileLayout ? (
                    <button
                      type="button"
                      onClick={selectAllTypes}
                      className={cn(
                        "font-display text-xs font-semibold hover:underline",
                        selectedIds.length === 0 ? "text-cm-ink" : "text-cm-accent",
                      )}
                    >
                      {t.heroSearch.containerTypeAll}
                    </button>
                  ) : null}
                  {selectedIds.length > 0 ? (
                    <button
                      type="button"
                      onClick={selectAllTypes}
                      className="font-display text-xs font-semibold text-cm-accent hover:underline"
                    >
                      {t.heroSearch.clearSelection}
                    </button>
                  ) : null}
                </div>
              </div>

              <div
                className={cn(
                  "p-2.5",
                  isMobileLayout &&
                    "max-h-[calc(min(70dvh,32rem)-2.75rem)] touch-pan-y overflow-y-auto overscroll-contain",
                )}
                onScroll={() => setActiveInfoId(null)}
                onTouchMove={(event) => event.stopPropagation()}
              >
                {containerTypeGroups.map((group) => (
                  <div key={group.label.el} className="mb-2 last:mb-0">
                    <p className="px-1.5 py-1 font-mono text-[9px] tracking-[0.16em] text-cm-ink-muted uppercase">
                      {locale === "en" ? group.label.en : group.label.el}
                    </p>
                    <ul className={cn("grid gap-x-1.5 gap-y-0.5", isMobileLayout ? "grid-cols-1" : "grid-cols-2")}>
                      {group.ids.map((id) => {
                        const spec = getContainerTypeById(id);
                        if (!spec) return null;
                        const checked = selectedIds.includes(id);
                        const name = locale === "en" ? spec.name.en : spec.name.el;
                        const summary =
                          locale === "en" ? spec.shortDescription.en : spec.shortDescription.el;

                        return (
                          <li key={id} className="flex items-start gap-0.5">
                            <button
                              type="button"
                              role="option"
                              aria-selected={checked}
                              onClick={() => toggleId(id)}
                              className={cn(
                                "flex min-w-0 flex-1 items-start gap-2 rounded-lg px-1.5 py-1.5 text-left transition-colors",
                                checked ? "bg-cm-accent/10" : "hover:bg-cm-light-bg",
                              )}
                            >
                              <span
                                className={cn(
                                  "mt-0.5 flex size-3.5 shrink-0 items-center justify-center rounded border",
                                  checked
                                    ? "border-cm-accent bg-cm-accent text-white"
                                    : "border-cm-light-border-strong bg-white",
                                )}
                              >
                                {checked ? <Check className="size-2.5" strokeWidth={3} /> : null}
                              </span>
                              <span className="min-w-0 flex-1">
                                <span className="block font-display text-[13px] leading-tight text-cm-ink">
                                  {name}
                                </span>
                                <span className="mt-0.5 block font-mono text-[9px] leading-snug text-cm-ink-muted">
                                  ISO {spec.isoCode} · {summary}
                                </span>
                              </span>
                            </button>
                            <ContainerTypeInfoButton
                              spec={spec}
                              open={activeInfoId === id}
                              onOpenChange={(next) => setActiveInfoId(next ? id : null)}
                            />
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ))}
              </div>
            </div>,
            document.body,
          )
        : null}
    </div>
  );
}
