import { InvoicePDFPS } from "@/features/templates/templateps/InvoicePDFPS";
import { CreateInvoiceBase } from "./CreateInvoiceBase";

export default function CreateInvoicePS() {
  return <CreateInvoiceBase invoiceType="PS" PDFTemplate={InvoicePDFPS} />;
}
