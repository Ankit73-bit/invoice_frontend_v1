import type { UseFormSetValue } from "react-hook-form";
import type { FormValues } from "../invoice/invoice/CreateInvoiceBase";

export function handleGSTTypeChange(
  value: "CGST" | "IGST" | "None",
  setValue: UseFormSetValue<FormValues>
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
  setValue: UseFormSetValue<FormValues>
) {
  const rate = Number.parseFloat(value);
  setValue("gstDetails.cgstRate", rate);
  setValue("gstDetails.sgstRate", rate); // Auto-sync SGST with CGST
}

function toNumber(value: string | number, fallback = 0): number {
  if (typeof value === "number") return value;
  const parsed = Number.parseFloat(value);
  return Number.isNaN(parsed) ? fallback : parsed;
}

export function normalizeItemsForPDF(items: FormValues["items"]) {
  return items.map((item) => ({
    ...item,
    quantity: Number(item.quantity), // assumes quantity is string|number; Number(...) coerces safely
    unitPrice: item.unitPrice === "-" ? "-" : toNumber(item.unitPrice), // handles string or number
    total: toNumber(item.total),
  }));
}
