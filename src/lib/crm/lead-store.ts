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
import {
  buildPaginatedResult,
  getPageRange,
  paginateSlice,
  parsePageParam,
  type PaginatedSlice,
} from "@/lib/crm/pagination";
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

export type LeadListingOption = {
  slug: string;
  label: string;
};

const LEAD_LISTING_SEARCH_LIMIT = 20;

function listingToLeadOption(listing: {
  slug: string;
  type: string;
  containerNumber?: string;
  active: boolean;
}): LeadListingOption {
  return {
    slug: listing.slug,
    label: [
      listing.type,
      listing.containerNumber ? `· ${listing.containerNumber}` : null,
      listing.active ? "(ενεργό)" : "(αρχείο)",
    ]
      .filter(Boolean)
      .join(" "),
  };
}

const leadListColumns =
  "id, name, email, phone, source, status, message, listing_slug, created_at";

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
    adminNotes: row.admin_notes?.trim() ? row.admin_notes : undefined,
  };
}

export type LeadsQuery = {
  page?: number;
  status?: LeadStatus | "";
  source?: LeadSource | "";
  query?: string;
};

function filterMockLeads(leads: Lead[], query: LeadsQuery): Lead[] {
  const q = query.query?.trim().toLowerCase();

  return leads.filter((lead) => {
    if (query.status && lead.status !== query.status) return false;
    if (query.source && lead.source !== query.source) return false;
    if (!q) return true;

    const haystack = [
      lead.name,
      lead.email,
      lead.phone,
      lead.message,
      lead.listingSlug,
      lead.adminNotes,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return haystack.includes(q);
  });
}

export async function countAllLeads(): Promise<number> {
  if (!isSupabaseAdminConfigured()) {
    return getMockLeads().length;
  }

  try {
    const { count, error } = await getSupabaseAdminClient()
      .from("leads")
      .select("*", { count: "exact", head: true });

    if (error) throw new Error(error.message);
    return count ?? 0;
  } catch (error) {
    console.error("[lead-store] Supabase count all failed, falling back to demo leads:", error);
    return getMockLeads().length;
  }
}

export async function readLeadsPaginated(query: LeadsQuery = {}): Promise<PaginatedSlice<Lead>> {
  const page = parsePageParam(query.page ? String(query.page) : "1");

  if (!isSupabaseAdminConfigured()) {
    const filtered = filterMockLeads(getMockLeads(), query);
    return paginateSlice(filtered, page);
  }

  try {
    const client = getSupabaseAdminClient();
    const { from, to } = getPageRange(page);
    let request = client
      .from("leads")
      .select(leadListColumns, { count: "exact" })
      .order("created_at", { ascending: false });

    if (query.status) {
      request = request.eq("status", query.status);
    }
    if (query.source) {
      request = request.eq("source", query.source);
    }
    if (query.query?.trim()) {
      const needle = `%${query.query.trim()}%`;
      request = request.or(
        [
          `name.ilike.${needle}`,
          `email.ilike.${needle}`,
          `phone.ilike.${needle}`,
          `message.ilike.${needle}`,
          `listing_slug.ilike.${needle}`,
        ].join(","),
      );
    }

    const { data, count, error } = await request.range(from, to);
    if (error) throw new Error(error.message);

    const items = (data ?? []).map((row) => leadRowToLead(row as LeadRow));
    return buildPaginatedResult(items, count ?? 0, page);
  } catch (error) {
    console.error("[lead-store] Supabase paginated fetch failed, falling back to demo leads:", error);
    const filtered = filterMockLeads(getMockLeads(), query);
    return paginateSlice(filtered, page);
  }
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

export async function updateLeadAdminNotes(id: string, adminNotes: string): Promise<Lead> {
  if (!isSupabaseAdminConfigured()) {
    throw new Error("Lead updates require Supabase service role.");
  }

  const { data, error } = await getSupabaseAdminClient()
    .from("leads")
    .update({ admin_notes: adminNotes.trim(), updated_at: new Date().toISOString() })
    .eq("id", id)
    .select("*")
    .single();

  if (error) {
    throw new Error(`Supabase lead notes update failed: ${error.message}`);
  }

  return leadRowToLead(data as LeadRow);
}

export async function updateLeadListingSlug(id: string, listingSlug: string | null): Promise<Lead> {
  if (!isSupabaseAdminConfigured()) {
    throw new Error("Lead updates require Supabase service role.");
  }

  const slug = listingSlug?.trim() || null;

  if (slug) {
    const { data: listing, error: listingError } = await getSupabaseAdminClient()
      .from("listings")
      .select("slug")
      .eq("slug", slug)
      .maybeSingle();

    if (listingError) {
      throw new Error(`Listing lookup failed: ${listingError.message}`);
    }
    if (!listing) {
      throw new Error("Η καταχώριση δεν βρέθηκε.");
    }
  }

  const { data, error } = await getSupabaseAdminClient()
    .from("leads")
    .update({ listing_slug: slug, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select("*")
    .single();

  if (error) {
    throw new Error(`Supabase lead listing update failed: ${error.message}`);
  }

  return leadRowToLead(data as LeadRow);
}

export async function readLeadListingOptionBySlug(slug: string): Promise<LeadListingOption | null> {
  const trimmed = slug.trim();
  if (!trimmed) return null;

  const { readAdminListingBySlug } = await import("@/lib/repositories/listing-store");
  const listing = await readAdminListingBySlug(trimmed);
  return listing ? listingToLeadOption(listing) : null;
}

export async function searchLeadListingOptions(query: string): Promise<LeadListingOption[]> {
  const trimmed = query.trim();
  if (trimmed.length < 2) return [];

  if (isSupabaseAdminConfigured()) {
    const needle = `%${trimmed}%`;
    const { data, error } = await getSupabaseAdminClient()
      .from("listings")
      .select("slug, type, container_number, active")
      .or(`container_number.ilike.${needle},type.ilike.${needle},slug.ilike.${needle}`)
      .order("type", { ascending: true })
      .limit(LEAD_LISTING_SEARCH_LIMIT);

    if (error) {
      throw new Error(`Lead listing search failed: ${error.message}`);
    }

    return (data ?? []).map((row) =>
      listingToLeadOption({
        slug: row.slug,
        type: row.type,
        containerNumber: row.container_number ?? undefined,
        active: row.active,
      }),
    );
  }

  const { readAdminListings, readAdminHistoryListings } = await import(
    "@/lib/repositories/listing-store"
  );
  const lower = trimmed.toLowerCase();
  const matches = (listing: {
    slug: string;
    type: string;
    containerNumber?: string;
    active: boolean;
  }) =>
    listing.type.toLowerCase().includes(lower) ||
    listing.slug.toLowerCase().includes(lower) ||
    (listing.containerNumber?.toLowerCase().includes(lower) ?? false);

  const combined = [...(await readAdminListings()), ...(await readAdminHistoryListings())];
  return combined.filter(matches).slice(0, LEAD_LISTING_SEARCH_LIMIT).map(listingToLeadOption);
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
