/**
 * @file spline-menu.ts
 * @description Spline 3D service picker — scene path and object → route map
 * @author Katsoulakis
 * @copyright 2025 Katsoulakis. All rights reserved.
 */

export type SplineServiceItem = {
  label: string;
  href: string;
  dropIndex: number;
};

export const splineMenuServices: SplineServiceItem[] = [
  { label: "Προσφορές κοντέινερ", href: "/prosfores", dropIndex: 1 },
  { label: "Ενοικίαση χώρου", href: "/enoikiasis-xoron", dropIndex: 2 },
];

export const splineMenu = {
  scene: "/spline/menu-dropdown.splinecode",
  cloudScene: "https://prod.spline.design/6R5uXHVx8-T4bb3U/scene.splinecode",
  activeScene: "https://prod.spline.design/6R5uXHVx8-T4bb3U/scene.splinecode",
  heroHeightClass: "h-full min-h-[220px] w-full lg:min-h-[420px]",
  heightClass: "h-[min(80vh,720px)] min-h-[560px]",
  backgroundColor: "#08111e",
  lockedZoom: 0.68,
  routes: {
    "Drop 1": "/prosfores",
    Text1: "/prosfores",
    "Text 1": "/prosfores",
    Bar01: "/prosfores",
    "Bar 01": "/prosfores",
    "Drop 2": "/enoikiasis-xoron",
    Text2: "/enoikiasis-xoron",
    "Text 2": "/enoikiasis-xoron",
    Bar02: "/enoikiasis-xoron",
    "Bar 02": "/enoikiasis-xoron",
  } as Record<string, string>,
} as const;

const dropRoutePatterns: { dropIndex: number; href: string; patterns: RegExp[] }[] = [
  {
    dropIndex: 1,
    href: "/prosfores",
    patterns: [/^drop\s*1$/i, /^text\s*1$/i, /^bar\s*0?1$/i, /προσφορ/i, /μεταχειρ/i, /prosfor/i],
  },
  {
    dropIndex: 2,
    href: "/enoikiasis-xoron",
    patterns: [
      /^drop\s*2$/i,
      /^text\s*2$/i,
      /^bar\s*0?2$/i,
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
  for (const group of dropRoutePatterns) {
    if (group.patterns.some((pattern) => pattern.test(normalized))) {
      return group.href;
    }
  }

  return undefined;
}
