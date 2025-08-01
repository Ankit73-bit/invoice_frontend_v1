import { create } from "zustand";
import { persist } from "zustand/middleware";

type CompanyContext = {
  selectedCompanyId: string | undefined;
  setSelectedCompanyId: (id: string) => void;
  hasHydrated: boolean;
  setHasHydrated: (value: boolean) => void;
};

export const useCompanyContext = create<CompanyContext>()(
  persist(
    (set) => ({
      selectedCompanyId: undefined,
      hasHydrated: false,
      setSelectedCompanyId: (id) => set({ selectedCompanyId: id }),
      setHasHydrated: (value) => set({ hasHydrated: value }),
    }),
    {
      name: "company-context",
      onRehydrateStorage: () => (state) => {
        // ✅ Now safely call the setter
        state?.setHasHydrated(true);
      },
    }
  )
);
