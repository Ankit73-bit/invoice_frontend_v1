import { InvoicePDFPS } from "@/features/templates/templateps/InvoicePDFPS";
import { InvoicePDFPP } from "@/features/templates/templatepp/InvoicePDFPP";

export const pdfTemplateMap: Record<string, React.FC<any>> = {
  "686229f9f8998a2972ba8d7a": InvoicePDFPS, // PS company
  "685e835863244aefe1b2820b": InvoicePDFPP, // PP company
  Default: InvoicePDFPS,
};
