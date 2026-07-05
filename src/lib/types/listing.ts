/**
 * @file listing.ts
 * @description Container listing types
 * @author Katsoulakis
 * @copyright 2025 Katsoulakis. All rights reserved.
 */

export type ListingType = "sale" | "rent";

/** Stock age for carousel/catalog filters */
export type StockCondition = "new" | "used";

/** Why a listing left the public catalog (CRM history) */
export type ArchiveReason = "sold" | "rented" | "withdrawn";

/** Where a rented container is physically located (CRM only) */
export type RentalLocation = "depot" | "customer";

export type Listing = {
  id: string;
  slug: string;
  type: string;
  /** ISO container number — CRM only, not shown on public site */
  containerNumber?: string;
  condition: string;
  conditionEn?: string;
  price: number;
  priceFormatted: string;
  unit: string;
  unitEn?: string;
  location: string;
  locationEn?: string;
  listingType: ListingType;
  /** Καινούριο vs μεταχειρισμένο — για φίλτρο carousel */
  stockCondition?: StockCondition;
  /** Ειδική προσφορά — εμφανίζεται μόνο στο tab «Προσφορές» */
  isOffer?: boolean;
  image: string;
  /** Gallery slides for detail modal — falls back to repeated `image` */
  images?: string[];
  description: string;
  descriptionEn?: string;
  active: boolean;
  /** When removed from site (sold / rented / withdrawn) */
  archivedAt?: string;
  archiveReason?: ArchiveReason;
  /** For rented units: depot or customer site */
  rentalLocation?: RentalLocation;
  /** Active rental contract — CRM only */
  rentalCustomerName?: string;
  rentalCustomerPhone?: string;
  rentalCustomerEmail?: string;
  rentalCustomerCompany?: string;
  rentalCustomerAddress?: string;
  rentalCustomerNotes?: string;
  /** YYYY-MM-DD */
  rentalStartsAt?: string;
  /** YYYY-MM-DD — subscription end */
  rentalEndsAt?: string;
  /** CRM / Supabase — when the listing was created */
  createdAt?: string;
  /** CRM / Supabase — last save */
  updatedAt?: string;
};
