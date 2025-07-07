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
      <Text style={companyStyles.companyName}>
        {company?.clientCompanyName}
      </Text>
      <Text>{company?.add1}</Text>
      <Text>{company?.add2}</Text>
      <Text>{company?.add3}</Text>
      <Text>{company?.pinCode}</Text>
      <Text>{company?.contact}</Text>
      <Text>{company?.mail}</Text>
      <Text>{company?.gstno}</Text>
    </View>
  );
}

export default CompanyDetails;
