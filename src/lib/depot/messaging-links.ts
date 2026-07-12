/**
 * @file messaging-links.ts
 * @description Viber and WhatsApp deep links for depot dispatch
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

const MESSAGE_MAX_LENGTH = 200;

export function normalizePhoneForMessaging(phone: string, defaultCountryCode = "30"): string | null {
  const cleaned = phone.replace(/[\s\-().]/g, "");
  if (!cleaned) return null;

  let digits = cleaned;
  if (digits.startsWith("+")) {
    digits = digits.slice(1);
  } else if (digits.startsWith("00")) {
    digits = digits.slice(2);
  } else if (!digits.startsWith(defaultCountryCode) && digits.length === 10) {
    digits = `${defaultCountryCode}${digits}`;
  }

  if (!/^\d{10,15}$/.test(digits)) return null;
  return digits;
}

export function buildViberChatUrl(phone: string, draftText: string): string | null {
  const digits = normalizePhoneForMessaging(phone);
  if (!digits) return null;

  const draft = encodeURIComponent(draftText.trim().slice(0, MESSAGE_MAX_LENGTH));
  return `viber://chat?number=%2B${digits}&draft=${draft}`;
}

export function buildViberForwardUrl(text: string): string {
  return `viber://forward?text=${encodeURIComponent(text.trim().slice(0, MESSAGE_MAX_LENGTH))}`;
}

export function buildViberDispatchUrl(text: string, phone?: string): string {
  if (phone?.trim()) {
    const chatUrl = buildViberChatUrl(phone, text);
    if (chatUrl) return chatUrl;
  }

  return buildViberForwardUrl(text);
}

export function buildWhatsAppDispatchUrl(text: string, phone?: string): string {
  const encoded = encodeURIComponent(text.trim());
  if (phone?.trim()) {
    const digits = normalizePhoneForMessaging(phone);
    if (digits) return `https://wa.me/${digits}?text=${encoded}`;
  }

  return `https://wa.me/?text=${encoded}`;
}

export type OpenMessagingOptions = {
  /** Keep the depot page open (desktop download + attach flow) */
  preservePage?: boolean;
};

function openDeepLink(url: string): void {
  const iframe = document.createElement("iframe");
  iframe.style.display = "none";
  iframe.setAttribute("aria-hidden", "true");
  iframe.src = url;
  document.body.appendChild(iframe);
  window.setTimeout(() => iframe.remove(), 2500);
}

export function openViberDispatch(
  text: string,
  phone?: string,
  options?: OpenMessagingOptions,
): string {
  const url = buildViberDispatchUrl(text, phone);
  if (options?.preservePage) {
    openDeepLink(url);
    return url;
  }
  window.location.assign(url);
  return url;
}

export function openWhatsAppDispatch(
  text: string,
  phone?: string,
  options?: OpenMessagingOptions,
): string {
  const url = buildWhatsAppDispatchUrl(text, phone);
  if (options?.preservePage) {
    window.open(url, "_blank", "noopener,noreferrer");
    return url;
  }
  window.location.assign(url);
  return url;
}
