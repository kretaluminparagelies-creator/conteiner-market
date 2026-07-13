/**
 * @file DepotPhotoInput.tsx
 * @description Camera/file photo capture for depot intake
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

"use client";

import Image from "next/image";
import { Camera, ImagePlus, Loader2, Star, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { prepareListingImage } from "@/lib/crm/compress-image-browser";
import { useIsMobileLayout } from "@/lib/hooks/useIsMobileLayout";

type DepotPhotoInputProps = {
  images: string[];
  onChange: (images: string[]) => void;
  /** Two buttons (camera + gallery) on mobile — depot intake only */
  dualMobileCapture?: boolean;
};

const actionButtonClass =
  "flex w-full items-center justify-center gap-2 rounded-2xl border px-4 py-5 font-display text-sm font-semibold transition-colors disabled:opacity-60";

export function DepotPhotoInput({
  images,
  onChange,
  dualMobileCapture = false,
}: DepotPhotoInputProps) {
  const isMobile = useIsMobileLayout();
  const dualMode = dualMobileCapture && isMobile;
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const legacyInputRef = useRef<HTMLInputElement>(null);
  const imagesRef = useRef(images);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    imagesRef.current = images;
  }, [images]);

  const clearInputs = () => {
    if (cameraInputRef.current) cameraInputRef.current.value = "";
    if (galleryInputRef.current) galleryInputRef.current.value = "";
    if (legacyInputRef.current) legacyInputRef.current.value = "";
  };

  const uploadFile = async (file: File): Promise<string> => {
    const prepared = await prepareListingImage(file);
    const response = await fetch("/api/depot/upload-image", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(prepared),
    });

    const payload = (await response.json()) as { url?: string; error?: string };
    if (!response.ok || !payload.url) {
      throw new Error(payload.error ?? "Αποτυχία ανεβάσματος.");
    }

    return payload.url;
  };

  const handleFiles = async (fileList: FileList | null) => {
    if (!fileList?.length) return;

    setUploading(true);
    setError(null);

    const failures: string[] = [];
    let current = [...imagesRef.current];

    for (const file of Array.from(fileList)) {
      try {
        const url = await uploadFile(file);
        current = [...current, url];
        imagesRef.current = current;
        onChange(current);
      } catch (err) {
        const label = file.name?.trim() || "εικόνα";
        failures.push(
          err instanceof Error && err.message ? `${label}: ${err.message}` : label,
        );
      }
    }

    if (failures.length > 0) {
      setError(
        failures.length === fileList.length
          ? failures.join(" · ")
          : `Μερικές απέτυχαν: ${failures.join(" · ")}`,
      );
    }

    setUploading(false);
    clearInputs();
  };

  const removeImage = (index: number) => {
    const next = images.filter((_, itemIndex) => itemIndex !== index);
    imagesRef.current = next;
    onChange(next);
  };

  const setPrimaryImage = (index: number) => {
    if (index <= 0 || index >= images.length) return;
    const next = [images[index]!, ...images.filter((_, itemIndex) => itemIndex !== index)];
    imagesRef.current = next;
    onChange(next);
  };

  return (
    <div className="space-y-3">
      {dualMode ? (
        <>
          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            multiple
            className="hidden"
            onChange={(event) => void handleFiles(event.target.files)}
          />
          <input
            ref={galleryInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(event) => void handleFiles(event.target.files)}
          />

          <div className="grid gap-2">
            <button
              type="button"
              onClick={() => cameraInputRef.current?.click()}
              disabled={uploading}
              className={`${actionButtonClass} border-dashed border-cm-accent/45 bg-white text-cm-ink shadow-cm-light-xs hover:border-cm-accent hover:bg-cm-accent/5`}
            >
              {uploading ? (
                <Loader2 className="size-5 animate-spin" aria-hidden="true" />
              ) : (
                <Camera className="size-5 text-cm-accent" aria-hidden="true" />
              )}
              {uploading ? "Ανέβασμα..." : "Λήψη φωτογραφίας"}
            </button>
            <button
              type="button"
              onClick={() => galleryInputRef.current?.click()}
              disabled={uploading}
              className={`${actionButtonClass} border-cm-light-border-strong bg-white text-cm-ink-sub shadow-cm-light-xs hover:border-cm-accent/40 hover:bg-cm-accent/5 hover:text-cm-ink`}
            >
              <ImagePlus className="size-5 text-cm-accent" aria-hidden="true" />
              Από gallery / αρχεία
            </button>
          </div>
        </>
      ) : (
        <>
          <input
            ref={legacyInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            multiple
            className="hidden"
            onChange={(event) => void handleFiles(event.target.files)}
          />

          <button
            type="button"
            onClick={() => legacyInputRef.current?.click()}
            disabled={uploading}
            className={`${actionButtonClass} border-dashed border-cm-accent/45 bg-white py-8 text-cm-ink shadow-cm-light-xs hover:border-cm-accent hover:bg-cm-accent/5`}
          >
            {uploading ? (
              <Loader2 className="size-5 animate-spin" aria-hidden="true" />
            ) : (
              <Camera className="size-5 text-cm-accent" aria-hidden="true" />
            )}
            {uploading ? "Ανέβασμα..." : "Λήψη / επιλογή φωτογραφίας"}
          </button>
        </>
      )}

      {images.length > 0 ? (
        <p className="text-xs text-cm-ink-sub">
          Η πρώτη φωτό (Κύρια) είναι η κάρτα προσφοράς στο Viber. Όλες οι φωτό στέλνονται μία-μία.
        </p>
      ) : null}

      {error ? <p className="text-sm font-medium text-red-600">{error}</p> : null}

      {images.length > 0 ? (
        <div className="grid grid-cols-2 gap-3">
          {images.map((src, index) => (
            <div key={`${src}-${index}`} className="relative overflow-hidden rounded-xl border border-cm-light-border-strong">
              <Image
                src={src}
                alt=""
                width={320}
                height={240}
                unoptimized
                className="h-28 w-full object-cover"
              />
              {index === 0 ? (
                <span className="absolute top-2 left-2 inline-flex items-center gap-0.5 rounded-full bg-cm-accent/90 px-2 py-0.5 font-mono text-[9px] text-white uppercase">
                  <Star className="size-3" aria-hidden="true" />
                  Κύρια
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => setPrimaryImage(index)}
                  className="absolute top-2 left-2 rounded-full bg-black/55 px-2 py-0.5 font-mono text-[9px] text-white"
                >
                  Κύρια
                </button>
              )}
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-2 right-2 rounded-full bg-black/55 p-1 text-white"
                aria-label="Αφαίρεση φωτογραφίας"
              >
                <X className="size-4" />
              </button>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
