/**
 * @file listing-images.ts
 * @description Resolve primary image + gallery from CRM form input
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

import type { ListingFormInput } from "@/lib/crm/listing-form";
import { placeholderImageForType } from "@/lib/repositories/listing-format";
import { isPlaceholderImage } from "@/lib/utils/listing-image";

export function resolveListingImages(input: ListingFormInput): {
  image: string;
  images: string[] | null;
} {
  const gallery = (input.images ?? []).map((url) => url.trim()).filter(Boolean);
  const coverInput = input.image.trim();
  const primary =
    (coverInput && !isPlaceholderImage(coverInput) ? coverInput : null) ||
    gallery.find((url) => !isPlaceholderImage(url)) ||
    coverInput ||
    gallery[0] ||
    placeholderImageForType(input.type);
  const images = gallery.length > 0 ? gallery : primary ? [primary] : null;

  return { image: primary, images };
}
