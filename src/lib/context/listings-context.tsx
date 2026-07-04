/**
 * @file listings-context.tsx
 * @description Client context for listings passed from server (Supabase-aware home)
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

"use client";

import { getAllListings } from "@/lib/data/listings";
import type { Listing } from "@/lib/types/listing";
import { createContext, useContext, useMemo, type ReactNode } from "react";

type ListingsContextValue = {
  listings: Listing[];
};

const ListingsContext = createContext<ListingsContextValue | null>(null);

type ListingsProviderProps = {
  listings?: Listing[];
  children: ReactNode;
};

export function ListingsProvider({ listings, children }: ListingsProviderProps) {
  const value = useMemo(
    () => ({ listings: listings ?? getAllListings() }),
    [listings],
  );

  return <ListingsContext.Provider value={value}>{children}</ListingsContext.Provider>;
}

export function useListings(): Listing[] {
  const context = useContext(ListingsContext);
  return context?.listings ?? getAllListings();
}

export function useListingBySlug(slug: string): Listing | undefined {
  const listings = useListings();
  return listings.find((listing) => listing.slug === slug);
}
