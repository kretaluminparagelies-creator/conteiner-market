/**
 * @file lead-actions.ts
 * @description Server actions for CRM leads
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

"use server";

import { revalidatePath } from "next/cache";
import { requireCrmSession } from "@/lib/crm/auth";
import { createLead, updateLeadStatus } from "@/lib/crm/lead-store";
import type { LeadSource, LeadStatus } from "@/lib/crm/types";
import { sendLeadNotification } from "@/lib/email/send-lead-notification";

export async function updateLeadStatusAction(leadId: string, status: LeadStatus) {
  await requireCrmSession();
  await updateLeadStatus(leadId, status);
  revalidatePath("/admin/leads");
  revalidatePath("/admin");
  revalidatePath(`/admin/leads/${leadId}`);
}

export async function submitContactLeadAction(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();
  const source = (String(formData.get("source") ?? "contact").trim() || "contact") as LeadSource;
  const listingSlug = String(formData.get("listingSlug") ?? "").trim() || undefined;

  if (!name || !email || !message) {
    return { error: "Συμπλήρωσε όνομα, email και μήνυμα." };
  }

  if (!email.includes("@")) {
    return { error: "Μη έγκυρο email." };
  }

  try {
    const leadInput = {
      name,
      email,
      phone: phone || undefined,
      message,
      source,
      listingSlug,
    };
    await createLead(leadInput);

    try {
      await sendLeadNotification(leadInput);
    } catch (notifyError) {
      console.error("[submitContactLeadAction] email notify failed:", notifyError);
    }

    return { success: true };
  } catch (error) {
    console.error("[submitContactLeadAction]", error);
    return { error: "Αποτυχία αποστολής. Δοκίμασε ξανά ή στείλε email." };
  }
}
