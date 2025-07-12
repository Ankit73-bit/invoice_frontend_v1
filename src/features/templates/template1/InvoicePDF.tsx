import type React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

// Register fonts if needed
// Font.register({
//   family: 'Roboto',
//   src: 'https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu4mxK.woff2'
// });

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#FFFFFF",
    padding: 30,
    fontSize: 10,
    fontFamily: "Helvetica",
  },
  header: {
    marginBottom: 20,
    textAlign: "center",
  },
  companyName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  companyAddress: {
    fontSize: 10,
    color: "#666",
    marginBottom: 2,
  },
  invoiceTitle: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 15,
    textDecoration: "underline",
  },
  section: {
    marginBottom: 15,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  column: {
    flexDirection: "column",
    flex: 1,
  },
  label: {
    fontWeight: "bold",
    marginBottom: 2,
  },
  value: {
    marginBottom: 8,
  },
  table: {
    display: "table",
    width: "auto",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#000",
    marginVertical: 10,
  },
  tableRow: {
    margin: "auto",
    flexDirection: "row",
  },
  tableHeader: {
    backgroundColor: "#f0f0f0",
  },
  tableCol: {
    width: "20%",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#000",
    padding: 5,
  },
  tableColDescription: {
    width: "40%",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#000",
    padding: 5,
  },
  tableCell: {
    fontSize: 9,
    textAlign: "center",
  },
  tableCellLeft: {
    fontSize: 9,
    textAlign: "left",
  },
  totalsSection: {
    marginTop: 20,
    alignItems: "flex-end",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: 200,
    marginBottom: 3,
  },
  totalLabel: {
    fontWeight: "bold",
  },
  grandTotal: {
    fontSize: 12,
    fontWeight: "bold",
    borderTopWidth: 1,
    borderTopColor: "#000",
    paddingTop: 5,
  },
  bankDetails: {
    marginTop: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: "#000",
    borderStyle: "solid",
  },
  bankTitle: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 8,
  },
  footer: {
    marginTop: 30,
    borderTopWidth: 1,
    borderTopColor: "#000",
    paddingTop: 10,
  },
  signature: {
    textAlign: "right",
    marginTop: 40,
  },
});

interface InvoicePDFProps {
  invoice: any;
  company: any;
  client: any;
  consignee?: any;
}

// Utility function to format date to dd-mm-yyyy
const formatDate = (dateString: string) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

