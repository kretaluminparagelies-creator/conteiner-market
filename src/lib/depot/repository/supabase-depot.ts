/**
 * @file supabase-depot.ts
 * @description Supabase persistence for depot inventory
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

import "server-only";

import { getSupabaseAdminClient } from "@/lib/supabase/server";
import { statusAfterDispatch, depotOutStatuses } from "@/lib/depot/status";
import {
  buildPaginatedResult,
  getPageRange,
  type PaginatedSlice,
} from "@/lib/crm/pagination";
import type {
  DepotContainer,
  DepotContainerUpdate,
  DepotDispatch,
  DepotDispatchInput,
  DepotIntakeInput,
  DepotRepresentative,
  DepotRepresentativeInput,
  DepotRepresentativeUpdate,
} from "@/lib/depot/types";

type DepotContainerRow = {
  id: string;
  container_number: string;
  container_type: string;
  grade: DepotContainer["grade"];
  status: DepotContainer["status"];
  sale_price: number | null;
  rent_price: number | null;
  notes: string | null;
  images: string[] | null;
  recorded_by: string | null;
  created_at: string;
  updated_at: string;
};

type DepotRepresentativeRow = {
  id: string;
  company_name: string;
  name: string;
  phone: string | null;
  email: string | null;
  afm: string | null;
  doy: string | null;
  address: string | null;
  city: string | null;
  postal_code: string | null;
  notes: string | null;
  active: boolean;
  created_at: string;
};

type DepotDispatchRow = {
  id: string;
  container_id: string;
  representative_id: string | null;
  recipient_label: string | null;
  dispatch_type: DepotDispatch["dispatchType"];
  sent_by_email: string | null;
  notes: string | null;
  created_at: string;
};

function mapContainer(row: DepotContainerRow): DepotContainer {
  return {
    id: row.id,
    containerNumber: row.container_number,
    containerType: row.container_type,
    grade: row.grade,
    status: row.status,
    salePrice: row.sale_price ?? undefined,
    rentPrice: row.rent_price ?? undefined,
    notes: row.notes ?? undefined,
    images: row.images ?? [],
    recordedBy: row.recorded_by ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapRepresentative(row: DepotRepresentativeRow): DepotRepresentative {
  const name = row.name?.trim() || "—";
  const companyName = row.company_name?.trim() || name;

  return {
    id: row.id,
    companyName,
    name,
    phone: row.phone ?? undefined,
    email: row.email ?? undefined,
    afm: row.afm ?? undefined,
    doy: row.doy ?? undefined,
    address: row.address ?? undefined,
    city: row.city ?? undefined,
    postalCode: row.postal_code ?? undefined,
    notes: row.notes ?? undefined,
    active: row.active,
    createdAt: row.created_at,
  };
}

function representativeInsertPayload(input: {
  companyName: string;
  name: string;
  phone?: string;
  email?: string;
  afm?: string;
  doy?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  notes?: string;
}) {
  return {
    company_name: input.companyName.trim(),
    name: input.name.trim(),
    phone: input.phone?.trim() || null,
    email: input.email?.trim() || null,
    afm: input.afm?.trim() || null,
    doy: input.doy?.trim() || null,
    address: input.address?.trim() || null,
    city: input.city?.trim() || null,
    postal_code: input.postalCode?.trim() || null,
    notes: input.notes?.trim() || null,
  };
}

function representativeUpdatePayload(update: DepotRepresentativeUpdate) {
  const payload: Record<string, unknown> = {};
  if (update.companyName !== undefined) payload.company_name = update.companyName.trim();
  if (update.name !== undefined) payload.name = update.name.trim();
  if (update.phone !== undefined) payload.phone = update.phone.trim() || null;
  if (update.email !== undefined) payload.email = update.email.trim() || null;
  if (update.afm !== undefined) payload.afm = update.afm.trim() || null;
  if (update.doy !== undefined) payload.doy = update.doy.trim() || null;
  if (update.address !== undefined) payload.address = update.address.trim() || null;
  if (update.city !== undefined) payload.city = update.city.trim() || null;
  if (update.postalCode !== undefined) payload.postal_code = update.postalCode.trim() || null;
  if (update.notes !== undefined) payload.notes = update.notes.trim() || null;
  if (update.active !== undefined) payload.active = update.active;
  return payload;
}

function mapDispatch(
  row: DepotDispatchRow,
  container?: DepotContainer,
  representative?: DepotRepresentative,
): DepotDispatch {
  return {
    id: row.id,
    containerId: row.container_id,
    representativeId: row.representative_id ?? undefined,
    recipientLabel: row.recipient_label ?? undefined,
    dispatchType: row.dispatch_type,
    sentByEmail: row.sent_by_email ?? undefined,
    notes: row.notes ?? undefined,
    createdAt: row.created_at,
    container,
    representative,
  };
}

export type CrmDepotTab = "available" | "out" | "offers";

const depotAvailableStatuses = ["available", "sent_offer"] as const;

export async function countDepotContainersByTabFromSupabase(
  tab: "available" | "out",
): Promise<number> {
  const client = getSupabaseAdminClient();
  const statuses = tab === "available" ? depotAvailableStatuses : depotOutStatuses;
  const { count, error } = await client
    .from("depot_containers")
    .select("*", { count: "exact", head: true })
    .in("status", statuses);

  if (error) throw new Error(error.message);
  return count ?? 0;
}

export async function countDepotOfferDispatchesFromSupabase(): Promise<number> {
  const client = getSupabaseAdminClient();
  const { count, error } = await client
    .from("depot_dispatches")
    .select("*", { count: "exact", head: true })
    .eq("dispatch_type", "offer");

  if (error) throw new Error(error.message);
  return count ?? 0;
}

export async function fetchDepotContainersPaginatedFromSupabase(
  tab: "available" | "out",
  page = 1,
): Promise<PaginatedSlice<DepotContainer>> {
  const client = getSupabaseAdminClient();
  const { from, to } = getPageRange(page);
  const statuses = tab === "available" ? depotAvailableStatuses : depotOutStatuses;

  const { data, count, error } = await client
    .from("depot_containers")
    .select("*", { count: "exact" })
    .in("status", statuses)
    .order(tab === "out" ? "updated_at" : "created_at", { ascending: false })
    .range(from, to);

  if (error) throw new Error(error.message);
  const items = (data as DepotContainerRow[]).map(mapContainer);
  return buildPaginatedResult(items, count ?? 0, page);
}

export async function fetchDepotOfferDispatchesPaginatedFromSupabase(
  page = 1,
): Promise<PaginatedSlice<DepotDispatch>> {
  const client = getSupabaseAdminClient();
  const { from, to } = getPageRange(page);

  const { data, count, error } = await client
    .from("depot_dispatches")
    .select("*, container:depot_containers(*), representative:depot_representatives(*)", {
      count: "exact",
    })
    .eq("dispatch_type", "offer")
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) throw new Error(error.message);
  const items = (data as DepotDispatchJoinedRow[]).map(mapJoinedDispatch);
  return buildPaginatedResult(items, count ?? 0, page);
}

export async function fetchDepotRepresentativesPaginatedFromSupabase(
  page = 1,
): Promise<PaginatedSlice<DepotRepresentative>> {
  const client = getSupabaseAdminClient();
  const { from, to } = getPageRange(page);

  const { data, count, error } = await client
    .from("depot_representatives")
    .select("*", { count: "exact" })
    .order("company_name", { ascending: true })
    .range(from, to);

  if (error) throw new Error(error.message);
  const items = (data as DepotRepresentativeRow[]).map(mapRepresentative);
  return buildPaginatedResult(items, count ?? 0, page);
}

export async function countRepresentativeDispatchesFromSupabase(
  representativeId: string,
): Promise<number> {
  const client = getSupabaseAdminClient();
  const { count, error } = await client
    .from("depot_dispatches")
    .select("*", { count: "exact", head: true })
    .eq("representative_id", representativeId);

  if (error) throw new Error(error.message);
  return count ?? 0;
}

export async function countRepresentativeActiveOutFromSupabase(
  representativeId: string,
): Promise<number> {
  const client = getSupabaseAdminClient();
  const { count, error } = await client
    .from("depot_dispatches")
    .select("container:depot_containers!inner(status)", { count: "exact", head: true })
    .eq("representative_id", representativeId)
    .eq("container.status", "with_rep_storage");

  if (error) throw new Error(error.message);
  return count ?? 0;
}

export async function fetchRepresentativeDispatchesPaginatedFromSupabase(
  representativeId: string,
  page = 1,
): Promise<PaginatedSlice<DepotDispatch>> {
  const client = getSupabaseAdminClient();
  const { from, to } = getPageRange(page);

  const { data, count, error } = await client
    .from("depot_dispatches")
    .select("*, container:depot_containers(*), representative:depot_representatives(*)", {
      count: "exact",
    })
    .eq("representative_id", representativeId)
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) throw new Error(error.message);
  const items = (data as DepotDispatchJoinedRow[]).map(mapJoinedDispatch);
  return buildPaginatedResult(items, count ?? 0, page);
}

export async function fetchDepotContainersFromSupabase(): Promise<DepotContainer[]> {
  const client = getSupabaseAdminClient();
  const { data, error } = await client
    .from("depot_containers")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return (data as DepotContainerRow[]).map(mapContainer);
}

export async function createDepotContainerInSupabase(input: DepotIntakeInput): Promise<DepotContainer> {
  const client = getSupabaseAdminClient();
  const { data, error } = await client
    .from("depot_containers")
    .insert({
      container_number: input.containerNumber.trim().toUpperCase(),
      container_type: input.containerType,
      grade: input.grade,
      status: "available",
      sale_price: input.salePrice ?? null,
      rent_price: input.rentPrice ?? null,
      notes: input.notes?.trim() || null,
      images: input.images,
      recorded_by: input.recordedBy ?? null,
    })
    .select("*")
    .single();

  if (error) throw new Error(error.message);
  return mapContainer(data as DepotContainerRow);
}

export async function fetchDepotRepresentativesFromSupabase(): Promise<DepotRepresentative[]> {
  const client = getSupabaseAdminClient();
  const { data, error } = await client
    .from("depot_representatives")
    .select("*")
    .eq("active", true)
    .order("name", { ascending: true });

  if (error) throw new Error(error.message);
  return (data as DepotRepresentativeRow[]).map(mapRepresentative);
}

export async function fetchAllDepotRepresentativesFromSupabase(): Promise<DepotRepresentative[]> {
  const client = getSupabaseAdminClient();
  const { data, error } = await client
    .from("depot_representatives")
    .select("*")
    .order("name", { ascending: true });

  if (error) throw new Error(error.message);
  return (data as DepotRepresentativeRow[]).map(mapRepresentative);
}

export async function fetchDepotRepresentativeByIdFromSupabase(
  id: string,
): Promise<DepotRepresentative | null> {
  const client = getSupabaseAdminClient();
  const { data, error } = await client
    .from("depot_representatives")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!data) return null;
  return mapRepresentative(data as DepotRepresentativeRow);
}

export async function createDepotRepresentativeInSupabase(
  input: DepotRepresentativeInput,
): Promise<DepotRepresentative> {
  const client = getSupabaseAdminClient();
  const { data, error } = await client
    .from("depot_representatives")
    .insert(representativeInsertPayload(input))
    .select("*")
    .single();

  if (error) throw new Error(error.message);
  return mapRepresentative(data as DepotRepresentativeRow);
}

export async function updateDepotRepresentativeInSupabase(
  id: string,
  update: DepotRepresentativeUpdate,
): Promise<DepotRepresentative> {
  const client = getSupabaseAdminClient();
  const payload = representativeUpdatePayload(update);
  if (Object.keys(payload).length === 0) {
    throw new Error("Δεν υπάρχουν αλλαγές προς αποθήκευση.");
  }

  const { data, error } = await client
    .from("depot_representatives")
    .update(payload)
    .eq("id", id)
    .select("*")
    .single();

  if (error) throw new Error(error.message);
  return mapRepresentative(data as DepotRepresentativeRow);
}

export async function createDepotDispatchInSupabase(
  input: DepotDispatchInput,
  sentByEmail?: string,
): Promise<DepotDispatch> {
  const recipientLabel = input.recipientLabel?.trim() || undefined;
  if (!input.representativeId && !recipientLabel) {
    throw new Error("Επίλεξε αντιπρόσωπο ή όνομα εξωτερικού παραλήπτη.");
  }

  const client = getSupabaseAdminClient();
  const nextStatus = statusAfterDispatch(input.dispatchType);

  if (nextStatus) {
    const { error: statusError } = await client
      .from("depot_containers")
      .update({ status: nextStatus, updated_at: new Date().toISOString() })
      .eq("id", input.containerId);

    if (statusError) throw new Error(statusError.message);
  } else {
    const { error: touchError } = await client
      .from("depot_containers")
      .update({ updated_at: new Date().toISOString() })
      .eq("id", input.containerId);

    if (touchError) throw new Error(touchError.message);
  }

  const { data, error } = await client
    .from("depot_dispatches")
    .insert({
      container_id: input.containerId,
      representative_id: input.representativeId ?? null,
      recipient_label: input.recipientLabel?.trim() || null,
      dispatch_type: input.dispatchType,
      sent_by_email: sentByEmail ?? null,
      notes: input.notes?.trim() || null,
    })
    .select("*")
    .single();

  if (error) throw new Error(error.message);

  const [containers, representatives] = await Promise.all([
    fetchDepotContainersFromSupabase(),
    fetchDepotRepresentativesFromSupabase(),
  ]);

  const container = containers.find((item) => item.id === input.containerId);
  const representative = input.representativeId
    ? representatives.find((item) => item.id === input.representativeId)
    : undefined;

  return mapDispatch(data as DepotDispatchRow, container, representative);
}

type DepotDispatchJoinedRow = DepotDispatchRow & {
  container: DepotContainerRow | DepotContainerRow[] | null;
  representative: DepotRepresentativeRow | DepotRepresentativeRow[] | null;
};

function firstJoinedRow<T>(value: T | T[] | null | undefined): T | undefined {
  if (value == null) return undefined;
  return Array.isArray(value) ? value[0] : value;
}

function mapJoinedDispatch(row: DepotDispatchJoinedRow): DepotDispatch {
  const container = firstJoinedRow(row.container);
  const representative = firstJoinedRow(row.representative);

  return mapDispatch(
    row,
    container ? mapContainer(container) : undefined,
    representative ? mapRepresentative(representative) : undefined,
  );
}

export async function fetchDepotOfferDispatchesFromSupabase(): Promise<DepotDispatch[]> {
  const client = getSupabaseAdminClient();
  const { data, error } = await client
    .from("depot_dispatches")
    .select("*, container:depot_containers(*), representative:depot_representatives(*)")
    .eq("dispatch_type", "offer")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return (data as DepotDispatchJoinedRow[]).map(mapJoinedDispatch);
}

export async function fetchDepotDispatchesFromSupabase(): Promise<DepotDispatch[]> {
  const client = getSupabaseAdminClient();
  const { data, error } = await client
    .from("depot_dispatches")
    .select("*, container:depot_containers(*), representative:depot_representatives(*)")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return (data as DepotDispatchJoinedRow[]).map(mapJoinedDispatch);
}

export async function updateDepotContainerInSupabase(
  id: string,
  update: DepotContainerUpdate,
): Promise<DepotContainer> {
  const client = getSupabaseAdminClient();
  const payload: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };

  if (update.containerNumber !== undefined) {
    payload.container_number = update.containerNumber.trim().toUpperCase();
  }
  if (update.containerType !== undefined) payload.container_type = update.containerType;
  if (update.grade !== undefined) payload.grade = update.grade;
  if (update.status !== undefined) payload.status = update.status;
  if (update.salePrice !== undefined) payload.sale_price = update.salePrice;
  if (update.rentPrice !== undefined) payload.rent_price = update.rentPrice;
  if (update.notes !== undefined) payload.notes = update.notes?.trim() || null;
  if (update.images !== undefined) payload.images = update.images;

  const { data, error } = await client
    .from("depot_containers")
    .update(payload)
    .eq("id", id)
    .select("*")
    .single();

  if (error) throw new Error(error.message);
  return mapContainer(data as DepotContainerRow);
}

export async function deleteDepotContainerInSupabase(id: string): Promise<void> {
  const client = getSupabaseAdminClient();
  const { error } = await client.from("depot_containers").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

export async function fetchDepotContainerByIdFromSupabase(
  id: string,
): Promise<DepotContainer | null> {
  const client = getSupabaseAdminClient();
  const { data, error } = await client
    .from("depot_containers")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!data) return null;
  return mapContainer(data as DepotContainerRow);
}

export async function returnDepotContainerToAvailableInSupabase(id: string): Promise<void> {
  const client = getSupabaseAdminClient();
  const { error } = await client
    .from("depot_containers")
    .update({ status: "available", updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) throw new Error(error.message);
}
