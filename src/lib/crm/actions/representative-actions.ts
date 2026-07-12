/**
 * @file representative-actions.ts
 * @description CRM server actions for depot representatives
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

"use server";

import { revalidatePath } from "next/cache";
import { notFound } from "next/navigation";
import { isDepotEnabled } from "@/lib/depot/config";
import {
  countRepresentativeActiveOut,
  countRepresentativeDispatches,
  getDepotRepresentativeById,
  readCrmRepresentativesPaginated,
  readRepresentativeDispatchesPaginated,
  addDepotRepresentative,
  updateDepotRepresentative,
} from "@/lib/depot/repository/depot-store";
import type { DepotRepresentativeProfile } from "@/lib/depot/representative-profile";
import {
  parseRepresentativeInput,
  parseRepresentativeUpdate,
} from "@/lib/depot/representative-form";
import { requireCrmSession } from "@/lib/crm/auth";
import { parsePageParam } from "@/lib/crm/pagination";

function revalidateRepresentatives(id?: string) {
  revalidatePath("/admin/representatives");
  if (id) revalidatePath(`/admin/representatives/${id}`);
  revalidatePath("/depot");
  revalidatePath("/depot/dispatch");
}

function ensureDepotEnabled() {
  if (!isDepotEnabled()) notFound();
}

export async function loadCrmRepresentativesPaginated(page?: string) {
  await requireCrmSession();
  ensureDepotEnabled();
  return readCrmRepresentativesPaginated(parsePageParam(page));
}

export async function loadCrmRepresentativeProfile(
  id: string,
  page?: string,
): Promise<DepotRepresentativeProfile | null> {
  await requireCrmSession();
  ensureDepotEnabled();

  const safePage = parsePageParam(page);
  const [representative, dispatchSlice, totalDispatches, activeOutCount] = await Promise.all([
    getDepotRepresentativeById(id),
    readRepresentativeDispatchesPaginated(id, safePage),
    countRepresentativeDispatches(id),
    countRepresentativeActiveOut(id),
  ]);

  if (!representative) return null;

  return {
    representative,
    dispatchSlice,
    totalDispatches,
    activeOutCount,
  };
}

export async function createRepresentativeAction(formData: FormData) {
  await requireCrmSession();
  ensureDepotEnabled();

  const parsed = parseRepresentativeInput(formData);
  if ("error" in parsed) return { error: parsed.error };

  try {
    const representative = await addDepotRepresentative(parsed.data);
    revalidateRepresentatives(representative.id);
    return { ok: true as const, id: representative.id };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Αποτυχία αποθήκευσης.";
    return { error: message };
  }
}

export async function updateRepresentativeAction(id: string, formData: FormData) {
  await requireCrmSession();
  ensureDepotEnabled();

  const parsed = parseRepresentativeUpdate(formData);
  if ("error" in parsed) return { error: parsed.error };

  try {
    await updateDepotRepresentative(id, parsed.data);
    revalidateRepresentatives(id);
    return { ok: true as const };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Αποτυχία ενημέρωσης.";
    return { error: message };
  }
}
