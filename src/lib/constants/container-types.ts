/**
 * @file container-types.ts
 * @description ISO container type catalog — specs for hero filter & documentation
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 *
 * Sources: Container Market buying guide, ISO 6346 / xChange specifications.
 */

export type ContainerLengthFt = 20 | 40 | 45;

export type ContainerCategory = "standard" | "specialty";

export type ContainerDimensions = {
  external: { length: string; width: string; height: string };
  internal: { length: string; width: string; height: string };
};

export type ContainerWeightSpec = {
  kg: string;
  lbs?: string;
};

export type ContainerVolumeSpec = {
  cuFt: string;
  m3: string;
};

export type ContainerTypeSpec = {
  id: string;
  isoCode: string;
  lengthFt: ContainerLengthFt;
  category: ContainerCategory;
  name: { el: string; en: string };
  shortDescription: { el: string; en: string };
  dimensions?: ContainerDimensions;
  volume?: ContainerVolumeSpec;
  tareWeight?: ContainerWeightSpec;
  payload?: ContainerWeightSpec;
  specialtyNotes?: { el: string; en: string };
};

/** Standard & specialty container types — hero filter + reference data */
export const containerTypes: ContainerTypeSpec[] = [
  {
    id: "20dc",
    isoCode: "22G1",
    lengthFt: 20,
    category: "standard",
    name: { el: "20' Dry Standard (20DC)", en: "20' Dry Standard (20DC)" },
    shortDescription: {
      el: "Κλειστό γενικής χρήσης · 8'6\" · 33.2 m³",
      en: "General purpose dry · 8'6\" · 33.2 m³",
    },
    dimensions: {
      external: { length: "20' (6.06m)", width: "8' (2.44m)", height: "8'6\" (2.59m)" },
      internal: { length: "19'4\" (5.90m)", width: "7'8\" (2.35m)", height: "7'10\" (2.39m)" },
    },
    volume: { cuFt: "1,172", m3: "33.2" },
    tareWeight: { kg: "2,300", lbs: "5,070" },
    payload: { kg: "28,200", lbs: "62,170" },
  },
  {
    id: "20hc",
    isoCode: "25G1",
    lengthFt: 20,
    category: "standard",
    name: { el: "20' High Cube (20HC)", en: "20' High Cube (20HC)" },
    shortDescription: {
      el: "Επιπλέον ύψος 9'6\" · ~37.4 m³",
      en: "Extra height 9'6\" · ~37.4 m³",
    },
    dimensions: {
      external: { length: "20' (6.06m)", width: "8' (2.44m)", height: "9'6\" (2.90m)" },
      internal: { length: "19'4\" (5.90m)", width: "7'8\" (2.35m)", height: "8'10\" (2.70m)" },
    },
    volume: { cuFt: "~1,320", m3: "~37.4" },
    tareWeight: { kg: "~2,400" },
    payload: { kg: "~28,100" },
  },
  {
    id: "40dc",
    isoCode: "42G1",
    lengthFt: 40,
    category: "standard",
    name: { el: "40' Dry Standard (40DC)", en: "40' Dry Standard (40DC)" },
    shortDescription: {
      el: "Κλειστό γενικής χρήσης · 8'6\" · 67.7 m³",
      en: "General purpose dry · 8'6\" · 67.7 m³",
    },
    dimensions: {
      external: { length: "40' (12.19m)", width: "8' (2.44m)", height: "8'6\" (2.59m)" },
      internal: { length: "39'5\" (12.03m)", width: "7'8\" (2.35m)", height: "7'10\" (2.39m)" },
    },
    volume: { cuFt: "2,390", m3: "67.7" },
    tareWeight: { kg: "3,750", lbs: "8,270" },
    payload: { kg: "28,750", lbs: "63,380" },
  },
  {
    id: "40hc",
    isoCode: "45G1",
    lengthFt: 40,
    category: "standard",
    name: { el: "40' High Cube (40HC)", en: "40' High Cube (40HC)" },
    shortDescription: {
      el: "Επιπλέον ύψος 9'6\" · 76.4 m³",
      en: "Extra height 9'6\" · 76.4 m³",
    },
    dimensions: {
      external: { length: "40' (12.19m)", width: "8' (2.44m)", height: "9'6\" (2.90m)" },
      internal: { length: "39'5\" (12.03m)", width: "7'8\" (2.35m)", height: "8'10\" (2.70m)" },
    },
    volume: { cuFt: "2,700", m3: "76.4" },
    tareWeight: { kg: "3,900", lbs: "8,600" },
    payload: { kg: "28,600", lbs: "63,050" },
  },
  {
    id: "45hc",
    isoCode: "L5G1",
    lengthFt: 45,
    category: "standard",
    name: { el: "45' High Cube (45HC)", en: "45' High Cube (45HC)" },
    shortDescription: {
      el: "Μέγιστο μήκος & ύψος · 9'6\"",
      en: "Maximum length & height · 9'6\"",
    },
    dimensions: {
      external: { length: "45' (13.72m)", width: "8' (2.44m)", height: "9'6\" (2.90m)" },
      internal: {
        length: "44'5\" (~13.55m)",
        width: "7'8\" (2.35m)",
        height: "8'10\" (2.70m)",
      },
    },
    specialtyNotes: {
      el: "Επιπλέον μήκος και ύψος για μέγιστη χωρητικότητα.",
      en: "Extra length and height for maximum capacity.",
    },
  },
  {
    id: "45-pallet-wide",
    isoCode: "L5G1",
    lengthFt: 45,
    category: "specialty",
    name: { el: "45' Pallet Wide", en: "45' Pallet Wide" },
    shortDescription: {
      el: "Ευρύτερο εσωτερικό για euro pallets",
      en: "Wider interior for euro pallets",
    },
    specialtyNotes: {
      el: "Εσωτερικό πλάτος για παλέτες 2.500×1.244m — logistics υψηλού όγκου.",
      en: "Interior width for 2.500×1.244m pallets — high-volume logistics.",
    },
  },
  {
    id: "20-reefer",
    isoCode: "22R1",
    lengthFt: 20,
    category: "specialty",
    name: { el: "20' Reefer (Ψυγείο)", en: "20' Reefer" },
    shortDescription: {
      el: "Θερμοκρασία -65°F έως 104°F",
      en: "Temperature -65°F to 104°F",
    },
    specialtyNotes: {
      el: "ISO R1 — ψυχόμενο για τρόφιμα, φάρμακα, cold chain.",
      en: "ISO R1 — refrigerated for food, pharma, cold chain.",
    },
  },
  {
    id: "40-reefer",
    isoCode: "45R1",
    lengthFt: 40,
    category: "specialty",
    name: { el: "40' Reefer (Ψυγείο)", en: "40' Reefer" },
    shortDescription: {
      el: "Ψυχόμενο μεγάλου όγκου",
      en: "Large-volume refrigerated",
    },
    specialtyNotes: {
      el: "ISO R1 — cold chain logistics, catering, χονδρικό εμπόριο.",
      en: "ISO R1 — cold chain logistics, catering, wholesale.",
    },
  },
  {
    id: "open-top",
    isoCode: "22U1",
    lengthFt: 20,
    category: "specialty",
    name: { el: "Open Top", en: "Open Top" },
    shortDescription: {
      el: "Αφαιρούμενη οροφή · φόρτωση με γερανό",
      en: "Removable roof · crane loading",
    },
    specialtyNotes: {
      el: "ISO U1 — μηχανήματα, υπερμεγέθη αντικείμενα, project cargo.",
      en: "ISO U1 — machinery, oversized items, project cargo.",
    },
  },
  {
    id: "flat-rack",
    isoCode: "22P1",
    lengthFt: 20,
    category: "specialty",
    name: { el: "Flat Rack", en: "Flat Rack" },
    shortDescription: {
      el: "Χωρίς τοίχους/οροφή · out-of-gauge",
      en: "No sides/roof · out-of-gauge cargo",
    },
    specialtyNotes: {
      el: "ISO P1 — μηχανήματα, σωλήνες, ξυλοδέματα.",
      en: "ISO P1 — machinery, pipes, timber bundles.",
    },
  },
  {
    id: "double-door",
    isoCode: "22G1",
    lengthFt: 20,
    category: "specialty",
    name: { el: "Double Door", en: "Double Door" },
    shortDescription: {
      el: "Πόρτες και στα δύο άκρα",
      en: "Doors at both ends",
    },
    specialtyNotes: {
      el: "Διπλή πρόσβαση για γρήγορη φόρτωση/εκφόρτωση.",
      en: "Dual access for faster loading and unloading.",
    },
  },
  {
    id: "side-door",
    isoCode: "22G1",
    lengthFt: 20,
    category: "specialty",
    name: { el: "Side Door / Open Side", en: "Side Door / Open Side" },
    shortDescription: {
      el: "Πλήρες άνοιγμα πλαϊνής πλευράς",
      en: "Full side opening access",
    },
    specialtyNotes: {
      el: "Open Side Full Open — forklift, retail pop-up, events.",
      en: "Open Side Full Open — forklift, retail pop-up, events.",
    },
  },
];

