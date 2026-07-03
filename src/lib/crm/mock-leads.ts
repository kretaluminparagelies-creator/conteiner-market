/**
 * @file mock-leads.ts
 * @description Sample leads for CRM preview (replaced by Supabase later)
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

import type { Lead } from "@/lib/crm/types";

export const mockLeads: Lead[] = [
  {
    id: "lead-1",
    createdAt: "2026-07-03T10:24:00.000Z",
    name: "Γιώργος Π.",
    email: "g.pap@example.com",
    phone: "+30 694 000 0001",
    message: "Ενδιαφέρομαι για 20ft dry προς αγορά — παράδοση Αθήνα.",
    source: "contact",
    status: "new",
    listingSlug: "20ft-dry-peiraias",
  },
  {
    id: "lead-2",
    createdAt: "2026-07-02T15:10:00.000Z",
    name: "Maria K.",
    email: "maria.k@example.com",
    message: "Θέλω ενοικίαση 40ft για 6 μήνες, project logistics.",
    source: "rent",
    status: "contacted",
  },
  {
    id: "lead-3",
    createdAt: "2026-07-01T09:05:00.000Z",
    name: "Nikos A.",
    email: "nikos.a@example.com",
    phone: "+30 693 000 0003",
    message: "Έχω container 20ft να πουλήσω — ζητάω προσφορά αγοράς.",
    source: "buyback",
    status: "quoted",
  },
  {
    id: "lead-4",
    createdAt: "2026-06-28T11:40:00.000Z",
    name: "TechStore SA",
    email: "info@techstore.example",
    message: "Χώρος αποθήκευσης 2 containers για εποχιακό stock.",
    source: "space",
    status: "won",
  },
];

export function getMockLeads(): Lead[] {
  return mockLeads;
}

export function countLeadsByStatus(status: Lead["status"]): number {
  return mockLeads.filter((lead) => lead.status === status).length;
}
