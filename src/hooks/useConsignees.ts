import { useEffect } from "react";
import { useConsigneeStore } from "@/store/consigneeStore";
import { api } from "@/lib/api";
import { toast } from "react-toastify";
import { useCompanyContext } from "@/store/companyContextStore";

/**
 * Fetch consignees for the given company.
 * If no companyId is provided, it will use the selectedCompanyId from context.
 */
export function useConsignees(companyIdOverride?: string) {
  const { setConsignees, consignees } = useConsigneeStore();
  const { selectedCompanyId } = useCompanyContext();

  // Use override if provided, otherwise fallback to context
  const companyId = companyIdOverride ?? selectedCompanyId;

  useEffect(() => {
    const fetchConsignees = async () => {
      try {
        const params: Record<string, string> = {};
        if (companyId) {
          params.companyId = companyId;
        }

        const res = await api.get("/consignees", { params });
        setConsignees(res.data.data);
      } catch (error) {
        console.error("Failed to fetch consignees", error);
        toast.error("Failed to load consignees");
      }
    };

    fetchConsignees();
  }, [setConsignees, companyId]);

  return { consignees, setConsignees };
}
