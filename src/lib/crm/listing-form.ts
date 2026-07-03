/**
 * @file listing-form.ts
 * @description CRM listing form defaults & container type presets
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

import type { Listing, ListingType, StockCondition } from "@/lib/types/listing";
import {
  resolveIsOffer,
  resolveStockCondition,
} from "@/lib/utils/listing-carousel-filters";

export const containerTypeOptions = [
  "20ft Dry",
  "40ft Dry",
  "40ft High Cube",
  "20ft Reefer",
  "20ft Open Top",
  "45ft Pallet Wide",
] as const;

export type ListingFormInput = {
  type: string;
  listingType: ListingType;
  stockCondition: StockCondition;
  isOffer: boolean;
  condition: string;
  conditionEn: string;
  price: number;
  unit: string;
  unitEn: string;
  description: string;
  descriptionEn: string;
  image: string;
  active: boolean;
};

export const emptyListingForm: ListingFormInput = {
  type: "20ft Dry",
  listingType: "sale",
  stockCondition: "new",
  isOffer: false,
  condition: "Καινούριο",
  conditionEn: "New",
  price: 0,
  unit: "",
  unitEn: "",
  description: "",
  descriptionEn: "",
  image: "",
  active: true,
};

export function listingToFormInput(listing: Listing): ListingFormInput {
  return {
    type: listing.type,
    listingType: listing.listingType,
    stockCondition: listing.stockCondition ?? resolveStockCondition(listing),
    isOffer: listing.isOffer ?? resolveIsOffer(listing),
    condition: listing.condition,
    conditionEn: listing.conditionEn ?? "",
    price: listing.price,
    unit: listing.unit,
    unitEn: listing.unitEn ?? "",
    description: listing.description,
    descriptionEn: listing.descriptionEn ?? "",
    image: listing.image,
    active: listing.active,
  };
}
