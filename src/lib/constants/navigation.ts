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
    description: "Αγορά κοντέινερ — καινούρια και μεταχειρισμένα",
  },
  {
    label: "Πώληση",
    href: "/polisi",
    description: "Πώληση κοντέινερ — ανταγωνιστικές τιμές",
  },
  {
    label: "Ενοικίαση",
    href: "/enoikiasi",
    description: "Ενοικίαση κοντέινερ — ευέλικτοι όροι",
  },
  {
    label: "Κατάλογος",
    href: "/listings",
    description: "Όλα τα διαθέσιμα κοντέινερ",
  },
  {
    label: "Επικοινωνία",
    href: "/epikoinonia",
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
];
