import { StyleSheet, Text, View } from "@react-pdf/renderer";

function HrDescription({ hrDescription }) {
  const hrDescriptionStyle = StyleSheet.create({
    container: {
      display: "flex",
      flexDirection: "row",
      textAlign: "center",
      position: "relative",
    },
    description: {
      flexWrap: "wrap",
      width: "40%",
      borderRight: "1px solid black",
      textAlign: "left",
      padding: 4,
    },
    hsncode: {
      width: "15%",
      borderRight: "1px solid black",
      padding: 4,
    },
    qty: {
      width: "16%",
      borderRight: "1px solid black",
      padding: 4,
    },
    unitPrice: {
      width: "13%",
      borderRight: "1px solid black",
      padding: 4,
    },
    total: {
      width: "16%",
      padding: 4,
    },
  });

  const { year, month, hrName, hrCode } = hrDescription;

  return (
    <>
      <View style={hrDescriptionStyle.container}>
        <Text style={hrDescriptionStyle.description}>
          <Text>
            Bill for the month of {month} - {year}
          </Text>
          {"\n"}
          <Text>
            {hrName} - {hrCode}
          </Text>
        </Text>
        <Text style={hrDescriptionStyle.hsncode}></Text>
        <Text style={hrDescriptionStyle.qty}></Text>
        <Text style={hrDescriptionStyle.unitPrice}></Text>
        <Text style={hrDescriptionStyle.total}></Text>
      </View>
    </>
  );
}

export default HrDescription;
