import type { Consignee } from "@/lib/types";
import { create } from "zustand";

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
