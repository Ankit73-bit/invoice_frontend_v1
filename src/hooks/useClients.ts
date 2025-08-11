import { useEffect } from "react";
import { useClientStore } from "@/store/clientStore";
import { api } from "@/lib/api";
import { toast } from "react-toastify";
import { useCompanyContext } from "@/store/companyContextStore";

/**
 * Fetch clients for the given company.
 * If no companyId is provided, it will use the selectedCompanyId from context.
 */
export function useClients(companyIdOverride?: string) {
  const { setClients, clients } = useClientStore();
  const { selectedCompanyId } = useCompanyContext();

  // Use override if provided, otherwise fallback to context
  const companyId = companyIdOverride ?? selectedCompanyId;

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const params: Record<string, string> = {};
        if (companyId) {
          params.companyId = companyId;
        }

        const res = await api.get("/clients", { params });
        setClients(res.data.data);
      } catch (error) {
        console.error("Failed to fetch clients", error);
        toast.error("Failed to load clients");
      }
    };

    fetchClients();
  }, [setClients, companyId]);

  return { clients };
}
