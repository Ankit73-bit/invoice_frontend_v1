import { useEffect } from "react";
import { useClientStore } from "@/store/clientStore";
import { api } from "@/lib/api";
import { toast } from "react-toastify";
import { useCompanyContext } from "@/store/companyContextStore";

export function useClients() {
  const { setClients, clients } = useClientStore();
  const { selectedCompanyId } = useCompanyContext();

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const res = await api.get(`/clients?companyId=${selectedCompanyId}`);
        setClients(res.data.data); // assuming data shape is { data: Client[] }
      } catch (error) {
        console.error("Failed to fetch clients", error);
        toast.error("Failed to load clients");
      }
    };

    fetchClients();
  }, [setClients, selectedCompanyId]);

  return { clients };
}
