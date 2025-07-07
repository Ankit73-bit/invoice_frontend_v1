import { useEffect } from "react";
import { api } from "@/lib/api";
import { toast } from "react-toastify";
import { useConsigneeStore } from "@/store/consigneeStore";

export function useConsignees() {
  const { setConsignees, consignees } = useConsigneeStore();

  useEffect(() => {
    const fetchConsignees = async () => {
      try {
        const res = await api.get("/consignees");
        setConsignees(res.data.data);
      } catch (error) {
        console.error("Failed to fetch consignees", error);
        toast.error("Failed to load consignees");
      }
    };

    fetchConsignees();
  }, [setConsignees]);

  return { consignees };
}
