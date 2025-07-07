import { StyleSheet, Text, View } from "@react-pdf/renderer";

const consigneeStyles = StyleSheet.create({
  container: {
    fontSize: 10,
    padding: 4,
    width: "100%",
    borderLeft: "1px solid black",
    borderBottom: "1px solid black",
    borderRight: "1px solid black",
  },
  consigneeName: {
    fontWeight: "semibold",
    fontSize: 10,
  },
});

function ConsigneeDetails({ consignee }) {
  if (!consignee) {
    return (
      <View style={consigneeStyles.container}>
        <Text>No consignee details available.</Text>
      </View>
    );
  }

  return (
    <View style={consigneeStyles.container}>
      <Text>Consinee: </Text>
      <Text style={consigneeStyles.consigneeName}>
        {consignee.clientCompanyName}
      </Text>
      {consignee?.address?.add1 && <Text>{consignee.address.add1}</Text>}
      {consignee?.address?.add2 && <Text>{consignee.address.add2}</Text>}
      {consignee?.address?.add3 && <Text>{consignee.address.add3}</Text>}
      {consignee?.address?.pinCode && (
        <Text>Pincode: {consignee.address.pinCode}</Text>
      )}
      {consignee?.address?.panNo && <Text>PAN: {consignee.address.panNo}</Text>}
      {consignee?.address?.gstNo && <Text>GST: {consignee.address.gstNo}</Text>}
    </View>
  );
}

export default ConsigneeDetails;
