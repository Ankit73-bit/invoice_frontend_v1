import { StyleSheet, Text, View } from "@react-pdf/renderer";

function Signature() {
  const signatureStyle = StyleSheet.create({
    container: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "flex-end",
      alignItems: "flex-end",
    },
  });

  return (
    <View style={signatureStyle.container}>
      <Text style={{ paddingLeft: 100 }}>Authorized Signatory</Text>
    </View>
  );
}

export default Signature;
