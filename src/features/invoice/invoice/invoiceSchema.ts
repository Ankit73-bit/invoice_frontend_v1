import z from "zod";

export const invoiceSchema = z.object({
  invoiceNo: z.string(),
  date: z.date(),
  financialYear: z.string().optional(),

  // Reference & Delivery
  referenceNo: z.string().optional(),
  referenceDate: z.date().optional(),
  otherReferences: z.string().optional(),
  purchaseNo: z.string().optional(),
  purchaseDate: z.date().optional(),
  termsOfDelivery: z.string().optional(),

  // Dispatch
  dispatchDetails: z.object({
    dispatchNo: z.string().optional(),
    date: z.date().optional(),
    through: z.string().optional(),
    destination: z.string().optional(),
  }),

  // HR
  hrDescription: z.object({
    year: z.coerce.number().optional(),
    month: z.string().optional(),
    hrCode: z.string().optional(),
    hrName: z.string().optional(),
  }),

  // Relations
  company: z.string().optional(), // attached before POST
  client: z.string(),
  consignee: z.string().optional(),

  // Items
  items: z.array(
    z.object({
      description: z.string(),
      hsnCode: z.string().optional(),
      quantity: z.coerce.number().min(1),
      unitPrice: z.string(),
      total: z.string().optional(),
    })
  ),

  // Totals
  totalBeforeGST: z.coerce.number().optional(),
  roundingOff: z.coerce.number().optional(),
  grossAmount: z.coerce.number().optional(),
  inWords: z.string().optional(),

  // GST
  gstDetails: z.object({
    type: z.enum(["CGST", "SGST", "IGST", "None"]),
    cgstRate: z.coerce.number().optional(),
    sgstRate: z.coerce.number().optional(),
    igstRate: z.coerce.number().optional(),
    cgst: z.coerce.number().optional(),
    sgst: z.coerce.number().optional(),
    igst: z.coerce.number().optional(),
    fuelSurchargeRate: z.coerce.number().optional(),
    fuelSurcharge: z.coerce.number().optional(),
    totalAmount: z.coerce.number().optional(),
  }),

  // Misc
  note: z.string().optional(),
  declaration: z.string().optional(),
  status: z.enum(["Pending", "Paid", "Overdue"]).default("Pending"),
});
