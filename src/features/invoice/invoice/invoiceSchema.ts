import z from "zod";

export type FormValues = z.infer<typeof invoiceSchema>;

export const invoiceSchema = z.object({
  invoiceNo: z.string(),
  date: z.date(),
  financialYear: z.string().optional(),

  details: z.object({
    // Reference & Delivery
    referenceNo: z.string().optional(),
    referenceDate: z.date().optional(),
    otherReferences: z.string().optional(),
    purchaseNo: z.string().optional(),
    purchaseDate: z.date().optional(),
    termsOfDelivery: z.string().optional(),
    dueDate: z.string().optional(),
    // Dispatch
    dispatchDetails: z.object({
      dispatchNo: z.string().optional(),
      date: z.date().optional(),
      through: z.string().optional(),
      destination: z.string().optional(),
    }),
  }),

  // HR
  hrDescription: z.object({
    year: z.string().optional(),
    month: z.string().optional(),
    hrCode: z.string().optional(),
    hrName: z.string().optional(),
  }),

  // Recieved Data from
  dataFrom: z.string().optional(),

  // Relations
  company: z.string(),
  client: z.string().min(1, "Client is required"),
  consignee: z.string().min(1, "Consignee is required"),
  createdBy: z.any(),

  // Items
  items: z
    .array(
      z.object({
        description: z.string().min(1, "Description is required"),
        hsnCode: z.string(),
        quantity: z.coerce.number(),
        unitPrice: z.union([z.string(), z.number()]),
        total: z.union([z.string(), z.number()]),
        applyGST: z.boolean().default(true),
      })
    )
    .min(1, "At least one item is required"),

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
    totalGstAmount: z.coerce.number().optional(),
    totalAmount: z.coerce.number().optional(),
  }),

  // Misc
  note: z.string().optional(),
  declaration: z.string().min(1, "Declaration is required"),
  status: z.enum(["Pending", "Paid", "Overdue"]),
});
