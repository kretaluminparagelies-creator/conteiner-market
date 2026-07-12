/**
 * @file types.ts
 * @description Depot inventory domain types
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

export type DepotGrade = "A" | "B" | "C";

export type DepotContainerStatus =
  | "available"
  | "sent_offer"
  | "with_rep_storage"
  | "reserved"
  | "sold"
  | "rented"
  | "withdrawn";

export type DepotDispatchType = "offer" | "free_storage";

export type DepotRepresentative = {
  id: string;
  companyName: string;
  name: string;
  phone?: string;
  email?: string;
  afm?: string;
  doy?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  notes?: string;
  active: boolean;
  createdAt: string;
};

export type DepotRepresentativeInput = {
  companyName: string;
  name: string;
  phone?: string;
  email?: string;
  afm?: string;
  doy?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  notes?: string;
};

export type DepotRepresentativeUpdate = Partial<DepotRepresentativeInput> & {
  active?: boolean;
};

export type DepotContainer = {
  id: string;
  containerNumber: string;
  containerType: string;
  grade: DepotGrade;
  status: DepotContainerStatus;
  salePrice?: number;
  rentPrice?: number;
  notes?: string;
  images: string[];
  recordedBy?: string;
  createdAt: string;
  updatedAt: string;
};

export type DepotDispatch = {
  id: string;
  containerId: string;
  representativeId: string;
  dispatchType: DepotDispatchType;
  sentByEmail?: string;
  notes?: string;
  createdAt: string;
  container?: DepotContainer;
  representative?: DepotRepresentative;
};

export type DepotIntakeInput = {
  containerNumber: string;
  containerType: string;
  grade: DepotGrade;
  notes?: string;
  salePrice?: number;
  rentPrice?: number;
  images: string[];
  recordedBy?: string;
};

export type DepotDispatchInput = {
  containerId: string;
  representativeId: string;
  dispatchType: DepotDispatchType;
  notes?: string;
};
