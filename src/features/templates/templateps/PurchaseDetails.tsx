import { formattedDate } from "@/features/utils/helpers";
import { StyleSheet, View, Text } from "@react-pdf/renderer";

const purchaseDetails = StyleSheet.create({
  container: {
    display: "flex",
    alignItems: "flex-start",
    flexDirection: "row",
    justifyContent: "space-evenly",
    fontSize: 10,
    flexWrap: "wrap",
  },
  purchaseNo: {
    fontSize: 8,
    borderBottom: "1px solid black",
    width: "50%",
    padding: 4,
  },
  purchaseDate: {
    fontSize: 8,
    borderBottom: "1px solid black",
    borderLeft: "1px solid black",
    width: "50%",
    padding: 4,
  },
});

interface PurchaseDetailsProps {
  purchaseNo: string | number | undefined;
  purchaseDate: string | number | Date;
}

function PurchaseDetails({ purchaseNo, purchaseDate }: PurchaseDetailsProps) {
  return (
    <View style={purchaseDetails.container}>
      <Text style={purchaseDetails.purchaseNo}>
        Purchase ORD. No: {purchaseNo}
      </Text>
      <Text style={purchaseDetails.purchaseDate}>
        Purchase ORD. Date: {formattedDate(purchaseDate)}
      </Text>
    </View>
  );
}

export default PurchaseDetails;
