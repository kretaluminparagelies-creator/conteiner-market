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
    help: "Βοήθεια",
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
    eyebrow: "Κοντέινερ από εμάς",
    words: ["Αγορά", "Πώληση", "Ενοικίαση"],
    subtitleLine1: "Πουλάμε και ενοικιάζουμε δικά μας containers στην Ελλάδα.",
    subtitleLine2: "Άμεση επαφή. Χωρίς ενδιάμεσους.",
    scroll: "SCROLL",
  },
  categories: {
    eyebrow: "Τι ψάχνεις",
    title: "Βρες αυτό που χρειάζεσαι",
    items: [
      {
        tag: "ΑΓΟΡΑ",
        title: "Αγορά",
        description:
          "Αγοράστε δικά μας κοντέινερ — καινούρια και μεταχειρισμένα. Τιμές απευθείας, χωρίς ενδιάμεσους.",
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
          "Ενοικιάστε δικά μας κοντέινερ — ευέλικτοι όροι από 1 μήνα. Dry, reefer, open top.",
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
    eyebrow: "Διαθέσιμα",
    title: "Προσφορές",
    viewAll: "Δες όλα →",
    sale: "Πώληση",
    rent: "Ενοικίαση",
    detailClose: "Κλείσιμο",
    detailContact: "Επικοινωνία",
    detailDescription: "Περιγραφή",
    catalogHint:
      "Δικά μας κοντέινερ — φίλτρα: ειδικές προσφορές, καινούρια, μεταχειρισμένα, ενοικίαση. Σύρε ή πάτα, κλικ στην κεντρική κάρτα για λεπτομέρειες.",
    noResults: "Δεν βρέθηκαν κοντέινερ με αυτά τα κριτήρια.",
    noTabResults: "Δεν υπάρχουν κοντέινερ σε αυτή την κατηγορία.",
    clearFilters: "Καθαρισμός φίλτρων",
    resultsHint: "Αποτελέσματα αναζήτησης",
    backToListings: "← Πίσω στις προσφορές",
    viewPage: "Πλήρης σελίδα →",
    offerBadge: "Προσφορά",
    peerSelect: "Δείτε {type}",
    detailActiveIn: "{type} · {category}",
    sectionEyebrow: "Διαθέσιμα κοντέινερ",
    sectionSubtitle: "Βρες το κοντέινερ που ψάχνεις",
    tabs: {
      ariaLabel: "Φίλτρα καταλόγου",
      offers: "Προσφορές",
      new: "Καινούργιο",
      used: "Μεταχειρισμένα",
      rent: "Ενοικίαση",
      navOffers: "Προσφορές",
      navNew: "Καινούργιο",
      navUsed: "Μεταχ.",
      navRent: "Ενοικίαση",
    },
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
  help: {
    eyebrow: "Βοήθεια",
    title: "Συχνές ερωτήσεις",
    intro:
      "Οδηγός χρήσης — πώς να βρείτε δικά μας κοντέινερ προς αγορά ή ενοικίαση και να επικοινωνήσετε απευθείας μαζί μας.",
    contactCta: "Επικοινωνία",
    listingsCta: "Δες προσφορές",
    items: [
      {
        question: "Πώς βρίσκω κοντέινερ;",
        answer:
          "Στην αρχική, χρησιμοποιήστε τη μπάρα αναζήτησης (Τύπος + Μέγεθος) ή πηγαίνετε στο μενού «Προσφορές». Μπορείτε να φιλτράρετε αγορά ή ενοικίαση και μέγεθος (20ft, 40ft, 45ft).",
      },
      {
        question: "Τι σημαίνουν Αγορά και Ενοικίαση;",
        answer:
          "Αγορά = αγοράζετε το κοντέινερ (μόνιμα). Ενοικίαση = μισθώνετε για όσο χρειάζεστε (π.χ. ανά μήνα). Στις προσφορές φαίνεται η τιμή και η μονάδα (/μήνα για ενοικίαση).",
      },
      {
        question: "Πώς βλέπω λεπτομέρειες μιας προσφοράς;",
        answer:
          "Στο carousel, κάντε κλικ στην κεντρική κάρτα για modal, ή ανοίξτε την πλήρη σελίδα (/listings/[slug], π.χ. /listings/20ft-dry-peiraias). Εκεί βρίσκονται φωτογραφίες, τιμή, κατάσταση και περιγραφή — ιδανικό για κοινοποίηση ή AI agents.",
      },
      {
        question: "Πώς επικοινωνώ για αγορά ή ενοικίαση;",
        answer:
          "Πατήστε «Επικοινωνία» στο μενού ή στο modal της προσφοράς. Στείλτε email ή καλέστε — χωρίς ενδιάμεσους.",
      },
      {
        question: "Τα κοντέινερ είναι δικά σας;",
        answer:
          "Ναι. Πουλάμε και ενοικιάζουμε δικά μας κοντέινερ — απευθείας από εμάς. Δεν είμαστε πλατφόρμα τρίτων. Στις Προσφορές βλέπετε τι έχουμε διαθέσιμο.",
      },
      {
        question: "Μπορώ να πουλήσω το δικό μου κοντέινερ σε εσάς;",
        answer:
          "Ναι. Στη σελίδα «Πώληση» μπορείτε να ζητήσετε προσφορά — αγοράζουμε containers από ιδιώτες και επιχειρήσεις.",
      },
      {
        question: "Ενοικιάζετε χώρο αποθήκευσης;",
        answer:
          "Ναι. Δείτε «Ενοικίαση χώρου» για αποθήκευση σε container yards / αποθήκες.",
      },
      {
        question: "Η τοποθεσία στις προσφορές τι σημαίνει;",
        answer:
          "Όλα τα κοντέινερ είναι στην έδρα μας — παράδοση σε όλη την Ελλάδα. Δεν φιλτράρουμε ανά πόλη· η τοποθεσία δείχνει από πού εξυπηρετούμε.",
      },
      {
        question: "Γιατί δεν βλέπω φωτογραφίες;",
        answer:
          "Οι φωτογραφίες ενημερώνονται. Μέχρι τότε εμφανίζεται εικονίδιο κοντέινερ. Ρωτήστε μας για φωτό συγκεκριμένης προσφοράς.",
      },
    ],
  },
  howItWorks: {
    eyebrow: "Διαδικασία",
    title: "Πώς λειτουργεί",
    steps: [
      {
        number: "01",
        title: "Αναζήτησε",
        body: "Φίλτραρε κοντέινερ κατά τύπο και μέγεθος. Βρες ακριβώς αυτό που χρειάζεσαι.",
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
    body: "Δικά μας κοντέινερ, απευθείας από εμάς. Χωρίς μεσάζοντες.",
    browse: "Δες Κοντέινερ",
    contact: "Επικοινωνία",
  },
  common: {
    email: "Email",
    phone: "Τηλέφωνο",
    name: "Όνομα",
    area: "Περιοχή",
    lastUpdated: "Τελευταία ενημέρωση",
  },
  siteMeta: {
    tagline: "Αγορά & Ενοικίαση Κοντέινερ — απευθείας από εμάς",
    description:
      "Container Market GR — πουλάμε και ενοικιάζουμε δικά μας shipping containers στην Ελλάδα. Άμεση επαφή, χωρίς ενδιάμεσους, παράδοση σε όλη τη χώρα.",
  },
  pages: {
    home: {
      metaTitle: "Container Market GR — Αγορά & Ενοικίαση Κοντέινερ",
      metaDescription:
        "Container Market GR — πουλάμε και ενοικιάζουμε δικά μας shipping containers στην Ελλάδα. Άμεση επαφή, χωρίς ενδιάμεσους.",
    },
    agora: {
      metaTitle: "Αγορά Κοντέινερ",
      metaDescription:
        "Αγορά shipping containers στην Ελλάδα — καινούρια και μεταχειρισμένα 20ft, 40ft, High Cube. Container Market, άμεση παράδοση.",
      eyebrow: "Αγορά",
      title: "Αγορά κοντέινερ",
      description:
        "Νέα και μεταχειρισμένα containers για μόνιμη χρήση — αποθήκευση, logistics, μετατροπές.",
      body: "Πουλάμε δικά μας shipping containers — cargo worthy, σε ανταγωνιστικές τιμές. Διαθέσιμα 20ft, 40ft, High Cube και ειδικοί τύποι. Δείτε τις Προσφορές ή επικοινωνήστε για διαθεσιμότητα, τιμή και παράδοση.",
      ctaLabel: "Δες διαθέσιμα κοντέινερ →",
      ctaHref: "/listings",
    },
    enoikiasi: {
      metaTitle: "Ενοικίαση Κοντέινερ",
      metaDescription:
        "Ενοικίαση shipping containers στην Ελλάδα — dry, reefer, open top. Ευέλικτοι όροι από 1 μήνα. Container Market.",
      eyebrow: "Ενοικίαση",
      title: "Ενοικίαση κοντέινερ",
      description: "Ευέλικτες λύσεις αποθήκευσης και logistics — από 1 μήνα, όλοι οι τύποι.",
      body: "Ενοικιάζουμε δικά μας shipping containers — για projects, εποχιακές ανάγκες ή μακροχρόνια αποθήκευση. Dry, reefer, open top. Δείτε τις Προσφορές ή ρωτήστε μας για διαθεσιμότητα και μηνιαία τιμή.",
      ctaLabel: "Δες containers προς ενοικίαση →",
      ctaHref: "/listings?tab=rent",
    },
    enoikiasisXoron: {
      metaTitle: "Ενοικίαση Χώρου Αποθήκευσης",
      metaDescription:
        "Ενοικίαση χώρου αποθήκευσης σε shipping containers — ευέλικτοι όροι, ασφαλής φύλαξη. Container Market GR.",
      eyebrow: "Ενοικίαση χώρου",
      title: "Χώρος αποθήκευσης σε κοντέινερ",
      description:
        "Ενοικιάστε χώρο μέσα σε container ή σε οργανωμένη αποθήκευση — ιδανικό για εμπόρευμα, εξοπλισμό, εποχιακές ανάγκες.",
      body: "Προσφέρουμε ευέλικτες λύσεις ενοικίασης χώρου αποθήκευσης με shipping containers ως αποθηκευτικές μονάδες. Μηνιαίοι ή μακροχρόνιοι όροι, πρόσβαση κατόπιν συνεννόησης και τοποθεσίες σε στρατηγικά σημεία στην Ελλάδα. Επικοινωνήστε μαζί μας για διαθεσιμότητα, όγκο και τιμή.",
      ctaLabel: "Ζήτησε προσφορά →",
      ctaHref: "/epikoinonia",
    },
    polisi: {
      metaTitle: "Πώληση Κοντέινερ",
      metaDescription:
        "Πουλήστε το shipping container σας στην Ελλάδα. Container Market — άμεση αξιολόγηση, ανταγωνιστική προσφορά, πανελλαδική κάλυψη.",
      eyebrow: "Πώληση",
      title: "Πώληση κοντέινερ",
      description:
        "Θέλετε να πουλήσετε container; Στείλτε μας τα στοιχεία και θα σας κάνουμε προσφορά.",
      body: "Η Container Market αγοράζει shipping containers όλων των τύπων — dry van, reefer, open top, high cube. Αξιολογούμε την κατάσταση, προτείνουμε δίκαιη τιμή και αναλαμβάνουμε τη διαδικασία με απλότητα και διαφάνεια.",
      ctaLabel: "Επικοινωνία για πώληση →",
      ctaHref: "/epikoinonia",
    },
    contact: {
      metaTitle: "Επικοινωνία",
      metaDescription:
        "Επικοινωνήστε με την Container Market για αγορά, πώληση ή ενοικίαση shipping containers στην Ελλάδα.",
      eyebrow: "Επικοινωνία",
      title: "Επικοινωνήστε μαζί μας",
      intro: "Για αγορά, πώληση ή ενοικίαση κοντέινερ — είμαστε εδώ για εσάς.",
      areaValue: "Ελλάδα — πανελλαδική κάλυψη",
      formTitle: "Φόρμα επικοινωνίας",
      formMessage: "Μήνυμα",
      formSubmit: "Αποστολή",
      formSuccess: "Το μήνυμά σας στάλθηκε. Θα επικοινωνήσουμε σύντομα.",
    },
    listings: {
      metaTitle: "Προσφορές Κοντέινερ",
      metaDescription:
        "Διαθέσιμα κοντέινερ προς αγορά ή ενοικίαση — δικά μας containers, απευθείας από την Container Market GR.",
      schemaName: "Προσφορές κοντέινερ",
    },
    help: {
      metaTitle: "Βοήθεια & Συχνές Ερωτήσεις",
      metaDescription:
        "Οδηγός χρήσης Container Market GR — αναζήτηση κοντέινερ, προσφορές, αγορά, ενοικίαση και επικοινωνία.",
    },
    legal: {
      terms: {
        metaTitle: "Όροι Χρήσης",
        metaDescription:
          "Όροι χρήσης του Container Market GR — αγορά, ενοικίαση κοντέινερ και ενοικίαση χώρου από την Logiworkpass P.C.",
        title: "Όροι χρήσης",
        intro:
          "Οι όροι που διέπουν τη χρήση του ιστοτόπου και τις υπηρεσίες αγοράς, ενοικίασης κοντέινερ και ενοικίασης χώρου.",
      },
      privacy: {
        metaTitle: "Πολιτική Απορρήτου",
        metaDescription:
          "Πολιτική απορρήτου και προστασίας προσωπικών δεδομένων (GDPR) — Container Market GR / Logiworkpass P.C.",
        title: "Πολιτική απορρήτου",
        intro:
          "Πώς συλλέγουμε, χρησιμοποιούμε και προστατεύουμε τα προσωπικά σας δεδομένα, σύμφωνα με τον GDPR.",
      },
      cookies: {
        metaTitle: "Πολιτική Cookies",
        metaDescription:
          "Πολιτική cookies και τοπικής αποθήκευσης (localStorage) — Container Market GR.",
        title: "Πολιτική cookies",
        intro:
          "Πληροφορίες για cookies, localStorage και sessionStorage που χρησιμοποιεί ο ιστότοπος.",
      },
    },
  },
};

export type Messages = typeof el;
