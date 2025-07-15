import { create } from "zustand";

export interface ClientItem {
  _id: string;
  clientId: string;
  companyId: string;
  description: string;
  unitPrice: number;
  hsnCode: string;
  lastUsed?: string;
}

interface ClientItemStore {
  items: ClientItem[];
  setItems: (items: ClientItem[]) => void;
  addItem: (item: ClientItem) => void;
  updateItem: (item: ClientItem) => void;
  deleteItem: (id: string) => void;
  clearItems: () => void;
}

export const useClientItemStore = create<ClientItemStore>((set) => ({
  items: [],
  setItems: (items) => set({ items }),
  addItem: (item) => set((state) => ({ items: [item, ...state.items] })),
  updateItem: (updated) =>
    set((state) => ({
      items: state.items.map((i) => (i._id === updated._id ? updated : i)),
    })),
  deleteItem: (id) =>
    set((state) => ({
      items: state.items.filter((i) => i._id !== id),
    })),
  clearItems: () => set({ items: [] }),
}));