export const containerTypeById = Object.fromEntries(
  containerTypes.map((entry) => [entry.id, entry]),
) as Record<string, ContainerTypeSpec>;

export function getContainerTypeById(id: string): ContainerTypeSpec | undefined {
  return containerTypeById[id];
}

export function isKnownContainerTypeId(id: string): boolean {
  return id in containerTypeById;
}

/** ISO 6346 size/type code decoding (1st = length, 2nd = height, 3–4th = type) */
export function decodeIsoContainerCode(code: string): {
  lengthLabel: string;
  heightLabel: string;
  typeLabel: string;
} | null {
  if (code.length < 4) return null;

  const lengthMap: Record<string, string> = {
    "2": "20'",
    "4": "40'",
    L: "45'",
    l: "45'",
  };
  const heightMap: Record<string, string> = {
    "2": "8'6\" (Standard)",
    "5": "9'6\" (High Cube)",
  };
  const typeMap: Record<string, string> = {
    G1: "General Purpose (Dry)",
    R1: "Reefer",
    U1: "Open Top",
    P1: "Flat Rack",
  };

  const lengthLabel = lengthMap[code[0] ?? ""] ?? "Unknown";
  const heightLabel = heightMap[code[1] ?? ""] ?? "Unknown";
  const typeKey = code.slice(2, 4);
  const typeLabel = typeMap[typeKey] ?? typeKey;

  return { lengthLabel, heightLabel, typeLabel };
}

export const containerTypeGroups: { label: { el: string; en: string }; ids: string[] }[] = [
  {
    label: { el: "20 πόδια", en: "20-foot" },
    ids: ["20dc", "20hc", "20-reefer", "open-top", "flat-rack", "double-door", "side-door"],
  },
  {
    label: { el: "40 πόδια", en: "40-foot" },
    ids: ["40dc", "40hc", "40-reefer"],
  },
  {
    label: { el: "45 πόδια", en: "45-foot" },
    ids: ["45hc", "45-pallet-wide"],
  },
];
