/**
 * @file listing-schema.ts
 * @description Detect Supabase listings schema (legacy vs extended history columns)
 */

import "server-only";

import { getSupabaseAdminClient } from "@/lib/supabase/server";
import type { ArchiveReason, ListingType, RentalLocation } from "@/lib/types/listing";

export type ListingSchemaMode = "legacy" | "extended";

let cachedMode: ListingSchemaMode | null = null;
let cachedRentalLocationColumn: boolean | null = null;
let cachedRentalContractColumn: boolean | null = null;

const EXTENDED_LISTING_COLUMNS_BASE =
  "id, slug, type, container_number, condition, condition_en, price, price_formatted, unit, unit_en, location, location_en, listing_type, stock_condition, is_offer, image, images, description, description_en, active, archived_at, archive_reason";

const EXTENDED_ADMIN_COLUMNS_BASE =
  "id, slug, type, container_number, condition, price, price_formatted, unit, listing_type, stock_condition, is_offer, active, archived_at, archive_reason";

const RENTAL_LOCATION_SUFFIX = ", rental_location";

const RENTAL_CONTRACT_SUFFIX =
  ", rental_customer_name, rental_customer_phone, rental_customer_email, rental_customer_company, rental_customer_address, rental_customer_notes, rental_starts_at, rental_ends_at";

const LEGACY_LISTING_COLUMNS =
  "id, slug, type, condition, condition_en, price, price_formatted, unit, unit_en, location, location_en, listing_type, stock_condition, is_offer, image, images, description, description_en, active, created_at, updated_at";

const LEGACY_ADMIN_COLUMNS =
  "id, slug, type, condition, price, price_formatted, unit, listing_type, stock_condition, is_offer, active, created_at, updated_at";

const RENTAL_CONTRACT_WRITE_KEYS = [
  "rental_customer_name",
  "rental_customer_phone",
  "rental_customer_email",
  "rental_customer_company",
  "rental_customer_address",
  "rental_customer_notes",
  "rental_starts_at",
  "rental_ends_at",
] as const;

function isMissingExtendedColumnError(message: string): boolean {
  return (
    message.includes("container_number") ||
    message.includes("archived_at") ||
    message.includes("archive_reason")
  );
}

function isMissingRentalLocationError(message: string): boolean {
  return message.includes("rental_location");
}

function isMissingRentalContractError(message: string): boolean {
  return message.includes("rental_customer_name") || message.includes("rental_ends_at");
}

/** Probe once per process — extended columns exist after migration 20260705000000 */
export async function getListingSchemaMode(): Promise<ListingSchemaMode> {
  if (cachedMode) return cachedMode;

  try {
    const client = getSupabaseAdminClient();
    const { error } = await client.from("listings").select("container_number").limit(1);

    if (error && isMissingExtendedColumnError(error.message)) {
      cachedMode = "legacy";
      console.warn(
        "[supabase] Pending migration: run supabase/migrations/20260705000000_listing_history_fields.sql in Supabase SQL Editor (container number + history).",
      );
    } else {
      cachedMode = "extended";
    }
  } catch {
    cachedMode = "legacy";
  }

  return cachedMode;
}

export async function hasRentalLocationColumn(): Promise<boolean> {
  if (cachedRentalLocationColumn !== null) return cachedRentalLocationColumn;

  const mode = await getListingSchemaMode();
  if (mode === "legacy") {
    cachedRentalLocationColumn = false;
    return false;
  }

  try {
    const client = getSupabaseAdminClient();
    const { error } = await client.from("listings").select("rental_location").limit(1);
    if (error && isMissingRentalLocationError(error.message)) {
      cachedRentalLocationColumn = false;
      console.warn(
        "[supabase] Pending migration: run supabase/migrations/20260705010000_rental_location.sql in Supabase SQL Editor.",
      );
    } else {
      cachedRentalLocationColumn = true;
    }
  } catch {
    cachedRentalLocationColumn = false;
  }

  return cachedRentalLocationColumn;
}

export async function hasRentalContractColumn(): Promise<boolean> {
  if (cachedRentalContractColumn !== null) return cachedRentalContractColumn;

  const mode = await getListingSchemaMode();
  if (mode === "legacy") {
    cachedRentalContractColumn = false;
    return false;
  }

  try {
    const client = getSupabaseAdminClient();
    const { error } = await client.from("listings").select("rental_ends_at").limit(1);
    if (error && isMissingRentalContractError(error.message)) {
      cachedRentalContractColumn = false;
      console.warn(
        "[supabase] Pending migration: run supabase/migrations/20260705020000_rental_contract.sql in Supabase SQL Editor.",
      );
    } else {
      cachedRentalContractColumn = true;
    }
  } catch {
    cachedRentalContractColumn = false;
  }

  return cachedRentalContractColumn;
}

