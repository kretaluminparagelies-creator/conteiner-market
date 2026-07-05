/**
 * @file CrmListingForm.tsx
 * @description Add / edit container listing in CRM
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { CheckCircle2, EyeOff, RotateCcw } from "lucide-react";
import { CrmListingImages } from "@/components/crm/CrmListingImages";
import {
  CrmRentalContractFields,
  formToRentalHandover,
} from "@/components/crm/CrmRentalContractFields";
import {
  containerTypeOptions,
  emptyListingForm,
  type ListingFormInput,
} from "@/lib/crm/listing-form";
import {
  emptyRentalHandover,
  validateRentalHandover,
} from "@/lib/crm/rental-contract";
import {
  createListingAction,
  deleteListingAction,
  setListingActiveAction,
  updateListingAction,
} from "@/lib/crm/actions/listing-actions";
import type { ListingType } from "@/lib/types/listing";
import type { RentalHandoverInput } from "@/lib/crm/rental-contract";

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
  const [rentalHandover, setRentalHandover] = useState<RentalHandoverInput>(() =>
    initial ? formToRentalHandover(initial) : emptyRentalHandover(),
  );
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
        stockCondition === "new" && !current.condition.trim() ? "Καινούριο" : current.condition,
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

    if (!form.active && form.listingType === "rent") {
      const contractError = validateRentalHandover(formToRentalHandover(form));
      if (contractError) {
        setError(contractError);
        return;
      }
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

      {mode === "edit" && slug ? (
        <section className="rounded-xl border border-cm-border bg-cm-card/40 p-5">
          <h2 className="font-display text-base font-semibold">Διαθεσιμότητα στο site</h2>
          {form.active ? (
            <>
              <p className="mt-2 text-sm text-cm-sub">
                Η καταχώριση εμφανίζεται δημόσια. Όταν{" "}
                {form.listingType === "rent" ? "ενοικιαστεί" : "πωληθεί"}, σημείωσέ το για να
                εξαφανιστεί από το site.
              </p>
              {form.listingType === "rent" ? (
                <CrmRentalContractFields
                  value={rentalHandover}
                  onChange={setRentalHandover}
                  inputClass={inputClass}
                  labelClass={labelClass}
                />
              ) : null}
              <button
                type="button"
                disabled={pending}
                onClick={() => {
                  if (form.listingType === "rent") {
                    const contractError = validateRentalHandover(rentalHandover);
                    if (contractError) {
                      setError(contractError);
                      return;
                    }
                  }
                  const label =
                    form.listingType === "rent"
                      ? `Σημείωση ως ενοικιασμένο (${rentalHandover.customerName}) και απόκρυψη από το site;`
                      : "Σημείωση ως πωλημένο και απόκρυψη από το site;";
                  if (!window.confirm(`${label} Συνέχεια;`)) return;
                  startTransition(async () => {
                    try {
                      await setListingActiveAction(
                        slug,
                        false,
                        form.listingType === "rent" ? "rented" : "sold",
                        form.listingType === "rent" ? rentalHandover : undefined,
                      );
                    } catch (err) {
                      setError(err instanceof Error ? err.message : "Αποτυχία ενημέρωσης.");
                    }
                  });
                }}
                className="mt-4 inline-flex items-center gap-2 rounded-lg border border-amber-500/40 bg-amber-500/10 px-4 py-2.5 font-display text-sm font-semibold text-amber-200 transition-colors hover:bg-amber-500/20 disabled:opacity-50"
              >
                <EyeOff className="h-4 w-4" aria-hidden="true" />
                {form.listingType === "rent" ? "Ενοικιάστηκε" : "Πωλήθηκε"}
              </button>
            </>
          ) : (
            <>
              <p className="mt-2 flex items-center gap-2 text-sm text-cm-sub">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" aria-hidden="true" />
                Ανενεργό — δεν εμφανίζεται στο site (πωλήθηκε / ενοικιάστηκε / αποσύρθηκε).
              </p>
              {!form.active && form.listingType === "rent" ? (
                <CrmRentalContractFields
                  value={formToRentalHandover(form)}
                  onChange={(handover) =>
                    setForm((current) => ({
                      ...current,
                      rentalLocation: handover.rentalLocation,
                      rentalCustomerName: handover.customerName,
                      rentalCustomerPhone: handover.customerPhone,
                      rentalCustomerEmail: handover.customerEmail,
                      rentalCustomerCompany: handover.customerCompany,
                      rentalCustomerAddress: handover.customerAddress,
                      rentalCustomerNotes: handover.customerNotes,
                      rentalStartsAt: handover.startsAt,
                      rentalEndsAt: handover.endsAt,
                    }))
                  }
                  inputClass={inputClass}
                  labelClass={labelClass}
                />
              ) : null}
              <button
                type="button"
                disabled={pending}
                onClick={() => {
                  startTransition(async () => {
                    try {
                      await setListingActiveAction(slug, true);
                    } catch (err) {
                      setError(err instanceof Error ? err.message : "Αποτυχία ενημέρωσης.");
                    }
                  });
                }}
                className="mt-4 inline-flex items-center gap-2 rounded-lg border border-cm-border px-4 py-2.5 font-display text-sm text-cm-sub transition-colors hover:border-cm-accent hover:text-cm-text disabled:opacity-50"
              >
                <RotateCcw className="h-4 w-4" aria-hidden="true" />
                Επανενεργοποίηση στο site
              </button>
            </>
          )}
        </section>
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
            <label className={labelClass} htmlFor="containerNumber">
              Αριθμός κοντέινερ
            </label>
            <input
              id="containerNumber"
              className={inputClass}
              value={form.containerNumber}
              onChange={(e) => setField("containerNumber", e.target.value.toUpperCase())}
              placeholder="π.χ. ABCD1234567"
            />
            <p className="mt-1 text-xs text-cm-muted">
              Εσωτερικό CRM — δεν εμφανίζεται στο δημόσιο site. Χρήσιμο για να ξέρετε ποιο κοντέινερ
              δίνετε.
            </p>
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
            Ενεργό στο site (εμφανίζεται δημόσια)
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
          {pending
            ? "Αποθήκευση…"
            : mode === "create"
              ? "Δημιουργία καταχώρισης"
              : "Αποθήκευση αλλαγών"}
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
