/**
 * @file listing-form.ts
 * @description CRM listing form defaults & container type presets
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

import type { Listing, ListingType, RentalLocation, StockCondition } from "@/lib/types/listing";
import { isPlaceholderImage } from "@/lib/utils/listing-image";
import { resolveIsOffer, resolveStockCondition } from "@/lib/utils/listing-carousel-filters";

export const containerTypeOptions = [
  "20ft Dry",
  "40ft Dry",
  "40ft High Cube",
  "20ft Reefer",
  "40ft Reefer",
  "20ft Open Top",
  "20ft Flat Rack",
  "20ft Side Opener",
  "45ft Pallet Wide",
] as const;

export type ListingFormInput = {
  type: string;
  containerNumber: string;
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
  images: string[];
  active: boolean;
  /** Set when archived as rented — depot or customer site */
  rentalLocation: RentalLocation | "";
  rentalCustomerName: string;
  rentalCustomerPhone: string;
  rentalCustomerEmail: string;
  rentalCustomerCompany: string;
  rentalCustomerAddress: string;
  rentalCustomerNotes: string;
  rentalStartsAt: string;
  rentalEndsAt: string;
};

export const emptyListingForm: ListingFormInput = {
  type: "20ft Dry",
  containerNumber: "",
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
  images: [],
  active: true,
  rentalLocation: "",
  rentalCustomerName: "",
  rentalCustomerPhone: "",
  rentalCustomerEmail: "",
  rentalCustomerCompany: "",
  rentalCustomerAddress: "",
  rentalCustomerNotes: "",
  rentalStartsAt: "",
  rentalEndsAt: "",
};

export function listingToFormInput(listing: Listing): ListingFormInput {
  const rawGallery = listing.images?.length
    ? listing.images
    : listing.image
      ? [listing.image]
      : [];
  // Hide placeholders in the CRM: their files may not exist and render as broken.
  const gallery = rawGallery.filter((url) => url && !isPlaceholderImage(url));
  const cover =
    listing.image && !isPlaceholderImage(listing.image) ? listing.image : (gallery[0] ?? "");

  return {
    type: listing.type,
    containerNumber: listing.containerNumber ?? "",
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
    image: cover,
    images: gallery,
    active: listing.active,
    rentalLocation: listing.rentalLocation ?? "",
    rentalCustomerName: listing.rentalCustomerName ?? "",
    rentalCustomerPhone: listing.rentalCustomerPhone ?? "",
    rentalCustomerEmail: listing.rentalCustomerEmail ?? "",
    rentalCustomerCompany: listing.rentalCustomerCompany ?? "",
    rentalCustomerAddress: listing.rentalCustomerAddress ?? "",
    rentalCustomerNotes: listing.rentalCustomerNotes ?? "",
    rentalStartsAt: listing.rentalStartsAt ?? "",
    rentalEndsAt: listing.rentalEndsAt ?? "",
  };
}
