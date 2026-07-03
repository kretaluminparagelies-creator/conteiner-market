/**
 * @file layout.tsx
 * @description CRM admin area root layout
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CRM | Container Market",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return children;
}
