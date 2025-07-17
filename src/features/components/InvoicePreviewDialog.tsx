import type React from "react";
import { useState } from "react";
import { PDFViewer, PDFDownloadLink } from "@react-pdf/renderer";
import { Download, Eye, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { InvoicePDF } from "../templates/template1/InvoicePDF";

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
  const [showPDFViewer, setShowPDFViewer] = useState(false);

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-full max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            Invoice Preview
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowPDFViewer(!showPDFViewer)}
              >
                <Eye className="h-4 w-4 mr-2" />
                {showPDFViewer ? "Hide PDF" : "Show PDF"}
              </Button>
              <PDFDownloadLink
                document={
                  <InvoicePDF
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
          {showPDFViewer ? (
            <div className="h-[70vh] w-full">
              <PDFViewer width="100%" height="100%">
                <InvoicePDF
                  invoice={invoice}
                  company={company}
                  client={client}
                  consignee={consignee}
                />
              </PDFViewer>
            </div>
          ) : (
            <div className="space-y-4 p-4 bg-muted/50 rounded-lg overflow-y-auto max-h-[70vh]">
              {/* Company Header */}
              <div className="text-center border-b pb-4">
                <h2 className="text-2xl font-bold">{company?.companyName}</h2>
                <p className="text-muted-foreground">
                  {company?.address?.add1}
                </p>
                <p className="text-muted-foreground">
                  {company?.address?.add2}
                </p>
                <p className="text-muted-foreground">
                  {company?.address?.city}, {company?.address?.state} -{" "}
                  {company?.address?.pincode}
                </p>
                <p className="text-sm text-muted-foreground">
                  GST: {company?.address.gstNo} | PAN: {company?.address.panNo}
                </p>
              </div>

              <h3 className="text-xl font-bold text-center">TAX INVOICE</h3>

              {/* Invoice Details */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <strong>Invoice No:</strong> {invoice.invoiceNo}
                </div>
                <div>
                  <strong>Date:</strong> {formatDate(invoice.date)}
                </div>
                <div>
                  <strong>Reference No:</strong> {invoice.referenceNo || "N/A"}
                </div>
                <div>
                  <strong>Reference Date:</strong>{" "}
                  {formatDate(invoice.referenceDate) || "N/A"}
                </div>
              </div>

              {/* Bill To / Ship To */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="border p-3 rounded">
                  <h4 className="font-semibold mb-2">Bill To:</h4>
                  <p>{client?.clientCompanyName}</p>
                  <p>{client?.address?.add1}</p>
                  <p>{client?.address?.add2}</p>
                  <p>
                    {client?.address?.city}, {client?.address?.state} -{" "}
                    {client?.address?.pincode}
                  </p>
                  <p>GST: {client?.gstNo}</p>
                </div>
                {consignee && (
                  <div className="border p-3 rounded">
                    <h4 className="font-semibold mb-2">Ship To:</h4>
                    <p>{consignee?.consigneeCompanyName}</p>
                    <p>{consignee?.address?.add1}</p>
                    <p>{consignee?.address?.add2}</p>
                    <p>
                      {consignee?.address?.city}, {consignee?.address?.state} -{" "}
                      {consignee?.address?.pincode}
                    </p>
                  </div>
                )}
              </div>

              {/* Items */}
              <div>
                <h4 className="font-semibold mb-2">Items:</h4>
                <div className="border border-gray-300 rounded overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-muted">
                      <tr>
                        <th className="text-left p-2 border-b">Description</th>
                        <th className="text-center p-2 border-b">HSN</th>
                        <th className="text-center p-2 border-b">Qty</th>
                        <th className="text-center p-2 border-b">Rate</th>
                        <th className="text-right p-2 border-b">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {invoice.items?.map((item: any, index: number) => (
                        <tr key={index} className="border-b last:border-b-0">
                          <td className="p-2">{item.description}</td>
                          <td className="text-center p-2">
                            {item.hsnCode || "-"}
                          </td>
                          <td className="text-center p-2">{item.quantity}</td>
                          <td className="text-center p-2">
                            ₹
                            {Number.parseFloat(item.unitPrice || "0").toFixed(
                              2
                            )}
                          </td>
                          <td className="text-right p-2">
                            ₹{Number.parseFloat(item.total || "0").toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Totals */}
              <div className="text-right space-y-1 border-t pt-4">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>₹{(invoice.totalBeforeGST || 0).toFixed(2)}</span>
                </div>
                {invoice.gstDetails?.type !== "None" && (
                  <>
                    {invoice.gstDetails?.type === "CGST" && (
                      <>
                        <div className="flex justify-between">
                          <span>CGST ({invoice.gstDetails.cgstRate}%):</span>
                          <span>
                            ₹{(invoice.gstDetails.cgst || 0).toFixed(2)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>SGST ({invoice.gstDetails.sgstRate}%):</span>
                          <span>
                            ₹{(invoice.gstDetails.sgst || 0).toFixed(2)}
                          </span>
                        </div>
                      </>
                    )}
                    {invoice.gstDetails?.type === "IGST" && (
                      <div className="flex justify-between">
                        <span>IGST ({invoice.gstDetails.igstRate}%):</span>
                        <span>
                          ₹{(invoice.gstDetails.igst || 0).toFixed(2)}
                        </span>
                      </div>
                    )}
                  </>
                )}
                {invoice.roundingOff !== 0 && (
                  <div className="flex justify-between">
                    <span>Rounding Off:</span>
                    <span>₹{(invoice.roundingOff || 0).toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-lg border-t pt-2">
                  <span>Total:</span>
                  <span>₹{(invoice.grossAmount || 0).toFixed(2)}</span>
                </div>
              </div>

              {/* Amount in Words */}
              {invoice.inWords && (
                <div className="text-sm">
                  <strong>Amount in Words:</strong> {invoice.inWords}
                </div>
              )}

              {/* Bank Details */}
              {invoice.bankDetails && (
                <div className="border border-gray-300 p-3 rounded text-sm">
                  <h4 className="font-semibold mb-2">Bank Details:</h4>
                  <p>
                    <strong>Bank Name:</strong> {invoice.bankDetails.bankName}
                  </p>
                  <p>
                    <strong>Account No:</strong> {invoice.bankDetails.accNo}
                  </p>
                  <p>
                    <strong>IFSC Code:</strong> {invoice.bankDetails.ifsc}
                  </p>
                  <p>
                    <strong>Branch:</strong> {invoice.bankDetails.branchName}
                  </p>
                </div>
              )}

              {/* Notes and Declaration */}
              {invoice.note && (
                <div className="text-sm">
                  <strong>Notes:</strong> {invoice.note}
                </div>
              )}
              {invoice.declaration && (
                <div className="text-sm">
                  <strong>Declaration:</strong> {invoice.declaration}
                </div>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
