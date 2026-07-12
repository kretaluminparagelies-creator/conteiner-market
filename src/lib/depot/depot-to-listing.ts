/**
 * @file depot-to-listing.ts
 * @description Map depot inventory container to CRM listing form draft
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

import type { ListingFormInput } from "@/lib/crm/listing-form";
import type { ListingType } from "@/lib/types/listing";
import { containerTypeById } from "@/lib/constants/container-types";
import type { DepotContainer, DepotGrade } from "@/lib/depot/types";

export type DepotListingPublishOptions = {
  active?: boolean;
  isOffer?: boolean;
  listingType?: ListingType;
};

const depotTypeToListingType: Record<string, string> = {
  "20dc": "20ft Dry",
  "40dc": "40ft Dry",
  "40hc": "40ft High Cube",
  "20hc": "20ft Dry",
  "20-reefer": "20ft Reefer",
  "40-reefer": "40ft Reefer",
  "open-top": "20ft Open Top",
  "flat-rack": "20ft Flat Rack",
  "side-door": "20ft Side Opener",
  "45-pallet-wide": "45ft Pallet Wide",
  "45hc": "40ft High Cube",
  "double-door": "40ft Dry",
};

const gradeCondition: Record<DepotGrade, { el: string; en: string }> = {
  A: { el: "Grade A — χωρίς μπαλώματα", en: "Grade A" },
  B: { el: "Grade B — με μπαλώματα", en: "Grade B" },
  C: { el: "Grade C", en: "Grade C" },
};

export function depotContainerToListingType(containerType: string): string {
  return depotTypeToListingType[containerType] ?? "20ft Dry";
}

export function depotContainerToListingFormInput(
  container: DepotContainer,
  options: DepotListingPublishOptions = {},
): ListingFormInput {
  const listingType = options.listingType ?? (container.rentPrice && !container.salePrice ? "rent" : "sale");
  const type = depotContainerToListingType(container.containerType);
  const typeLabel =
    containerTypeById[container.containerType]?.name.el ?? container.containerType;
  const condition = gradeCondition[container.grade];
  const images = container.images.filter(Boolean);
  const cover = images[0] ?? "";
  const notes = container.notes?.trim();
  const descriptionParts = [
    `${typeLabel}, ${condition.el}.`,
    notes,
    "Διαθέσιμο από την αποθήκη μας — επικοινωνήστε για λεπτομέρειες.",
  ].filter(Boolean);

  return {
    type,
    containerNumber: container.containerNumber,
    listingType,
    stockCondition: "used",
    isOffer: options.isOffer ?? false,
    condition: condition.el,
    conditionEn: condition.en,
    price:
      listingType === "rent"
        ? (container.rentPrice ?? container.salePrice ?? 0)
        : (container.salePrice ?? container.rentPrice ?? 0),
    unit: listingType === "rent" ? "/μήνα" : "",
    unitEn: listingType === "rent" ? "/month" : "",
    description: descriptionParts.join(" "),
    descriptionEn: "",
    image: cover,
    images,
    active: options.active ?? true,
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
}
