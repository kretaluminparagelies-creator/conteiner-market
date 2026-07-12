/**
 * @file safe-redirect.ts
 * @description Internal post-login redirect targets (middleware + actions)
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

export function isSafeDepotRedirect(path: string): boolean {
  return path === "/depot" || path.startsWith("/depot/");
}

export function safePostLoginRedirect(next: string | null | undefined): string {
  if (!next || !next.startsWith("/") || next.startsWith("//")) return "/admin";
  if (isSafeDepotRedirect(next) || next.startsWith("/admin")) return next;
  return "/admin";
}

export function linkPathname(href: string): string {
  const path = href.split(/[?#]/, 1)[0];
  return path || href;
}
