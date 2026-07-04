/**
 * @file admin-dashboard.ts
 * @description Lightweight dashboard stats — count queries instead of full row scans
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

import "server-only";

import { cache } from "react";
import { countLeadsByStatus as countMockLeadsByStatus } from "@/lib/crm/mock-leads";
import { isSupabaseAdminConfigured } from "@/lib/supabase/env";
import { getSupabaseAdminClient } from "@/lib/supabase/server";
import { readListingsFromDisk } from "@/lib/repositories/listing-store";
import { resolveIsOffer } from "@/lib/utils/listing-carousel-filters";

export type AdminDashboardCounts = {
  activeListings: number;
  offerCount: number;
  rentCount: number;
  newLeadsCount: number;
};

async function readAdminDashboardCountsUncached(): Promise<AdminDashboardCounts> {
  if (!isSupabaseAdminConfigured()) {
    const listings = await readListingsFromDisk();
    const active = listings.filter((l) => l.active);
    return {
      activeListings: active.length,
      offerCount: active.filter((l) => resolveIsOffer(l)).length,
      rentCount: active.filter((l) => l.listingType === "rent").length,
      newLeadsCount: countMockLeadsByStatus("new"),
    };
  }

  const client = getSupabaseAdminClient();

  const [activeResult, offerResult, rentResult, newLeadsResult] = await Promise.all([
    client.from("listings").select("*", { count: "exact", head: true }).eq("active", true),
    client
      .from("listings")
      .select("*", { count: "exact", head: true })
      .eq("active", true)
      .eq("is_offer", true),
    client
      .from("listings")
      .select("*", { count: "exact", head: true })
      .eq("active", true)
      .eq("listing_type", "rent"),
    client.from("leads").select("*", { count: "exact", head: true }).eq("status", "new"),
  ]);

  for (const result of [activeResult, offerResult, rentResult, newLeadsResult]) {
    if (result.error) {
      throw new Error(result.error.message);
    }
  }

  return {
    activeListings: activeResult.count ?? 0,
    offerCount: offerResult.count ?? 0,
    rentCount: rentResult.count ?? 0,
    newLeadsCount: newLeadsResult.count ?? 0,
  };
}

export const readAdminDashboardCounts = cache(readAdminDashboardCountsUncached);
