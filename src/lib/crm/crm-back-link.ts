/**
 * @file crm-back-link.ts
 * @description Parent back link for CRM sub-pages (edit, new, detail)
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

export type CrmBackLink = {
  href: string;
  label: string;
};

export function getCrmBackLink(pathname: string): CrmBackLink | null {
  if (pathname === "/admin/rentals/new") {
    return { href: "/admin/rentals", label: "Πίσω στα ενοικιασμένα" };
  }

  if (pathname === "/admin/listings/new" || /^\/admin\/listings\/[^/]+\/edit$/.test(pathname)) {
    return { href: "/admin/listings", label: "Πίσω στις καταχωρίσεις" };
  }

  if (/^\/admin\/leads\/[^/]+$/.test(pathname)) {
    return { href: "/admin/leads", label: "Πίσω στα αιτήματα" };
  }

  return null;
}
