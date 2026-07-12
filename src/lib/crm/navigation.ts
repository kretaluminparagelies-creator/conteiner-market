/**
 * @file navigation.ts
 * @description CRM admin sidebar navigation
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

import type { CrmNavItem } from "@/lib/crm/types";
import { isDepotEnabled } from "@/lib/depot/config";

const baseCrmNavItems: CrmNavItem[] = [
  {
    href: "/admin",
    label: "Πίνακας",
    labelEn: "Dashboard",
    icon: "dashboard",
  },
  {
    href: "/admin/listings",
    label: "Καταχωρίσεις",
    labelEn: "Listings",
    icon: "listings",
  },
  {
    href: "/admin/history",
    label: "Ιστορικό",
    labelEn: "History",
    icon: "history",
  },
  {
    href: "/admin/rentals",
    label: "Ενοικιασμένα",
    labelEn: "Rentals",
    icon: "rentals",
  },
  {
    href: "/admin/leads",
    label: "Αιτήματα",
    labelEn: "Leads",
    icon: "leads",
  },
  {
    href: "/admin/settings",
    label: "Ρυθμίσεις",
    labelEn: "Settings",
    icon: "settings",
  },
];

const depotNavItem: CrmNavItem = {
  href: "/admin/representatives",
  label: "Αντιπρόσωποι",
  labelEn: "Representatives",
  icon: "representatives",
};

export function getCrmNavItems(): CrmNavItem[] {
  if (!isDepotEnabled()) return baseCrmNavItems;
  const items = [...baseCrmNavItems];
  items.splice(items.length - 1, 0, depotNavItem);
  return items;
}

/** @deprecated Use getCrmNavItems() — kept for static imports */
export const crmNavItems = baseCrmNavItems;

export const crmSiteLink = "/";
