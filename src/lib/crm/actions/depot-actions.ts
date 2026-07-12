/**
 * @file depot-actions.ts
 * @description CRM server actions for depot inventory
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireCrmSession } from "@/lib/crm/auth";
import {
  compactIso6346FromDisplay,
  displayIso6346FromCompact,
  iso6346ContainerErrorMessage,
} from "@/lib/iso6346ContainerFormat";
import type { ListingType } from "@/lib/types/listing";
import { depotContainerToListingFormInput } from "@/lib/depot/depot-to-listing";
import type { DepotContainerStatus, DepotGrade } from "@/lib/depot/types";
import {
  deleteDepotContainer,
  getDepotContainerById,
  listDepotOfferDispatches,
  readCrmDepotTabCounts,
  readCrmDepotTabPaginated,
  returnDepotContainerToDepot,
  updateDepotContainer,
} from "@/lib/depot/repository/depot-store";
import type { CrmDepotTab } from "@/lib/depot/repository/supabase-depot";
import { parsePageParam } from "@/lib/crm/pagination";

function revalidateCrmDepot() {
  revalidatePath("/admin/depot");
  revalidatePath("/depot");
  revalidatePath("/depot/dispatch");
  revalidatePath("/depot/offers");
  revalidatePath("/depot/out");
}

function parseDepotTab(raw?: string): CrmDepotTab {
  if (raw === "out" || raw === "offers") return raw;
  return "available";
}

export async function loadCrmDepotPageData(query: { tab?: string; page?: string } = {}) {
  await requireCrmSession();
  const tab = parseDepotTab(query.tab);
  const page = parsePageParam(query.page);
  const [tabCounts, slice] = await Promise.all([
    readCrmDepotTabCounts(),
    readCrmDepotTabPaginated(tab, page),
  ]);

  return { tab, tabCounts, slice };
}

export async function loadCrmDepotContainerDetail(id: string) {
  await requireCrmSession();
  const container = await getDepotContainerById(id);
  if (!container) return null;

  const dispatches = (await listDepotOfferDispatches()).filter(
    (item) => item.containerId === id,
  );

  return { container, dispatches };
}

export async function loadListingDraftFromDepotContainer(
  containerId: string,
  options?: {
    active?: boolean;
    isOffer?: boolean;
    listingType?: ListingType;
  },
) {
  await requireCrmSession();
  const container = await getDepotContainerById(containerId);
  if (!container) return null;

  return depotContainerToListingFormInput(container, options);
}

export async function updateCrmDepotContainerAction(
  id: string,
  formData: FormData,
): Promise<{ error?: string }> {
  await requireCrmSession();

  const containerNumberRaw = String(formData.get("containerNumber") ?? "");
  const compact = compactIso6346FromDisplay(containerNumberRaw);
  if (!compact) {
    return { error: iso6346ContainerErrorMessage };
  }

  const salePriceRaw = String(formData.get("salePrice") ?? "").trim();
  const rentPriceRaw = String(formData.get("rentPrice") ?? "").trim();

  try {
    await updateDepotContainer(id, {
      containerNumber: displayIso6346FromCompact(compact),
      containerType: String(formData.get("containerType") ?? ""),
      grade: String(formData.get("grade") ?? "") as DepotGrade,
      status: String(formData.get("status") ?? "") as DepotContainerStatus,
      salePrice: salePriceRaw ? Number(salePriceRaw) : undefined,
      rentPrice: rentPriceRaw ? Number(rentPriceRaw) : undefined,
      notes: String(formData.get("notes") ?? ""),
    });
    revalidateCrmDepot();
    return {};
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Αποτυχία ενημέρωσης." };
  }
}

export async function deleteCrmDepotContainerAction(id: string): Promise<{ error?: string }> {
  await requireCrmSession();

  try {
    await deleteDepotContainer(id);
    revalidateCrmDepot();
    redirect("/admin/depot");
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Αποτυχία διαγραφής." };
  }
}

export async function returnCrmDepotContainerAction(id: string): Promise<{ error?: string }> {
  await requireCrmSession();

  try {
    await returnDepotContainerToDepot(id);
    revalidateCrmDepot();
    return {};
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Αποτυχία επιστροφής στο depo." };
  }
}
