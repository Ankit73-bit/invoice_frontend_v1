import type { FormValues } from "../invoice/invoice/CreateInvoiceBase";

export function handleGSTTypeChange(
  value: "CGST" | "IGST" | "None",
  setValue: (path: string, value: any) => void
) {
  setValue("gstDetails.type", value);

  if (value === "CGST") {
    setValue("gstDetails.cgstRate", 9);
    setValue("gstDetails.sgstRate", 9);
    setValue("gstDetails.igstRate", 0);
  } else if (value === "IGST") {
    setValue("gstDetails.igstRate", 18);
    setValue("gstDetails.cgstRate", 0);
    setValue("gstDetails.sgstRate", 0);
  } else {
    setValue("gstDetails.cgstRate", 0);
    setValue("gstDetails.sgstRate", 0);
    setValue("gstDetails.igstRate", 0);
  }

  setValue("gstDetails.cgst", 0);
  setValue("gstDetails.sgst", 0);
  setValue("gstDetails.igst", 0);
}

export function handleCGSTRateChange(
  value: string,
  setValue: (path: string, value: any) => void
) {
  const rate = Number.parseFloat(value);
  setValue("gstDetails.cgstRate", rate);
  setValue("gstDetails.sgstRate", rate); // Auto-sync SGST with CGST
}

export function normalizeItemsForPDF(items: FormValues["items"]) {
  return items.map((item) => ({
    ...item,
    quantity: Number(item.quantity),
    unitPrice: item.unitPrice === "-" ? "-" : Number.parseFloat(item.unitPrice),
    total: Number.parseFloat(item.total),
  }));
}
