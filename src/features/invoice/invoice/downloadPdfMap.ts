import { InvoicePDFPS } from "@/features/templates/templateps/InvoicePDFPS";
import { InvoicePDFPP } from "@/features/templates/templatepp/InvoicePDFPP";
import { pdf } from "@react-pdf/renderer";
import { saveAs } from "file-saver";
import React from "react";
import type { DocumentProps } from "@react-pdf/renderer";

export const downloadPdfMap: Record<
  string,
  React.ComponentType<DocumentProps & any>
> = {
  "686229f9f8998a2972ba8d7a": InvoicePDFPS,
  "685e835863244aefe1b2820b": InvoicePDFPP,
  Default: InvoicePDFPS,
};

export const downloadInvoicePDF = async (
  component: React.ReactElement<DocumentProps>,
  filename: string
) => {
  const blob = await pdf(component).toBlob();
  saveAs(blob, filename);
};
