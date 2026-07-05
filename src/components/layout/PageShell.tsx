/**
 * @file PageShell.tsx
 * @description Shared page wrapper with nav and footer
 * @author Katsoulakis
 * @copyright 2025 Katsoulakis. All rights reserved.
 */

import type { ReactNode } from "react";
import { Suspense } from "react";
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
  /** Light ink-on-white page shell (home, polisi, sell contact) */
  tone?: "dark" | "light";
  /** Single-screen page — compact footer, main locked to viewport below nav */
  hideFooter?: boolean;
  /** On mobile, allow page scroll instead of locking to one viewport (contact form) */
  mobileScroll?: boolean;
};

export function PageShell({ children, homeListings, tone, hideFooter, mobileScroll }: PageShellProps) {
  const isLight = tone === "light" || Boolean(homeListings);

  return (
    <Providers>
      <ListingsProvider listings={homeListings}>
        <div
          className={
            isLight
              ? "flex min-h-screen flex-col text-cm-ink"
              : "min-h-screen bg-cm-bg text-cm-text"
          }
        >
          <Suspense fallback={null}>
            <Nav />
          </Suspense>
          <main
            className={
              hideFooter
                ? [
                    "box-border flex flex-col pt-[60px]",
                    mobileScroll
                      ? "max-md:min-h-dvh md:h-dvh md:overflow-hidden"
                      : "h-dvh overflow-hidden",
                  ].join(" ")
                : "flex flex-1 flex-col pt-[60px]"
            }
          >
            {hideFooter ? (
              <div
                className={
                  mobileScroll ? "min-h-0 flex-1 max-md:flex-none max-md:min-h-0" : "min-h-0 flex-1"
                }
              >
                {children}
              </div>
            ) : (
              children
            )}
            {hideFooter ? (
              <Suspense fallback={null}>
                <Footer compact />
              </Suspense>
            ) : null}
          </main>
          {!hideFooter ? (
            <Suspense fallback={null}>
              <Footer />
            </Suspense>
          ) : null}
          {!hideFooter ? <SiteVersion /> : null}
        </div>
      </ListingsProvider>
    </Providers>
  );
}
