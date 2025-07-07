import { StyleSheet, View, Text } from "@react-pdf/renderer";
import { formattedDate } from "../utils/helpers";

const invoiceDetails = StyleSheet.create({
  container: {
    display: "flex",
    alignItems: "flex-start",
    flexDirection: "row",
    justifyContent: "space-evenly",
    fontSize: 10,
    flexWrap: "wrap",
  },
  invoiceNo: {
    fontSize: 9,
    borderBottom: "1px solid black",
    width: "50%",
    padding: 4,
  },
  invoiceDate: {
    fontSize: 9,
    borderBottom: "1px solid black",
    borderLeft: "1px solid black",
    width: "50%",
    padding: 4,
  },
});

function InvoiceNoDetails({ invoiceNo, invoiceDate }) {
  return (
    <View style={invoiceDetails.container}>
      <Text style={invoiceDetails.invoiceNo}>Invoice No: {invoiceNo}</Text>
      <Text style={invoiceDetails.invoiceDate}>
        Invoice Date: {formattedDate(invoiceDate)}
      </Text>
    </View>
  );
}

export default InvoiceNoDetails;
