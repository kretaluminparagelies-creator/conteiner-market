/**
 * @file opengraph-image.tsx
 * @description Default Open Graph image for social & search previews
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

import { ImageResponse } from "next/og";
import { site } from "@/lib/constants/site";

export const alt = `${site.nameFull} — Αγορά & Ενοικίαση Κοντέινερ στην Ελλάδα`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 64,
          background: "linear-gradient(135deg, #0f1419 0%, #1a2332 50%, #0f1419 100%)",
          color: "#f5f5f5",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div style={{ fontSize: 28, color: "#f97316", fontWeight: 700, marginBottom: 16 }}>
          Container Market GR
        </div>
        <div style={{ fontSize: 52, fontWeight: 700, lineHeight: 1.15, maxWidth: 900 }}>
          Αγορά &amp; Ενοικίαση Shipping Containers
        </div>
        <div style={{ fontSize: 28, color: "#94a3b8", marginTop: 24, maxWidth: 800 }}>
          Πώληση · Ενοικίαση · Buyback — Άμεση επαφή, παράδοση σε όλη την Ελλάδα
        </div>
        <div style={{ fontSize: 22, color: "#64748b", marginTop: 40 }}>containermarket.gr</div>
      </div>
    ),
    { ...size },
  );
}
