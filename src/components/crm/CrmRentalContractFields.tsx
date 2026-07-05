/**
 * @file CrmRentalContractFields.tsx
 * @description Customer + contract dates when handing over a rental (CRM)
 */

"use client";

import type { RentalHandoverInput } from "@/lib/crm/rental-contract";
import { rentalLocationLabels } from "@/lib/crm/rental-location-labels";
import type { RentalLocation } from "@/lib/types/listing";

type CrmRentalContractFieldsProps = {
  value: RentalHandoverInput;
  onChange: (value: RentalHandoverInput) => void;
  inputClass: string;
  labelClass: string;
};

export function CrmRentalContractFields({
  value,
  onChange,
  inputClass,
  labelClass,
}: CrmRentalContractFieldsProps) {
  const setField = <K extends keyof RentalHandoverInput>(key: K, fieldValue: RentalHandoverInput[K]) => {
    onChange({ ...value, [key]: fieldValue });
  };

  return (
    <div className="mt-4 space-y-4 rounded-lg border border-cm-border/80 bg-cm-bg/40 p-4">
      <h3 className="font-display text-sm font-semibold">Στοιχεία ενοικίασης & πελάτη</h3>

      <div>
        <p className={labelClass}>Τοποθεσία κοντέινερ</p>
        <div className="flex flex-wrap gap-3">
          {(["depot", "customer"] as const).map((location) => (
            <label
              key={location}
              className={[
                "flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors",
                value.rentalLocation === location
                  ? "border-cm-accent/50 bg-cm-accent/10 text-cm-text"
                  : "border-cm-border text-cm-sub hover:border-cm-accent/30",
              ].join(" ")}
            >
              <input
                type="radio"
                name="rentalLocation"
                checked={value.rentalLocation === location}
                onChange={() => setField("rentalLocation", location)}
                className="accent-cm-accent"
              />
              {rentalLocationLabels[location]}
            </label>
          ))}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass} htmlFor="rentalCustomerName">
            Όνομα πελάτη *
          </label>
          <input
            id="rentalCustomerName"
            className={inputClass}
            value={value.customerName}
            onChange={(e) => setField("customerName", e.target.value)}
            placeholder="π.χ. Γιώργος Παπαδόπουλος"
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="rentalCustomerPhone">
            Τηλέφωνο *
          </label>
          <input
            id="rentalCustomerPhone"
            className={inputClass}
            value={value.customerPhone}
            onChange={(e) => setField("customerPhone", e.target.value)}
            placeholder="69XXXXXXXX"
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="rentalCustomerEmail">
            Email
          </label>
          <input
            id="rentalCustomerEmail"
            type="email"
            className={inputClass}
            value={value.customerEmail}
            onChange={(e) => setField("customerEmail", e.target.value)}
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="rentalCustomerCompany">
            Εταιρεία
          </label>
          <input
            id="rentalCustomerCompany"
            className={inputClass}
            value={value.customerCompany}
            onChange={(e) => setField("customerCompany", e.target.value)}
          />
        </div>
      </div>

      <div>
        <label className={labelClass} htmlFor="rentalCustomerAddress">
          Διεύθυνση / χώρος παράδοσης
        </label>
        <input
          id="rentalCustomerAddress"
          className={inputClass}
          value={value.customerAddress}
          onChange={(e) => setField("customerAddress", e.target.value)}
          placeholder="Διεύθυνση αν είναι στον πελάτη"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass} htmlFor="rentalStartsAt">
            Έναρξη σύμβασης *
          </label>
          <input
            id="rentalStartsAt"
            type="date"
            className={inputClass}
            value={value.startsAt}
            onChange={(e) => setField("startsAt", e.target.value)}
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="rentalEndsAt">
            Λήξη σύμβασης *
          </label>
          <input
            id="rentalEndsAt"
            type="date"
            className={inputClass}
            value={value.endsAt}
            onChange={(e) => setField("endsAt", e.target.value)}
          />
        </div>
      </div>

      <div>
        <label className={labelClass} htmlFor="rentalCustomerNotes">
          Σημειώσεις
        </label>
        <textarea
          id="rentalCustomerNotes"
          rows={2}
          className={inputClass}
          value={value.customerNotes}
          onChange={(e) => setField("customerNotes", e.target.value)}
          placeholder="Π.χ. αυτόματη ανανέωση, εγγύηση, ιδιαίτεροι όροι"
        />
      </div>
    </div>
  );
}

/** Map form rental fields ↔ handover input */
export function formToRentalHandover(form: {
  rentalLocation: RentalLocation | "";
  rentalCustomerName: string;
  rentalCustomerPhone: string;
  rentalCustomerEmail: string;
  rentalCustomerCompany: string;
  rentalCustomerAddress: string;
  rentalCustomerNotes: string;
  rentalStartsAt: string;
  rentalEndsAt: string;
}): RentalHandoverInput {
  return {
    rentalLocation: (form.rentalLocation || "depot") as RentalLocation,
    customerName: form.rentalCustomerName,
    customerPhone: form.rentalCustomerPhone,
    customerEmail: form.rentalCustomerEmail,
    customerCompany: form.rentalCustomerCompany,
    customerAddress: form.rentalCustomerAddress,
    customerNotes: form.rentalCustomerNotes,
    startsAt: form.rentalStartsAt,
    endsAt: form.rentalEndsAt,
  };
}
