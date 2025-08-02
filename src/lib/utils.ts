import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { pdf, type DocumentProps } from "@react-pdf/renderer";
import { saveAs } from "file-saver";
import type { ReactElement } from "react";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const downloadInvoicePDF = async (
  component: ReactElement,
  filename: string
) => {
  const blob = await pdf(component as ReactElement<DocumentProps>).toBlob();
  saveAs(blob, filename);
};
