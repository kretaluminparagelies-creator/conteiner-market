/**
 * @file page.tsx
 * @description Terms of use placeholder page
 * @author Katsoulakis
 * @copyright 2025 Katsoulakis. All rights reserved.
 */

import { PageShell } from "@/components/layout/PageShell";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata = createPageMetadata({
  title: "Όροι Χρήσης",
  description: "Όροι χρήσης της ιστοσελίδας Container Market GR.",
  path: "/oroi",
});

export default function OroiPage() {
  return (
    <PageShell>
      <section className="px-[6%] py-24">
        <div className="mx-auto max-w-3xl">
          <h1 className="font-display text-4xl font-bold">Όροι χρήσης</h1>
          <p className="mt-6 text-cm-sub">Η σελίδα θα ενημερωθεί σύντομα.</p>
        </div>
      </section>
    </PageShell>
  );
}
