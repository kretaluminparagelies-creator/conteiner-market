/**
 * @file Stats.tsx
 * @description Animated statistics bar for the home page
 * @author Katsoulakis
 * @copyright 2025 Katsoulakis. All rights reserved.
 */

"use client";

import { CountUp } from "@/components/ui/CountUp";
import { statDefinitions } from "@/lib/constants/home";
import { useLocale } from "@/lib/i18n/locale-context";
import { useInView } from "@/lib/hooks/useInView";
import { fadeUpStyle } from "@/lib/utils/motion";

export function Stats() {
  const { t } = useLocale();
  const { ref, visible } = useInView<HTMLDivElement>({ threshold: 0.2 });

  return (
    <div
      ref={ref}
      className="grid grid-cols-2 border-y border-cm-light-border bg-cm-light-surf md:grid-cols-4"
    >
      {statDefinitions.map((stat, index) => (
        <div
          key={stat.key}
          className={[
            "px-5 py-11 text-center",
            index < statDefinitions.length - 1 ? "border-cm-light-border md:border-r" : "",
            index % 2 === 0 ? "border-r border-cm-light-border md:border-r" : "",
            index < 2 ? "border-b md:border-b-0" : "",
          ].join(" ")}
          style={fadeUpStyle(visible, index * 0.1)}
        >
          <div className="font-display text-[46px] leading-none font-bold text-cm-accent">
            <CountUp end={stat.end} suffix={stat.suffix} run={visible} />
          </div>
          <div className="mt-1.5 text-[13px] text-cm-ink-sub">{t.stats[stat.key]}</div>
        </div>
      ))}
    </div>
  );
}