export const InvoicePDF: React.FC<InvoicePDFProps> = ({
  invoice,
  company,
  client,
  consignee,
}) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.companyName}>
          {company?.companyName || "Company Name"}
        </Text>
        <Text style={styles.companyAddress}>{company?.address?.add1}</Text>
        <Text style={styles.companyAddress}>{company?.address?.add2}</Text>
        <Text style={styles.companyAddress}>
          {company?.address?.city}, {company?.address?.state} -{" "}
          {company?.address?.pincode}
        </Text>
        <Text style={styles.companyAddress}>
          GST: {company?.gstNo} | PAN: {company?.panNo}
        </Text>
        <Text style={styles.companyAddress}>
          Phone: {company?.phoneNo} | Email: {company?.email}
        </Text>
      </View>

      <Text style={styles.invoiceTitle}>TAX INVOICE</Text>

      {/* Invoice Details */}
      <View style={styles.section}>
        <View style={styles.row}>
          <View style={styles.column}>
            <Text style={styles.label}>Invoice No:</Text>
            <Text style={styles.value}>{invoice.invoiceNo}</Text>
          </View>
          <View style={styles.column}>
            <Text style={styles.label}>Date:</Text>
            <Text style={styles.value}>{formatDate(invoice.date)}</Text>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.column}>
            <Text style={styles.label}>Reference No:</Text>
            <Text style={styles.value}>{invoice.referenceNo || "N/A"}</Text>
          </View>
          <View style={styles.column}>
            <Text style={styles.label}>Reference Date:</Text>
            <Text style={styles.value}>
              {formatDate(invoice.referenceDate) || "N/A"}
            </Text>
          </View>
        </View>
      </View>

      {/* Bill To / Ship To */}
      <View style={styles.section}>
        <View style={styles.row}>
          <View style={styles.column}>
            <Text style={styles.label}>Bill To:</Text>
            <Text style={styles.value}>{client?.clientCompanyName}</Text>
            <Text style={styles.value}>{client?.address?.add1}</Text>
            <Text style={styles.value}>{client?.address?.add2}</Text>
            <Text style={styles.value}>
              {client?.address?.city}, {client?.address?.state} -{" "}
              {client?.address?.pincode}
            </Text>
            <Text style={styles.value}>GST: {client?.gstNo}</Text>
          </View>
          {consignee && (
            <View style={styles.column}>
              <Text style={styles.label}>Ship To:</Text>
              <Text style={styles.value}>
                {consignee?.consigneeCompanyName}
              </Text>
              <Text style={styles.value}>{consignee?.address?.add1}</Text>
              <Text style={styles.value}>{consignee?.address?.add2}</Text>
              <Text style={styles.value}>
                {consignee?.address?.city}, {consignee?.address?.state} -{" "}
                {consignee?.address?.pincode}
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* Items Table */}
      <View style={styles.table}>
        <View style={[styles.tableRow, styles.tableHeader]}>
          <View style={styles.tableColDescription}>
            <Text style={styles.tableCell}>Description</Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>HSN Code</Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>Qty</Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>Rate</Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>Amount</Text>
          </View>
        </View>
        {invoice.items?.map((item: any, index: number) => (
          <View style={styles.tableRow} key={index}>
            <View style={styles.tableColDescription}>
              <Text style={styles.tableCellLeft}>{item.description}</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>{item.hsnCode || "-"}</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>{item.quantity}</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>
                ₹{Number.parseFloat(item.unitPrice || "0").toFixed(2)}
              </Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>
                ₹{(item.total || 0).toFixed(2)}
              </Text>
            </View>
          </View>
        ))}
      </View>

      {/* Totals */}
      <View style={styles.totalsSection}>
        <View style={styles.totalRow}>
          <Text>Subtotal:</Text>
          <Text>₹{(invoice.totalBeforeGST || 0).toFixed(2)}</Text>
        </View>

        {invoice.gstDetails?.type !== "None" && (
          <>
            {invoice.gstDetails?.type === "CGST" && (
              <>
                <View style={styles.totalRow}>
                  <Text>CGST ({invoice.gstDetails.cgstRate}%):</Text>
                  <Text>₹{(invoice.gstDetails.cgst || 0).toFixed(2)}</Text>
                </View>
                <View style={styles.totalRow}>
                  <Text>SGST ({invoice.gstDetails.sgstRate}%):</Text>
                  <Text>₹{(invoice.gstDetails.sgst || 0).toFixed(2)}</Text>
                </View>
              </>
            )}
            {invoice.gstDetails?.type === "IGST" && (
              <View style={styles.totalRow}>
                <Text>IGST ({invoice.gstDetails.igstRate}%):</Text>
                <Text>₹{(invoice.gstDetails.igst || 0).toFixed(2)}</Text>
              </View>
            )}
          </>
        )}

        {invoice.roundingOff !== 0 && (
          <View style={styles.totalRow}>
            <Text>Rounding Off:</Text>
            <Text>₹{(invoice.roundingOff || 0).toFixed(2)}</Text>
          </View>
        )}

        <View style={[styles.totalRow, styles.grandTotal]}>
          <Text style={styles.totalLabel}>Total Amount:</Text>
          <Text style={styles.totalLabel}>
            ₹{(invoice.grossAmount || 0).toFixed(2)}
          </Text>
        </View>
      </View>

      {/* Amount in Words */}
      {invoice.inWords && (
        <View style={styles.section}>
          <Text style={styles.label}>Amount in Words:</Text>
          <Text style={styles.value}>{invoice.inWords}</Text>
        </View>
      )}

      {/* Bank Details */}
      {invoice.bankDetails && (
        <View style={styles.bankDetails}>
          <Text style={styles.bankTitle}>Bank Details:</Text>
          <Text>Bank Name: {invoice.bankDetails.bankName}</Text>
          <Text>Account No: {invoice.bankDetails.accNo}</Text>
          <Text>IFSC Code: {invoice.bankDetails.ifsc}</Text>
          <Text>Branch: {invoice.bankDetails.branchName}</Text>
        </View>
      )}

      {/* Notes and Declaration */}
      {invoice.note && (
        <View style={styles.section}>
          <Text style={styles.label}>Notes:</Text>
          <Text style={styles.value}>{invoice.note}</Text>
        </View>
      )}

      {invoice.declaration && (
        <View style={styles.section}>
          <Text style={styles.label}>Declaration:</Text>
          <Text style={styles.value}>{invoice.declaration}</Text>
        </View>
      )}

      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.signature}>
          <Text>For {company?.companyName}</Text>
          <Text style={{ marginTop: 30 }}>Authorized Signatory</Text>
        </View>
      </View>
    </Page>
  </Document>
);
