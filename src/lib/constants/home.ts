/**
 * @file home.ts
 * @description Static content for the home page sections
 * @author Katsoulakis
 * @copyright 2025 Katsoulakis. All rights reserved.
 */

export const heroTicker =
  "20FT DRY  ·  40FT HIGH CUBE  ·  ΨΥΓΕΙΟ REEFER  ·  OPEN TOP  ·  FLAT RACK  ·  SIDE OPENER  ·  ISO TANK  ·  45FT  ·  " +
  "ΠΡΟΣΦΟΡΕΣ ΜΕΤΑΧΕΙΡΙΣΜΕΝΩΝ ΚΟΝΤΕΙΝΕΡ  ·  ΕΝΟΙΚΙΑΣΗ ΧΩΡΟΥ ΑΠΟΘΗΚΕΥΣΗΣ  ·  CARGO WORTHY  ·  WIND & WATERTIGHT  ·  " +
  "ΠΑΡΑΔΟΣΗ ΣΕ ΟΛΗ ΤΗΝ ΕΛΛΑΔΑ  ·  500+ ΔΙΑΘΕΣΙΜΑ  ·  32 ΛΙΜΑΝΙΑ & ΑΠΟΘΗΚΕΣ  ·  ONE-WAY LEASING  ·  " +
  "ΆΜΕΣΗ ΕΚΤΙΜΗΣΗ & ΠΡΟΣΦΟΡΑ  ·  CONTAINER MARKET GR  ·  ";

/** Scroll duration (seconds) — longer copy = slower loop */
export const heroTickerDurationSec = 55;

export const heroWords = ["Αγορά.", "Πώληση.", "Ενοικίαση."] as const;

export const stats = [
  { end: 500, suffix: "+", label: "Κοντέινερ" },
  { end: 280, suffix: "+", label: "Πελάτες" },
  { end: 12, suffix: "", label: "Χρόνια εμπειρίας" },
  { end: 32, suffix: "", label: "Λιμάνια & αποθήκες" },
] as const;

export type CategoryItem = {
  tag: string;
  title: string;
  description: string;
  note: string;
  href: string;
};

export const categories: CategoryItem[] = [
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
];

export type StepItem = {
  number: string;
  title: string;
  body: string;
};

export const steps: StepItem[] = [
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
];
