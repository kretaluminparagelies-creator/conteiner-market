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
    title: "1. General",
    paragraphs: [
      `The website ${siteUrl} (the "Website") is operated by ${companyName} (the "Company"), which is also its administrator. The Company sells and rents its own shipping containers and provides storage space rental services in Greece.`,
      `Use of the Website is governed by these Terms of Use. By accessing and using the Website, you confirm that you have read, understood, and accept these terms without reservation. If you do not agree, you must not use the Website.`,
      "These terms may be amended at any time. Continued use after changes constitutes acceptance of the updated terms.",
    ],
  },
  {
    id: "services",
    title: "2. Services & offers",
    paragraphs: [
      "Information, prices, and container availability shown on the Website (including Offers) are indicative and do not constitute a binding offer unless agreed otherwise in writing.",
      "A final agreement for purchase, container rental, or storage space rental is formed only after contact with the Company and confirmation of terms, price, delivery, and availability.",
    ],
    bullets: [
      "Container purchase — sale of our own containers",
      "Container rental — lease of our own containers",
      "Space rental — storage in an organised facility",
      "Buy-back from customers — after evaluation and quote",
    ],
  },
  {
    id: "ip",
    title: "3. Intellectual property",
    paragraphs: [
      "All Website content (text, graphics, logos, photos, designs, video, software, structure) is protected by applicable intellectual property law and belongs to the Company or its lawful rights holders.",
      "Copying, reproduction, modification, distribution, or commercial exploitation without prior written permission is prohibited. For permission requests: " +
        contactEmail +
        ".",
    ],
  },
  {
    id: "links",
    title: "4. Third-party links",
    paragraphs: [
      "The Website may contain links to third-party sites. The Company does not control their content or practices and is not liable for damages arising from their use.",
    ],
  },
  {
    id: "privacy-ref",
    title: "5. Personal data",
    paragraphs: [
      "Processing of personal data is governed by the Website Privacy Policy, in accordance with the GDPR (EU Regulation 2016/679) and Greek law.",
    ],
  },
  {
    id: "liability",
    title: "6. Limitation of liability",
    paragraphs: [
      "The Company makes every effort to provide accurate and up-to-date information but does not guarantee uninterrupted, error-free operation or freedom from viruses or malicious software.",
      "The Company is not liable for indirect, incidental, or consequential damages arising from use or inability to use the Website, except where required by law.",
    ],
  },
  {
    id: "law",
    title: "7. Governing law — Contact",
    paragraphs: [
      "These terms are governed by Greek law. The courts of Greece have exclusive jurisdiction over any dispute.",
      `For questions about these Terms of Use: ${contactEmail}.`,
    ],
  },
];

export const privacySections: LegalSection[] = [
  {
    id: "controller",
    title: "1. Data controller",
    paragraphs: [
      `${companyName} — ${siteName}`,
      `Email: ${contactEmail}`,
      "Greece — nationwide service",
    ],
  },
  {
    id: "data",
    title: "2. Data we collect",
    paragraphs: ["We may process the following, depending on how you contact us:"],
    bullets: [
      "Contact details (name, email, phone) when you send us a message",
      "Message content / quote request",
      "Technical data (IP, browser, device) via server logs",
      "Language preferences (localStorage) — see Cookie Policy",
    ],
  },
  {
    id: "purpose",
    title: "3. Purposes of processing",
    paragraphs: ["Data is used to:"],
    bullets: [
      "Respond to purchase, rental, or space rental requests",
      "Prepare quotes and conclude agreements",
      "Operate and secure the Website",
      "Comply with legal obligations",
    ],
  },
  {
    id: "legal-basis",
    title: "4. Legal basis (GDPR)",
    paragraphs: ["Processing is based on:"],
    bullets: [
      "Performance of pre-contractual/contractual measures (Article 6(1)(b))",
      "Legitimate interest in Website operation and security (Article 6(1)(f))",
      "Consent where required (e.g. non-essential cookies — when enabled)",
    ],
  },
  {
    id: "retention",
    title: "5. Retention period",
    paragraphs: [
      "Contact data is kept as long as needed for the purpose of collection and in line with legal obligations (e.g. tax/accounting where applicable).",
      "Technical logs: usually up to 12 months, unless a longer period is required for security.",
    ],
  },
  {
    id: "rights",
    title: "6. Your rights",
    paragraphs: [
      "You have the right of access, rectification, erasure, restriction, portability, and objection, as well as withdrawal of consent where applicable.",
    ],
    bullets: [
      "Request at: " + contactEmail,
      "Complaint to the Hellenic Data Protection Authority (www.dpa.gr)",
    ],
  },
  {
    id: "sharing",
    title: "7. Sharing with third parties",
    paragraphs: [
      "We do not sell your personal data. Data may be shared with hosting/technical support providers (processors under contractual obligations) or when required by law.",
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
