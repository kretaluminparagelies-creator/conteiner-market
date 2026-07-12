/**
 * @file share-image-filename.ts
 * @description Safe download filenames for depot container photos
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

export function safeContainerImageFilename(containerNumber: string, extension = "jpg"): string {
  const safeName =
    containerNumber.replace(/[^a-zA-Z0-9]+/g, "-").replace(/^-|-$/g, "") || "container";
  return `${safeName}.${extension}`;
}
