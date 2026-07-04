/**
 * @file compress-listing-image.ts
 * @description Resize & compress listing photos before storage upload
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

import "server-only";

import sharp from "sharp";

const MAX_EDGE = 1400;
const WEBP_QUALITY = 80;

export type CompressedImage = {
  buffer: Buffer;
  contentType: "image/webp";
  extension: "webp";
};

/** Downscale and convert to WebP — keeps photos light for site & storage */
export async function compressListingImage(input: Buffer): Promise<CompressedImage> {
  const buffer = await sharp(input)
    .rotate()
    .resize(MAX_EDGE, MAX_EDGE, { fit: "inside", withoutEnlargement: true })
    .webp({ quality: WEBP_QUALITY, effort: 4 })
    .toBuffer();

  return {
    buffer,
    contentType: "image/webp",
    extension: "webp",
  };
}
