/**
 * @file company.ts
 * @description Legal entity details for LOGIWORKPASS (Container Market GR operator)
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

/** Latin company name — use on site, footer, and legal documents */
export const company = {
  legalNameLatin: "LOGIWORKPASS P.C.",
  legalNameEl: "LOGIWORKPASS Ι.Κ.Ε.",
  tradeName: "LOGIWORKPASS",
  legalFormEl: "Ι.Κ.Ε.",
  legalFormLatin: "P.C.",
  gemiNumber: "194958703000",
  euid: "ELGEMI.194958703000",
  gemiRegistryEl: "ΕΠΑΓΓΕΛΜΑΤΙΚΟ ΕΠΙΜΕΛΗΤΗΡΙΟ ΑΘΗΝΑΣ",
  taxId: "803342289",
  taxOfficeEl: "ΚΕΦΟΔΕ ΑΤΤΙΚΗΣ",
  foundedDate: "08/07/2026",
  addressLine: "ΑΛΕΞΑΝΔΡΟΥΠΟΛΕΩΣ 20",
  postalCode: "11527",
  city: "ΑΘΗΝΑ",
  phone: "6939333324",
  phoneDisplay: "+30 693 933 3324",
  contactEmail: "support@logiworkpass.com",
} as const;

export function formatCompanyAddressEl(): string {
  return `${company.addressLine}, ${company.postalCode} ${company.city}`;
}

export function formatCompanyAddressEn(): string {
  return "20 Alexandroupoleos St, 115 27 Athens, Greece";
}

/** Full GEMI block — terms, privacy, cookies, returns */
export function legalCompanyDetailsEl(siteName: string): string[] {
  return [
    `${company.legalNameLatin} (${company.legalNameEl}) — ${siteName}`,
    `Διακριτικός τίτλος: ${company.tradeName}`,
    `Νομική μορφή: ${company.legalFormEl}`,
    `Έδρα: ${formatCompanyAddressEl()}`,
    `Τηλέφωνο: ${company.phoneDisplay}`,
    `Email: ${company.contactEmail}`,
    `Α.Φ.Μ.: ${company.taxId} — ${company.taxOfficeEl}`,
    `Αριθμός Γ.Ε.ΜΗ.: ${company.gemiNumber}`,
    `EUID: ${company.euid}`,
    company.gemiRegistryEl,
    `Ημερομηνία σύστασης: ${company.foundedDate}`,
  ];
}

export function legalCompanyDetailsEn(siteName: string): string[] {
  return [
    `${company.legalNameLatin} (${company.legalNameEl}) — ${siteName}`,
    `Trade name: ${company.tradeName}`,
    `Legal form: ${company.legalFormLatin} (Ι.Κ.Ε.)`,
    `Registered office: ${formatCompanyAddressEn()}`,
    `Phone: ${company.phoneDisplay}`,
    `Email: ${company.contactEmail}`,
    `Tax ID (AFM): ${company.taxId} — ${company.taxOfficeEl}`,
    `GEMI number: ${company.gemiNumber}`,
    `EUID: ${company.euid}`,
    `GEMI registry: ${company.gemiRegistryEl}`,
    `Date of incorporation: ${company.foundedDate}`,
  ];
}

/** Short block — contact page, footer-adjacent UI */
export function publicCompanyContactEl(siteName: string): string[] {
  return [
    `${company.legalNameLatin} — ${siteName}`,
    formatCompanyAddressEl(),
    `Τηλ.: ${company.phoneDisplay}`,
    `Email: ${company.contactEmail}`,
  ];
}

export function publicCompanyContactEn(siteName: string): string[] {
  return [
    `${company.legalNameLatin} — ${siteName}`,
    formatCompanyAddressEn(),
    `Tel.: ${company.phoneDisplay}`,
    `Email: ${company.contactEmail}`,
  ];
}
