/**
 * @file expiring-rentals.ts
 * @description Active rentals expiring within 30 days or already expired
 */

import "server-only";

import { cache } from "react";
import { getRentalContractStatus } from "@/lib/crm/rental-contract";
import {
  buildPaginatedResult,
  getPageRange,
  paginateSlice,
  parsePageParam,
  type PaginatedSlice,
} from "@/lib/crm/pagination";
import { readAdminActiveRentals } from "@/lib/repositories/listing-store";
import { isSupabaseAdminConfigured } from "@/lib/supabase/env";
import type { Listing } from "@/lib/types/listing";

function filterExpiringRentals(rentals: Listing[]): Listing[] {
  return rentals
    .filter((listing) => {
      const { status } = getRentalContractStatus(listing.rentalEndsAt);
      return status === "expiring" || status === "expired";
    })
    .sort((a, b) => (a.rentalEndsAt ?? "").localeCompare(b.rentalEndsAt ?? ""));
}

async function readExpiringRentalsUncached(): Promise<Listing[]> {
  const rentals = await readAdminActiveRentals();
  return filterExpiringRentals(rentals);
}

export const readExpiringRentals = cache(readExpiringRentalsUncached);

export async function readExpiringRentalsPaginated(page = 1): Promise<PaginatedSlice<Listing>> {
  const safePage = parsePageParam(String(page));

  if (isSupabaseAdminConfigured()) {
    try {
      const today = new Date();
      const in30 = new Date(today);
      in30.setDate(in30.getDate() + 30);
      const in30Iso = in30.toISOString().slice(0, 10);

      const client = (await import("@/lib/supabase/server")).getSupabaseAdminClient();
      const columns = await (
        await import("@/lib/supabase/listing-schema")
      ).listingSelectColumns("admin");
      const { from, to } = getPageRange(safePage);

      const { data, count, error } = await client
        .from("listings")
        .select(columns, { count: "exact" })
        .eq("active", false)
        .eq("archive_reason", "rented")
        .eq("listing_type", "rent")
        .not("rental_ends_at", "is", null)
        .lte("rental_ends_at", in30Iso)
        .order("rental_ends_at", { ascending: true })
        .range(from, to);

      if (error) throw new Error(error.message);

      const { listingAdminRowToListing } = await import("@/lib/supabase/listing-mapper");
      const items = (data ?? []).map((row) =>
        listingAdminRowToListing(row as never),
      );
      return buildPaginatedResult(items, count ?? 0, safePage);
    } catch (error) {
      console.error("[expiring-rentals] Supabase paginated fetch failed, falling back:", error);
    }
  }

  return paginateSlice(await readExpiringRentalsUncached(), safePage);
}

export async function countExpiredRentals(): Promise<number> {
  const todayIso = new Date().toISOString().slice(0, 10);

  if (isSupabaseAdminConfigured()) {
    try {
      const client = (await import("@/lib/supabase/server")).getSupabaseAdminClient();
      const { count, error } = await client
        .from("listings")
        .select("*", { count: "exact", head: true })
        .eq("active", false)
        .eq("archive_reason", "rented")
        .eq("listing_type", "rent")
        .not("rental_ends_at", "is", null)
        .lt("rental_ends_at", todayIso);

      if (error) throw new Error(error.message);
      return count ?? 0;
    } catch (error) {
      console.error("[expiring-rentals] expired count failed, falling back:", error);
    }
  }

  const rentals = await readAdminActiveRentals();
  return rentals.filter((listing) => getRentalContractStatus(listing.rentalEndsAt).status === "expired")
    .length;
}

export async function countExpiringOnlyRentals(): Promise<number> {
  const todayIso = new Date().toISOString().slice(0, 10);
  const in30 = new Date();
  in30.setDate(in30.getDate() + 30);
  const in30Iso = in30.toISOString().slice(0, 10);

  if (isSupabaseAdminConfigured()) {
    try {
      const client = (await import("@/lib/supabase/server")).getSupabaseAdminClient();
      const { count, error } = await client
        .from("listings")
        .select("*", { count: "exact", head: true })
        .eq("active", false)
        .eq("archive_reason", "rented")
        .eq("listing_type", "rent")
        .gte("rental_ends_at", todayIso)
        .lte("rental_ends_at", in30Iso);

      if (error) throw new Error(error.message);
      return count ?? 0;
    } catch (error) {
      console.error("[expiring-rentals] expiring-only count failed, falling back:", error);
    }
  }

  const rentals = await readAdminActiveRentals();
  return rentals.filter((listing) => getRentalContractStatus(listing.rentalEndsAt).status === "expiring")
    .length;
}

export async function countExpiringRentals(): Promise<number> {
  if (isSupabaseAdminConfigured()) {
    try {
      const today = new Date();
      const in30 = new Date(today);
      in30.setDate(in30.getDate() + 30);
      const in30Iso = in30.toISOString().slice(0, 10);

      const client = (await import("@/lib/supabase/server")).getSupabaseAdminClient();
      const { count, error } = await client
        .from("listings")
        .select("*", { count: "exact", head: true })
        .eq("active", false)
        .eq("archive_reason", "rented")
        .eq("listing_type", "rent")
        .not("rental_ends_at", "is", null)
        .lte("rental_ends_at", in30Iso);

      if (error) throw new Error(error.message);
      return count ?? 0;
    } catch (error) {
      console.error("[expiring-rentals] Supabase count failed, falling back:", error);
    }
  }

  const rentals = await readExpiringRentals();
  return rentals.length;
}
