/**
 * @file HeroSearchBar.tsx
 * @description Hero container finder — deal / container type → home carousel
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

"use client";

import { usePathname, useRouter } from "next/navigation";
import { useMemo, useState, type FormEvent } from "react";
import { Package, Search, Tags } from "lucide-react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { containerTypeGroups, getContainerTypeById } from "@/lib/constants/container-types";
import { useLocale } from "@/lib/i18n/locale-context";
import { navigateHomeCarouselSearch } from "@/lib/nav/navigate-offers-route";
import { cn } from "@/lib/utils";

const ALL = "all";

const labelClass =
  "mb-1.5 block font-mono text-[10px] tracking-[0.18em] text-cm-ink-muted uppercase";

const triggerClass = cn(
  "input-light h-auto min-h-[44px] w-full justify-between gap-2 px-3 py-2.5",
  "font-display text-sm text-cm-ink shadow-cm-light-xs",
  "data-placeholder:text-cm-ink-muted",
  "hover:border-cm-accent/35 hover:shadow-cm-light-sm",
  "focus-visible:border-cm-accent/50 focus-visible:ring-cm-accent/15",
  "data-popup-open:border-cm-accent/45 data-popup-open:shadow-cm-light-sm",
);

const contentClass = cn(
  "max-h-[min(24rem,60vh)] overflow-y-auto rounded-xl border-cm-light-border-strong p-1 shadow-cm-light-lg",
  "**:data-[slot=select-item]:rounded-lg",
);

const itemClass = cn(
  "items-start py-2.5 pl-2.5",
  "data-highlighted:bg-cm-light-bg data-highlighted:text-cm-ink",
  "[&[aria-selected=true]]:bg-cm-accent/10 [&[aria-selected=true]]:font-semibold [&[aria-selected=true]]:text-cm-accent",
  "[&_[data-slot=select-item-indicator]_svg]:text-cm-accent",
);

const groupLabelClass =
  "px-2.5 py-1.5 font-mono text-[9px] tracking-[0.16em] text-cm-ink-muted uppercase";

export function HeroSearchBar({ className }: { className?: string }) {
  const { t, locale } = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  const [deal, setDeal] = useState<string>(ALL);
  const [containerType, setContainerType] = useState<string>(ALL);

  const dealLabels: Record<string, string> = {
    [ALL]: t.heroSearch.dealAll,
    sale: t.heroSearch.sale,
    rent: t.heroSearch.rent,
  };

  const selectedType = containerType !== ALL ? getContainerTypeById(containerType) : null;

  const containerTypeLabel = useMemo(() => {
    if (!selectedType) return t.heroSearch.containerTypeAll;
    return locale === "en" ? selectedType.name.en : selectedType.name.el;
  }, [selectedType, locale, t.heroSearch.containerTypeAll]);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    navigateHomeCarouselSearch(
      {
        deal: deal === ALL ? undefined : (deal as "sale" | "rent"),
        containerType: containerType === ALL ? undefined : containerType,
        tab: deal === "rent" ? "rent" : undefined,
      },
      pathname,
      router.push,
    );
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={[
        "glass-light flex h-full flex-col justify-center gap-4 rounded-2xl p-5 md:p-6",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="flex items-center gap-2">
        <span className="h-4 w-1 rounded-full bg-cm-accent shadow-cm-accent" />
        <h2 className="font-display text-base font-bold tracking-[0.02em] text-cm-ink">
          {t.heroSearch.title}
        </h2>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="hero-deal" className={labelClass}>
          {t.heroSearch.dealLabel}
        </Label>
        <Select value={deal} onValueChange={(value) => setDeal(value ?? ALL)}>
          <SelectTrigger id="hero-deal" className={triggerClass}>
            <span className="flex min-w-0 items-center gap-2">
              <Tags className="size-4 shrink-0 text-cm-accent" aria-hidden="true" />
              <SelectValue placeholder={t.heroSearch.dealAll}>{dealLabels[deal]}</SelectValue>
            </span>
          </SelectTrigger>
          <SelectContent className={contentClass}>
            <SelectItem value={ALL} className={itemClass}>
              {t.heroSearch.dealAll}
            </SelectItem>
            <SelectItem value="sale" className={itemClass}>
              {t.heroSearch.sale}
            </SelectItem>
            <SelectItem value="rent" className={itemClass}>
              {t.heroSearch.rent}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="hero-container-type" className={labelClass}>
          {t.heroSearch.containerTypeLabel}
        </Label>
        <Select value={containerType} onValueChange={(value) => setContainerType(value ?? ALL)}>
          <SelectTrigger id="hero-container-type" className={triggerClass}>
            <span className="flex min-w-0 items-center gap-2">
              <Package className="size-4 shrink-0 text-cm-rent" aria-hidden="true" />
              <SelectValue placeholder={t.heroSearch.containerTypeAll}>
                {containerTypeLabel}
              </SelectValue>
            </span>
          </SelectTrigger>
          <SelectContent className={contentClass}>
            <SelectItem value={ALL} className={itemClass}>
              <span className="font-display text-sm">{t.heroSearch.containerTypeAll}</span>
            </SelectItem>
            {containerTypeGroups.map((group) => (
              <SelectGroup key={group.label.el}>
                <SelectLabel className={groupLabelClass}>
                  {locale === "en" ? group.label.en : group.label.el}
                </SelectLabel>
                {group.ids.map((id) => {
                  const spec = getContainerTypeById(id);
                  if (!spec) return null;
                  const name = locale === "en" ? spec.name.en : spec.name.el;
                  const summary =
                    locale === "en" ? spec.shortDescription.en : spec.shortDescription.el;

                  return (
                    <SelectItem key={id} value={id} className={itemClass}>
                      <span className="flex min-w-0 flex-col gap-0.5 text-left">
                        <span className="font-display text-sm leading-tight">{name}</span>
                        <span className="font-mono text-[10px] leading-snug text-cm-ink-muted">
                          ISO {spec.isoCode} · {summary}
                        </span>
                      </span>
                    </SelectItem>
                  );
                })}
              </SelectGroup>
            ))}
          </SelectContent>
        </Select>
      </div>

      <button
        type="submit"
        className={[
          "mt-1 inline-flex items-center justify-center gap-2 rounded-lg bg-cm-accent",
          "px-5 py-3 font-display text-sm font-semibold text-white transition-all duration-200",
          "shadow-cm-accent hover:bg-[#f08848] hover:-translate-y-0.5 active:translate-y-0",
        ].join(" ")}
      >
        <Search className="h-4 w-4" strokeWidth={2.2} />
        {t.heroSearch.submit}
      </button>
    </form>
  );
}
