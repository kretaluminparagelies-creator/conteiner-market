/**
 * @file HeroSearchBar.tsx
 * @description Hero container finder — deal / size → /listings
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState, type FormEvent } from "react";
import { Search } from "lucide-react";
import { useListings } from "@/lib/context/listings-context";
import { getListingSizes } from "@/lib/utils/listing-filters";
import { useLocale } from "@/lib/i18n/locale-context";

const selectClass = [
  "w-full appearance-none rounded-[6px] border border-cm-border bg-cm-bg/70 px-3 py-2.5",
  "font-display text-sm text-cm-text outline-none transition-colors",
  "hover:border-cm-accent/60 focus:border-cm-accent",
].join(" ");

const labelClass = "mb-1.5 block font-mono text-[10px] tracking-[0.18em] text-cm-sub uppercase";

export function HeroSearchBar({ className }: { className?: string }) {
  const { t } = useLocale();
  const router = useRouter();

  const listings = useListings();
  const sizes = useMemo(() => getListingSizes(listings), [listings]);

  const [deal, setDeal] = useState("");
  const [size, setSize] = useState("");

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const params = new URLSearchParams();
    if (deal) params.set("deal", deal);
    if (size) params.set("size", size);
    if (deal === "rent") params.set("tab", "rent");
    const query = params.toString();
    router.push(query ? `/listings?${query}` : "/listings");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={[
        "flex h-full flex-col justify-center gap-4 rounded-xl border border-cm-border",
        "bg-cm-card/60 p-5 backdrop-blur-sm md:p-6",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="flex items-center gap-2">
        <span className="h-4 w-1 rounded-full bg-cm-accent" />
        <h2 className="font-display text-base font-bold tracking-[0.02em]">
          {t.heroSearch.title}
        </h2>
      </div>

      <div>
        <label htmlFor="hero-deal" className={labelClass}>
          {t.heroSearch.dealLabel}
        </label>
        <select
          id="hero-deal"
          value={deal}
          onChange={(event) => setDeal(event.target.value)}
          className={selectClass}
        >
          <option value="">{t.heroSearch.dealAll}</option>
          <option value="sale">{t.heroSearch.sale}</option>
          <option value="rent">{t.heroSearch.rent}</option>
        </select>
      </div>

      <div>
        <label htmlFor="hero-size" className={labelClass}>
          {t.heroSearch.sizeLabel}
        </label>
        <select
          id="hero-size"
          value={size}
          onChange={(event) => setSize(event.target.value)}
          className={selectClass}
        >
          <option value="">{t.heroSearch.sizeAll}</option>
          {sizes.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        className={[
          "mt-1 inline-flex items-center justify-center gap-2 rounded-[6px] bg-cm-accent",
          "px-5 py-3 font-display text-sm font-semibold text-white transition-all duration-200",
          "hover:bg-[#f08848] hover:-translate-y-0.5 active:translate-y-0",
        ].join(" ")}
      >
        <Search className="h-4 w-4" strokeWidth={2.2} />
        {t.heroSearch.submit}
      </button>
    </form>
  );
}
