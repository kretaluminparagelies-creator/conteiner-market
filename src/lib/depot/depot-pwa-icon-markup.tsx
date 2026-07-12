/**
 * @file depot-pwa-icon-markup.tsx
 * @description Shared depot home-screen icon artwork for ImageResponse
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

import type { ReactElement } from "react";

export function depotPwaIconMarkup(size: number): ReactElement {
  const showLabel = size >= 96;
  const compact = size < 48;
  const radius = size >= 64 ? Math.round(size * 0.22) : 0;
  const boxWidth = Math.round(size * 0.46);
  const boxHeight = Math.round(size * 0.3);
  const border = Math.max(3, Math.round(size * 0.04));

  if (compact) {
    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(145deg, #f08848 0%, #e07030 55%, #c85a20 100%)",
          color: "#ffffff",
          fontFamily: "system-ui, sans-serif",
          fontSize: Math.round(size * 0.56),
          fontWeight: 800,
          lineHeight: 1,
        }}
      >
        D
      </div>
    );
  }

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(145deg, #f08848 0%, #e07030 55%, #c85a20 100%)",
        borderRadius: radius,
        color: "#ffffff",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <div
        style={{
          width: boxWidth,
          height: boxHeight,
          border: `${border}px solid #ffffff`,
          borderRadius: Math.max(4, Math.round(size * 0.04)),
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 4px 14px rgba(0,0,0,0.18)",
        }}
      >
        <div
          style={{
            width: "72%",
            height: "58%",
            border: `${Math.max(2, border - 1)}px solid rgba(255,255,255,0.9)`,
            borderRadius: Math.max(2, Math.round(size * 0.02)),
          }}
        />
      </div>
      {showLabel ? (
        <div
          style={{
            marginTop: Math.round(size * 0.07),
            fontSize: Math.round(size * 0.14),
            fontWeight: 800,
            letterSpacing: Math.round(size * 0.02),
          }}
        >
          DEPOT
        </div>
      ) : null}
    </div>
  );
}
