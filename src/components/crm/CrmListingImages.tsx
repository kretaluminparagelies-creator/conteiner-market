/**
 * @file CrmListingImages.tsx
 * @description Cover image + gallery upload for CRM listing form
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

"use client";

import { ImagePlus, Star, Trash2, Upload } from "lucide-react";
import Image from "next/image";
import { useRef, useState, useTransition } from "react";
import { uploadListingImageAction } from "@/lib/crm/actions/upload-actions";

const inputClass =
  "w-full rounded-lg border border-cm-border bg-cm-bg px-3 py-2.5 text-sm text-cm-text outline-none transition-colors focus:border-cm-accent";

const labelClass = "mb-1.5 block font-mono text-[10px] tracking-[0.14em] text-cm-muted uppercase";

type CrmListingImagesProps = {
  image: string;
  images: string[];
  onImageChange: (image: string) => void;
  onGalleryChange: (images: string[]) => void;
};

export function CrmListingImages({
  image,
  images,
  onImageChange,
  onGalleryChange,
}: CrmListingImagesProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [urlInput, setUrlInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const gallery = images.length > 0 ? images : image ? [image] : [];

  const addUrl = (url: string) => {
    const trimmed = url.trim();
    if (!trimmed || gallery.includes(trimmed)) return;
    const next = [...gallery, trimmed];
    onGalleryChange(next);
    if (!image) onImageChange(trimmed);
  };

  const handleUpload = (file: File) => {
    setError(null);
    const formData = new FormData();
    formData.set("file", file);

    startTransition(async () => {
      const result = await uploadListingImageAction(formData);
      if (result.error) {
        setError(result.error);
        return;
      }
      if (result.url) {
        addUrl(result.url);
        setUrlInput("");
      }
    });
  };

  const setAsCover = (url: string) => onImageChange(url);

  const removeImage = (url: string) => {
    const next = gallery.filter((item) => item !== url);
    onGalleryChange(next);
    if (image === url) {
      onImageChange(next[0] ?? "");
    }
  };

  return (
    <section className="space-y-4 rounded-xl border border-cm-border bg-cm-card/40 p-5">
      <h2 className="font-display text-base font-semibold">Φωτογραφίες</h2>

      {error ? (
        <div className="rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {error}
        </div>
      ) : null}

      <div className="flex flex-wrap gap-3">
        <input
          ref={fileRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          className="hidden"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) handleUpload(file);
            event.target.value = "";
          }}
        />
        <button
          type="button"
          disabled={pending}
          onClick={() => fileRef.current?.click()}
          className="inline-flex items-center gap-2 rounded-lg border border-cm-border px-4 py-2.5 text-sm text-cm-sub transition-colors hover:border-cm-accent hover:text-cm-text disabled:opacity-50"
        >
          <Upload className="h-4 w-4" />
          {pending ? "Ανέβασμα…" : "Ανέβασμα αρχείου"}
        </button>
      </div>

      <div className="flex gap-2">
        <input
          className={inputClass}
          value={urlInput}
          onChange={(e) => setUrlInput(e.target.value)}
          placeholder="https://… ή /images/containers/…"
        />
        <button
          type="button"
          onClick={() => {
            addUrl(urlInput);
            setUrlInput("");
          }}
          className="shrink-0 rounded-lg border border-cm-border px-4 py-2.5 text-sm text-cm-sub hover:text-cm-text"
        >
          <ImagePlus className="h-4 w-4" />
        </button>
      </div>

      <div>
        <label className={labelClass} htmlFor="cover-image">
          Κύρια εικόνα (URL)
        </label>
        <input
          id="cover-image"
          className={inputClass}
          value={image}
          onChange={(e) => onImageChange(e.target.value)}
          placeholder="Κενό = πρώτη από gallery ή placeholder"
        />
      </div>

      {gallery.length > 0 ? (
        <ul className="grid gap-3 sm:grid-cols-2">
          {gallery.map((url) => (
            <li
              key={url}
              className={[
                "overflow-hidden rounded-lg border bg-cm-bg/50",
                image === url ? "border-cm-accent" : "border-cm-border",
              ].join(" ")}
            >
              <div className="relative aspect-video bg-cm-surf/30">
                <Image src={url} alt="" fill className="object-cover" sizes="240px" unoptimized />
                {image === url ? (
                  <span className="absolute top-2 left-2 inline-flex items-center gap-1 rounded bg-cm-accent/90 px-2 py-0.5 font-mono text-[10px] text-white uppercase">
                    <Star className="h-3 w-3" /> Cover
                  </span>
                ) : null}
              </div>
              <div className="flex gap-2 border-t border-cm-border/70 p-2">
                {image !== url ? (
                  <button
                    type="button"
                    onClick={() => setAsCover(url)}
                    className="flex-1 rounded px-2 py-1 text-xs text-cm-sub hover:bg-cm-surf/50 hover:text-cm-text"
                  >
                    Ορισμός ως cover
                  </button>
                ) : null}
                <button
                  type="button"
                  onClick={() => removeImage(url)}
                  className="rounded px-2 py-1 text-xs text-red-300 hover:bg-red-500/10"
                  aria-label="Αφαίρεση"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-xs text-cm-muted">
          Ανέβασε φωτογραφίες ή πρόσθεσε URL. Χωρίς εικόνα χρησιμοποιείται placeholder ανά τύπο.
        </p>
      )}
    </section>
  );
}
