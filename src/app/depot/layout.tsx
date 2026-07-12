/**
 * @file layout.tsx
 * @description Depot field app layout
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

import { notFound } from "next/navigation";
import { isDepotEnabled } from "@/lib/depot/config";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Depot | Container Market",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default function DepotLayout({ children }: { children: React.ReactNode }) {
  if (!isDepotEnabled()) notFound();
  return children;
}
