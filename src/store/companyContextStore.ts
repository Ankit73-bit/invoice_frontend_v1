import { create } from "zustand";
import { persist } from "zustand/middleware";

type CompanyContext = {
  selectedCompanyId: string | null;
  setSelectedCompanyId: (id: string) => void;
};

export const useCompanyContext = create<CompanyContext>()(
  persist(
    (set) => ({
      selectedCompanyId: null,
      setSelectedCompanyId: (id) => set({ selectedCompanyId: id }),
    }),
    {
      name: "company-context", // key in localStorage
    }
  )
);
