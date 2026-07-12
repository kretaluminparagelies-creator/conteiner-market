/**
 * @file layout.tsx
 * @description Depot field app layout
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

import { notFound } from "next/navigation";
import { DepotShell } from "@/components/depot/DepotShell";
import { depotHomePath, isDepotEnabled } from "@/lib/depot/config";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Depot | Container Market",
  description: "Καταχώρηση κοντέινερ & αποστολή προσφορών από την αποθήκη.",
  applicationName: "Depot",
  manifest: "/api/depot/manifest",
  robots: { index: false, follow: false },
  appleWebApp: {
    capable: true,
    title: "Depot",
    statusBarStyle: "default",
  },
  icons: {
    icon: [
      { url: "/api/depot/pwa-icon?size=192", type: "image/png", sizes: "192x192" },
    ],
    apple: [
      { url: "/api/depot/pwa-icon?size=180", type: "image/png", sizes: "180x180" },
    ],
  },
  other: {
    "mobile-web-app-capable": "yes",
  },
  alternates: {
    canonical: depotHomePath,
  },
};

export const dynamic = "force-dynamic";

export default function DepotLayout({ children }: { children: React.ReactNode }) {
  if (!isDepotEnabled()) notFound();
  return <DepotShell>{children}</DepotShell>;
}
