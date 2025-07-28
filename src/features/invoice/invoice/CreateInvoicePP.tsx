import { InvoicePDFPP } from "@/features/templates/templatepp/InvoicePDFPP";
import { CreateInvoiceBase } from "./CreateInvoiceBase";

export default function CreateInvoicePP() {
  return (
    <CreateInvoiceBase
      invoiceType="PP"
      PDFTemplate={InvoicePDFPP}
      showHRSection
    />
  );
}
