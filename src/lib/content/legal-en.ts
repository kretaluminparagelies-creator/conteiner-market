/**
 * @file legal-en.ts
 * @description English legal copy — terms, privacy, cookies (Container Market GR)
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

import type { LegalSection } from "@/lib/content/legal-el";
import { site } from "@/lib/constants/site";

const companyName = "Logiworkpass P.C.";
const siteName = "Container Market GR";
const siteUrl = "containermarket.gr";
const contactEmail = site.contactEmail;

export const termsSections: LegalSection[] = [
  {
    id: "intro",
    title: "1. Introduction",
    paragraphs: [
      `This website ${siteUrl} (the "Website") is operated by ${companyName} (the "Company"), administrator of ${siteName}. The Company sells and rents its own shipping containers and provides storage space rental services in Greece.`,
      "By accessing and using the Website, you agree to these Terms of Use. If you do not agree, please do not use the Website.",
      "Processing of personal data is governed by the Website Privacy Policy, in accordance with the GDPR (EU Regulation 2016/679) and Greek law.",
    ],
  },
  {
    id: "product-info",
    title: "2. Product information",
    paragraphs: [
      "The Company makes every effort to ensure that information about containers and offers (descriptions, prices, technical specifications, ISO types, and photos) is accurate and up to date.",
      "However, typographical errors or variations may occur, and the Company reserves the right to correct them without prior notice.",
      "Information and prices shown on the Website are indicative and do not constitute a binding offer unless agreed otherwise in writing after contact with us.",
    ],
  },
  {
    id: "prices",
    title: "3. Prices",
    paragraphs: [
      "All prices are shown in euros (€), unless stated otherwise (e.g. /month for rental).",
      "The Company reserves the right to change prices without prior notice.",
      "In case of an incorrect price due to technical or human error, the Company reserves the right not to proceed with an agreement or to cancel it after informing you.",
    ],
  },
  {
    id: "availability",
    title: "4. Product availability",
    paragraphs: [
      "Container and offer availability may change without notice.",
      "The Company is not liable for unavailability of a specific type or offer. Final availability is confirmed after contact.",
    ],
  },
  {
    id: "ip",
    title: "5. Intellectual property",
    paragraphs: [
      "All Website content (text, photos, logos, graphics, design, software, and structure) is the intellectual property of the Company or its lawful rights holders and is protected by applicable law.",
      `Copying, reproduction, or use of the content without prior written permission is prohibited. For permission requests: ${contactEmail}.`,
    ],
  },
  {
    id: "liability",
    title: "6. Limitation of liability",
    paragraphs: [
      "The Company is not liable for any direct or indirect damage arising from use of the Website or the information it contains, except where required by law.",
      "The Company makes every effort to operate the Website securely but does not guarantee uninterrupted, error-free operation or freedom from viruses or malicious software.",
    ],
  },
  {
    id: "links",
    title: "7. Third-party links",
    paragraphs: [
      "The Website may include links to third-party websites. The Company is not responsible for the content or policies of those websites.",
    ],
  },
  {
    id: "changes",
    title: "8. Changes to terms",
    paragraphs: [
      "The Company reserves the right to amend these Terms of Use at any time. Changes are published on this page. Continued use after changes constitutes acceptance of the updated terms.",
      "These terms are governed by Greek law. The courts of Greece have jurisdiction over any dispute.",
    ],
  },
  {
    id: "company",
    title: "9. Company details",
    paragraphs: [
      `${companyName} — ${siteName}`,
      `Email: ${contactEmail}`,
      "Greece — nationwide service",
    ],
  },
];

export const privacySections: LegalSection[] = [
  {
    id: "intro",
    title: "1. Introduction",
    paragraphs: [
      `${companyName} (the "Company"), administrator of ${siteName}, respects the privacy of visitors to ${siteUrl} (the "Website") and is committed to protecting their personal data.`,
      "This Privacy Policy explains how personal data is collected, used, and protected when you visit and use the Website, in accordance with the General Data Protection Regulation (GDPR — EU Regulation 2016/679) and Greek law.",
    ],
  },
  {
    id: "data",
    title: "2. Information we collect",
    paragraphs: ["When using the Website, the following information may be collected:"],
    bullets: [
      "Name and contact details",
      "Email address",
      "Phone number",
      "Information submitted via contact forms or quote requests (e.g. container type, location)",
      "Technical data such as IP address, browser type, and access device",
      "Language preferences (localStorage) — see Cookie Policy",
    ],
    paragraphsAfterBullets: [
      "This information is collected only when provided voluntarily or through Website analytics tools.",
    ],
  },
  {
    id: "purpose",
    title: "3. Use of information",
    paragraphs: ["Data is used to:"],
    bullets: [
      "Respond to contact requests",
      "Provide information about containers, offers, and services",
      "Improve Website operation",
      "Ensure system security and proper operation",
      "Comply with legal obligations, where applicable",
    ],
    paragraphsAfterBullets: [
      "The Company does not sell or share personal data with third parties for advertising purposes.",
    ],
  },
  {
    id: "protection",
    title: "4. Data protection",
    paragraphs: [
      "The Company takes appropriate technical and organisational measures to protect personal data from unauthorised access, loss, or misuse.",
      "However, no data transmission over the internet can be considered completely secure.",
    ],
  },
  {
    id: "cookies",
    title: "5. Cookies",
    paragraphs: ["The Website may use cookies and similar technologies to:"],
    bullets: [
      "improve user experience",
      "analyse traffic (when relevant tools are enabled)",
      "operate essential Website services",
    ],
    paragraphsAfterBullets: ["For more information, see the Cookie Policy."],
  },
  {
    id: "third-party",
    title: "6. Third-party services",
    paragraphs: [
      "The Website may use or integrate third-party services in the future, such as:",
    ],
    bullets: [
      "Google Analytics",
      "Social networks (Facebook, Instagram, YouTube)",
      "Hosting and technical support providers",
    ],
    paragraphsAfterBullets: [
      "We do not currently use Google Analytics or third-party marketing cookies; if enabled, this policy will be updated and consent will be requested where required by law. These services may collect data under their own privacy policies.",
    ],
  },
  {
    id: "rights",
    title: "7. User rights",
    paragraphs: [
      "Under the General Data Protection Regulation (GDPR), users have the right to:",
    ],
    bullets: [
      "request access to their personal data",
      "request rectification or erasure of data",
      "request restriction of processing",
      "object to processing",
      "request data portability, where applicable",
      "withdraw consent where processing is based on consent",
    ],
    paragraphsAfterBullets: [
      `For any request, contact us at ${contactEmail}. You also have the right to lodge a complaint with the Hellenic Data Protection Authority (www.dpa.gr).`,
    ],
  },
  {
    id: "changes",
    title: "8. Policy changes",
    paragraphs: [
      "The Company reserves the right to amend this Privacy Policy at any time. Changes will be published on this page.",
    ],
  },
  {
    id: "contact",
    title: "9. Contact details",
    paragraphs: [
      `${companyName} — ${siteName}`,
      `Email: ${contactEmail}`,
      "Greece — nationwide service",
    ],
  },
];

export const cookiesSections: LegalSection[] = [
  {
    id: "intro",
    title: "1. Introduction",
    paragraphs: [
      `The website ${siteUrl} (the "Website") is operated by ${companyName} (the "Company"), administrator of ${siteName}.`,
      "The Website uses cookies and similar technologies for proper operation, to improve user experience, and — where enabled — to analyse traffic.",
      "By using the Website, you agree to the use of cookies under this policy, unless you have rejected or restricted non-essential cookies in your browser settings.",
    ],
  },
  {
    id: "what",
    title: "2. What are Cookies",
    paragraphs: [
      "Cookies are small text files stored on your device (computer, tablet, or mobile) when you visit a website. They help the site remember information about your visit and your preferences.",
      "The Website may also use localStorage or sessionStorage (similar browser technology), for example to store your language preference.",
    ],
  },
  {
    id: "how-we-use",
    title: "3. How we use Cookies",
    paragraphs: ["Cookies and similar technologies are used to:"],
    bullets: [
      "ensure proper Website operation",
      "improve user experience",
      "analyse traffic (when relevant tools are enabled)",
      "store basic user preferences (e.g. language)",
    ],
  },
  {
    id: "types",
    title: "4. Types of Cookies used",
    paragraphs: [
      "Essential Cookies — required for proper Website operation (e.g. security, basic navigation).",
      "Functional Cookies — allow the Website to remember user choices and preferences. We currently use: cm-locale (localStorage) for EL/EN language preference.",
      "Analytics Cookies — used to collect traffic statistics and improve Website performance. We do not currently use Google Analytics or other analytics tools; if added, this policy will be updated.",
    ],
  },
  {
    id: "manage",
    title: "5. Managing Cookies",
    paragraphs: [
      "You can configure your browser to accept or reject cookies, and to delete cookies and localStorage.",
      "Disabling certain cookies may affect Website functionality (e.g. saving language preference).",
    ],
  },
  {
    id: "third-party",
    title: "6. Third-party Cookies",
    paragraphs: [
      "The Website does not currently set third-party marketing or analytics cookies.",
      "In the future, third-party services such as Google Analytics or social network integrations may be used. If enabled, those services may use cookies under their own privacy policies; we will update this policy and request consent where required by law.",
    ],
  },
  {
    id: "changes",
    title: "7. Policy changes",
    paragraphs: [
      "This Cookie Policy may be amended from time to time. Any change will be published on this page with an updated last-revision date.",
    ],
  },
  {
    id: "contact",
    title: "8. Contact details",
    paragraphs: [
      "For any information about cookie use, contact the Company:",
      `${companyName} — ${siteName}`,
      `Email: ${contactEmail}`,
      "Greece — nationwide service",
    ],
  },
];

export const legalMeta = {
  companyName,
  siteName,
  contactEmail,
  lastUpdated: "July 2026",
};
