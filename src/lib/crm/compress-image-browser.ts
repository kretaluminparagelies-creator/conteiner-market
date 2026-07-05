/**
 * @file compress-image-browser.ts
 * @description Client-side image downscale + WebP compression (no server sharp)
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

const MAX_EDGE = 1400;
const WEBP_QUALITY = 0.8;

export type PreparedImage = {
  data: string;
  mimeType: string;
  size: number;
};

function readAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ""));
    reader.onerror = () => reject(reader.error ?? new Error("Αποτυχία ανάγνωσης αρχείου."));
    reader.readAsDataURL(file);
  });
}

function stripBase64Prefix(dataUrl: string): string {
  const comma = dataUrl.indexOf(",");
  return comma >= 0 ? dataUrl.slice(comma + 1) : dataUrl;
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Μη έγκυρη εικόνα."));
    img.src = src;
  });
}

async function originalPayload(file: File): Promise<PreparedImage> {
  const dataUrl = await readAsDataUrl(file);
  return { data: stripBase64Prefix(dataUrl), mimeType: file.type, size: file.size };
}

function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(stripBase64Prefix(String(reader.result ?? "")));
    reader.onerror = () => reject(reader.error ?? new Error("Αποτυχία επεξεργασίας εικόνας."));
    reader.readAsDataURL(blob);
  });
}

/**
 * Downscale + convert to WebP in the browser. GIFs (animation) and any failure
 * fall back to uploading the original file bytes.
 */
export async function prepareListingImage(file: File): Promise<PreparedImage> {
  if (file.type === "image/gif") {
    return originalPayload(file);
  }

  try {
    const dataUrl = await readAsDataUrl(file);
    const img = await loadImage(dataUrl);

    let width = img.naturalWidth || img.width;
    let height = img.naturalHeight || img.height;
    if (!width || !height) return originalPayload(file);

    if (width > MAX_EDGE || height > MAX_EDGE) {
      const scale = Math.min(MAX_EDGE / width, MAX_EDGE / height);
      width = Math.round(width * scale);
      height = Math.round(height * scale);
    }

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return originalPayload(file);
    ctx.drawImage(img, 0, 0, width, height);

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/webp", WEBP_QUALITY),
    );

    if (!blob || blob.size === 0) return originalPayload(file);

    const data = await blobToBase64(blob);
    return { data, mimeType: "image/webp", size: blob.size };
  } catch {
    return originalPayload(file);
  }
}
