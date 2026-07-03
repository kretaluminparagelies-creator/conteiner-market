/**
 * @file PageShell.tsx
 * @description Shared page wrapper with nav and footer
 * @author Katsoulakis
 * @copyright 2025 Katsoulakis. All rights reserved.
 */

import { Footer } from "@/components/layout/Footer";
import { Nav } from "@/components/layout/Nav";
import type { ReactNode } from "react";

type PageShellProps = {
  children: ReactNode;
};

export function PageShell({ children }: PageShellProps) {
  return (
    <div className="min-h-screen bg-cm-bg text-cm-text">
      <Nav />
      <main className="pt-[60px]">{children}</main>
      <Footer />
    </div>
  );
}
