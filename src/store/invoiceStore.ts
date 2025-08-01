import type { Invoice } from "@/lib/types";
import { create } from "zustand";

interface InvoiceStore {
  invoices: Invoice[];
  selectedInvoice: Invoice | null;
  setInvoices: (data: Invoice[]) => void;
  setSelectedInvoice: (invoice: Invoice | null) => void;
  addInvoice: (invoice: Invoice) => void;
  removeInvoice: (id: string) => void;
  resetSelectedInvoice: () => void;
}

export const useInvoiceStore = create<InvoiceStore>((set) => ({
  invoices: [],
  selectedInvoice: null,
  setInvoices: (data) => set({ invoices: data }),
  setSelectedInvoice: (invoice) => set({ selectedInvoice: invoice }),
  addInvoice: (invoice) =>
    set((state) => ({ invoices: [invoice, ...state.invoices] })),
  removeInvoice: (id) =>
    set((state) => ({
      invoices: state.invoices.filter((inv) => inv._id !== id),
    })),
  resetSelectedInvoice: () => set({ selectedInvoice: null }),
}));
