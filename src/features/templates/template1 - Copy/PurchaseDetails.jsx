import { StyleSheet, View, Text } from "@react-pdf/renderer";
import { formattedDate } from "../utils/helpers";

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

function PurchaseDetails({ purchaseNo, purchaseDate }) {
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
