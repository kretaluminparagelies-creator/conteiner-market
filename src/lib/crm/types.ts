/**
 * @file types.ts
 * @description CRM domain types (Supabase-ready)
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

export type LeadStatus = "new" | "contacted" | "quoted" | "won" | "lost";

export type LeadSource = "contact" | "buyback" | "rent" | "space" | "listing";

export type Lead = {
  id: string;
  createdAt: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  source: LeadSource;
  status: LeadStatus;
  listingSlug?: string;
};

export type CrmConnectionStatus = "preview" | "connected";

export type CrmNavItem = {
  href: string;
  label: string;
  labelEn: string;
  icon: "dashboard" | "listings" | "history" | "rentals" | "leads" | "settings";
};
