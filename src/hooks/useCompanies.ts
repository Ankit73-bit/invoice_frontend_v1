import { api } from "@/lib/api";
import { useLoaderStore } from "@/store/loaderStore";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export interface Company {
  _id: string;
  companyName: string;
  invoicePrefix: string;
  allowManualItemTotals: string;
  isActive: string;
}

export function useCompanies() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const { showLoader, hideLoader } = useLoaderStore();

  useEffect(() => {
    const fetchCompanies = async () => {
      showLoader();
      try {
        const res = await api.get("/companies");
        setCompanies(res?.data?.data);
      } catch (err) {
        console.error("Failed to fetch companies", err);
        toast("Failed to load companies");
      } finally {
        hideLoader();
      }
    };

    fetchCompanies();
  }, [hideLoader, showLoader]);

  return { companies };
}
