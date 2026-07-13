/**
 * @file share-image-filename.ts
 * @description Safe download filenames for depot container photos
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

export function safeContainerImageFilename(
  containerNumber: string,
  extension = "jpg",
  imageIndex?: number,
): string {
  const safeName =
    containerNumber.replace(/[^a-zA-Z0-9]+/g, "-").replace(/^-|-$/g, "") || "container";
  const suffix =
    imageIndex !== undefined && imageIndex > 0 ? `-${imageIndex + 1}` : "";
  return `${safeName}${suffix}.${extension}`;
}
