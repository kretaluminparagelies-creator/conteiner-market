/**
 * @file page.tsx
 * @description Used container offers — redirects to carousel catalog
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

import { redirect } from "next/navigation";

export default function ProsforesPage() {
  redirect("/listings");
}
