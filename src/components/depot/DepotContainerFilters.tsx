/**
 * @file DepotContainerFilters.tsx
 * @description Shared filters for depot container lists
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

"use client";

import { depotGradeOptions, depotTypeOptions } from "@/lib/depot/intake-options";

export type DepotContainerFilterState = {
  query: string;
  containerType: string;
  grade: string;
  maxSalePrice: string;
};

export const emptyDepotContainerFilters: DepotContainerFilterState = {
  query: "",
  containerType: "",
  grade: "",
  maxSalePrice: "",
};

const fieldClass =
  "w-full rounded-xl border border-cm-light-border-strong bg-white px-3 py-2.5 text-sm text-cm-ink outline-none focus:border-cm-accent/50";

type DepotContainerFiltersProps = {
  value: DepotContainerFilterState;
  onChange: (value: DepotContainerFilterState) => void;
  searchPlaceholder?: string;
};

export function DepotContainerFilters({
  value,
  onChange,
  searchPlaceholder = "Αναζήτηση αριθμού...",
}: DepotContainerFiltersProps) {
  const patch = (partial: Partial<DepotContainerFilterState>) => {
    onChange({ ...value, ...partial });
  };

  return (
    <div className="grid gap-3 rounded-2xl border border-cm-light-border-strong bg-white p-4">
      <input
        type="search"
        placeholder={searchPlaceholder}
        value={value.query}
        onChange={(event) => patch({ query: event.target.value })}
        className={fieldClass}
      />

      <div className="grid grid-cols-2 gap-2">
        <select
          value={value.containerType}
          onChange={(event) => patch({ containerType: event.target.value })}
          className={fieldClass}
        >
          <option value="">Όλοι οι τύποι</option>
          {depotTypeOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <select
          value={value.grade}
          onChange={(event) => patch({ grade: event.target.value })}
          className={fieldClass}
        >
          <option value="">Όλα τα grades</option>
          {depotGradeOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.value}
            </option>
          ))}
        </select>
      </div>

      <input
        type="number"
        min="0"
        placeholder="Μέγ. τιμή πώλησης"
        value={value.maxSalePrice}
        onChange={(event) => patch({ maxSalePrice: event.target.value })}
        className={fieldClass}
      />
    </div>
  );
}
