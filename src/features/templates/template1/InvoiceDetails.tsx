import { StyleSheet, View } from "@react-pdf/renderer";
import InvoiceNoDetails from "./InvoiceNoDetails";
import ReferenceDetails from "./ReferenceDetails";
import PurchaseDetails from "./PurchaseDetails";
import DispatchDetails from "./DispatchDetails";

const invoiceDetails = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
    flexWrap: "wrap",
    width: "50%",
  },
});

function InvoiceDetails({ invoice }) {
  return (
    <View style={invoiceDetails.container}>
      <InvoiceNoDetails
        invoiceNo={invoice.invoiceNo}
        invoiceDate={invoice.date}
      />
      <ReferenceDetails
        referenceNo={invoice.referenceNo}
        referenceDate={invoice.referenceDate}
      />
      <PurchaseDetails
        purchaseNo={invoice.purchaseNo}
        purchaseDate={invoice.purchaseDate}
      />
      <DispatchDetails dispatchDetails={invoice?.dispatchDetails} />
    </View>
  );
}

export default InvoiceDetails;
