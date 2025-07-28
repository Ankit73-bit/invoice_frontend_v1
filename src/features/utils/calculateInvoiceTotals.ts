export interface InvoiceItem {
  total: string | number;
}

export interface GSTDetails {
  type: "CGST" | "IGST" | "None";
  cgstRate?: number;
  sgstRate?: number;
  igstRate?: number;
  fuelSurchargeRate?: number;
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
}

/**
 * Calculates GST and invoice totals from items and gst config.
 */
export function calculateInvoiceTotals(
  items: InvoiceItem[],
  gst: GSTDetails
): CalculatedTotals {
  const totalBeforeGST = items.reduce((sum, item) => {
    const value = parseFloat(item.total?.toString() || "0");
    return sum + (isNaN(value) ? 0 : value);
  }, 0);

  const gstType = gst.type;
  const cgstRate =
    gstType === "CGST" ? parseFloat(String(gst.cgstRate || 0)) : 0;
  const sgstRate =
    gstType === "CGST" ? parseFloat(String(gst.sgstRate || 0)) : 0;
  const igstRate =
    gstType === "IGST" ? parseFloat(String(gst.igstRate || 0)) : 0;
  const fuelRate = parseFloat(String(gst.fuelSurchargeRate || 0));

  const cgstAmount = (totalBeforeGST * cgstRate) / 100;
  const sgstAmount = (totalBeforeGST * sgstRate) / 100;
  const igstAmount = (totalBeforeGST * igstRate) / 100;
  const fuelSurchargeAmount = (totalBeforeGST * fuelRate) / 100;

  const totalGSTAmount =
    cgstAmount + sgstAmount + igstAmount + fuelSurchargeAmount;
  const totalAmount = totalBeforeGST + totalGSTAmount;

  const grossAmount = Math.round(totalAmount);
  const roundingOff = parseFloat((grossAmount - totalAmount).toFixed(2));

  return {
    totalBeforeGST,
    cgstAmount,
    sgstAmount,
    igstAmount,
    fuelSurchargeAmount,
    totalGSTAmount,
    totalAmount,
    roundingOff,
    grossAmount,
  };
}
