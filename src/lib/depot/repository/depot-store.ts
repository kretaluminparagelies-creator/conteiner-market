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
  DepotDispatch,
  DepotDispatchInput,
  DepotIntakeInput,
  DepotRepresentative,
  DepotRepresentativeInput,
  DepotRepresentativeUpdate,
} from "@/lib/depot/types";
import {
  createDepotContainerInSupabase,
  createDepotDispatchInSupabase,
  createDepotRepresentativeInSupabase,
  fetchAllDepotRepresentativesFromSupabase,
  fetchDepotContainersFromSupabase,
  fetchDepotDispatchesFromSupabase,
  fetchDepotRepresentativeByIdFromSupabase,
  fetchDepotRepresentativesFromSupabase,
  returnDepotContainerToAvailableInSupabase,
  updateDepotRepresentativeInSupabase,
} from "@/lib/depot/repository/supabase-depot";
import { isSupabaseAdminConfigured } from "@/lib/supabase/env";

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
  const representative = file.representatives.find((item) => item.id === input.representativeId);

  if (!container || !representative) {
    throw new Error("Μη έγκυρο κοντέινερ ή αντιπρόσωπος.");
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
  const containers = await listDepotContainers();
  return containers.find((item) => item.id === id) ?? null;
}

export async function listDepotDispatches(): Promise<DepotDispatch[]> {
  if (isSupabaseAdminConfigured()) {
    return fetchDepotDispatchesFromSupabase();
  }
  const file = await readDepotFile();
  return file.dispatches;
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
