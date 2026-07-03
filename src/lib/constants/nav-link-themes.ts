/**
 * @file nav-link-themes.ts
 * @description Accent colors for main nav links (aligned with category cards)
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

export type NavLinkTheme = {
  accent: string;
  glow: string;
};

const navLinkThemes: Record<string, NavLinkTheme> = {
  "/agora": {
    accent: "#e07030",
    glow: "rgba(224, 112, 48, 0.55)",
  },
  "/polisi": {
    accent: "#7a9ab8",
    glow: "rgba(122, 154, 184, 0.55)",
  },
  "/enoikiasi": {
    accent: "#4ab0e8",
    glow: "rgba(74, 176, 232, 0.55)",
  },
  "/listings": {
    accent: "#e07030",
    glow: "rgba(224, 112, 48, 0.55)",
  },
};

const defaultNavLinkTheme = navLinkThemes["/agora"];

export function getNavLinkTheme(href: string): NavLinkTheme {
  return navLinkThemes[href] ?? defaultNavLinkTheme;
}
