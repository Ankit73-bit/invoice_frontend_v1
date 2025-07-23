import type React from "react";
import { PDFViewer, PDFDownloadLink } from "@react-pdf/renderer";
import { Download, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { pdfTemplateMap } from "../invoice/invoice/templateMap";

interface InvoicePreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  invoice: any;
  company: any;
  client: any;
  consignee?: any;
}

export const InvoicePreviewDialog: React.FC<InvoicePreviewDialogProps> = ({
  open,
  onOpenChange,
  invoice,
  company,
  client,
  consignee,
}) => {
  const companyId = company?._id ?? "Default";
  const InvoicePDFComponent =
    pdfTemplateMap[companyId] || pdfTemplateMap.Default;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-full max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            Invoice Preview
            <div className="flex gap-2">
              <PDFDownloadLink
                document={
                  <InvoicePDFComponent
                    invoice={invoice}
                    company={company}
                    client={client}
                    consignee={consignee}
                  />
                }
                fileName={`${invoice.invoiceNo}.pdf`}
              >
                {({ loading }) => (
                  <Button variant="outline" size="sm" disabled={loading}>
                    <Download className="h-4 w-4 mr-2" />
                    {loading ? "Generating..." : "Download PDF"}
                  </Button>
                )}
              </PDFDownloadLink>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => onOpenChange(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogTitle>
          <DialogDescription>
            Review your invoice before submission
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          <div className="h-[70vh] w-full">
            <PDFViewer width="100%" height="100%">
              <InvoicePDFComponent
                invoice={invoice}
                company={company}
                client={client}
                consignee={consignee}
              />
            </PDFViewer>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
