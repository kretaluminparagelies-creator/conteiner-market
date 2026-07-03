/**
 * @file page.tsx
 * @description Contact page
 * @author Katsoulakis
 * @copyright 2025 Katsoulakis. All rights reserved.
 */

import { PageShell } from "@/components/layout/PageShell";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata = createPageMetadata({
  title: "Επικοινωνία",
  description:
    "Επικοινωνήστε με την Container Market για αγορά, πώληση ή ενοικίαση shipping containers στην Ελλάδα.",
  path: "/epikoinonia",
  keywords: ["επικοινωνία container market", "τηλέφωνο κοντέινερ"],
});

export default function EpikoinoniaPage() {
  return (
    <PageShell>
      <section className="px-[6%] py-24">
        <div className="mx-auto max-w-3xl">
          <p className="mb-4 font-mono text-[10px] tracking-[0.25em] text-cm-accent uppercase">
            Επικοινωνία
          </p>
          <h1 className="font-display text-4xl font-bold md:text-5xl">Επικοινωνήστε μαζί μας</h1>
          <p className="mt-6 text-lg font-light text-cm-sub">
            Για αγορά, πώληση ή ενοικίαση κοντέινερ — είμαστε εδώ για εσάς.
          </p>

          <div className="mt-12 space-y-6 rounded border border-cm-border bg-cm-card p-8">
            <div>
              <p className="font-mono text-[10px] tracking-[0.2em] text-cm-muted uppercase">
                Email
              </p>
              <p className="mt-2 text-cm-text">info@containermarket.gr</p>
            </div>
            <div>
              <p className="font-mono text-[10px] tracking-[0.2em] text-cm-muted uppercase">
                Τηλέφωνο
              </p>
              <p className="mt-2 text-cm-text">+30 210 000 0000</p>
            </div>
            <div>
              <p className="font-mono text-[10px] tracking-[0.2em] text-cm-muted uppercase">
                Περιοχή
              </p>
              <p className="mt-2 text-cm-text">Ελλάδα — πανελλαδική κάλυψη</p>
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
