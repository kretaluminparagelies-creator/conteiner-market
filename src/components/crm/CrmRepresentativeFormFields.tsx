/**
 * @file CrmRepresentativeFormFields.tsx
 * @description Shared full representative card fields (τιμολόγηση)
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

import type { DepotRepresentative } from "@/lib/depot/types";

const fieldClass =
  "w-full rounded-lg border border-cm-border bg-cm-card px-3 py-2.5 text-sm text-cm-ink outline-none focus:border-cm-accent/50";

const labelClass = "mb-1 block font-mono text-[10px] tracking-[0.12em] text-cm-muted uppercase";

type CrmRepresentativeFormFieldsProps = {
  representative?: DepotRepresentative;
};

export function CrmRepresentativeFormFields({
  representative,
}: CrmRepresentativeFormFieldsProps) {
  return (
    <div className="space-y-5">
      <section className="space-y-3">
        <h3 className="font-mono text-[10px] tracking-[0.14em] text-cm-muted uppercase">
          Στοιχεία τιμολόγησης
        </h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className={labelClass} htmlFor="companyName">
              Επωνυμία *
            </label>
            <input
              id="companyName"
              name="companyName"
              required
              defaultValue={representative?.companyName ?? ""}
              className={fieldClass}
              placeholder="π.χ. Alpha Containers AE"
            />
          </div>
          <div>
            <label className={labelClass} htmlFor="afm">
              ΑΦΜ
            </label>
            <input
              id="afm"
              name="afm"
              inputMode="numeric"
              pattern="\d{9}"
              defaultValue={representative?.afm ?? ""}
              className={fieldClass}
              placeholder="9 ψηφία"
            />
          </div>
          <div>
            <label className={labelClass} htmlFor="doy">
              ΔΟΥ
            </label>
            <input
              id="doy"
              name="doy"
              defaultValue={representative?.doy ?? ""}
              className={fieldClass}
            />
          </div>
          <div className="sm:col-span-2">
            <label className={labelClass} htmlFor="address">
              Διεύθυνση
            </label>
            <input
              id="address"
              name="address"
              defaultValue={representative?.address ?? ""}
              className={fieldClass}
            />
          </div>
          <div>
            <label className={labelClass} htmlFor="city">
              Πόλη
            </label>
            <input id="city" name="city" defaultValue={representative?.city ?? ""} className={fieldClass} />
          </div>
          <div>
            <label className={labelClass} htmlFor="postalCode">
              Τ.Κ.
            </label>
            <input
              id="postalCode"
              name="postalCode"
              defaultValue={representative?.postalCode ?? ""}
              className={fieldClass}
            />
          </div>
        </div>
      </section>

      <section className="space-y-3">
        <h3 className="font-mono text-[10px] tracking-[0.14em] text-cm-muted uppercase">
          Επικοινωνία
        </h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClass} htmlFor="name">
              Υπεύθυνος επαφής *
            </label>
            <input
              id="name"
              name="name"
              required
              defaultValue={representative?.name ?? ""}
              className={fieldClass}
            />
          </div>
          <div>
            <label className={labelClass} htmlFor="phone">
              Τηλέφωνο
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              defaultValue={representative?.phone ?? ""}
              className={fieldClass}
            />
          </div>
          <div className="sm:col-span-2">
            <label className={labelClass} htmlFor="email">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              defaultValue={representative?.email ?? ""}
              className={fieldClass}
            />
          </div>
        </div>
      </section>

      <section>
        <label className={labelClass} htmlFor="notes">
          Εσωτερικές σημειώσεις
        </label>
        <textarea
          id="notes"
          name="notes"
          rows={4}
          defaultValue={representative?.notes ?? ""}
          className={fieldClass}
          placeholder="Περιοχή δραστηριότητας, όροι, σημειώσεις για τιμολόγηση..."
        />
      </section>
    </div>
  );
}
