/**
 * @file ContactPageContent.tsx
 * @description Locale-aware contact page
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

"use client";

import { useSearchParams } from "next/navigation";
import { ContactLeadForm } from "@/components/pages/ContactLeadForm";
import { ContactPhotoLayout } from "@/components/pages/ContactPhotoLayout";
import { site } from "@/lib/constants/site";
import { useLocale } from "@/lib/i18n/locale-context";

export function ContactPageContent() {
  const { t } = useLocale();
  const page = t.pages.contact;
  const searchParams = useSearchParams();
  const isSellFlow = searchParams.get("intent") === "sell";

  const sharedContactProps = {
    emailLabel: t.common.email,
    phoneLabel: t.common.phone,
    areaLabel: t.common.area,
    areaValue: page.areaValue,
    contactPhone: site.contactPhone,
  };

  if (isSellFlow) {
    return (
      <ContactPhotoLayout
        backHref="/polisi"
        backLabel={page.backToPolisi}
        eyebrow={page.sellEyebrow}
        title={page.sellTitle}
        intro={page.sellIntro}
        form={<ContactLeadForm theme="light" flow="sell" compact />}
        {...sharedContactProps}
      />
    );
  }

  return (
    <ContactPhotoLayout
      backHref="/"
      backLabel={page.backToHome}
      eyebrow={page.inquiryEyebrow}
      title={page.inquiryTitle}
      intro={page.inquiryIntro}
      form={<ContactLeadForm theme="light" flow="inquiry" showInterestSelect compact />}
      {...sharedContactProps}
    />
  );
}
