/**
 * @file server.ts
 * @description Supabase clients for server-side reads and CRM admin
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

import "server-only";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import {
  getSupabaseAnonKey,
  getSupabaseServiceRoleKey,
  getSupabaseUrl,
  isSupabaseAdminConfigured,
  isSupabaseReadConfigured,
} from "@/lib/supabase/env";

export type ListingRow = {
  id: string;
  slug: string;
  type: string;
  condition: string;
  condition_en: string | null;
  price: number;
  price_formatted: string;
  unit: string | null;
  unit_en: string | null;
  location: string;
  location_en: string | null;
  listing_type: "sale" | "rent";
  stock_condition: "new" | "used";
  is_offer: boolean;
  image: string;
  images: string[] | null;
  description: string;
  description_en: string | null;
  active: boolean;
  created_at: string;
  updated_at: string;
};

export type ListingInsert = Omit<ListingRow, "id" | "created_at" | "updated_at"> & {
  id?: string;
  created_at?: string;
  updated_at?: string;
};

export type ListingUpdate = Partial<ListingInsert>;

export type LeadRow = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  source: "contact" | "buyback" | "rent" | "space" | "listing";
  status: "new" | "contacted" | "quoted" | "won" | "lost";
  listing_slug: string | null;
  created_at: string;
  updated_at: string;
};

export type LeadInsert = Omit<LeadRow, "id" | "created_at" | "updated_at"> & {
  id?: string;
  created_at?: string;
  updated_at?: string;
};

export type LeadUpdate = Partial<LeadInsert>;

let anonClient: SupabaseClient | null = null;
let adminClient: SupabaseClient | null = null;

export function getSupabaseAnonServerClient(): SupabaseClient {
  if (!isSupabaseReadConfigured()) {
    throw new Error("Supabase read env vars are not configured");
  }

  if (!anonClient) {
    anonClient = createClient(getSupabaseUrl()!, getSupabaseAnonKey()!, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }

  return anonClient;
}

export function getSupabaseAdminClient(): SupabaseClient {
  if (!isSupabaseAdminConfigured()) {
    throw new Error("Supabase service role is not configured");
  }

  if (!adminClient) {
    adminClient = createClient(getSupabaseUrl()!, getSupabaseServiceRoleKey()!, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }

  return adminClient;
}
