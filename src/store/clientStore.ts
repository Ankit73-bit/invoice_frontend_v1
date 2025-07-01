import { create } from "zustand";

export interface Address {
  add1?: string;
  add2?: string;
  add3?: string;
  city?: string;
  state?: string;
  pinCode?: string;
  country?: string;
  panNo?: string;
  gstNo?: string;
  stateCode?: string;
}

export interface Client {
  _id: string;
  clientCompanyName: string;
  clientName?: string;
  company: string;
  contact?: string;
  email?: string;
  address: Address;
  createdAt: string;
}

interface ClientStore {
  clients: Client[];
  setClients: (clients: Client[]) => void;
  addClient: (clients: Client) => void;
  selectedClient: Client | null;
  setSelectedClient: (client: Client | null) => void;
  updateClient: (updated: Client) => void;
  removeClient: (id: string) => void;
}

export const useClientStore = create<ClientStore>((set) => ({
  clients: [],
  setClients: (clients) => set({ clients }),
  addClient: (client) =>
    set((state) => ({ clients: [...state.clients, client] })),
  selectedClient: null,
  setSelectedClient: (client) => set({ selectedClient: client }),
  updateClient: (updateClient) =>
    set((state) => ({
      clients: state.clients.map((c) =>
        c._id === updateClient._id ? updateClient : c
      ),
    })),
  removeClient: (id) =>
    set((state) => ({
      clients: state.clients.filter((client) => client._id !== id),
    })),
}));
