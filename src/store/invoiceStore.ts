import { create } from "zustand";

export interface InvoiceItem {
  description: string;
  hsnCode?: string;
  unitPrice?: string;
  quantity?: number;
  total?: number;
}

export interface GSTDetails {
  type: "CGST" | "SGST" | "IGST" | "None";
  cgstRate?: number;
  sgstRate?: number;
  igstRate?: number;
  cgst?: number;
  sgst?: number;
  igst?: number;
  fuelSurchargeRate?: number;
  fuelSurcharge?: number;
  totalAmount?: number;
}

export interface DispatchDetails {
  dispatchNo?: string;
  date?: string;
  through?: string;
  destination?: string;
}

export interface HRDescription {
  year?: number;
  month?: string;
  hrCode?: string;
  hrName?: string;
}

export interface BankDetails {
  bankName?: string;
  accNo?: string;
  ifsc?: string;
  branchName?: string;
}

export interface Invoice {
  _id: string;
  invoiceNo: string;
  date: string;
  financialYear: string;
  referenceNo?: string;
  referenceDate?: string;
  otherReferences?: string;
  purchaseNo?: string;
  purchaseDate?: string;
  termsOfDelivery?: string;
  dispatchDetails?: DispatchDetails;
  hrDescription?: HRDescription;
  company: string; // id reference
  from: string;
  to: string;
  consignee?: string; // id reference
  client: string; // id reference
  companyBankDetails?: BankDetails;
  items: InvoiceItem[];
  totalBeforeGST: number;
  gstDetails?: GSTDetails;
  note?: string;
  declaration?: string;
  roundingOff?: number;
  grossAmount: number;
  inWords?: string;
  status: "Pending" | "Paid" | "Overdue";
  createdAt: string;
}

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
