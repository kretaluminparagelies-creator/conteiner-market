/**
 * @file route.ts
 * @description CRM leads CSV export
 */

import { NextResponse } from "next/server";
import { requireCrmSession } from "@/lib/crm/auth";
import { leadsToCsv } from "@/lib/crm/export-csv";
import { readLeads } from "@/lib/crm/lead-store";

export const runtime = "nodejs";

export async function GET() {
  try {
    await requireCrmSession();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const leads = await readLeads();
  const csv = leadsToCsv(leads);
  const filename = `leads-${new Date().toISOString().slice(0, 10)}.csv`;

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
