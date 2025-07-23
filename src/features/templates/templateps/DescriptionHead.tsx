import { StyleSheet, Text, View } from "@react-pdf/renderer";

const descriptionHeadStyle = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "start",
    borderBottom: "1px solid black",
    alignItems: "center",
    fontWeight: "bold",
  },
  description: {
    flexWrap: "wrap",
    width: "40%",
    borderRight: "1px solid black",
    textAlign: "center",
  },
  hsncode: {
    width: "15%",
    borderRight: "1px solid black",
    textAlign: "center",
  },
  qty: {
    width: "16%",
    borderRight: "1px solid black",
    textAlign: "center",
  },
  unitPrice: {
    width: "13%",
    borderRight: "1px solid black",
    textAlign: "center",
  },
  total: {
    width: "16%",
    textAlign: "center",
  },
  innerText: {
    padding: 4,
  },
});

function DescriptionHead() {
  return (
    <>
      <View style={descriptionHeadStyle.container}>
        <View style={descriptionHeadStyle.description}>
          <Text style={descriptionHeadStyle.innerText}>Description</Text>
        </View>
        <View style={descriptionHeadStyle.hsncode}>
          <Text style={descriptionHeadStyle.innerText}>HSN Code</Text>
        </View>
        <View style={descriptionHeadStyle.qty}>
          <Text style={descriptionHeadStyle.innerText}>QTY</Text>
        </View>
        <View style={descriptionHeadStyle.unitPrice}>
          <Text style={descriptionHeadStyle.innerText}>Unit Price</Text>
        </View>
        <View style={descriptionHeadStyle.total}>
          <Text style={descriptionHeadStyle.innerText}>Total</Text>
        </View>
      </View>
    </>
  );
}

export default DescriptionHead;
