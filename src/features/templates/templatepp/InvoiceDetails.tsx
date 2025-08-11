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
        referenceNo={invoice?.detailsSchema?.referenceNo}
        referenceDate={invoice?.detailsSchema?.referenceDate}
      />
      <PurchaseDetails
        purchaseNo={invoice?.detailsSchema?.purchaseNo}
        purchaseDate={invoice?.detailsSchema?.purchaseDate}
      />
      <DispatchDetails
        dispatchDetails={invoice?.detailsSchema?.dispatchDetails}
      />
      <DueDetails dueDate={invoice?.detailsSchema?.dueDate} />
    </View>
  );
}

export default InvoiceDetails;
