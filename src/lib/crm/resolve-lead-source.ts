/**
 * @file resolve-lead-source.ts
 * @description Map public contact form fields → CRM lead_source
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

import type { LeadSource } from "@/lib/crm/types";

export type ContactFormFlow = "sell" | "inquiry";

export type ContactInterest = "buy" | "rent" | "both";

export function resolveLeadSourceFromForm(formData: FormData): LeadSource {
  const flow = String(formData.get("flow") ?? "").trim() as ContactFormFlow;

  if (flow === "sell") {
    return "buyback";
  }

  const interest = String(formData.get("interest") ?? "buy").trim() as ContactInterest;

  if (interest === "rent") {
    return "rent";
  }

  return "contact";
}
