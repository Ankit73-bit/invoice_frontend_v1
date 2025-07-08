import type { Invoice } from "@/store/invoiceStore";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 11,
    fontFamily: "Helvetica",
  },
  section: {
    marginBottom: 10,
  },
  heading: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 4,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  tableHeader: {
    backgroundColor: "#eee",
    padding: 4,
    fontWeight: "bold",
    flex: 1,
  },
  tableCell: {
    padding: 4,
    flex: 1,
  },
});

export const InvoicePDF = ({ invoice }: { invoice: Invoice }) => {
  console.log(invoice);
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text style={styles.heading}>Invoice No: {invoice.invoiceNo}</Text>
          <Text>Date: {invoice.date}</Text>
          <Text>Financial Year: {invoice.financialYear}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.heading}>Client Details</Text>
          <Text>{invoice.client?.clientCompanyName}</Text>
          <Text>{invoice.client?.email}</Text>
          <Text>{invoice.client?.address?.gstNo}</Text>
        </View>

        {invoice.consignee && (
          <View style={styles.section}>
            <Text style={styles.heading}>Consignee Details</Text>
            <Text>{invoice.consignee?.consigneeCompanyName}</Text>
            <Text>{invoice.consignee?.email}</Text>
            <Text>{invoice.consignee?.address?.gstNo}</Text>
          </View>
        )}

        <View style={[styles.section, { marginTop: 12 }]}>
          <Text style={styles.heading}>Items</Text>
          <View style={styles.row}>
            <Text style={styles.tableHeader}>Description</Text>
            <Text style={styles.tableHeader}>HSN</Text>
            <Text style={styles.tableHeader}>Qty</Text>
            <Text style={styles.tableHeader}>Rate</Text>
            <Text style={styles.tableHeader}>Total</Text>
          </View>
          {invoice.items.map((item, i) => (
            <View key={i} style={styles.row}>
              <Text style={styles.tableCell}>{item.description}</Text>
              <Text style={styles.tableCell}>{item.hsnCode}</Text>
              <Text style={styles.tableCell}>{item.quantity}</Text>
              <Text style={styles.tableCell}>{item.unitPrice}</Text>
              <Text style={styles.tableCell}>{item.total}</Text>
            </View>
          ))}
        </View>

        {/* <View style={{ marginTop: 10 }}>
        <Text>Total Before GST: ₹{invoice.totalBeforeGST.toFixed(2)}</Text>
        <Text>GST: ₹{invoice.gstDetails?.totalAmount?.toFixed(2) || 0}</Text>
        <Text>Rounding Off: ₹{invoice.roundingOff?.toFixed(2) || 0}</Text>
        <Text style={{ fontWeight: "bold" }}>
          Gross Amount: ₹{invoice.grossAmount.toFixed(2)}
        </Text>
      </View> */}
      </Page>
    </Document>
  );
};
