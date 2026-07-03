/**
 * @file listing.ts
 * @description Container listing types
 * @author Katsoulakis
 * @copyright 2025 Katsoulakis. All rights reserved.
 */

export type ListingType = "sale" | "rent";

/** Stock age for carousel/catalog filters */
export type StockCondition = "new" | "used";

export type Listing = {
  id: string;
  slug: string;
  type: string;
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
};
