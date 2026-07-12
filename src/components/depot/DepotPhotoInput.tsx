/**
 * @file DepotPhotoInput.tsx
 * @description Camera/file photo capture for depot intake
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

"use client";

import Image from "next/image";
import { Camera, Loader2, X } from "lucide-react";
import { useRef, useState } from "react";
import { prepareListingImage } from "@/lib/crm/compress-image-browser";

type DepotPhotoInputProps = {
  images: string[];
  onChange: (images: string[]) => void;
};

export function DepotPhotoInput({ images, onChange }: DepotPhotoInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFiles = async (fileList: FileList | null) => {
    if (!fileList?.length) return;

    setUploading(true);
    setError(null);

    try {
      const next = [...images];

      for (const file of Array.from(fileList)) {
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

        next.push(payload.url);
      }

      onChange(next);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Αποτυχία φωτογραφίας.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const removeImage = (index: number) => {
    onChange(images.filter((_, itemIndex) => itemIndex !== index));
  };

  return (
    <div className="space-y-3">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        multiple
        className="hidden"
        onChange={(event) => void handleFiles(event.target.files)}
      />

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-cm-accent/45 bg-white px-4 py-8 font-display text-sm font-semibold text-cm-ink shadow-cm-light-xs transition-colors hover:border-cm-accent hover:bg-cm-accent/5 disabled:opacity-60"
      >
        {uploading ? <Loader2 className="size-5 animate-spin" /> : <Camera className="size-5 text-cm-accent" />}
        {uploading ? "Ανέβασμα..." : "Λήψη / επιλογή φωτογραφίας"}
      </button>

      {error ? <p className="text-sm font-medium text-red-600">{error}</p> : null}

      {images.length > 0 ? (
        <div className="grid grid-cols-2 gap-3">
          {images.map((src, index) => (
            <div key={src} className="relative overflow-hidden rounded-xl border border-cm-light-border-strong">
              <Image
                src={src}
                alt=""
                width={320}
                height={240}
                unoptimized
                className="h-28 w-full object-cover"
              />
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
