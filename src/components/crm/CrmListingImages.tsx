/**
 * @file CrmListingImages.tsx
 * @description Cover image + gallery upload for CRM listing form
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

"use client";

import { ImagePlus, Star, Trash2, Upload } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";
import { prepareListingImage } from "@/lib/crm/compress-image-browser";
import { isPlaceholderImage } from "@/lib/utils/listing-image";

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
  const [pending, setPending] = useState(false);

  const gallery = images.length > 0 ? images : image ? [image] : [];

  const addUrl = (url: string) => {
    const trimmed = url.trim();
    if (!trimmed || gallery.includes(trimmed)) return;
    const next = [...gallery, trimmed];
    onGalleryChange(next);
    if (!image || isPlaceholderImage(image)) onImageChange(trimmed);
  };

  const handleUpload = (file: File) => {
    setError(null);
    setPending(true);

    void (async () => {
      try {
        const prepared = await prepareListingImage(file);
        const response = await fetch("/api/admin/upload-listing-image", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(prepared),
        });
        const result = (await response.json()) as { url?: string; error?: string };

        if (!response.ok || result.error) {
          setError(result.error ?? "Αποτυχία ανεβάσματος.");
          return;
        }
        if (result.url) {
          addUrl(result.url);
          setUrlInput("");
        }
      } catch {
        setError("Αποτυχία ανεβάσματος. Δοκίμασε ξανά.");
      } finally {
        setPending(false);
      }
    })();
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

      <div>
        <p className={labelClass}>1) Ανέβασμα από τον υπολογιστή</p>
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
          {pending ? "Ανέβασμα…" : "Επιλογή φωτογραφίας"}
        </button>
        <p className="mt-1.5 text-xs text-cm-muted">
          Διάλεξε αρχείο (JPEG/PNG/WebP/GIF, έως 12MB). Ανεβαίνει αυτόματα — δεν χρειάζεται
          τίποτα άλλο.
        </p>
      </div>

      <div>
        <p className={labelClass}>ή 2) Πρόσθεσε σύνδεσμο (URL)</p>
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
            className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-cm-border px-4 py-2.5 text-sm text-cm-sub hover:text-cm-text"
          >
            <ImagePlus className="h-4 w-4" />
            Προσθήκη
          </button>
        </div>
        <p className="mt-1.5 text-xs text-cm-muted">
          Μόνο αν έχεις ήδη link φωτογραφίας. Για δικές σου φωτό χρησιμοποίησε το «Ανέβασμα» πιο
          πάνω.
        </p>
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
