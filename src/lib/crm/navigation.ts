/**
 * @file navigation.ts
 * @description CRM admin sidebar navigation
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

import type { CrmNavItem } from "@/lib/crm/types";

export const crmNavItems: CrmNavItem[] = [
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

export const crmSiteLink = "/";
