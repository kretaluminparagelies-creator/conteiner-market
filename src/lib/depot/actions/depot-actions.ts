/**
 * @file depot-actions.ts
 * @description Server actions for depot field app
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

"use server";

import { cache } from "react";
import { revalidatePath } from "next/cache";
import {
  compactIso6346FromDisplay,
  displayIso6346FromCompact,
  iso6346ContainerErrorMessage,
} from "@/lib/iso6346ContainerFormat";
import { requireCrmSession } from "@/lib/depot/auth";
import { buildDepotMobileShareText } from "@/lib/depot/share-text";
import { isDepotAvailable } from "@/lib/depot/status";
import type { DepotDispatchType, DepotGrade } from "@/lib/depot/types";
import { EXTERNAL_DISPATCH_RECIPIENT_LABEL } from "@/lib/depot/types";
import {
  addDepotRepresentative,
  dispatchDepotContainer,
  intakeDepotContainer,
  listDepotContainers,
  listDepotDispatches,
  listDepotOfferDispatches,
  listDepotRepresentatives,
  getDepotContainerById,
  returnDepotContainerToDepot,
} from "@/lib/depot/repository/depot-store";

function revalidateDepot() {
  revalidatePath("/depot");
  revalidatePath("/depot/available");
  revalidatePath("/depot/out");
  revalidatePath("/depot/dispatch");
  revalidatePath("/depot/offers");
}

export async function intakeDepotContainerAction(formData: FormData) {
  const user = await requireCrmSession();

  const containerNumberRaw = String(formData.get("containerNumber") ?? "").trim();
  const containerType = String(formData.get("containerType") ?? "").trim();
  const grade = String(formData.get("grade") ?? "").trim() as DepotGrade;
  const notes = String(formData.get("notes") ?? "").trim();
  const salePriceRaw = String(formData.get("salePrice") ?? "").trim();
  const rentPriceRaw = String(formData.get("rentPrice") ?? "").trim();
  const imagesRaw = String(formData.get("images") ?? "[]");

  const compact = compactIso6346FromDisplay(containerNumberRaw);
  if (!compact) {
    return { error: iso6346ContainerErrorMessage };
  }
  const containerNumber = displayIso6346FromCompact(compact);

  if (!containerType || !["A", "B", "C"].includes(grade)) {
    return { error: "Συμπλήρωσε τύπο και grade." };
  }

  let images: string[] = [];
  try {
    images = JSON.parse(imagesRaw) as string[];
    if (!Array.isArray(images)) images = [];
  } catch {
    images = [];
  }

  if (images.length === 0) {
    return { error: "Πρόσθεσε τουλάχιστον μία φωτογραφία." };
  }

  try {
    await intakeDepotContainer({
      containerNumber,
      containerType,
      grade,
      notes: notes || undefined,
      salePrice: salePriceRaw ? Number(salePriceRaw) : undefined,
      rentPrice: rentPriceRaw ? Number(rentPriceRaw) : undefined,
      images,
      recordedBy: user?.email ?? undefined,
    });
    revalidateDepot();
    return { ok: true as const };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Αποτυχία καταχώρησης.";
    return { error: message };
  }
}

export async function addDepotRepresentativeAction(formData: FormData) {
  await requireCrmSession();

  const name = String(formData.get("name") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();

  if (!name) return { error: "Συμπλήρωσε όνομα αντιπροσώπου." };

  try {
    await addDepotRepresentative({
      companyName: name,
      name,
      phone: phone || undefined,
    });
    revalidateDepot();
    return { ok: true as const };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Αποτυχία αποθήκευσης.";
    return { error: message };
  }
}

export async function dispatchDepotContainerAction(formData: FormData) {
  const user = await requireCrmSession();

  const containerId = String(formData.get("containerId") ?? "").trim();
  const representativeId = String(formData.get("representativeId") ?? "").trim();
  const dispatchType = String(formData.get("dispatchType") ?? "").trim() as DepotDispatchType;
  const notes = String(formData.get("notes") ?? "").trim();

  if (!containerId || !representativeId || !["offer", "free_storage"].includes(dispatchType)) {
    return { error: "Επίλεξε κοντέινερ, αντιπρόσωπο και τύπο αποστολής." };
  }

  try {
    const dispatch = await dispatchDepotContainer(
      { containerId, representativeId, dispatchType, notes: notes || undefined },
      user?.email ?? undefined,
    );

    if (!dispatch.container) {
      return { error: "Δεν βρέθηκαν στοιχεία για αποστολή." };
    }

    revalidateDepot();
    return {
      ok: true as const,
      shareText: buildDepotMobileShareText(dispatch.container),
      imageUrl: dispatch.container.images[0],
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Αποτυχία αποστολής.";
    return { error: message };
  }
}

export async function shareDepotContainerExternallyAction(formData: FormData) {
  const user = await requireCrmSession();

  const containerId = String(formData.get("containerId") ?? "").trim();
  const recipientLabelRaw = String(formData.get("recipientLabel") ?? "").trim();
  const recipientLabel = recipientLabelRaw || EXTERNAL_DISPATCH_RECIPIENT_LABEL;

  if (!containerId) {
    return { error: "Επίλεξε κοντέινερ." };
  }

  try {
    const container = await getDepotContainerById(containerId);
    if (!container) {
      return { error: "Το κοντέινερ δεν βρέθηκε." };
    }
    if (!isDepotAvailable(container.status)) {
      return { error: "Το κοντέινερ δεν είναι διαθέσιμο." };
    }

    await dispatchDepotContainer(
      {
        containerId,
        dispatchType: "offer",
        recipientLabel,
      },
      user?.email ?? undefined,
    );

    revalidateDepot();
    return {
      ok: true as const,
      shareText: buildDepotMobileShareText(container),
      imageUrl: container.images[0],
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Αποτυχία αποστολής.";
    return { error: message };
  }
}

export async function returnDepotContainerAction(containerId: string) {
  await requireCrmSession();

  try {
    await returnDepotContainerToDepot(containerId);
    revalidateDepot();
    return { ok: true as const };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Αποτυχία επιστροφής.";
    return { error: message };
  }
}

export async function loadDepotDashboardData() {
  const [containers, representatives, dispatches] = await Promise.all([
    loadDepotContainersCached(),
    loadDepotRepresentativesCached(),
    loadDepotDispatchesCached(),
  ]);

  return { containers, representatives, dispatches };
}

export async function loadDepotOffersHistoryData() {
  const dispatches = await loadDepotOfferDispatchesCached();
  return { dispatches };
}

export async function loadDepotHomeData() {
  const [containers, dispatches] = await Promise.all([
    loadDepotContainersCached(),
    loadDepotDispatchesCached(),
  ]);

  return { containers, dispatches };
}

export async function loadDepotDispatchPageData() {
  const [containers, representatives] = await Promise.all([
    loadDepotContainersCached(),
    loadDepotRepresentativesCached(),
  ]);

  return { containers, representatives };
}

export async function loadDepotOutPageData() {
  const containers = await loadDepotContainersCached();
  return { containers };
}

const ensureDepotSession = cache(async () => requireCrmSession());

const loadDepotContainersCached = cache(async () => {
  await ensureDepotSession();
  return listDepotContainers();
});

const loadDepotRepresentativesCached = cache(async () => {
  await ensureDepotSession();
  return listDepotRepresentatives();
});

const loadDepotDispatchesCached = cache(async () => {
  await ensureDepotSession();
  return listDepotDispatches();
});

const loadDepotOfferDispatchesCached = cache(async () => {
  await ensureDepotSession();
  return listDepotOfferDispatches();
});
