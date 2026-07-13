/**
 * @file DepotMobileContainerGallery.tsx
 * @description Mobile-only tap-to-expand container photo gallery + details
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

"use client";

import Image from "next/image";
import { Images } from "lucide-react";
import { useState } from "react";
import { containerTypeById } from "@/lib/constants/container-types";
import { useIsMobileLayout } from "@/lib/hooks/useIsMobileLayout";
import type { DepotContainer } from "@/lib/depot/types";
import { cn } from "@/lib/utils";

type DepotMobileContainerGalleryProps = {
  container: DepotContainer;
  variant: "thumb" | "hero";
  expanded?: boolean;
  onExpandedChange?: (expanded: boolean) => void;
  showDetails?: boolean;
};

function formatPrice(value?: number): string | null {
  return value !== undefined ? `€${value.toLocaleString("el-GR")}` : null;
}

export function DepotMobileContainerGalleryPanel({
  container,
  showDetails = true,
}: {
  container: DepotContainer;
  showDetails?: boolean;
}) {
  const photos = container.images.filter(Boolean);
  const extraPhotos = photos.slice(1);
  const typeLabel = containerTypeById[container.containerType]?.name.el ?? container.containerType;
  const salePrice = formatPrice(container.salePrice);
  const rentPrice =
    container.rentPrice !== undefined
      ? `€${container.rentPrice.toLocaleString("el-GR")}/μήνα`
      : null;

  return (
    <div className="space-y-2 border-t border-cm-light-border-strong/80 pt-2">
      {extraPhotos.length > 0 ? (
        <div>
          <p className="mb-1.5 font-mono text-[9px] tracking-[0.12em] text-cm-ink-muted uppercase">
            Υπόλοιπες φωτό ({extraPhotos.length})
          </p>
          <div className="flex gap-1.5 overflow-x-auto pb-0.5">
            {extraPhotos.map((src, index) => (
              <div
                key={`${src}-${index}`}
                className="relative size-14 shrink-0 overflow-hidden rounded-lg border border-cm-light-border-strong"
              >
                <Image
                  src={src}
                  alt=""
                  width={56}
                  height={56}
                  unoptimized
                  className="size-14 object-cover"
                />
                <span className="absolute right-0.5 bottom-0.5 rounded bg-black/65 px-1 font-mono text-[8px] text-white">
                  {index + 2}/{photos.length}
                </span>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {showDetails ? (
        <div className="space-y-1 rounded-lg bg-cm-light-bg/60 px-2.5 py-2 text-xs text-cm-ink-sub">
          <p>
            <span className="font-mono font-bold text-cm-ink">{container.containerNumber}</span>
            {" · "}
            {typeLabel} · Grade {container.grade}
          </p>
          {salePrice ? <p className="font-semibold text-cm-accent">Πώληση: {salePrice}</p> : null}
          {rentPrice ? <p className="font-semibold text-cm-accent">Ενοικίαση: {rentPrice}</p> : null}
          {container.notes?.trim() ? (
            <p className="whitespace-pre-wrap text-cm-ink-sub">{container.notes.trim()}</p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

function GalleryTrigger({
  cover,
  photoCount,
  expanded,
  onToggle,
  className,
}: {
  cover?: string;
  photoCount: number;
  expanded: boolean;
  onToggle: () => void;
  className: string;
}) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        onToggle();
      }}
      onKeyDown={(event) => {
        if (event.key !== "Enter" && event.key !== " ") return;
        event.preventDefault();
        event.stopPropagation();
        onToggle();
      }}
      aria-expanded={expanded}
      aria-label={
        photoCount > 0
          ? `Φωτογραφίες κοντέινερ, ${photoCount} συνολικά`
          : "Στοιχεία κοντέινερ"
      }
      className={cn(
        className,
        "cursor-pointer ring-offset-2 transition-opacity active:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cm-accent",
        expanded && "ring-2 ring-cm-accent/40",
      )}
    >
      {cover ? (
        <Image
          src={cover}
          alt=""
          fill
          unoptimized
          sizes="80px"
          className="object-cover"
        />
      ) : (
        <div className="flex h-full items-center justify-center font-mono text-[10px] text-cm-ink-muted">
          Χωρίς φωτό
        </div>
      )}
      {photoCount > 1 ? (
        <span className="pointer-events-none absolute right-1 bottom-1 inline-flex items-center gap-0.5 rounded-full bg-black/70 px-1.5 py-0.5 font-mono text-[9px] font-bold text-white">
          <Images className="size-2.5" aria-hidden="true" />
          {photoCount}
        </span>
      ) : null}
    </div>
  );
}

export function DepotMobileContainerGallery({
  container,
  variant,
  expanded: expandedProp,
  onExpandedChange,
  showDetails = true,
}: DepotMobileContainerGalleryProps) {
  const isMobile = useIsMobileLayout();
  const isControlled = expandedProp !== undefined;
  const [openState, setOpenState] = useState<{ containerId: string; open: boolean }>({
    containerId: container.id,
    open: false,
  });
  const expandedInternal =
    openState.containerId === container.id ? openState.open : false;
  const expanded = expandedProp ?? expandedInternal;

  const setExpanded = (next: boolean) => {
    if (isControlled) {
      onExpandedChange?.(next);
      return;
    }
    setOpenState({ containerId: container.id, open: next });
    onExpandedChange?.(next);
  };

  const photos = container.images.filter(Boolean);
  const photoCount = photos.length;
  const cover = photos[0];

  const imageShellClass =
    variant === "thumb"
      ? "relative size-20 shrink-0 overflow-hidden rounded-xl bg-cm-light-bg"
      : "relative h-28 w-full overflow-hidden rounded-xl bg-cm-light-bg";

  if (!isMobile) {
    return (
      <div className={imageShellClass}>
        {cover ? (
          <Image
            src={cover}
            alt=""
            fill
            unoptimized
            sizes={variant === "thumb" ? "80px" : "320px"}
            className="object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center font-mono text-[10px] text-cm-ink-muted">
            Χωρίς φωτό
          </div>
        )}
      </div>
    );
  }

  const toggle = () => setExpanded(!expanded);

  const trigger = (
    <GalleryTrigger
      cover={cover}
      photoCount={photoCount}
      expanded={expanded}
      onToggle={toggle}
      className={imageShellClass}
    />
  );

  if (variant === "hero") {
    return (
      <div className="overflow-hidden rounded-2xl border border-cm-light-border-strong bg-white px-3 py-3">
        {trigger}
        {expanded ? (
          <DepotMobileContainerGalleryPanel container={container} showDetails={showDetails} />
        ) : null}
      </div>
    );
  }

  return trigger;
}
