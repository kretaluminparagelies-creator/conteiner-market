/**
 * @file DepotMobileDispatchForm.tsx
 * @description Minimal mobile dispatch — rep pick + Viber/WhatsApp photo send
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

"use client";

import Image from "next/image";
import { Check, Copy } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  dispatchDepotContainerAction,
  shareDepotContainerExternallyAction,
} from "@/lib/depot/actions/depot-actions";
import {
  canShareDepotPhoto,
  fetchShareImageFile,
  shareContainerPhotosSequentially,
  type DepotPhotoShareProgress,
} from "@/lib/depot/depot-messaging-share";
import { buildOfferCardFile } from "@/lib/depot/offer-card";
import { filterAvailableContainers } from "@/lib/depot/filters";
import { filterRepresentatives } from "@/lib/depot/filter-representatives";
import { openViberDispatch, openWhatsAppDispatch } from "@/lib/depot/messaging-links";
import { buildDepotMobileShareText } from "@/lib/depot/share-text";
import { DepotAvailableList } from "@/components/depot/DepotAvailableList";
import { DepotContainerCard } from "@/components/depot/DepotContainerCard";
import {
  DepotRepresentativePicker,
  type DepotRecipientMode,
} from "@/components/depot/DepotRepresentativePicker";
import type { DepotContainer, DepotRepresentative } from "@/lib/depot/types";
import { EXTERNAL_DISPATCH_RECIPIENT_LABEL } from "@/lib/depot/types";

type DepotMobileDispatchFormProps = {
  containers: DepotContainer[];
  representatives: DepotRepresentative[];
  initialContainerId?: string;
};

type SendApp = "viber" | "whatsapp";

function ShareProgressOverlay({ progress }: { progress: DepotPhotoShareProgress }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 px-6">
      <div className="w-full max-w-xs rounded-2xl bg-white px-6 py-5 text-center shadow-lg">
        <p className="text-sm text-cm-ink-sub">Περιμένετε…</p>
        <p className="mt-2 font-display text-xl font-bold text-cm-ink">
          Αποστολή {progress.current}/{progress.total}
        </p>
        <p className="mt-2 text-xs text-cm-ink-sub">
          Πάτα Μοιρασμός και διάλεξε Viber ή WhatsApp
        </p>
      </div>
    </div>
  );
}

function ContainerPreview({ container }: { container: DepotContainer }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-cm-light-border-strong bg-white">
      {container.images[0] ? (
        <div className="relative aspect-[4/3] bg-cm-light-bg">
          <Image
            src={container.images[0]}
            alt=""
            fill
            unoptimized
            sizes="(max-width: 512px) 100vw, 512px"
            className="object-cover"
          />
        </div>
      ) : null}
      <div className="px-4 py-3">
        <p className="font-mono text-sm font-bold">{container.containerNumber}</p>
        <p className="text-sm text-cm-ink-sub">
          {container.containerType} · Grade {container.grade}
        </p>
      </div>
    </div>
  );
}

export function DepotMobileDispatchForm({
  containers,
  representatives,
  initialContainerId,
}: DepotMobileDispatchFormProps) {
  const available = filterAvailableContainers(containers);
  const defaultContainerId =
    initialContainerId && available.some((item) => item.id === initialContainerId)
      ? initialContainerId
      : "";
  const [containerId, setContainerId] = useState(defaultContainerId);
  const [representativeId, setRepresentativeId] = useState("");
  const [recipientMode, setRecipientMode] = useState<DepotRecipientMode>("crm");
  const [searchQuery, setSearchQuery] = useState("");
  const [shareImageFile, setShareImageFile] = useState<File | null>(null);
  const [dispatchedContainer, setDispatchedContainer] = useState<DepotContainer | null>(null);
  const [shareText, setShareText] = useState<string | null>(null);
  const [recipientPhone, setRecipientPhone] = useState<string | undefined>();
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [shareProgress, setShareProgress] = useState<DepotPhotoShareProgress | null>(null);
  const [cardFile, setCardFile] = useState<File | null>(null);
  const photoShareSupported = useMemo(() => canShareDepotPhoto(), []);

  const selected = available.find((item) => item.id === containerId);
  const selectedRepresentative = representatives.find((item) => item.id === representativeId);
  const displayContainer =
    dispatchedContainer ?? selected ?? containers.find((item) => item.id === containerId);
  const pickingContainer = !containerId && !shareText;

  const trimmedSearchQuery = searchQuery.trim();
  const crmMatches = useMemo(
    () => (trimmedSearchQuery ? filterRepresentatives(representatives, searchQuery) : []),
    [representatives, searchQuery, trimmedSearchQuery],
  );
  const useExternalShare =
    recipientMode === "external" ||
    (!representativeId && trimmedSearchQuery.length > 0 && crmMatches.length === 0);
  const canSubmit = Boolean(containerId) && (Boolean(representativeId) || useExternalShare);
  const shareReady = Boolean(shareText);

  useEffect(() => {
    let cancelled = false;

    const loadPhoto = async () => {
      const container = selected;
      if (!container?.images[0]) {
        setShareImageFile(null);
        return;
      }
      const file = await fetchShareImageFile(container.id, container.containerNumber);
      if (!cancelled) setShareImageFile(file);
    };
    void loadPhoto();

    return () => {
      cancelled = true;
    };
  }, [selected]);

  useEffect(() => {
    let cancelled = false;

    const buildCard = async () => {
      const container = displayContainer;
      if (!container?.images[0] || !shareImageFile) {
        setCardFile(null);
        return;
      }
      const card = await buildOfferCardFile({
        photo: shareImageFile,
        captionLines: buildDepotMobileShareText(container).split("\n"),
        containerNumber: container.containerNumber,
      });
      if (!cancelled && card) setCardFile(card);
    };
    void buildCard();

    return () => {
      cancelled = true;
    };
  }, [displayContainer, shareImageFile]);

  const openMessagingApp = (app: SendApp, text: string, phone?: string) => {
    const preservePage = !photoShareSupported;
    if (app === "viber") {
      openViberDispatch(text, phone, { preservePage });
      return;
    }
    openWhatsAppDispatch(text, phone, { preservePage });
  };

  const buildCardFor = async (container: DepotContainer): Promise<File | null> => {
    if (cardFile && container.id === displayContainer?.id) {
      return cardFile;
    }

    const photo =
      shareImageFile ?? (await fetchShareImageFile(container.id, container.containerNumber));
    if (!photo) return null;
    if (!shareImageFile) setShareImageFile(photo);

    const captionLines = buildDepotMobileShareText(container).split("\n");
    return buildOfferCardFile({
      photo,
      captionLines,
      containerNumber: container.containerNumber,
    });
  };

  const shareAllPhotos = async (container: DepotContainer, text: string) => {
    const imageCount = container.images.filter(Boolean).length;
    const firstPhotoFile = imageCount > 0 ? await buildCardFor(container) : null;

    return shareContainerPhotosSequentially({
      containerId: container.id,
      containerNumber: container.containerNumber,
      imageCount,
      text,
      firstPhotoFile,
      onProgress: setShareProgress,
    });
  };

  const openAppWithPhoto = async (
    app: SendApp,
    container: DepotContainer,
    text: string,
    phone?: string,
  ) => {
    if (!photoShareSupported) {
      openMessagingApp(app, text, phone);
      return;
    }

    const photoResult = await shareAllPhotos(container, text);
    if (photoResult === "shared" || photoResult === "cancelled") {
      return;
    }
    openMessagingApp(app, text, phone);
  };

  const handleSend = async (app: SendApp) => {
    setError(null);
    setCopied(false);

    const containerSnapshot = selected ?? containers.find((item) => item.id === containerId);
    if (!containerSnapshot) {
      setError("Το κοντέινερ δεν είναι πλέον διαθέσιμο.");
      return;
    }

    const text = buildDepotMobileShareText(containerSnapshot);
    const phone = useExternalShare ? undefined : selectedRepresentative?.phone;

    setSending(true);
    setShareProgress(null);

    try {
      let photoShared = false;

      if (photoShareSupported) {
        const photoResult = await shareAllPhotos(containerSnapshot, text);
        if (photoResult === "cancelled") {
          return;
        }
        photoShared = photoResult === "shared";
      }

      const formData = new FormData();
      formData.set("containerId", containerId);

      const result =
        useExternalShare && !representativeId
          ? await (() => {
              formData.set("recipientLabel", trimmedSearchQuery || EXTERNAL_DISPATCH_RECIPIENT_LABEL);
              return shareDepotContainerExternallyAction(formData);
            })()
          : await (() => {
              formData.set("representativeId", representativeId);
              formData.set("dispatchType", "offer");
              return dispatchDepotContainerAction(formData);
            })();

      if (result.error) {
        setError(result.error);
        return;
      }

      const shareTextValue = result.shareText ?? text;
      setDispatchedContainer(containerSnapshot);
      setShareText(shareTextValue);
      setRecipientPhone(phone);

      if (!photoShared) {
        await openAppWithPhoto(app, containerSnapshot, shareTextValue, phone);
      }
    } finally {
      setShareProgress(null);
      setSending(false);
    }
  };

  const handleResend = async (app: SendApp) => {
    if (!shareText || !displayContainer) return;
    setSending(true);
    setShareProgress(null);
    try {
      await openAppWithPhoto(app, displayContainer, shareText, recipientPhone);
    } finally {
      setShareProgress(null);
      setSending(false);
    }
  };

  const copyShareText = async () => {
    if (!shareText) return;
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError("Δεν ήταν δυνατή η αντιγραφή.");
    }
  };

  if (representatives.length === 0) {
    return (
      <div className="space-y-3 rounded-2xl border border-cm-light-border-strong bg-white px-4 py-6 text-sm text-cm-ink-sub">
        <p>Δεν υπάρχουν διαθέσιμες επιλογές.</p>
        <Link href="/admin/representatives" className="font-semibold text-cm-accent">
          Πρόσθεσέ τες από το CRM →
        </Link>
      </div>
    );
  }

  if (!shareReady && available.length === 0) {
    return (
      <p className="rounded-2xl border border-cm-light-border-strong bg-white px-4 py-6 text-sm text-cm-ink-sub">
        Δεν υπάρχουν διαθέσιμα κοντέινερ για αποστολή.
      </p>
    );
  }

  if (shareReady && shareText) {
    return (
      <div className="space-y-5">
        {shareProgress ? <ShareProgressOverlay progress={shareProgress} /> : null}
        {displayContainer ? <ContainerPreview container={displayContainer} /> : null}

        <div className="space-y-3 rounded-2xl border border-cm-accent/25 bg-cm-accent/5 p-4">
          <p className="font-mono text-[10px] tracking-[0.14em] text-cm-accent uppercase">
            Αποστολή
          </p>

          <pre className="overflow-x-auto whitespace-pre-wrap break-words rounded-xl border border-cm-light-border-strong bg-white px-3 py-2 font-sans text-sm text-cm-ink">
            {shareText}
          </pre>

          {photoShareSupported ? (
            <>
              <p className="text-sm text-cm-ink-sub">Στείλε φωτογραφία με Viber ή WhatsApp.</p>
              <div className="grid gap-2">
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => void handleResend("viber")}
                    disabled={sending}
                    className="inline-flex flex-1 items-center justify-center rounded-xl bg-cm-accent px-3 py-3 text-sm font-semibold text-white disabled:opacity-60"
                  >
                    Viber
                  </button>
                  <button
                    type="button"
                    onClick={() => void handleResend("whatsapp")}
                    disabled={sending}
                    className="inline-flex flex-1 items-center justify-center rounded-xl bg-cm-accent px-3 py-3 text-sm font-semibold text-white disabled:opacity-60"
                  >
                    WhatsApp
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => void copyShareText()}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-cm-light-border-strong bg-white px-3 py-3 text-sm font-semibold"
                >
                  {copied ? <Check className="size-4 text-green-600" /> : <Copy className="size-4" />}
                  {copied ? "OK" : "Αντιγραφή κειμένου"}
                </button>
              </div>
            </>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-cm-ink-sub">
                Από υπολογιστή ανοίγει το κείμενο. Για φωτογραφία, στείλε την προσφορά από κινητό.
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => void handleResend("viber")}
                  disabled={sending}
                  className="inline-flex flex-1 items-center justify-center rounded-xl bg-cm-accent px-3 py-3 text-sm font-semibold text-white disabled:opacity-60"
                >
                  Άνοιξε Viber
                </button>
                <button
                  type="button"
                  onClick={() => void handleResend("whatsapp")}
                  disabled={sending}
                  className="inline-flex flex-1 items-center justify-center rounded-xl bg-cm-accent px-3 py-3 text-sm font-semibold text-white disabled:opacity-60"
                >
                  Άνοιξε WhatsApp
                </button>
              </div>
              <button
                type="button"
                onClick={() => void copyShareText()}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-cm-light-border-strong bg-white px-3 py-3 text-sm font-semibold"
              >
                {copied ? <Check className="size-4 text-green-600" /> : <Copy className="size-4" />}
                {copied ? "OK" : "Αντιγραφή κειμένου"}
              </button>
            </div>
          )}
        </div>

        <Link
          href="/depot/dispatch"
          className="block rounded-2xl border border-cm-light-border-strong bg-white px-4 py-3 text-center font-display text-sm font-semibold text-cm-accent"
        >
          Νέα προσφορά
        </Link>
      </div>
    );
  }

  if (pickingContainer) {
    return (
      <DepotAvailableList
        containers={available}
        mode="select"
        onSelect={(container) => setContainerId(container.id)}
        countLabel="διαθέσιμα"
        emptyLabel="Δεν βρέθηκαν κοντέινερ με αυτά τα φίλτρα."
      />
    );
  }

  return (
    <div className="space-y-5">
      {shareProgress ? <ShareProgressOverlay progress={shareProgress} /> : null}
      <button
        type="button"
        onClick={() => setContainerId("")}
        className="w-full rounded-xl border border-cm-light-border-strong bg-white px-4 py-3 text-left font-display text-sm font-semibold text-cm-accent transition-colors hover:border-cm-accent/40 hover:bg-cm-accent/5"
      >
        Άλλο κοντέινερ
      </button>

      {displayContainer ? (
        <DepotContainerCard container={displayContainer} selected />
      ) : null}

      {!selected && containerId ? (
        <p className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          Το κοντέινερ δεν είναι πλέον διαθέσιμο. Επίλεξε άλλο από τη λίστα.
        </p>
      ) : null}

      <DepotRepresentativePicker
        representatives={representatives}
        value={representativeId}
        onChange={setRepresentativeId}
        recipientMode={recipientMode}
        onRecipientModeChange={setRecipientMode}
        onSearchQueryChange={setSearchQuery}
      />

      <div className="rounded-2xl border border-cm-light-border-strong bg-white px-4 py-3">
        <p className="font-mono text-[10px] tracking-[0.14em] text-cm-ink-muted uppercase">
          Τύπος
        </p>
        <p className="mt-1 font-display text-sm font-semibold text-cm-ink">Προσφορά</p>
        <p className="mt-1 text-xs text-cm-ink-sub">
          {photoShareSupported
            ? "Φωτογραφία με Viber ή WhatsApp — όχι link."
            : "Από υπολογιστή στέλνεται κείμενο. Για φωτογραφία, στείλε από κινητό."}
        </p>
      </div>

      {error ? <p className="text-sm font-medium text-red-600">{error}</p> : null}

      <div className="grid gap-2">
        <button
          type="button"
          onClick={() => void handleSend("viber")}
          disabled={sending || !canSubmit || !selected}
          className="w-full rounded-2xl bg-cm-accent px-4 py-4 font-display text-base font-bold text-white shadow-cm-accent transition-transform active:scale-[0.98] disabled:opacity-60"
        >
          {sending
            ? shareProgress
              ? `Περιμένετε… ${shareProgress.current}/${shareProgress.total}`
              : "Προετοιμασία..."
            : photoShareSupported
              ? "Στείλε με Viber"
              : "Άνοιξε Viber"}
        </button>
        <button
          type="button"
          onClick={() => void handleSend("whatsapp")}
          disabled={sending || !canSubmit || !selected}
          className="w-full rounded-2xl border border-cm-accent bg-white px-4 py-4 font-display text-base font-bold text-cm-accent transition-transform active:scale-[0.98] disabled:opacity-60"
        >
          {sending
            ? shareProgress
              ? `Περιμένετε… ${shareProgress.current}/${shareProgress.total}`
              : "Προετοιμασία..."
            : photoShareSupported
              ? "Στείλε με WhatsApp"
              : "Άνοιξε WhatsApp"}
        </button>
      </div>
    </div>
  );
}
