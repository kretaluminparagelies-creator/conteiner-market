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
    <div ref={ref} className="home-mesh-alt px-[6%] py-12 md:py-14">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-4 md:grid-cols-4 md:gap-5">
        {statDefinitions.map((stat, index) => (
          <div
            key={stat.key}
            className="glass-light rounded-2xl px-5 py-9 text-center"
            style={fadeUpStyle(visible, index * 0.1)}
          >
            <div className="font-display text-[42px] leading-none font-bold text-cm-accent md:text-[46px]">
              <CountUp end={stat.end} suffix={stat.suffix} run={visible} />
            </div>
            <div className="mt-2 text-[13px] text-cm-ink-sub">{t.stats[stat.key]}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
