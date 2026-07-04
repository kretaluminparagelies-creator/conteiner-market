/**
 * @file CrmListingForm.tsx
 * @description Add / edit container listing in CRM
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { CrmListingImages } from "@/components/crm/CrmListingImages";
import {
  containerTypeOptions,
  emptyListingForm,
  type ListingFormInput,
} from "@/lib/crm/listing-form";
import {
  createListingAction,
  deleteListingAction,
  updateListingAction,
} from "@/lib/crm/actions/listing-actions";
import type { ListingType } from "@/lib/types/listing";

type CrmListingFormProps = {
  mode: "create" | "edit";
  initial?: ListingFormInput;
  slug?: string;
};

const inputClass =
  "w-full rounded-lg border border-cm-border bg-cm-bg px-3 py-2.5 text-sm text-cm-text outline-none transition-colors focus:border-cm-accent";

const labelClass = "mb-1.5 block font-mono text-[10px] tracking-[0.14em] text-cm-muted uppercase";

export function CrmListingForm({ mode, initial, slug }: CrmListingFormProps) {
  const router = useRouter();
  const [form, setForm] = useState<ListingFormInput>(initial ?? emptyListingForm);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const setField = <K extends keyof ListingFormInput>(key: K, value: ListingFormInput[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const handleListingTypeChange = (listingType: ListingType) => {
    setForm((current) => ({
      ...current,
      listingType,
      unit: listingType === "rent" ? current.unit || "/μήνα" : "",
      unitEn: listingType === "rent" ? current.unitEn || "/month" : "",
    }));
  };

  const handleStockConditionChange = (stockCondition: "new" | "used") => {
    setForm((current) => ({
      ...current,
      stockCondition,
      condition:
        stockCondition === "new" && !current.condition.trim()
          ? "Καινούριο"
          : current.condition,
      conditionEn:
        stockCondition === "new" && !current.conditionEn.trim() ? "New" : current.conditionEn,
    }));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    if (!form.type.trim() || !form.description.trim()) {
      setError("Συμπλήρωσε τύπο και περιγραφή.");
      return;
    }

    if (form.price <= 0) {
      setError("Η τιμή πρέπει να είναι μεγαλύτερη από 0.");
      return;
    }

    startTransition(async () => {
      try {
        if (mode === "create") {
          await createListingAction(form);
        } else if (slug) {
          await updateListingAction(slug, form);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Αποτυχία αποθήκευσης.");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl space-y-8">
      {error ? (
        <div className="rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {error}
        </div>
      ) : null}

      <section className="space-y-4 rounded-xl border border-cm-border bg-cm-card/40 p-5">
        <h2 className="font-display text-base font-semibold">Βασικά στοιχεία</h2>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClass} htmlFor="type">
              Τύπος κοντέινερ
            </label>
            <select
              id="type"
              className={inputClass}
              value={form.type}
              onChange={(e) => setField("type", e.target.value)}
            >
              {containerTypeOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelClass} htmlFor="listingType">
              Deal
            </label>
            <select
              id="listingType"
              className={inputClass}
              value={form.listingType}
              onChange={(e) => handleListingTypeChange(e.target.value as ListingType)}
            >
              <option value="sale">Αγορά (sale)</option>
              <option value="rent">Ενοικίαση (rent)</option>
            </select>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClass} htmlFor="stockCondition">
              Stock (φίλτρο)
            </label>
            <select
              id="stockCondition"
              className={inputClass}
              value={form.stockCondition}
              onChange={(e) => handleStockConditionChange(e.target.value as "new" | "used")}
            >
              <option value="new">Καινούριο</option>
              <option value="used">Μεταχειρισμένο</option>
            </select>
          </div>

          <div>
            <label className={labelClass} htmlFor="condition">
              Ετικέτα κατάστασης (EL)
            </label>
            <input
              id="condition"
              className={inputClass}
              value={form.condition}
              onChange={(e) => setField("condition", e.target.value)}
              placeholder="π.χ. Grade A, Cargo Worthy"
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClass} htmlFor="conditionEn">
              Condition label (EN)
            </label>
            <input
              id="conditionEn"
              className={inputClass}
              value={form.conditionEn}
              onChange={(e) => setField("conditionEn", e.target.value)}
              placeholder="e.g. Grade A, Cargo Worthy"
            />
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <label className="flex items-center gap-2 text-sm text-cm-sub">
            <input
              type="checkbox"
              checked={form.active}
              onChange={(e) => setField("active", e.target.checked)}
              className="rounded border-cm-border"
            />
            Ενεργό στο site
          </label>
          <label className="flex items-center gap-2 text-sm text-cm-sub">
            <input
              type="checkbox"
              checked={form.isOffer}
              onChange={(e) => setField("isOffer", e.target.checked)}
              className="rounded border-cm-border"
            />
            Ειδική προσφορά (tab «Προσφορές»)
          </label>
        </div>
      </section>

      <section className="space-y-4 rounded-xl border border-cm-border bg-cm-card/40 p-5">
        <h2 className="font-display text-base font-semibold">Τιμή</h2>

        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className={labelClass} htmlFor="price">
              Τιμή (€)
            </label>
            <input
              id="price"
              type="number"
              min={1}
              className={inputClass}
              value={form.price || ""}
              onChange={(e) => setField("price", Number(e.target.value))}
            />
          </div>
          <div>
            <label className={labelClass} htmlFor="unit">
              Μονάδα (EL)
            </label>
            <input
              id="unit"
              className={inputClass}
              value={form.unit}
              onChange={(e) => setField("unit", e.target.value)}
              placeholder={form.listingType === "rent" ? "/μήνα" : "—"}
            />
          </div>
          <div>
            <label className={labelClass} htmlFor="unitEn">
              Unit (EN)
            </label>
            <input
              id="unitEn"
              className={inputClass}
              value={form.unitEn}
              onChange={(e) => setField("unitEn", e.target.value)}
              placeholder={form.listingType === "rent" ? "/month" : "—"}
            />
          </div>
        </div>

        <p className="text-xs text-cm-muted">
          Τοποθεσία: πάντα η έδρα σας (ρυθμίζεται στο site config) — όχι ανά καταχώριση.
        </p>
      </section>

      <section className="space-y-4 rounded-xl border border-cm-border bg-cm-card/40 p-5">
        <h2 className="font-display text-base font-semibold">Περιγραφή</h2>

        <div>
          <label className={labelClass} htmlFor="description">
            Περιγραφή (EL)
          </label>
          <textarea
            id="description"
            rows={3}
            className={inputClass}
            value={form.description}
            onChange={(e) => setField("description", e.target.value)}
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="descriptionEn">
            Description (EN)
          </label>
          <textarea
            id="descriptionEn"
            rows={3}
            className={inputClass}
            value={form.descriptionEn}
            onChange={(e) => setField("descriptionEn", e.target.value)}
          />
        </div>
      </section>

      <CrmListingImages
        image={form.image}
        images={form.images}
        onImageChange={(image) => setField("image", image)}
        onGalleryChange={(images) => setField("images", images)}
      />

      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-cm-accent px-5 py-2.5 font-display text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {pending ? "Αποθήκευση…" : mode === "create" ? "Δημιουργία καταχώρισης" : "Αποθήκευση αλλαγών"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/listings")}
          className="rounded-lg border border-cm-border px-5 py-2.5 font-display text-sm text-cm-sub hover:text-cm-text"
        >
          Ακύρωση
        </button>
        {mode === "edit" && slug ? (
          <button
            type="button"
            disabled={pending}
            onClick={() => {
              if (!window.confirm("Διαγραφή καταχώρισης; Δεν αναιρείται.")) return;
              startTransition(async () => {
                try {
                  await deleteListingAction(slug);
                } catch (err) {
                  setError(err instanceof Error ? err.message : "Αποτυχία διαγραφής.");
                }
              });
            }}
            className="rounded-lg border border-red-500/40 px-5 py-2.5 font-display text-sm text-red-300 hover:bg-red-500/10 disabled:opacity-50"
          >
            Διαγραφή
          </button>
        ) : null}
      </div>
    </form>
  );
}
