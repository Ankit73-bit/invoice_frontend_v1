import { StyleSheet, Text, View } from "@react-pdf/renderer";

const companyStyles = StyleSheet.create({
  companyName: {
    fontWeight: "semibold",
    fontSize: 12,
  },
  container: {
    display: "flex",
    flexDirection: "column",
    flexWrap: "wrap",
    borderRight: "1px solid black",
    width: "50%",
    fontSize: 10,
    padding: 4,
  },
});

function CompanyDetails({ company }) {
  return (
    <View style={companyStyles.container}>
      <Text style={companyStyles.companyName}>{company?.companyName}</Text>
      <Text>{company?.address?.add1}</Text>
      <Text>{company?.address?.add2}</Text>
      <Text>{`${company?.address?.add3}, ${company?.address?.pinCode}`}</Text>
      <Text>{company?.address?.contact}</Text>
      <Text>{company?.address?.mail}</Text>
      <Text>{company?.address?.gstno}</Text>
    </View>
  );
}

export default CompanyDetails;
