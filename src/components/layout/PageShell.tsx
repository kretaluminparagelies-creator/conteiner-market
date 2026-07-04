/**
 * @file PageShell.tsx
 * @description Shared page wrapper with nav and footer
 * @author Katsoulakis
 * @copyright 2025 Katsoulakis. All rights reserved.
 */

import type { ReactNode } from "react";
import { Footer } from "@/components/layout/Footer";
import { Nav } from "@/components/layout/Nav";
import { Providers } from "@/components/layout/Providers";
import { SiteVersion } from "@/components/layout/SiteVersion";
import { ListingsProvider } from "@/lib/context/listings-context";
import type { Listing } from "@/lib/types/listing";

type PageShellProps = {
  children: ReactNode;
  /** When set, client components use Supabase/server-fetched listings instead of bundled JSON */
  homeListings?: Listing[];
};

export function PageShell({ children, homeListings }: PageShellProps) {
  return (
    <Providers>
      <ListingsProvider listings={homeListings}>
        <div className="min-h-screen bg-cm-bg text-cm-text">
          <Nav />
          <main className="pt-[60px]">{children}</main>
          <Footer />
          <SiteVersion />
        </div>
      </ListingsProvider>
    </Providers>
  );
}
