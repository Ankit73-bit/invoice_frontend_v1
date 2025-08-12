import { InvoicePDFPS } from "@/features/templates/templateps/InvoicePDFPS";
import { InvoicePDFPP } from "@/features/templates/templatepp/InvoicePDFPP";

export const pdfTemplateMap: Record<string, React.FC<any>> = {
  "689af187ba41e292ec4ca2f1": InvoicePDFPS, // PS company
  "689af187ba41e292ec4ca2f2": InvoicePDFPP, // PP company
  Default: InvoicePDFPS,
};
