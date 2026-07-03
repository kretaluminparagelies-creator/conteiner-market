/**
 * @file el.ts
 * @description Greek UI strings
 * @author Katsoulakis
 * @copyright 2025 Katsoulakis. All rights reserved.
 */

import type { Locale } from "@/lib/i18n/types";

export const el = {
  meta: {
    lang: "el" as Locale,
    localeLabel: "ΕΛ",
  },
  language: {
    switchTo: "Switch to English",
    ariaLabel: "Αλλαγή γλώσσας",
    help: "Ελληνικά / English — πάτα για εναλλαγή",
  },
  nav: {
    ariaLabel: "Κύρια πλοήγηση",
    buy: "Αγορά",
    sell: "Πώληση",
    rent: "Ενοικίαση",
    listings: "Προσφορές",
    contact: "Επικοινωνία",
  },
  footer: {
    country: "Ελλάδα",
    terms: "Όροι",
    privacy: "Απόρρητο",
    cookies: "Cookies",
  },
  hero: {
    ticker:
      "20FT DRY  ·  40FT HIGH CUBE  ·  ΨΥΓΕΙΟ REEFER  ·  OPEN TOP  ·  FLAT RACK  ·  SIDE OPENER  ·  ISO TANK  ·  45FT  ·  " +
      "ΠΡΟΣΦΟΡΕΣ ΜΕΤΑΧΕΙΡΙΣΜΕΝΩΝ ΚΟΝΤΕΙΝΕΡ  ·  ΕΝΟΙΚΙΑΣΗ ΧΩΡΟΥ ΑΠΟΘΗΚΕΥΣΗΣ  ·  CARGO WORTHY  ·  WIND & WATERTIGHT  ·  " +
      "ΠΑΡΑΔΟΣΗ ΣΕ ΟΛΗ ΤΗΝ ΕΛΛΑΔΑ  ·  500+ ΔΙΑΘΕΣΙΜΑ  ·  32 ΛΙΜΑΝΙΑ & ΑΠΟΘΗΚΕΣ  ·  ONE-WAY LEASING  ·  " +
      "ΆΜΕΣΗ ΕΚΤΙΜΗΣΗ & ΠΡΟΣΦΟΡΑ  ·  CONTAINER MARKET GR  ·  ",
    eyebrow: "Ελληνική αγορά κοντέινερ",
    words: ["Αγορά", "Πώληση", "Ενοικίαση"],
    subtitleLine1: "Container Market GR — shipping containers στην Ελλάδα.",
    subtitleLine2: "Άμεση επαφή. Χωρίς ενδιάμεσους.",
    scroll: "SCROLL",
  },
  spline: {
    offers: "Προσφορές κοντέινερ",
    spaceRent: "Ενοικίαση χώρου",
    quickLinksAria: "Γρήγορη επιλογή υπηρεσίας",
    touchHint: "Πάτα για επιλογή",
    touchHintAria: "Διαδραστικό 3D μενού — πάτα για να επιλέξεις υπηρεσία",
    clickHint: "Κλικ για επιλογή",
    clickHintAria: "Διαδραστικό 3D μενού — κλικ για να επιλέξεις υπηρεσία",
  },
  categories: {
    eyebrow: "Τι ψάχνεις",
    title: "Βρες αυτό που χρειάζεσαι",
    items: [
      {
        tag: "ΑΓΟΡΑ",
        title: "Αγορά",
        description:
          "Νέα & μεταχειρισμένα κοντέινερ για μόνιμη αγορά. Τιμές απ' ευθείας από την εταιρεία.",
        note: "320+ διαθέσιμα",
        href: "/agora",
      },
      {
        tag: "ΠΩΛΗΣΗ",
        title: "Πώληση",
        description:
          "Πουλήστε το container σας — άμεση αξιολόγηση και ανταγωνιστική προσφορά.",
        note: "Άμεση προσφορά",
        href: "/polisi",
      },
      {
        tag: "ΕΝΟΙΚΙΑΣΗ",
        title: "Ενοικίαση",
        description:
          "Ευέλικτες λύσεις από 1 μήνα. Ψυγεία, open top, dry — όλοι οι τύποι διαθέσιμοι.",
        note: "180+ για ενοικίαση",
        href: "/enoikiasi",
      },
    ],
  },
  stats: {
    containers: "Κοντέινερ",
    clients: "Πελάτες",
    years: "Χρόνια εμπειρίας",
    hubs: "Λιμάνια & αποθήκες",
  },
  listings: {
    eyebrow: "Μεταχειρισμένα",
    title: "Προσφορές",
    viewAll: "Δες όλα →",
    sale: "Πώληση",
    rent: "Ενοικίαση",
    detailClose: "Κλείσιμο",
    detailContact: "Επικοινωνία",
    detailDescription: "Περιγραφή",
    catalogHint: "Σύρε ή πάτα για να δεις τις προσφορές — κλικ στην κεντρική κάρτα για λεπτομέρειες.",
    noResults: "Δεν βρέθηκαν κοντέινερ με αυτά τα κριτήρια.",
    clearFilters: "Καθαρισμός φίλτρων",
    resultsHint: "Αποτελέσματα αναζήτησης",
  },
  heroSearch: {
    title: "Βρες κοντέινερ",
    dealLabel: "Τύπος",
    dealAll: "Αγορά & Ενοικίαση",
    sale: "Αγορά",
    rent: "Ενοικίαση",
    sizeLabel: "Μέγεθος",
    sizeAll: "Όλα τα μεγέθη",
    submit: "Αναζήτηση",
  },
  howItWorks: {
    eyebrow: "Διαδικασία",
    title: "Πώς λειτουργεί",
    steps: [
      {
        number: "01",
        title: "Αναζήτησε",
        body: "Φίλτραρε κοντέινερ κατά τύπο, μέγεθος, τοποθεσία και κατάσταση. Βρες ακριβώς αυτό που χρειάζεσαι.",
      },
      {
        number: "02",
        title: "Επικοινώνησε",
        body: "Μίλησε απευθείας μαζί μας — χωρίς ενδιάμεσους, χωρίς κρυφές χρεώσεις.",
      },
      {
        number: "03",
        title: "Κλείσε τη συμφωνία",
        body: "Ολοκλήρωσε τη συναλλαγή με ασφάλεια και αναλάβε το κοντέινερ στο χώρο σου.",
      },
    ],
  },
  cta: {
    eyebrow: "Ξεκίνα τώρα",
    titleLine1: "Βρες το κοντέινερ",
    titleLine2: "που ψάχνεις.",
    body: "Δεκάδες διαθέσιμα containers. Απευθείας επαφή. Χωρίς μεσάζοντες.",
    browse: "Δες Κοντέινερ",
    contact: "Επικοινωνία",
  },
};

export type Messages = typeof el;
