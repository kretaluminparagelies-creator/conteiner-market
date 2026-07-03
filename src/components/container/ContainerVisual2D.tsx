/**
 * @file ContainerVisual2D.tsx
 * @description Plan B — enhanced 2D container visual (swap if 3D is disabled or replaced)
 * @author Katsoulakis
 * @copyright 2025 Katsoulakis. All rights reserved.
 *
 * To replace: edit this file independently from ContainerModel3D.tsx (Plan A).
 */

import { containerColors } from "@/lib/constants/container";

export function ContainerVisual2D() {
  const { body, bodyDark, door, accent } = containerColors;

  return (
    <svg
      viewBox="0 0 320 180"
      fill="none"
      aria-hidden="true"
      className="h-auto w-full max-w-[420px]"
    >
      {/* Shadow */}
      <ellipse cx="160" cy="168" rx="120" ry="8" fill="#000" fillOpacity="0.25" />

      {/* Main body */}
      <rect
        x="24"
        y="36"
        width="272"
        height="118"
        rx="4"
        fill={body}
        fillOpacity="0.85"
        stroke={bodyDark}
        strokeWidth="1.5"
      />

      {/* Top corrugations */}
      {Array.from({ length: 13 }, (_, i) => {
        const x = 32 + i * 20;
        return (
          <rect
            key={`top-${i}`}
            x={x}
            y="34"
            width="10"
            height="6"
            rx="1"
            fill={bodyDark}
            fillOpacity="0.7"
          />
        );
      })}

      {/* Side corrugations */}
      {[58, 78, 98, 118, 138, 158, 178, 198, 218, 238, 258].map((x) => (
        <line
          key={x}
          x1={x}
          y1="38"
          x2={x}
          y2="152"
          stroke={bodyDark}
          strokeOpacity="0.65"
          strokeWidth="2"
        />
      ))}

      {/* Door panel */}
      <rect
        x="248"
        y="44"
        width="40"
        height="102"
        rx="2"
        fill={door}
        fillOpacity="0.9"
        stroke={accent}
        strokeOpacity="0.5"
        strokeWidth="1.2"
      />
      <line x1="268" y1="44" x2="268" y2="146" stroke={accent} strokeOpacity="0.35" strokeWidth="1" />

      {/* Door handles */}
      <rect x="278" y="82" width="6" height="14" rx="1" fill={accent} fillOpacity="0.85" />
      <rect x="278" y="102" width="6" height="14" rx="1" fill={accent} fillOpacity="0.85" />

      {/* Corner castings */}
      {(
        [
          [24, 36],
          [296, 36],
          [24, 154],
          [296, 154],
        ] as const
      ).map(([cx, cy], i) => (
        <rect
          key={i}
          x={cx - 7}
          y={cy - 7}
          width="14"
          height="14"
          rx="2"
          fill={accent}
          fillOpacity="0.85"
        />
      ))}
    </svg>
  );
}
