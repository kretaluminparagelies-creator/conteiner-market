/**
 * @file lead-store.ts
 * @description Server-only leads access — Supabase or demo fallback
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

import "server-only";

import { cache } from "react";
import type { Lead, LeadSource, LeadStatus } from "@/lib/crm/types";
import { countLeadsByStatus as countMockLeadsByStatus, getMockLeads } from "@/lib/crm/mock-leads";
import { isSupabaseAdminConfigured } from "@/lib/supabase/env";
import { getSupabaseAdminClient, type LeadRow } from "@/lib/supabase/server";

export type CreateLeadInput = {
  name: string;
  email: string;
  phone?: string;
  message: string;
  source: LeadSource;
  listingSlug?: string;
};

const leadListColumns = "id, name, email, source, status, message, created_at";

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

async function readLeadsUncached(): Promise<Lead[]> {
  if (!isSupabaseAdminConfigured()) {
    return getMockLeads();
  }

  try {
    const { data, error } = await getSupabaseAdminClient()
      .from("leads")
      .select(leadListColumns)
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

export const readLeads = cache(readLeadsUncached);

export async function readRecentLeads(limit: number): Promise<Lead[]> {
  if (!isSupabaseAdminConfigured()) {
    return getMockLeads().slice(0, limit);
  }

  try {
    const { data, error } = await getSupabaseAdminClient()
      .from("leads")
      .select(leadListColumns)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      throw new Error(error.message);
    }

    return (data ?? []).map((row) => leadRowToLead(row as LeadRow));
  } catch (error) {
    console.error("[lead-store] Supabase recent leads failed, falling back to demo:", error);
    return getMockLeads().slice(0, limit);
  }
}

export async function readLeadById(id: string): Promise<Lead | undefined> {
  if (!isSupabaseAdminConfigured()) {
    return getMockLeads().find((lead) => lead.id === id);
  }

  const { data, error } = await getSupabaseAdminClient()
    .from("leads")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw new Error(`Supabase lead fetch failed: ${error.message}`);
  }

  return data ? leadRowToLead(data as LeadRow) : undefined;
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

export async function updateLeadStatus(id: string, status: LeadStatus): Promise<Lead> {
  if (!isSupabaseAdminConfigured()) {
    throw new Error("Lead updates require Supabase service role.");
  }

  const { data, error } = await getSupabaseAdminClient()
    .from("leads")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select("*")
    .single();

  if (error) {
    throw new Error(`Supabase lead update failed: ${error.message}`);
  }

  return leadRowToLead(data as LeadRow);
}

export async function createLead(input: CreateLeadInput): Promise<Lead> {
  if (!isSupabaseAdminConfigured()) {
    throw new Error("Lead storage requires Supabase service role.");
  }

  const { data, error } = await getSupabaseAdminClient()
    .from("leads")
    .insert({
      name: input.name,
      email: input.email,
      phone: input.phone ?? null,
      message: input.message,
      source: input.source,
      listing_slug: input.listingSlug ?? null,
      status: "new",
    })
    .select("*")
    .single();

  if (error) {
    throw new Error(`Supabase lead create failed: ${error.message}`);
  }

  return leadRowToLead(data as LeadRow);
}
