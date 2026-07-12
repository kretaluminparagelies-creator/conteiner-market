/**
 * @file representative-form.ts
 * @description Parse + validate representative CRM form
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

import type { DepotRepresentativeInput, DepotRepresentativeUpdate } from "@/lib/depot/types";

function clean(value: FormDataEntryValue | null): string {
  return String(value ?? "").trim();
}

function optional(value: string): string | undefined {
  return value || undefined;
}

export function parseRepresentativeInput(
  formData: FormData,
): { data: DepotRepresentativeInput } | { error: string } {
  const companyName = clean(formData.get("companyName"));
  const name = clean(formData.get("name"));
  const phone = clean(formData.get("phone"));
  const email = clean(formData.get("email"));
  const afm = clean(formData.get("afm"));
  const doy = clean(formData.get("doy"));
  const address = clean(formData.get("address"));
  const city = clean(formData.get("city"));
  const postalCode = clean(formData.get("postalCode"));
  const notes = clean(formData.get("notes"));

  if (!companyName) return { error: "Συμπλήρωσε επωνυμία (για τιμολόγιο)." };
  if (!name) return { error: "Συμπλήρωσε όνομα επαφής." };

  if (afm && !/^\d{9}$/.test(afm)) {
    return { error: "Το ΑΦΜ πρέπει να είναι 9 ψηφία." };
  }

  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: "Μη έγκυρο email." };
  }

  return {
    data: {
      companyName,
      name,
      phone: optional(phone),
      email: optional(email),
      afm: optional(afm),
      doy: optional(doy),
      address: optional(address),
      city: optional(city),
      postalCode: optional(postalCode),
      notes: optional(notes),
    },
  };
}

export function parseRepresentativeUpdate(
  formData: FormData,
): { data: DepotRepresentativeUpdate } | { error: string } {
  const parsed = parseRepresentativeInput(formData);
  if ("error" in parsed) return parsed;

  const active = formData.get("active") === "true";

  return {
    data: {
      ...parsed.data,
      active,
    },
  };
}
