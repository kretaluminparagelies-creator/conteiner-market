/**
 * @file compress-image-browser.ts
 * @description Client-side image downscale + WebP compression (no server sharp)
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

const MAX_EDGE = 1400;
const WEBP_QUALITY = 0.8;

const UPLOADABLE_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

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

async function encodeCanvasToWebp(
  width: number,
  height: number,
  source: CanvasImageSource,
): Promise<PreparedImage | null> {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  ctx.drawImage(source, 0, 0, width, height);

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, "image/webp", WEBP_QUALITY),
  );

  if (!blob || blob.size === 0) return null;

  const data = await blobToBase64(blob);
  return { data, mimeType: "image/webp", size: blob.size };
}

function scaledDimensions(width: number, height: number): { width: number; height: number } {
  if (!width || !height) return { width, height };
  if (width <= MAX_EDGE && height <= MAX_EDGE) return { width, height };

  const scale = Math.min(MAX_EDGE / width, MAX_EDGE / height);
  return {
    width: Math.round(width * scale),
    height: Math.round(height * scale),
  };
}

async function preparedFromBitmap(bitmap: ImageBitmap): Promise<PreparedImage | null> {
  const { width, height } = scaledDimensions(bitmap.width, bitmap.height);
  return encodeCanvasToWebp(width, height, bitmap);
}

async function preparedFromImageElement(img: HTMLImageElement): Promise<PreparedImage | null> {
  const sourceWidth = img.naturalWidth || img.width;
  const sourceHeight = img.naturalHeight || img.height;
  const { width, height } = scaledDimensions(sourceWidth, sourceHeight);
  return encodeCanvasToWebp(width, height, img);
}

/**
 * Downscale + convert to WebP in the browser. GIFs (animation) and any failure
 * fall back to uploading the original file bytes when the type is allowed.
 */
export async function prepareListingImage(file: File): Promise<PreparedImage> {
  if (file.type === "image/gif") {
    return originalPayload(file);
  }

  if (typeof createImageBitmap === "function") {
    try {
      const bitmap = await createImageBitmap(file);
      const prepared = await preparedFromBitmap(bitmap);
      bitmap.close();
      if (prepared) return prepared;
    } catch {
      // Fall through to data-URL path (older browsers).
    }
  }

  try {
    const dataUrl = await readAsDataUrl(file);
    const img = await loadImage(dataUrl);
    const prepared = await preparedFromImageElement(img);
    if (prepared) return prepared;
  } catch {
    // Fall through to original bytes when allowed.
  }

  const original = await originalPayload(file);
  if (UPLOADABLE_TYPES.has(original.mimeType)) {
    return original;
  }

  throw new Error(
    "Η εικόνα από gallery δεν μετατράπηκε. Δοκίμασε ξανά ή λήψη με την κάμερα.",
  );
}
