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
import { buildRepresentativeProfile } from "@/lib/depot/representative-profile";
import {
  parseRepresentativeInput,
  parseRepresentativeUpdate,
} from "@/lib/depot/representative-form";
import {
  addDepotRepresentative,
  getDepotRepresentativeById,
  listAllDepotRepresentatives,
  listDepotDispatches,
  updateDepotRepresentative,
} from "@/lib/depot/repository/depot-store";
import { requireCrmSession } from "@/lib/depot/auth";

function revalidateRepresentatives(id?: string) {
  revalidatePath("/admin/representatives");
  if (id) revalidatePath(`/admin/representatives/${id}`);
  revalidatePath("/depot");
  revalidatePath("/depot/dispatch");
}

function ensureDepotEnabled() {
  if (!isDepotEnabled()) notFound();
}

export async function loadCrmRepresentatives() {
  await requireCrmSession();
  ensureDepotEnabled();
  return listAllDepotRepresentatives();
}

export async function loadCrmRepresentativeProfile(id: string) {
  await requireCrmSession();
  ensureDepotEnabled();

  const [representative, dispatches] = await Promise.all([
    getDepotRepresentativeById(id),
    listDepotDispatches(),
  ]);

  if (!representative) return null;
  return buildRepresentativeProfile(representative, dispatches);
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
