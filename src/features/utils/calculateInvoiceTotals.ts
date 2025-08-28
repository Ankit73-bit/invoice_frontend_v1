import type { CalculatedTotals, GSTDetails, InvoiceItem } from "@/lib/types";

// Update your calculateInvoiceTotals function to properly handle applyGST
export function calculateInvoiceTotals(
  items: InvoiceItem[],
  gst: GSTDetails
): CalculatedTotals {
  // Calculate total before GST (all items)
  const totalBeforeGST = items.reduce((sum, item) => {
    const value = parseFloat(item.total?.toString() || "0");
    return sum + (isNaN(value) ? 0 : value);
  }, 0);

  // Separate taxable and non-taxable items
  const taxableItems = items.filter((i) => i.applyGST);
  const nonTaxableItems = items.filter((i) => !i.applyGST);

  const totalTaxable = taxableItems.reduce(
    (sum, i) => sum + Number(i.total || 0),
    0
  );

  const totalNonTaxable = nonTaxableItems.reduce(
    (sum, i) => sum + Number(i.total || 0),
    0
  );

  const gstType = gst.type;
  const cgstRate =
    gstType === "CGST" ? parseFloat(String(gst.cgstRate || 0)) : 0;
  const sgstRate =
    gstType === "CGST" ? parseFloat(String(gst.sgstRate || 0)) : 0;
  const igstRate =
    gstType === "IGST" ? parseFloat(String(gst.igstRate || 0)) : 0;
  const fuelRate = parseFloat(String(gst.fuelSurchargeRate || 0));

  // Only apply GST to taxable items
  const cgstAmount = (totalTaxable * cgstRate) / 100;
  const sgstAmount = (totalTaxable * sgstRate) / 100;
  const igstAmount = (totalTaxable * igstRate) / 100;
  const fuelSurchargeAmount = (totalTaxable * fuelRate) / 100;

  const totalGSTAmount =
    cgstAmount + sgstAmount + igstAmount + fuelSurchargeAmount;

  // Total amount includes non-taxable items + taxable items + GST
  const totalAmount = totalNonTaxable + totalTaxable + totalGSTAmount;

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
    totalTaxable,
  };
}
