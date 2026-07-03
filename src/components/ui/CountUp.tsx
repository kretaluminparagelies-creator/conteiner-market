/**
 * @file CountUp.tsx
 * @description Animated number counter using requestAnimationFrame
 * @author Katsoulakis
 * @copyright 2025 Katsoulakis. All rights reserved.
 */

"use client";

import { useEffect, useState } from "react";

type CountUpProps = {
  end: number;
  suffix?: string;
  run: boolean;
  duration?: number;
};

export function CountUp({ end, suffix = "", run, duration = 1700 }: CountUpProps) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!run) return;

    let startTime: number | null = null;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * end));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    const frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [run, end, duration]);

  return (
    <>
      {value}
      {suffix}
    </>
  );
}
