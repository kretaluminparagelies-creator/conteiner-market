/**
 * @file HomeCTA.tsx
 * @description Call-to-action section on the home page
 * @author Katsoulakis
 * @copyright 2025 Katsoulakis. All rights reserved.
 */

import { Button } from "@/components/ui/Button";

export function HomeCTA() {
  return (
    <section className="border-t border-cm-border bg-cm-card px-[6%] py-24 text-center">
      <p className="mb-5 font-mono text-[10px] tracking-[0.25em] text-cm-accent uppercase">
        Ξεκίνα τώρα
      </p>
      <h2 className="mx-auto mb-5 max-w-3xl font-display text-[clamp(1.75rem,5.5vw,4rem)] leading-[1.1] font-bold">
        Βρες το κοντέινερ
        <br />
        που ψάχνεις.
      </h2>
      <p className="mx-auto mb-11 max-w-xl text-base font-light text-cm-sub">
        Δεκάδες διαθέσιμα containers. Απευθείας επαφή. Χωρίς μεσάζοντες.
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        <Button href="/listings" className="px-11 py-4 text-base">
          Δες Κοντέινερ
        </Button>
        <Button href="/epikoinonia" variant="secondary" className="px-11 py-4 text-base">
          Επικοινωνία
        </Button>
      </div>
    </section>
  );
}
