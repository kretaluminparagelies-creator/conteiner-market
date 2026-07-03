/**
 * @file listing.ts
 * @description Container listing types
 * @author Katsoulakis
 * @copyright 2025 Katsoulakis. All rights reserved.
 */

export type ListingType = "sale" | "rent";

export type Listing = {
  id: string;
  slug: string;
  type: string;
  condition: string;
  price: number;
  priceFormatted: string;
  unit: string;
  location: string;
  listingType: ListingType;
  image: string;
  description: string;
  active: boolean;
};
