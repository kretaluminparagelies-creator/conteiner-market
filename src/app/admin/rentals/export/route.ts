/**
 * @file route.ts
 * @description CRM active rentals CSV export
 */

import { NextResponse } from "next/server";
import { requireCrmSession } from "@/lib/crm/auth";
import { rentalsToCsv } from "@/lib/crm/export-csv";
import { readAdminActiveRentals } from "@/lib/repositories/listing-store";

export const runtime = "nodejs";

export async function GET() {
  try {
    await requireCrmSession();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const rentals = await readAdminActiveRentals();
  const csv = rentalsToCsv(rentals);
  const filename = `rentals-${new Date().toISOString().slice(0, 10)}.csv`;

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
