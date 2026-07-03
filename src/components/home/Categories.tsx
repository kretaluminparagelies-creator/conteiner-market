/**
 * @file Categories.tsx
 * @description Service category cards on the home page
 * @author Katsoulakis
 * @copyright 2025 Katsoulakis. All rights reserved.
 */

"use client";

import { CategoryCards } from "@/components/home/CategoryCards";
import { useInView } from "@/lib/hooks/useInView";
import { fadeUpStyle } from "@/lib/utils/motion";

export function Categories() {
  const { ref, visible } = useInView<HTMLElement>();

  return (
    <section ref={ref} className="bg-cm-bg px-[6%] py-24">
      <div className="mx-auto max-w-6xl">
        <p
          className="mb-4 font-mono text-[10px] tracking-[0.25em] text-cm-accent uppercase"
          style={fadeUpStyle(visible, 0)}
        >
          Τι ψάχνεις
        </p>
        <h2
          className="mb-14 font-display text-[clamp(1.625rem,4vw,2.875rem)] font-bold"
          style={fadeUpStyle(visible, 0.1)}
        >
          Βρες αυτό που χρειάζεσαι
        </h2>

        <CategoryCards visible={visible} />
      </div>
    </section>
  );
}
