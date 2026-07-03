/**
 * @file SiteVersion.tsx
 * @description Fixed version badge — bottom-right, subtle
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

import { site } from "@/lib/constants/site";
import { appVersionLabel } from "@/lib/constants/version";

export function SiteVersion() {
  return (
    <div
      aria-hidden="true"
      className={[
        "pointer-events-none fixed right-3 bottom-2 z-[150]",
        "font-mono text-[9px] tracking-[0.08em] text-cm-muted/55",
        "select-none sm:right-4 sm:bottom-3",
      ].join(" ")}
    >
      {site.author} · {site.copyrightYear} · {appVersionLabel}
    </div>
  );
}
