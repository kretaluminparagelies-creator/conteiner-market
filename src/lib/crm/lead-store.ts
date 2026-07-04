/**
 * @file lead-store.ts
 * @description Server-only leads access — Supabase or demo fallback
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

import "server-only";

import type { Lead, LeadStatus } from "@/lib/crm/types";
import { countLeadsByStatus as countMockLeadsByStatus, getMockLeads } from "@/lib/crm/mock-leads";
import { isSupabaseAdminConfigured } from "@/lib/supabase/env";
import { getSupabaseAdminClient, type LeadRow } from "@/lib/supabase/server";

function leadRowToLead(row: LeadRow): Lead {
  return {
    id: row.id,
    createdAt: row.created_at,
    name: row.name,
    email: row.email,
    phone: row.phone ?? undefined,
    message: row.message,
    source: row.source,
    status: row.status,
    listingSlug: row.listing_slug ?? undefined,
  };
}

export async function readLeads(): Promise<Lead[]> {
  if (!isSupabaseAdminConfigured()) {
    return getMockLeads();
  }

  try {
    const { data, error } = await getSupabaseAdminClient()
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    return (data ?? []).map((row) => leadRowToLead(row as LeadRow));
  } catch (error) {
    console.error("[lead-store] Supabase fetch failed, falling back to demo leads:", error);
    return getMockLeads();
  }
}

export async function countLeadsByStatus(status: LeadStatus): Promise<number> {
  if (!isSupabaseAdminConfigured()) {
    return countMockLeadsByStatus(status);
  }

  try {
    const { count, error } = await getSupabaseAdminClient()
      .from("leads")
      .select("*", { count: "exact", head: true })
      .eq("status", status);

    if (error) {
      throw new Error(error.message);
    }

    return count ?? 0;
  } catch (error) {
    console.error("[lead-store] Supabase count failed, falling back to demo leads:", error);
    return countMockLeadsByStatus(status);
  }
}
