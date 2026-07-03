/**
 * @file FooterCredit.tsx
 * @description Sketchfab CC-BY attribution (required for GLB model)
 * @author Katsoulakis
 * @copyright 2025 Katsoulakis. All rights reserved.
 */

import { sketchfabCredit } from "@/lib/constants/sketchfab";

export function FooterCredit() {
  return (
    <p className="max-w-xl text-center font-mono text-[10px] leading-relaxed text-cm-muted">
      3D model:{" "}
      <a
        href={sketchfabCredit.modelUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-cm-sub transition-colors hover:text-cm-text"
      >
        {sketchfabCredit.title}
      </a>{" "}
      by{" "}
      <a
        href={sketchfabCredit.authorUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-cm-sub transition-colors hover:text-cm-text"
      >
        {sketchfabCredit.author}
      </a>{" "}
      ·{" "}
      <a
        href={sketchfabCredit.licenseUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-cm-sub transition-colors hover:text-cm-text"
      >
        {sketchfabCredit.license}
      </a>
    </p>
  );
}
