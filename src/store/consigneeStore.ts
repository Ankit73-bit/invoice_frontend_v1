import { create } from "zustand";

export interface Address {
  add1?: string;
  add2?: string;
  add3?: string;
  city?: string;
  state?: string;
  pinCode?: string;
  country?: string;
  panNo?: string;
  gstNo?: string;
  stateCode?: string;
}

export interface Consignee {
  _id: string;
  consigneeCompanyName: string;
  consigneeName?: string;
  company: string;
  contact?: string;
  email?: string;
  address: Address;
  createdAt: string;
}

interface ConsigneeStore {
  consignees: Consignee[];
  setConsignees: (consignees: Consignee[]) => void;
  addConsignee: (consignees: Consignee) => void;
  selectedConsignee: Consignee | null;
  setSelectedConsignee: (consignee: Consignee | null) => void;
  updateConsignee: (updated: Consignee) => void;
  removeConsignee: (id: string) => void;
}

export const useConsigneeStore = create<ConsigneeStore>((set) => ({
  consignees: [],
  setConsignees: (consignees) => set({ consignees }),
  addConsignee: (consignee) =>
    set((state) => ({ consignees: [...state.consignees, consignee] })),
  selectedConsignee: null,
  setSelectedConsignee: (consignee) => set({ selectedConsignee: consignee }),
  updateConsignee: (updateConsignee) =>
    set((state) => ({
      consignees: state.consignees.map((c) =>
        c._id === updateConsignee._id ? updateConsignee : c
      ),
    })),
  removeConsignee: (id) =>
    set((state) => ({
      consignees: state.consignees.filter((consignee) => consignee._id !== id),
    })),
}));
