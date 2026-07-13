/**
 * @file DepotIntakeForm.tsx
 * @description New container intake form
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { DepotPhotoInput } from "@/components/depot/DepotPhotoInput";
import { intakeDepotContainerAction } from "@/lib/depot/actions/depot-actions";
import { depotGradeOptions, depotTypeOptions } from "@/lib/depot/intake-options";
import {
  formatIso6346ContainerField,
  isCompleteIso6346Display,
} from "@/lib/iso6346ContainerFormat";

const fieldClass =
  "w-full rounded-xl border border-cm-light-border-strong bg-white px-3 py-3 text-base text-cm-ink outline-none transition-colors focus:border-cm-accent/50";

const labelClass = "mb-1.5 block font-mono text-[10px] tracking-[0.14em] text-cm-ink-muted uppercase";

export function DepotIntakeForm() {
  const router = useRouter();
  const [images, setImages] = useState<string[]>([]);
  const [containerNumber, setContainerNumber] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const containerComplete = isCompleteIso6346Display(containerNumber);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    const formData = new FormData(event.currentTarget);
    formData.set("images", JSON.stringify(images));

    startTransition(async () => {
      const result = await intakeDepotContainerAction(formData);
      if (result.error) {
        setError(result.error);
        return;
      }
      router.push("/depot/dispatch");
      router.refresh();
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <DepotPhotoInput images={images} onChange={setImages} dualMobileCapture />

      <div>
        <label className={labelClass} htmlFor="containerNumber">
          Αριθμός κοντέινερ
        </label>
        <input
          id="containerNumber"
          name="containerNumber"
          required
          value={containerNumber}
          onChange={(event) =>
            setContainerNumber(formatIso6346ContainerField(event.target.value))
          }
          maxLength={13}
          className={fieldClass}
          placeholder="MSCU 123456-7"
          autoCapitalize="characters"
          inputMode="text"
          autoComplete="off"
          spellCheck={false}
        />
        <p className="mt-1.5 text-xs text-cm-ink-muted">
          4 γράμματα, κενό, 6 ψηφία — το τελευταίο ψηφίο μπαίνει αυτόματα.
        </p>
      </div>

      <div>
        <label className={labelClass} htmlFor="containerType">
          Τύπος
        </label>
        <select id="containerType" name="containerType" required className={fieldClass} defaultValue="">
          <option value="" disabled>
            Επίλεξε τύπο
          </option>
          {depotTypeOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className={labelClass} htmlFor="grade">
          Grade
        </label>
        <select id="grade" name="grade" required className={fieldClass} defaultValue="A">
          {depotGradeOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelClass} htmlFor="salePrice">
            Τιμή πώλησης (προαιρ.)
          </label>
          <input id="salePrice" name="salePrice" type="number" min="0" className={fieldClass} />
        </div>
        <div>
          <label className={labelClass} htmlFor="rentPrice">
            Τιμή ενοικίασης (προαιρ.)
          </label>
          <input id="rentPrice" name="rentPrice" type="number" min="0" className={fieldClass} />
        </div>
      </div>

      <div>
        <label className={labelClass} htmlFor="notes">
          Σημειώσεις
        </label>
        <textarea id="notes" name="notes" rows={3} className={fieldClass} />
      </div>

      {error ? <p className="text-sm font-medium text-red-600">{error}</p> : null}

      <button
        type="submit"
        disabled={pending || !containerComplete}
        className="w-full rounded-2xl bg-cm-accent px-4 py-4 font-display text-base font-bold text-white shadow-cm-accent transition-transform active:scale-[0.98] disabled:opacity-60"
      >
        {pending ? "Αποθήκευση..." : "Καταχώρηση στο depo"}
      </button>
    </form>
  );
}
