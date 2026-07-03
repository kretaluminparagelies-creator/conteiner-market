/**
 * @file spline-menu.ts
 * @description Spline 3D service picker — scene path and object → route map
 * @author Katsoulakis
 * @copyright 2025 Katsoulakis. All rights reserved.
 */

import type { SplineEvent } from "@splinetool/runtime";

export type SplineServiceItem = {
  label: string;
  href: string;
  dropIndex: number;
};

export const splineMenuServices: SplineServiceItem[] = [
  { label: "Προσφορές κοντέινερ", href: "/listings", dropIndex: 1 },
  { label: "Ενοικίαση χώρου", href: "/enoikiasis-xoron", dropIndex: 2 },
];

/** Carousel catalog — used offers (Spline Drop 1, μεταχειρισμένα) */
export const splineMenuOffersHref = "/listings";

export const splineMenu = {
  scene: "/spline/menu-dropdown.splinecode",
  cloudScene: "https://prod.spline.design/6R5uXHVx8-T4bb3U/scene.splinecode",
  activeScene: "https://prod.spline.design/6R5uXHVx8-T4bb3U/scene.splinecode",
  heroHeightClass: "h-full min-h-[220px] w-full lg:min-h-[420px]",
  heightClass: "h-[min(80vh,720px)] min-h-[560px]",
  backgroundColor: "#0e1828",
  lockedZoom: 0.68,
  routes: {
    Drop_1: splineMenuOffersHref,
    "Drop 1": splineMenuOffersHref,
    Text_1: splineMenuOffersHref,
    Text1: splineMenuOffersHref,
    "Text 1": splineMenuOffersHref,
    Bar01: splineMenuOffersHref,
    "Bar 01": splineMenuOffersHref,
    Container: splineMenuOffersHref,
    container: splineMenuOffersHref,
    "Container μεταχειρισμένα": splineMenuOffersHref,
    "Container metaxirismena": splineMenuOffersHref,
    "Μεταχειρισμένα": splineMenuOffersHref,
    Drop_2: "/enoikiasis-xoron",
    "Drop 2": "/enoikiasis-xoron",
    Text_2: "/enoikiasis-xoron",
    Text2: "/enoikiasis-xoron",
    "Text 2": "/enoikiasis-xoron",
    Bar02: "/enoikiasis-xoron",
    "Bar 02": "/enoikiasis-xoron",
  } as Record<string, string>,
} as const;

const dropRoutePatterns: { dropIndex: number; href: string; patterns: RegExp[] }[] = [
  {
    dropIndex: 1,
    href: splineMenuOffersHref,
    patterns: [
      /^drop[_\s-]*1$/i,
      /^text[_\s-]*1$/i,
      /^bar[_\s-]*0?1$/i,
      /προσφορ/i,
      /μεταχειρ/i,
      /metaxir/i,
      /metaihr/i,
      /prosfor/i,
      /container/i,
      /conteiner/i,
      /contein/i,
      /κοντέιν/i,
      /κοντειν/i,
      /used/i,
    ],
  },
  {
    dropIndex: 2,
    href: "/enoikiasis-xoron",
    patterns: [
      /^drop[_\s-]*2$/i,
      /^text[_\s-]*2$/i,
      /^bar[_\s-]*0?2$/i,
      /χώρ/i,
      /χωρ/i,
      /αποθηκ/i,
      /ενοικ.*χώρ/i,
      /space/i,
    ],
  },
];

export function resolveSplineMenuRoute(objectName: string): string | undefined {
  const direct = splineMenu.routes[objectName];
  if (direct) return direct;

  const normalized = objectName.trim();

  // Walk up: "Group / Text" or parent names from Spline
  const segments = normalized.split(/[/\\>›|]/).map((part) => part.trim()).filter(Boolean);
  for (const segment of segments) {
    const segmentRoute = splineMenu.routes[segment];
    if (segmentRoute) return segmentRoute;
    for (const group of dropRoutePatterns) {
      if (group.patterns.some((pattern) => pattern.test(segment))) {
        return group.href;
      }
    }
  }

  for (const group of dropRoutePatterns) {
    if (group.patterns.some((pattern) => pattern.test(normalized))) {
      return group.href;
    }
  }

  return undefined;
}

/** Resolve route from Spline click target (name + id fallback) */
export function resolveSplineMenuRouteFromEvent(
  event: SplineEvent,
  objectNamesById?: ReadonlyMap<string, string>,
): string | undefined {
  const target = event.target;
  const candidates = [target.name?.trim(), objectNamesById?.get(target.id)].filter(
    (name): name is string => Boolean(name),
  );

  for (const name of candidates) {
    const href = resolveSplineMenuRoute(name);
    if (href) return href;
  }

  return undefined;
}
