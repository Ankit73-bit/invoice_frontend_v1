export interface InvoiceItem {
  description: string;
  hsnCode?: string;
  unitPrice?: string | number;
  quantity?: number;
  total?: string | number;
  applyGST: boolean;
}

export type FormInvoiceItem = {
  description: string;
  hsnCode: string;
  quantity: number;
  unitPrice: string | number;
  total: string | number;
  applyGST: boolean;
};

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

export interface HRDescription {
  year?: string;
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

export interface DetailsSchema {
  referenceNo?: string;
  referenceDate?: string;
  otherReferences?: string;
  purchaseNo?: string;
  purchaseDate?: string;
  dueDate?: string;
  termsOfDelivery?: string | undefined;
  dispatchDetails: {
    dispatchNo?: string;
    date?: string;
    through?: string;
    destination?: string;
  };
}

export interface Invoice {
  _id: string;
  invoiceNo: string;
  date: string;
  financialYear: string;
  details: DetailsSchema;
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
  createdBy: string;
}

export interface User {
  _id: string;
  fullName: string;
  email: string;
  role: "user" | "admin";
  company: Company;
}

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

export interface Company {
  _id: string;
  companyName: string;
  address: Address;
  invoicePrefix: string;
  allowManualItemTotals: string;
  isActive: string;
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

export interface Consignee {
  _id: string;
  consigneeCompanyName: string;
  consigneeName?: string;
  company: string;
  contact?: string;
  email?: string;
  address: Address;
  createdAt: string;
}

export interface ClientItem {
  _id: string;
  clientId: string | Client;
  companyId: string;
  description: string;
  unitPrice: number;
  hsnCode: string;
  category: string;
  lastUsed?: string;
  applyGST?: boolean;
}

export interface InvoiceSummary {
  totalInvoices: number;
  totalRevenue: number;
  paid: { count: number; amount: number };
  pending: { count: number; amount: number };
  overdue: { count: number; amount: number };
  lastUpdated: string;
}

export interface MonthlyStats {
  month: string;
  count: number;
  revenue: number;
}

export interface TopClient {
  client: {
    _id: string;
    clientCompanyName: string;
  };
  invoiceCount: number;
  totalRevenue: number;
}

export interface CalculatedTotals {
  totalBeforeGST: number;
  cgstAmount: number;
  sgstAmount: number;
  igstAmount: number;
  fuelSurchargeAmount: number;
  totalGSTAmount: number;
  totalAmount: number;
  roundingOff: number;
  grossAmount: number;
  totalTaxable: number;
}
