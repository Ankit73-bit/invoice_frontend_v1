import { StyleSheet, View, Text } from "@react-pdf/renderer";

const referenceDetails = StyleSheet.create({
  container: {
    display: "flex",
    alignItems: "flex-start",
    flexDirection: "row",
    justifyContent: "space-evenly",
    fontSize: 10,
    flexWrap: "wrap",
  },
  terms: {
    fontSize: 10,
    width: "100%",
    flexWrap: "wrap",
    padding: 4,
  },
});

function TermsOfDelivery({ terms }) {
  return (
    <View style={referenceDetails.container}>
      <Text style={referenceDetails.terms}>Terms Of Delivery: {terms}</Text>
    </View>
  );
}

export default TermsOfDelivery;
