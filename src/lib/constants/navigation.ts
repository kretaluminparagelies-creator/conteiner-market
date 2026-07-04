/**
 * @file navigation.ts
 * @description Main navigation links for Container Market
 * @author Katsoulakis
 * @copyright 2025 Katsoulakis. All rights reserved.
 */

export type NavItem = {
  label: string;
  href: string;
  description: string;
};

export const mainNav: NavItem[] = [
  {
    label: "Αγορά",
    href: "/agora",
    description: "Αγορά κοντέινερ — αγοράστε δικά μας containers",
  },
  {
    label: "Πώληση",
    href: "/polisi",
    description: "Πουλήστε το κοντέινερ σας σε εμάς",
  },
  {
    label: "Ενοικίαση",
    href: "/enoikiasi",
    description: "Ενοικιάστε δικά μας κοντέινερ",
  },
  {
    label: "Προσφορές",
    href: "/listings",
    description: "Διαθέσιμα κοντέινερ προς αγορά ή ενοικίαση",
  },
  {
    label: "Επικοινωνία",
    href: "/epikoinonia?intent=inquiry",
    description: "Επικοινωνήστε μαζί μας",
  },
];

export const footerLegal: NavItem[] = [
  {
    label: "Όροι",
    href: "/oroi",
    description: "Όροι χρήσης",
  },
  {
    label: "Απόρρητο",
    href: "/aporrito",
    description: "Πολιτική απορρήτου",
  },
  {
    label: "Cookies",
    href: "/cookies",
    description: "Πολιτική cookies",
  },
  {
    label: "Επιστροφές",
    href: "/epistrofes",
    description: "Πολιτική επιστροφών και υπαναχώρησης",
  },
];
