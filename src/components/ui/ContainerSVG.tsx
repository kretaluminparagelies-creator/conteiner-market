/**
 * @file ContainerSVG.tsx
 * @description SVG illustration of a shipping container
 * @author Katsoulakis
 * @copyright 2025 Katsoulakis. All rights reserved.
 */

type ContainerSVGProps = {
  tinted?: boolean;
  className?: string;
};

export function ContainerSVG({ tinted = false, className = "h-16 w-auto opacity-75" }: ContainerSVGProps) {
  const stroke = tinted ? "#4ab0e8" : "#e07030";

  return (
    <svg
      viewBox="0 0 240 130"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <rect
        x="12"
        y="22"
        width="216"
        height="86"
        rx="3"
        fill="#2a4870"
        fillOpacity="0.4"
        stroke="#2a4870"
        strokeWidth="1.5"
      />
      {[50, 83, 120, 157, 190].map((x) => (
        <line
          key={x}
          x1={x}
          y1="22"
          x2={x}
          y2="108"
          stroke="#2a4870"
          strokeOpacity="0.6"
          strokeWidth="1.2"
        />
      ))}
      <rect
        x="198"
        y="24"
        width="28"
        height="82"
        rx="2"
        fill={stroke}
        fillOpacity="0.08"
        stroke={stroke}
        strokeOpacity="0.45"
        strokeWidth="1.2"
      />
      <line x1="212" y1="24" x2="212" y2="106" stroke={stroke} strokeOpacity="0.3" strokeWidth="1" />
      {(
        [
          [12, 22],
          [228, 22],
          [12, 108],
          [228, 108],
        ] as const
      ).map(([cx, cy], index) => (
        <rect
          key={index}
          x={cx - 6}
          y={cy - 6}
          width="12"
          height="12"
          rx="2"
          fill={stroke}
          fillOpacity="0.7"
        />
      ))}
      <circle cx="218" cy="65" r="3.5" fill={stroke} fillOpacity="0.9" />
    </svg>
  );
}
