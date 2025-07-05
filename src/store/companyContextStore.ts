import { create } from "zustand";

export const useCompanyContext = create<{
  selectedCompanyId: string | null;
  setSelectedCompanyId: (id: string) => void;
}>((set) => ({
  selectedCompanyId: null,
  setSelectedCompanyId: (id) => set({ selectedCompanyId: id }),
}));
