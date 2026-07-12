/**
 * @file CrmListingsFilterTabs.tsx
 * @description Filter tabs for active listings (CRM)
 */

import Link from "next/link";

type ListingsFilter = "offers" | "rent" | null;

type CrmListingsFilterTabsProps = {
  active: ListingsFilter;
  counts: {
    all: number;
    offers: number;
    rent: number;
  };
};

const tabs: { key: ListingsFilter; label: string; href: string }[] = [
  { key: null, label: "Όλες", href: "/admin/listings" },
  { key: "offers", label: "Ειδικές προσφορές", href: "/admin/listings?filter=offers" },
  { key: "rent", label: "Ενοικίαση", href: "/admin/listings?filter=rent" },
];

export function CrmListingsFilterTabs({ active, counts }: CrmListingsFilterTabsProps) {
  const countFor = (key: ListingsFilter) => {
    if (key === "offers") return counts.offers;
    if (key === "rent") return counts.rent;
    return counts.all;
  };

  return (
    <div className="flex flex-wrap gap-2">
      {tabs.map((tab) => {
        const isActive = active === tab.key;
        const count = countFor(tab.key);

        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={[
              "inline-flex items-center gap-2 rounded-lg border px-3 py-2 font-display text-sm font-semibold transition-colors",
              isActive
                ? "border-cm-accent/40 bg-cm-accent/10 text-cm-accent"
                : "border-cm-border bg-cm-card/50 text-cm-ink-sub hover:border-cm-accent/30 hover:text-cm-ink",
            ].join(" ")}
          >
            {tab.label}
            {count > 0 ? (
              <span
                className={[
                  "rounded-full px-2 py-0.5 font-mono text-[10px]",
                  isActive ? "bg-cm-accent/20 text-cm-accent" : "bg-cm-surf text-cm-muted",
                ].join(" ")}
              >
                {count}
              </span>
            ) : null}
          </Link>
        );
      })}
    </div>
  );
}
