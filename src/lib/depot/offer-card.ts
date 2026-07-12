/**
 * @file offer-card.ts
 * @description Client-side "offer card" image: photo + details baked into one file
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

import { safeContainerImageFilename } from "@/lib/depot/share-image-filename";

const CARD_WIDTH = 1080;
const SIDE_PADDING = 56;
const PANEL_TOP_PADDING = 44;
const PANEL_BOTTOM_PADDING = 56;
const TITLE_LINE_HEIGHT = 62;
const BODY_LINE_HEIGHT = 54;
const ACCENT = "#c2410c";

export type OfferCardInput = {
  photo: Blob;
  captionLines: string[];
  containerNumber: string;
};

/** Draws the container photo + caption into a single JPEG file (browser only) */
export async function buildOfferCardFile(input: OfferCardInput): Promise<File | null> {
  if (typeof document === "undefined") return null;

  try {
    const bitmap = await createImageBitmap(input.photo);
    const scale = CARD_WIDTH / bitmap.width;
    const photoHeight = Math.round(bitmap.height * scale);

    const lines = input.captionLines;
    const panelHeight =
      PANEL_TOP_PADDING +
      TITLE_LINE_HEIGHT +
      Math.max(0, lines.length - 1) * BODY_LINE_HEIGHT +
      PANEL_BOTTOM_PADDING;

    const canvas = document.createElement("canvas");
    canvas.width = CARD_WIDTH;
    canvas.height = photoHeight + panelHeight;

    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.drawImage(bitmap, 0, 0, CARD_WIDTH, photoHeight);
    bitmap.close?.();

    ctx.fillStyle = ACCENT;
    ctx.fillRect(0, photoHeight, CARD_WIDTH, 6);

    ctx.textBaseline = "alphabetic";
    let y = photoHeight + PANEL_TOP_PADDING;

    lines.forEach((line, index) => {
      if (index === 0) {
        ctx.font = '700 46px "Segoe UI", Arial, sans-serif';
        ctx.fillStyle = ACCENT;
        y += 46;
        ctx.fillText(line, SIDE_PADDING, y);
        y += TITLE_LINE_HEIGHT - 46;
        return;
      }

      ctx.font = '400 36px "Segoe UI", Arial, sans-serif';
      ctx.fillStyle = "#1f2937";
      y += 36;
      ctx.fillText(line, SIDE_PADDING, y);
      y += BODY_LINE_HEIGHT - 36;
    });

    const blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob((result) => resolve(result), "image/jpeg", 0.92);
    });
    if (!blob) return null;

    return new File([blob], safeContainerImageFilename(input.containerNumber, "jpg"), {
      type: "image/jpeg",
    });
  } catch {
    return null;
  }
}
