import type { FormValues } from "./CreateInvoiceBase";

// Global base/default structure
const baseDefaults: Partial<FormValues> = {
  financialYear: "25-26",
  status: "Pending",
  details: {
    referenceNo: "",
    referenceDate: undefined,
    otherReferences: "",
    purchaseNo: "",
    purchaseDate: undefined,
    termsOfDelivery: "",
    dueDate: "",
    dispatchDetails: {
      dispatchNo: "",
      date: undefined,
      through: "",
      destination: "",
    },
  },
  roundingOff: 0,
  hrDescription: { year: "", month: "", hrCode: "", hrName: "" },
  items: [
    {
      description: "",
      hsnCode: "",
      quantity: 1,
      unitPrice: "0",
      total: "0",
    },
  ],
  gstDetails: {
    type: "CGST",
    cgstRate: 9,
    sgstRate: 9,
    fuelSurchargeRate: 0,
    cgst: 0,
    sgst: 0,
    igst: 0,
    fuelSurcharge: 0,
    totalGstAmount: 0,
    totalAmount: 0,
  },
  note: "",
  declaration:
    "We declare that this Invoice shows the actual price of the Goods described and that all particulars are true and correct.",
  createdBy: "",
};

export const defaultFormValuesMap: Record<string, Partial<FormValues>> = {
  "689af187ba41e292ec4ca2f1": {
    ...baseDefaults,
    note: "TDS Not applicable on postal reimbursement charges",
  },

  "689af187ba41e292ec4ca2f2": {
    ...baseDefaults,
  },

  Default: baseDefaults,
};

export const getCompanyDefaultFormValues = (
  companyId?: string
): Partial<FormValues> => {
  if (!companyId) return defaultFormValuesMap.Default;
  return defaultFormValuesMap[companyId] ?? defaultFormValuesMap.Default;
};
