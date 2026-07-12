/**
 * @file CrmDepotContainerDetailCard.tsx
 * @description CRM view card for one depot container with sticky publish panel
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Globe, Pencil, RotateCcw, Trash2 } from "lucide-react";
import { DepotPhotoInput } from "@/components/depot/DepotPhotoInput";
import {
  deleteCrmDepotContainerAction,
  returnCrmDepotContainerAction,
  updateCrmDepotContainerAction,
} from "@/lib/crm/actions/depot-actions";
import { formatCrmDate } from "@/lib/crm/format-crm-date";
import { containerTypeById } from "@/lib/constants/container-types";
import { depotGradeOptions, depotTypeOptions } from "@/lib/depot/intake-options";
import {
  dispatchRecipientLabel,
  formatDepotDispatchDate,
} from "@/lib/depot/offer-history";
import { depotStatusLabels, isDepotOut } from "@/lib/depot/status";
import type { DepotContainer, DepotContainerStatus, DepotDispatch } from "@/lib/depot/types";
import type { ListingType } from "@/lib/types/listing";
import {
  formatIso6346ContainerField,
  isCompleteIso6346Display,
} from "@/lib/iso6346ContainerFormat";

const inputClass =
  "w-full rounded-lg border border-cm-border bg-cm-bg px-3 py-2.5 text-sm text-cm-text outline-none transition-colors focus:border-cm-accent";

const labelClass = "mb-1.5 block font-mono text-[10px] tracking-[0.14em] text-cm-muted uppercase";

const statusOptions = Object.entries(depotStatusLabels) as [DepotContainerStatus, string][];

type CrmDepotContainerDetailCardProps = {
  container: DepotContainer;
  dispatches: DepotDispatch[];
  initialEdit?: boolean;
};

function formatPrice(value?: number): string {
  return value !== undefined ? `€${value.toLocaleString("el-GR")}` : "—";
}

export function CrmDepotContainerDetailCard({
  container,
  dispatches,
  initialEdit = false,
}: CrmDepotContainerDetailCardProps) {
  const router = useRouter();
  const typeLabel =
    containerTypeById[container.containerType]?.name.el ?? container.containerType;

  const [isEditing, setIsEditing] = useState(initialEdit);
  const [images, setImages] = useState(container.images);
  const [containerNumber, setContainerNumber] = useState(container.containerNumber);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const [publishActive, setPublishActive] = useState(true);
  const [publishOffer, setPublishOffer] = useState(false);
  const [publishListingType, setPublishListingType] = useState<ListingType>(
    container.rentPrice && !container.salePrice ? "rent" : "sale",
  );
  const containerComplete = isCompleteIso6346Display(containerNumber);

  const publishHref = `/admin/listings/new?fromDepot=${container.id}&active=${publishActive ? "1" : "0"}&isOffer=${publishOffer ? "1" : "0"}&listingType=${publishListingType}`;

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    const formData = new FormData(event.currentTarget);
    formData.set("images", JSON.stringify(images));

    startTransition(async () => {
      const result = await updateCrmDepotContainerAction(container.id, formData);
      if (result.error) {
        setError(result.error);
        return;
      }
      setIsEditing(false);
      router.refresh();
    });
  };

  const handleReturn = () => {
    startTransition(async () => {
      const result = await returnCrmDepotContainerAction(container.id);
      if (result?.error) {
        setError(result.error);
        return;
      }
      router.refresh();
    });
  };

  const handleDelete = () => {
    if (!window.confirm("Διαγραφή κοντέινερ από την αποθήκη; Διαγράφεται και το ιστορικό αποστολών.")) {
      return;
    }

    startTransition(async () => {
      const result = await deleteCrmDepotContainerAction(container.id);
      if (result?.error) {
        setError(result.error);
      }
    });
  };

  const publishPanel = (
    <div className="space-y-3 rounded-xl border border-cm-border bg-cm-card/60 p-4 shadow-cm-light-xs">
      <p className="font-mono text-[10px] tracking-[0.14em] text-cm-muted uppercase">
        Δημοσίευση στο site
      </p>

      <div>
        <label className={labelClass} htmlFor="publishListingType">
          Deal
        </label>
        <select
          id="publishListingType"
          value={publishListingType}
          onChange={(event) => setPublishListingType(event.target.value as ListingType)}
          className={inputClass}
        >
          <option value="sale">Αγορά</option>
          <option value="rent">Ενοικίαση</option>
        </select>
      </div>

      <label className="flex items-center gap-2 text-sm text-cm-ink-sub">
        <input
          type="checkbox"
          checked={publishActive}
          onChange={(event) => setPublishActive(event.target.checked)}
          className="size-4 rounded border-cm-border"
        />
        Ενεργό στο site
      </label>
      <label className="flex items-center gap-2 text-sm text-cm-ink-sub">
        <input
          type="checkbox"
          checked={publishOffer}
          onChange={(event) => setPublishOffer(event.target.checked)}
          className="size-4 rounded border-cm-border"
        />
        Ειδική προσφορά
      </label>

      <Link
        href={publishHref}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-cm-accent px-4 py-2.5 font-display text-sm font-semibold text-white transition-opacity hover:opacity-90"
      >
        <Globe className="h-4 w-4" aria-hidden="true" />
        Συνέχεια στη καταχώριση
      </Link>
    </div>
  );

  return (
    <div className="max-w-5xl">
      <Link href="/admin/depot" className="mb-5 inline-block text-sm text-cm-accent hover:underline">
        ← Πίσω στην αποθήκη
      </Link>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_17.5rem] lg:items-start">
        <div className="space-y-5">
          {!isEditing ? (
            <div className="overflow-hidden rounded-xl border border-cm-border bg-cm-card/50">
              <div className="grid gap-4 p-4 sm:grid-cols-[7.5rem_minmax(0,1fr)]">
                <div className="relative aspect-square overflow-hidden rounded-lg bg-cm-light-bg">
                  {container.images[0] ? (
                    <Image
                      src={container.images[0]}
                      alt=""
                      fill
                      unoptimized
                      sizes="120px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center font-mono text-[10px] text-cm-muted">
                      Χωρίς φωτό
                    </div>
                  )}
                </div>

                <dl className="grid gap-x-4 gap-y-2 text-sm sm:grid-cols-2">
                  <div>
                    <dt className={labelClass}>Τύπος</dt>
                    <dd className="text-cm-ink">{typeLabel}</dd>
                  </div>
                  <div>
                    <dt className={labelClass}>Grade</dt>
                    <dd className="font-mono text-cm-ink">{container.grade}</dd>
                  </div>
                  <div>
                    <dt className={labelClass}>Τιμή πώλησης</dt>
                    <dd className="font-mono text-cm-ink">{formatPrice(container.salePrice)}</dd>
                  </div>
                  <div>
                    <dt className={labelClass}>Τιμή ενοικίασης</dt>
                    <dd className="font-mono text-cm-ink">{formatPrice(container.rentPrice)}</dd>
                  </div>
                  <div>
                    <dt className={labelClass}>Καταχώρηση</dt>
                    <dd className="font-mono text-xs text-cm-sub">
                      {formatCrmDate(container.createdAt)}
                    </dd>
                  </div>
                  <div>
                    <dt className={labelClass}>Τελευταία ενημέρωση</dt>
                    <dd className="font-mono text-xs text-cm-sub">
                      {formatCrmDate(container.updatedAt)}
                    </dd>
                  </div>
                </dl>
              </div>

              {container.notes ? (
                <div className="border-t border-cm-border/70 px-4 py-3 text-sm text-cm-sub">
                  {container.notes}
                </div>
              ) : null}

              <div className="flex flex-wrap gap-2 border-t border-cm-border/70 px-4 py-3">
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="inline-flex items-center gap-2 rounded-lg border border-cm-border px-3 py-2 font-display text-sm text-cm-ink-sub transition-colors hover:border-cm-accent/40 hover:text-cm-accent"
                >
                  <Pencil className="h-4 w-4" aria-hidden="true" />
                  Επεξεργασία στοιχείων
                </button>
              </div>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="space-y-4 rounded-xl border border-cm-border bg-cm-card/50 p-5"
            >
              <div className="flex items-center justify-between gap-3">
                <p className="font-mono text-[10px] tracking-[0.14em] text-cm-muted uppercase">
                  Επεξεργασία
                </p>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="font-mono text-[10px] text-cm-accent uppercase"
                >
                  Ακύρωση
                </button>
              </div>

              <DepotPhotoInput images={images} onChange={setImages} />

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
                  className={inputClass}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className={labelClass} htmlFor="containerType">
                    Τύπος
                  </label>
                  <select
                    id="containerType"
                    name="containerType"
                    defaultValue={container.containerType}
                    className={inputClass}
                  >
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
                  <select id="grade" name="grade" defaultValue={container.grade} className={inputClass}>
                    {depotGradeOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className={labelClass} htmlFor="status">
                  Κατάσταση
                </label>
                <select id="status" name="status" defaultValue={container.status} className={inputClass}>
                  {statusOptions.map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className={labelClass} htmlFor="salePrice">
                    Τιμή πώλησης (€)
                  </label>
                  <input
                    id="salePrice"
                    name="salePrice"
                    type="number"
                    min="0"
                    defaultValue={container.salePrice ?? ""}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass} htmlFor="rentPrice">
                    Τιμή ενοικίασης (€/μήνα)
                  </label>
                  <input
                    id="rentPrice"
                    name="rentPrice"
                    type="number"
                    min="0"
                    defaultValue={container.rentPrice ?? ""}
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label className={labelClass} htmlFor="notes">
                  Σημειώσεις
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  rows={3}
                  defaultValue={container.notes ?? ""}
                  className={inputClass}
                />
              </div>

              {error ? <p className="text-sm text-red-600">{error}</p> : null}

              <div className="flex flex-wrap gap-3">
                <button
                  type="submit"
                  disabled={pending || !containerComplete}
                  className="rounded-lg bg-cm-accent px-4 py-2.5 font-display text-sm font-semibold text-white disabled:opacity-60"
                >
                  {pending ? "Αποθήκευση…" : "Αποθήκευση"}
                </button>
                <button
                  type="button"
                  disabled={pending}
                  onClick={handleDelete}
                  className="inline-flex items-center gap-2 rounded-lg border border-red-500/40 px-4 py-2.5 font-display text-sm text-red-600 hover:bg-red-500/10 disabled:opacity-50"
                >
                  <Trash2 className="h-4 w-4" aria-hidden="true" />
                  Διαγραφή
                </button>
              </div>
            </form>
          )}

          <div className="rounded-xl border border-cm-border bg-cm-card/40 p-4 lg:hidden">
            {publishPanel}
          </div>

          <div className="rounded-xl border border-cm-border bg-cm-card/40 p-4">
            <p className="mb-3 font-mono text-[10px] tracking-[0.14em] text-cm-muted uppercase">
              Ιστορικό προσφορών ({dispatches.length})
            </p>
            {dispatches.length === 0 ? (
              <p className="text-sm text-cm-sub">Δεν έχουν σταλεί προσφορές για αυτό το κοντέινερ.</p>
            ) : (
              <div className="overflow-hidden rounded-lg border border-cm-border/70">
                <table className="w-full text-left text-sm">
                  <thead className="bg-cm-light-bg font-mono text-[10px] tracking-[0.1em] text-cm-muted uppercase">
                    <tr>
                      <th className="px-3 py-2">Ημερομηνία</th>
                      <th className="px-3 py-2">Παραλήπτης</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dispatches.map((dispatch) => (
                      <tr key={dispatch.id} className="border-t border-cm-border/60">
                        <td className="px-3 py-2 font-mono text-xs text-cm-sub">
                          {formatDepotDispatchDate(dispatch.createdAt)}
                        </td>
                        <td className="px-3 py-2 text-sm">
                          {dispatchRecipientLabel(dispatch)}
                          {dispatch.recipientLabel && !dispatch.representative ? " · Εξωτερικό" : ""}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        <aside className="hidden space-y-3 lg:sticky lg:top-6 lg:block">
          {publishPanel}

          {isDepotOut(container.status) ? (
            <button
              type="button"
              disabled={pending}
              onClick={handleReturn}
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-cm-border px-4 py-2.5 font-display text-sm text-cm-ink-sub transition-colors hover:border-cm-accent/40 hover:text-cm-accent disabled:opacity-50"
            >
              <RotateCcw className="h-4 w-4" aria-hidden="true" />
              Επιστροφή στο depo
            </button>
          ) : null}
        </aside>
      </div>
    </div>
  );
}
