import { StyleSheet, View } from "@react-pdf/renderer";
import InvoiceNoDetails from "./InvoiceNoDetails";
import ReferenceDetails from "./ReferenceDetails";
import PurchaseDetails from "./PurchaseDetails";
import DispatchDetails from "./DispatchDetails";
import DueDetails from "./DueDetails";

const invoiceDetails = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
    flexWrap: "wrap",
    width: "50%",
  },
});

interface invoiceProps {
  invoice: any;
}

function InvoiceDetails({ invoice }: invoiceProps) {
  return (
    <View style={invoiceDetails.container}>
      <InvoiceNoDetails
        invoiceNo={invoice?.invoiceNo}
        invoiceDate={invoice?.date}
      />
      <ReferenceDetails
        referenceNo={invoice?.details?.referenceNo}
        referenceDate={invoice?.details?.referenceDate}
      />
      <PurchaseDetails
        purchaseNo={invoice?.details?.purchaseNo}
        purchaseDate={invoice?.details?.purchaseDate}
      />
      <DispatchDetails dispatchDetails={invoice?.details?.dispatchDetails} />
      <DueDetails dueDate={invoice?.details?.dueDate} />
    </View>
  );
}

export default InvoiceDetails;
