import { useEffect } from "react";
import { api } from "@/lib/api";
import { toast } from "react-toastify";
import { useClientItemStore } from "@/store/clientItemStore";

export function useClientItems(clientId: string | undefined) {
  const { setItems, clearItems, items } = useClientItemStore();

  useEffect(() => {
    const fetchItems = async () => {
      if (!clientId) {
        clearItems();
        return;
      }

      try {
        const res = await api.get(`/client-items/client/${clientId}`);
        setItems(res.data.data);
      } catch (err) {
        console.error("Failed to fetch client items", err);
        toast.error("Failed to load client items");
      }
    };

    fetchItems();
  }, [clientId]);

  return { items };
}
