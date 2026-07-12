/**
 * @file page.tsx
 * @description Containers not at depot
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

import { DepotOutList } from "@/components/depot/DepotOutList";
import { loadDepotOutPageData } from "@/lib/depot/actions/depot-actions";

export default async function DepotOutPage() {
  const { containers } = await loadDepotOutPageData();

  return <DepotOutList containers={containers} />;
}
