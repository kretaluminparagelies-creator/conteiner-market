/**
 * @file depot-store.ts
 * @description Server-only depot persistence — Supabase or JSON fallback
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

import "server-only";

import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { statusAfterDispatch } from "@/lib/depot/status";
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
import { EXTERNAL_DISPATCH_RECIPIENT_LABEL } from "@/lib/depot/types";
import {
  countDepotContainersByTabFromSupabase,
  countDepotOfferDispatchesFromSupabase,
  createDepotContainerInSupabase,
  createDepotDispatchInSupabase,
  createDepotRepresentativeInSupabase,
  deleteDepotContainerInSupabase,
  fetchAllDepotRepresentativesFromSupabase,
  fetchDepotContainerByIdFromSupabase,
  fetchDepotContainersFromSupabase,
  fetchDepotContainersPaginatedFromSupabase,
  fetchDepotDispatchesFromSupabase,
  fetchDepotOfferDispatchesFromSupabase,
  fetchDepotOfferDispatchesPaginatedFromSupabase,
  fetchDepotRepresentativeByIdFromSupabase,
  fetchDepotRepresentativesFromSupabase,
  fetchDepotRepresentativesPaginatedFromSupabase,
  fetchRepresentativeDispatchesPaginatedFromSupabase,
  countRepresentativeDispatchesFromSupabase,
  countRepresentativeActiveOutFromSupabase,
  returnDepotContainerToAvailableInSupabase,
  updateDepotRepresentativeInSupabase,
  updateDepotContainerInSupabase,
  type CrmDepotTab,
} from "@/lib/depot/repository/supabase-depot";
import { isSupabaseAdminConfigured } from "@/lib/supabase/env";
import { filterAvailableContainers } from "@/lib/depot/filters";
import { isDepotOut } from "@/lib/depot/status";
import {
  paginateSlice,
  parsePageParam,
  type PaginatedSlice,
} from "@/lib/crm/pagination";

type DepotInventoryFile = {
  containers: DepotContainer[];
  representatives: DepotRepresentative[];
  dispatches: DepotDispatch[];
};

const depotPath = path.join(process.cwd(), "src/data/depot-inventory.json");

function normalizeRepresentative(rep: DepotRepresentative): DepotRepresentative {
  const name = rep.name?.trim() || "—";
  return {
    ...rep,
    name,
    companyName: rep.companyName?.trim() || name,
  };
}

async function readDepotFile(): Promise<DepotInventoryFile> {
  const raw = await readFile(depotPath, "utf-8");
  return JSON.parse(raw) as DepotInventoryFile;
}

async function writeDepotFile(data: DepotInventoryFile): Promise<void> {
  await writeFile(depotPath, `${JSON.stringify(data, null, 2)}\n`, "utf-8");
}

function representativeDispatchesFromFile(
  file: DepotInventoryFile,
  representativeId: string,
): DepotDispatch[] {
  return file.dispatches
    .filter((item) => item.representativeId === representativeId)
    .map((item) => ({
      ...item,
      container: file.containers.find((container) => container.id === item.containerId) ?? item.container,
      representative:
        file.representatives.find((rep) => rep.id === item.representativeId) ?? item.representative,
    }))
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function listDepotContainers(): Promise<DepotContainer[]> {
  if (isSupabaseAdminConfigured()) {
    return fetchDepotContainersFromSupabase();
  }
  const file = await readDepotFile();
  return file.containers;
}

export async function intakeDepotContainer(input: DepotIntakeInput): Promise<DepotContainer> {
  if (isSupabaseAdminConfigured()) {
    return createDepotContainerInSupabase(input);
  }

  const file = await readDepotFile();
  const now = new Date().toISOString();
  const container: DepotContainer = {
    id: randomUUID(),
    containerNumber: input.containerNumber.trim().toUpperCase(),
    containerType: input.containerType,
    grade: input.grade,
    status: "available",
    salePrice: input.salePrice,
    rentPrice: input.rentPrice,
    notes: input.notes?.trim() || undefined,
    images: input.images,
    recordedBy: input.recordedBy,
    createdAt: now,
    updatedAt: now,
  };

  file.containers.unshift(container);
  await writeDepotFile(file);
  return container;
}

export async function listDepotRepresentatives(): Promise<DepotRepresentative[]> {
  if (isSupabaseAdminConfigured()) {
    return fetchDepotRepresentativesFromSupabase();
  }
  const file = await readDepotFile();
  return file.representatives.filter((item) => item.active).map(normalizeRepresentative);
}

export async function listAllDepotRepresentatives(): Promise<DepotRepresentative[]> {
  if (isSupabaseAdminConfigured()) {
    return fetchAllDepotRepresentativesFromSupabase();
  }
  const file = await readDepotFile();
  return file.representatives.map(normalizeRepresentative);
}

export async function readCrmDepotTabCounts() {
  if (isSupabaseAdminConfigured()) {
    try {
      const [available, out, offers] = await Promise.all([
        countDepotContainersByTabFromSupabase("available"),
        countDepotContainersByTabFromSupabase("out"),
        countDepotOfferDispatchesFromSupabase(),
      ]);
      return { available, out, offers };
    } catch (error) {
      console.error("[depot-store] Supabase tab counts failed, falling back to JSON:", error);
    }
  }

  const file = await readDepotFile();
  const containers = file.containers;
  return {
    available: filterAvailableContainers(containers).length,
    out: containers.filter((item) => isDepotOut(item.status)).length,
    offers: file.dispatches.filter((item) => item.dispatchType === "offer").length,
  };
}

export async function readCrmDepotTabPaginated(
  tab: CrmDepotTab,
  page = 1,
): Promise<PaginatedSlice<DepotContainer | DepotDispatch>> {
  const safePage = parsePageParam(String(page));

  if (isSupabaseAdminConfigured()) {
    try {
      if (tab === "offers") {
        return await fetchDepotOfferDispatchesPaginatedFromSupabase(safePage);
      }
      return await fetchDepotContainersPaginatedFromSupabase(tab, safePage);
    } catch (error) {
      console.error("[depot-store] Supabase paginated depot tab failed, falling back to JSON:", error);
    }
  }

  const file = await readDepotFile();
  if (tab === "offers") {
    const dispatches = file.dispatches
      .filter((item) => item.dispatchType === "offer")
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    return paginateSlice(dispatches, safePage);
  }

  const containers =
    tab === "available"
      ? filterAvailableContainers(file.containers)
      : file.containers
          .filter((item) => isDepotOut(item.status))
          .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));

  return paginateSlice(containers, safePage);
}

export async function readCrmRepresentativesPaginated(
  page = 1,
): Promise<PaginatedSlice<DepotRepresentative>> {
  const safePage = parsePageParam(String(page));

  if (isSupabaseAdminConfigured()) {
    try {
      return await fetchDepotRepresentativesPaginatedFromSupabase(safePage);
    } catch (error) {
      console.error("[depot-store] Supabase paginated representatives failed, falling back to JSON:", error);
    }
  }

  const representatives = await listAllDepotRepresentatives();
  return paginateSlice(representatives, safePage);
}

export async function countRepresentativeDispatches(representativeId: string): Promise<number> {
  if (isSupabaseAdminConfigured()) {
    try {
      return await countRepresentativeDispatchesFromSupabase(representativeId);
    } catch (error) {
      console.error("[depot-store] Supabase representative dispatch count failed, falling back to JSON:", error);
    }
  }

  const file = await readDepotFile();
  return representativeDispatchesFromFile(file, representativeId).length;
}

export async function countRepresentativeActiveOut(representativeId: string): Promise<number> {
  if (isSupabaseAdminConfigured()) {
    try {
      return await countRepresentativeActiveOutFromSupabase(representativeId);
    } catch (error) {
      console.error("[depot-store] Supabase representative active-out count failed, falling back to JSON:", error);
    }
  }

  const file = await readDepotFile();
  return representativeDispatchesFromFile(file, representativeId).filter(
    (item) => item.container?.status === "with_rep_storage",
  ).length;
}

export async function readRepresentativeDispatchesPaginated(
  representativeId: string,
  page = 1,
): Promise<PaginatedSlice<DepotDispatch>> {
  const safePage = parsePageParam(String(page));

  if (isSupabaseAdminConfigured()) {
    try {
      return await fetchRepresentativeDispatchesPaginatedFromSupabase(representativeId, safePage);
    } catch (error) {
      console.error("[depot-store] Supabase representative dispatches paginated failed, falling back to JSON:", error);
    }
  }

  const file = await readDepotFile();
  return paginateSlice(representativeDispatchesFromFile(file, representativeId), safePage);
}

export async function getDepotRepresentativeById(id: string): Promise<DepotRepresentative | null> {
  if (isSupabaseAdminConfigured()) {
    return fetchDepotRepresentativeByIdFromSupabase(id);
  }
  const file = await readDepotFile();
  const found = file.representatives.find((item) => item.id === id);
  return found ? normalizeRepresentative(found) : null;
}

export async function addDepotRepresentative(
  input: DepotRepresentativeInput,
): Promise<DepotRepresentative> {
  if (isSupabaseAdminConfigured()) {
    return createDepotRepresentativeInSupabase(input);
  }

  const file = await readDepotFile();
  const representative: DepotRepresentative = {
    id: randomUUID(),
    companyName: input.companyName.trim(),
    name: input.name.trim(),
    phone: input.phone?.trim() || undefined,
    email: input.email?.trim() || undefined,
    afm: input.afm?.trim() || undefined,
    doy: input.doy?.trim() || undefined,
    address: input.address?.trim() || undefined,
    city: input.city?.trim() || undefined,
    postalCode: input.postalCode?.trim() || undefined,
    notes: input.notes?.trim() || undefined,
    active: true,
    createdAt: new Date().toISOString(),
  };

  file.representatives.push(representative);
  await writeDepotFile(file);
  return representative;
}

export async function updateDepotRepresentative(
  id: string,
  update: DepotRepresentativeUpdate,
): Promise<DepotRepresentative> {
  if (isSupabaseAdminConfigured()) {
    return updateDepotRepresentativeInSupabase(id, update);
  }

  const file = await readDepotFile();
  const representative = file.representatives.find((item) => item.id === id);
  if (!representative) throw new Error("Ο αντιπρόσωπος δεν βρέθηκε.");

  if (update.companyName !== undefined) representative.companyName = update.companyName.trim();
  if (update.name !== undefined) representative.name = update.name.trim();
  if (update.phone !== undefined) representative.phone = update.phone.trim() || undefined;
  if (update.email !== undefined) representative.email = update.email.trim() || undefined;
  if (update.afm !== undefined) representative.afm = update.afm.trim() || undefined;
  if (update.doy !== undefined) representative.doy = update.doy.trim() || undefined;
  if (update.address !== undefined) representative.address = update.address.trim() || undefined;
  if (update.city !== undefined) representative.city = update.city.trim() || undefined;
  if (update.postalCode !== undefined) representative.postalCode = update.postalCode.trim() || undefined;
  if (update.notes !== undefined) representative.notes = update.notes.trim() || undefined;
  if (update.active !== undefined) representative.active = update.active;

  await writeDepotFile(file);
  return representative;
}

export async function dispatchDepotContainer(
  input: DepotDispatchInput,
  sentByEmail?: string,
): Promise<DepotDispatch> {
  if (isSupabaseAdminConfigured()) {
    return createDepotDispatchInSupabase(input, sentByEmail);
  }

  const file = await readDepotFile();
  const container = file.containers.find((item) => item.id === input.containerId);
  const representative = input.representativeId
    ? file.representatives.find((item) => item.id === input.representativeId)
    : undefined;
  const recipientLabel = input.recipientLabel?.trim() || undefined;

  if (!container) {
    throw new Error("Μη έγκυρο κοντέινερ.");
  }
  if (!representative && !recipientLabel) {
    throw new Error("Επίλεξε αντιπρόσωπο ή όνομα εξωτερικού παραλήπτη.");
  }
  if (input.representativeId && !representative) {
    throw new Error("Μη έγκυρος αντιπρόσωπος.");
  }

  const nextStatus = statusAfterDispatch(input.dispatchType);
  if (nextStatus) {
    container.status = nextStatus;
  }
  container.updatedAt = new Date().toISOString();

  const dispatch: DepotDispatch = {
    id: randomUUID(),
    containerId: input.containerId,
    representativeId: input.representativeId,
    recipientLabel: representative ? undefined : recipientLabel ?? EXTERNAL_DISPATCH_RECIPIENT_LABEL,
    dispatchType: input.dispatchType,
    sentByEmail,
    notes: input.notes?.trim() || undefined,
    createdAt: new Date().toISOString(),
    container,
    representative,
  };

  file.dispatches.unshift(dispatch);
  await writeDepotFile(file);
  return dispatch;
}

export async function getDepotContainerById(id: string): Promise<DepotContainer | null> {
  if (isSupabaseAdminConfigured()) {
    return fetchDepotContainerByIdFromSupabase(id);
  }
  const containers = await listDepotContainers();
  return containers.find((item) => item.id === id) ?? null;
}

export async function updateDepotContainer(
  id: string,
  update: DepotContainerUpdate,
): Promise<DepotContainer> {
  if (isSupabaseAdminConfigured()) {
    return updateDepotContainerInSupabase(id, update);
  }

  const file = await readDepotFile();
  const container = file.containers.find((item) => item.id === id);
  if (!container) throw new Error("Το κοντέινερ δεν βρέθηκε.");

  if (update.containerNumber !== undefined) {
    container.containerNumber = update.containerNumber.trim().toUpperCase();
  }
  if (update.containerType !== undefined) container.containerType = update.containerType;
  if (update.grade !== undefined) container.grade = update.grade;
  if (update.status !== undefined) container.status = update.status;
  if (update.salePrice !== undefined) container.salePrice = update.salePrice ?? undefined;
  if (update.rentPrice !== undefined) container.rentPrice = update.rentPrice ?? undefined;
  if (update.notes !== undefined) container.notes = update.notes?.trim() || undefined;
  if (update.images !== undefined) container.images = update.images;
  container.updatedAt = new Date().toISOString();

  await writeDepotFile(file);
  return container;
}

export async function deleteDepotContainer(id: string): Promise<void> {
  if (isSupabaseAdminConfigured()) {
    await deleteDepotContainerInSupabase(id);
    return;
  }

  const file = await readDepotFile();
  const index = file.containers.findIndex((item) => item.id === id);
  if (index === -1) throw new Error("Το κοντέινερ δεν βρέθηκε.");

  file.containers.splice(index, 1);
  file.dispatches = file.dispatches.filter((item) => item.containerId !== id);
  await writeDepotFile(file);
}

export async function listDepotDispatches(): Promise<DepotDispatch[]> {
  if (isSupabaseAdminConfigured()) {
    return fetchDepotDispatchesFromSupabase();
  }
  const file = await readDepotFile();
  return file.dispatches;
}

export async function listDepotOfferDispatches(): Promise<DepotDispatch[]> {
  if (isSupabaseAdminConfigured()) {
    return fetchDepotOfferDispatchesFromSupabase();
  }
  const file = await readDepotFile();
  return file.dispatches.filter((item) => item.dispatchType === "offer");
}

export async function returnDepotContainerToDepot(id: string): Promise<void> {
  if (isSupabaseAdminConfigured()) {
    await returnDepotContainerToAvailableInSupabase(id);
    return;
  }

  const file = await readDepotFile();
  const container = file.containers.find((item) => item.id === id);
  if (!container) throw new Error("Το κοντέινερ δεν βρέθηκε.");
  container.status = "available";
  container.updatedAt = new Date().toISOString();
  await writeDepotFile(file);
}