async function extendedColumnSuffixes(): Promise<string> {
  const withLocation = await hasRentalLocationColumn();
  const withContract = await hasRentalContractColumn();
  return `${withLocation ? RENTAL_LOCATION_SUFFIX : ""}${withContract ? RENTAL_CONTRACT_SUFFIX : ""}`;
}

export async function listingSelectColumns(kind: "full" | "admin"): Promise<string> {
  const mode = await getListingSchemaMode();
  if (mode === "legacy") {
    return kind === "admin" ? LEGACY_ADMIN_COLUMNS : LEGACY_LISTING_COLUMNS;
  }

  const suffix = await extendedColumnSuffixes();
  if (kind === "admin") {
    return `${EXTENDED_ADMIN_COLUMNS_BASE}${suffix}, created_at, updated_at`;
  }
  return `${EXTENDED_LISTING_COLUMNS_BASE}${suffix}, created_at, updated_at`;
}

export async function omitExtendedListingWriteFields<T extends Record<string, unknown>>(
  payload: T,
  mode: ListingSchemaMode,
): Promise<T> {
  const next = { ...payload };

  if (mode === "legacy") {
    delete next.container_number;
    delete next.archived_at;
    delete next.archive_reason;
    delete next.rental_location;
    for (const key of RENTAL_CONTRACT_WRITE_KEYS) delete next[key];
    return next;
  }

  if (!(await hasRentalLocationColumn())) {
    delete next.rental_location;
  }

  if (!(await hasRentalContractColumn())) {
    for (const key of RENTAL_CONTRACT_WRITE_KEYS) delete next[key];
  }

  return next;
}

export async function existingListingLookupColumns(): Promise<string> {
  const mode = await getListingSchemaMode();
  return mode === "extended" ? "id, slug, active, archive_reason" : "id, slug, active";
}

function rentalLocationWriteValue(
  archiveReason: ArchiveReason | string | null | undefined,
  rentalLocation?: RentalLocation | "",
): RentalLocation | null {
  if (archiveReason !== "rented" || !rentalLocation) return null;
  return rentalLocation;
}

function rentalContractClearPayload(withContract: boolean): Record<string, null> {
  if (!withContract) return {};
  return {
    rental_customer_name: null,
    rental_customer_phone: null,
    rental_customer_email: null,
    rental_customer_company: null,
    rental_customer_address: null,
    rental_customer_notes: null,
    rental_starts_at: null,
    rental_ends_at: null,
  };
}

export async function archivePayloadForUpdate(
  input: { active: boolean; rentalLocation?: RentalLocation | "" },
  existingRow: { active: boolean; archive_reason?: string | null },
): Promise<Record<string, string | null>> {
  const mode = await getListingSchemaMode();
  if (mode === "legacy") return {};

  const withRental = await hasRentalLocationColumn();
  const withContract = await hasRentalContractColumn();

  if (input.active) {
    return {
      archived_at: null,
      archive_reason: null,
      ...(withRental ? { rental_location: null } : {}),
      ...rentalContractClearPayload(withContract),
    };
  }

  if (existingRow.active) {
    const reason = (existingRow.archive_reason as ArchiveReason | null) ?? "withdrawn";
    const payload: Record<string, string | null> = {
      archived_at: new Date().toISOString(),
      archive_reason: reason,
    };
    if (withRental) {
      payload.rental_location = rentalLocationWriteValue(reason, input.rentalLocation);
    }
    return payload;
  }

  if (withRental && existingRow.archive_reason === "rented" && input.rentalLocation) {
    return { rental_location: input.rentalLocation };
  }

  return {};
}

export async function archivePayloadForArchiveAction(
  active: boolean,
  listingType: ListingType,
  archiveReason?: ArchiveReason,
  rentalLocation?: RentalLocation,
): Promise<Record<string, string | null>> {
  const mode = await getListingSchemaMode();
  if (mode === "legacy") return {};

  const withRental = await hasRentalLocationColumn();
  const withContract = await hasRentalContractColumn();

  if (active) {
    return {
      archived_at: null,
      archive_reason: null,
      ...(withRental ? { rental_location: null } : {}),
      ...rentalContractClearPayload(withContract),
    };
  }

  const reason = archiveReason ?? (listingType === "rent" ? "rented" : "sold");
  const payload: Record<string, string | null> = {
    archived_at: new Date().toISOString(),
    archive_reason: reason,
  };

  if (withRental) {
    payload.rental_location = rentalLocationWriteValue(reason, rentalLocation);
  }

  if (withContract && reason !== "rented") {
    Object.assign(payload, rentalContractClearPayload(true));
  }

  return payload;
}
