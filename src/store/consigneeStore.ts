import type { Consignee } from "@/lib/types";
import { create } from "zustand";

interface ConsigneeStore {
  consignees: Consignee[];
  setConsignees: (
    updater: Consignee[] | ((prev: Consignee[]) => Consignee[])
  ) => void;
  addConsignee: (consignee: Consignee) => void;
  selectedConsignee: Consignee | null;
  setSelectedConsignee: (consignee: Consignee | null) => void;
  updateConsignee: (updated: Consignee) => void;
  removeConsignee: (id: string) => void;
}

export const useConsigneeStore = create<ConsigneeStore>((set) => ({
  consignees: [],
  setConsignees: (updater) =>
    set((state) => ({
      consignees:
        typeof updater === "function"
          ? (updater as (prev: Consignee[]) => Consignee[])(state.consignees)
          : updater,
    })),
  addConsignee: (consignee) =>
    set((state) => ({ consignees: [...state.consignees, consignee] })),
  selectedConsignee: null,
  setSelectedConsignee: (consignee) => set({ selectedConsignee: consignee }),
  updateConsignee: (updated) =>
    set((state) => ({
      consignees: state.consignees.map((c) =>
        c._id === updated._id ? updated : c
      ),
    })),
  removeConsignee: (id) =>
    set((state) => ({
      consignees: state.consignees.filter((consignee) => consignee._id !== id),
    })),
}));
