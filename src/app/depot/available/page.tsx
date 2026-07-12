/**
 * @file page.tsx
 * @description Redirect legacy available route to offer flow
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

import { redirect } from "next/navigation";

export default function DepotAvailablePage() {
  redirect("/depot/dispatch");
}
