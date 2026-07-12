/**
 * @file depot-messaging-share.ts
 * @description Share depot photo + caption on mobile (Viber / WhatsApp)
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

import { safeContainerImageFilename } from "@/lib/depot/share-image-filename";

export type DepotPhotoShareResult = "shared" | "unsupported" | "failed" | "cancelled";

/** True on phones/tablets that can attach a photo via the native share sheet */
export function canShareDepotPhoto(): boolean {
  if (typeof navigator.share !== "function") return false;
  if (typeof navigator.canShare !== "function") return false;

  try {
    const probe = new File([new Blob(["x"], { type: "image/jpeg" })], "probe.jpg", {
      type: "image/jpeg",
    });
    return navigator.canShare({ files: [probe] });
  } catch {
    return false;
  }
}

/** Server-side download URL that forces the browser to save the photo */
export function buildShareImageDownloadUrl(containerId: string): string {
  return `/api/depot/share-image?containerId=${encodeURIComponent(containerId)}&download=1`;
}

async function encodeBlobAsPng(source: Blob): Promise<Blob | null> {
  try {
    const bitmap = await createImageBitmap(source);
    const canvas = document.createElement("canvas");
    canvas.width = bitmap.width;
    canvas.height = bitmap.height;
    const context = canvas.getContext("2d");
    if (!context) return null;
    context.drawImage(bitmap, 0, 0);
    bitmap.close?.();

    return await new Promise<Blob | null>((resolve) => {
      canvas.toBlob((blob) => resolve(blob), "image/png");
    });
  } catch {
    return null;
  }
}

/** Copies the photo to the clipboard as PNG (browsers only accept PNG here) */
export async function copyShareImageToClipboard(file: File): Promise<boolean> {
  if (!navigator.clipboard?.write || typeof ClipboardItem === "undefined") {
    return false;
  }

  try {
    const png = file.type === "image/png" ? file : await encodeBlobAsPng(file);
    if (!png) return false;
    await navigator.clipboard.write([new ClipboardItem({ "image/png": png })]);
    return true;
  } catch {
    return false;
  }
}

function imageExtension(mimeType: string): string {
  if (mimeType.includes("png")) return "png";
  if (mimeType.includes("webp")) return "webp";
  if (mimeType.includes("gif")) return "gif";
  return "jpg";
}

export async function fetchShareImageFile(
  containerId: string,
  containerNumber: string,
): Promise<File | null> {
  try {
    const response = await fetch(
      `/api/depot/share-image?containerId=${encodeURIComponent(containerId)}`,
      { credentials: "same-origin" },
    );
    if (!response.ok) return null;

    const blob = await response.blob();
    const extension = imageExtension(blob.type);
    const type = blob.type || "image/jpeg";

    return new File([blob], safeContainerImageFilename(containerNumber, extension), { type });
  } catch {
    return null;
  }
}

function pickSharePayload(file: File, text: string): ShareData | null {
  const withText: ShareData = { text, files: [file] };
  const filesOnly: ShareData = { files: [file] };

  if (typeof navigator.canShare !== "function") {
    return withText;
  }

  if (navigator.canShare(withText)) return withText;
  if (navigator.canShare(filesOnly)) return filesOnly;
  return null;
}

export async function shareDepotPhotoFile(
  file: File,
  text: string,
): Promise<DepotPhotoShareResult> {
  if (typeof navigator.share !== "function") {
    return "unsupported";
  }

  const payload = pickSharePayload(file, text);
  if (!payload) {
    return "unsupported";
  }

  try {
    await navigator.share(payload);
    return "shared";
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      return "cancelled";
    }
    return "failed";
  }
}

export async function shareDepotWithPhoto(options: {
  text: string;
  containerId: string;
  containerNumber: string;
}): Promise<DepotPhotoShareResult> {
  if (typeof navigator.share !== "function") {
    return "unsupported";
  }

  const file = await fetchShareImageFile(options.containerId, options.containerNumber);
  if (!file) return "failed";

  return shareDepotPhotoFile(file, options.text);
}
