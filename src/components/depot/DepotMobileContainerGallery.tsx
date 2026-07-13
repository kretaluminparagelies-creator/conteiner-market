/**
 * @file DepotMobileContainerGallery.tsx
 * @description Mobile-only tap-to-expand container photo gallery + details
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

"use client";

import Image from "next/image";
import { Images, Star } from "lucide-react";
import { useState } from "react";
import { containerTypeById } from "@/lib/constants/container-types";
import { depotStatusLabels } from "@/lib/depot/status";
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

const gradeLabels = { A: "A (χωρίς μπαλώματα)", B: "B (με μπαλώματα)", C: "C" } as const;

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
  const typeLabel = containerTypeById[container.containerType]?.name.el ?? container.containerType;
  const salePrice = formatPrice(container.salePrice);
  const rentPrice =
    container.rentPrice !== undefined
      ? `€${container.rentPrice.toLocaleString("el-GR")}/μήνα`
      : null;

  return (
    <div className="space-y-3 border-t border-cm-light-border-strong/80 pt-3">
      {photos.length > 0 ? (
        <div>
          <p className="mb-2 font-mono text-[10px] tracking-[0.14em] text-cm-ink-muted uppercase">
            Φωτογραφίες ({photos.length})
          </p>
          <div className="grid grid-cols-2 gap-2">
            {photos.map((src, index) => (
              <div
                key={`${src}-${index}`}
                className="relative overflow-hidden rounded-xl border border-cm-light-border-strong"
              >
                <Image
                  src={src}
                  alt=""
                  width={320}
                  height={240}
                  unoptimized
                  className="h-28 w-full object-cover"
                />
                {index === 0 ? (
                  <span className="absolute top-2 left-2 inline-flex items-center gap-0.5 rounded-full bg-cm-accent/90 px-2 py-0.5 font-mono text-[9px] text-white uppercase">
                    <Star className="size-3" aria-hidden="true" />
                    Κύρια
                  </span>
                ) : (
                  <span className="absolute top-2 left-2 rounded-full bg-black/55 px-2 py-0.5 font-mono text-[9px] text-white">
                    {index + 1}/{photos.length}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {showDetails ? (
        <dl className="grid gap-2 rounded-xl border border-cm-light-border-strong bg-cm-light-bg/50 px-3 py-3 text-sm">
          <div>
            <dt className="font-mono text-[10px] tracking-[0.14em] text-cm-ink-muted uppercase">
              Αριθμός
            </dt>
            <dd className="font-mono font-bold text-cm-ink">{container.containerNumber}</dd>
          </div>
          <div>
            <dt className="font-mono text-[10px] tracking-[0.14em] text-cm-ink-muted uppercase">
              Τύπος
            </dt>
            <dd className="text-cm-ink-sub">{typeLabel}</dd>
          </div>
          <div>
            <dt className="font-mono text-[10px] tracking-[0.14em] text-cm-ink-muted uppercase">
              Grade
            </dt>
            <dd className="text-cm-ink-sub">{gradeLabels[container.grade]}</dd>
          </div>
          <div>
            <dt className="font-mono text-[10px] tracking-[0.14em] text-cm-ink-muted uppercase">
              Κατάσταση
            </dt>
            <dd className="text-cm-ink-sub">{depotStatusLabels[container.status]}</dd>
          </div>
          {salePrice ? (
            <div>
              <dt className="font-mono text-[10px] tracking-[0.14em] text-cm-ink-muted uppercase">
                Τιμή πώλησης
              </dt>
              <dd className="font-semibold text-cm-accent">{salePrice}</dd>
            </div>
          ) : null}
          {rentPrice ? (
            <div>
              <dt className="font-mono text-[10px] tracking-[0.14em] text-cm-ink-muted uppercase">
                Ενοικίαση
              </dt>
              <dd className="font-semibold text-cm-accent">{rentPrice}</dd>
            </div>
          ) : null}
          {container.notes?.trim() ? (
            <div>
              <dt className="font-mono text-[10px] tracking-[0.14em] text-cm-ink-muted uppercase">
                Σημειώσεις
              </dt>
              <dd className="whitespace-pre-wrap text-cm-ink-sub">{container.notes.trim()}</dd>
            </div>
          ) : null}
        </dl>
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
  const [expandedInternal, setExpandedInternal] = useState(false);
  const expanded = expandedProp ?? expandedInternal;
  const setExpanded = onExpandedChange ?? setExpandedInternal;

  const photos = container.images.filter(Boolean);
  const photoCount = photos.length;
  const cover = photos[0];

  const imageShellClass =
    variant === "thumb"
      ? "relative size-20 shrink-0 overflow-hidden rounded-xl bg-cm-light-bg"
      : "relative aspect-[4/3] bg-cm-light-bg";

  if (!isMobile) {
    return (
      <div className={imageShellClass}>
        {cover ? (
          <Image
            src={cover}
            alt=""
            fill
            unoptimized
            sizes={variant === "thumb" ? "80px" : "(max-width: 512px) 100vw, 512px"}
            className="object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center font-mono text-[10px] text-cm-ink-muted">
            {variant === "thumb" ? "No photo" : "Χωρίς φωτό"}
          </div>
        )}
      </div>
    );
  }

  const toggle = () => setExpanded(!expanded);

  const trigger = (
    <button
      type="button"
      onClick={(event) => {
        event.stopPropagation();
        toggle();
      }}
      aria-expanded={expanded}
      aria-label={
        photoCount > 0
          ? `Φωτογραφίες κοντέινερ, ${photoCount} συνολικά`
          : "Στοιχεία κοντέινερ"
      }
      className={cn(
        imageShellClass,
        "block w-full text-left ring-offset-2 transition-opacity active:opacity-90 focus-visible:ring-2 focus-visible:ring-cm-accent",
        expanded && "ring-2 ring-cm-accent/50",
      )}
    >
      {cover ? (
        <Image
          src={cover}
          alt=""
          fill
          unoptimized
          sizes={variant === "thumb" ? "80px" : "(max-width: 512px) 100vw, 512px"}
          className="object-cover"
        />
      ) : (
        <div className="flex h-full items-center justify-center font-mono text-[10px] text-cm-ink-muted">
          {variant === "thumb" ? "No photo" : "Χωρίς φωτό"}
        </div>
      )}
      {photoCount > 1 ? (
        <span className="absolute right-1.5 bottom-1.5 inline-flex items-center gap-0.5 rounded-full bg-black/70 px-2 py-0.5 font-mono text-[10px] font-bold text-white">
          <Images className="size-3" aria-hidden="true" />
          {photoCount}
        </span>
      ) : null}
    </button>
  );

  if (variant === "hero") {
    return (
      <div className="overflow-hidden rounded-2xl border border-cm-light-border-strong bg-white">
        {trigger}
        {expanded ? (
          <div className="px-4 pb-4">
            <DepotMobileContainerGalleryPanel container={container} showDetails={showDetails} />
          </div>
        ) : (
          <div className="px-4 py-3">
            <p className="font-mono text-sm font-bold">{container.containerNumber}</p>
            <p className="text-sm text-cm-ink-sub">
              {containerTypeById[container.containerType]?.name.el ?? container.containerType} ·
              Grade {container.grade}
            </p>
            {photoCount > 0 ? (
              <p className="mt-1 text-xs text-cm-accent">Πάτα την εικόνα για όλες τις φωτό</p>
            ) : null}
          </div>
        )}
      </div>
    );
  }

  return trigger;
}
