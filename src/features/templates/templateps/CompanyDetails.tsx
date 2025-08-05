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
  email: {
    color: "#0096FF",
  },
});

interface companyProps {
  company: any;
}

function CompanyDetails({ company }: companyProps) {
  return (
    <View style={companyStyles.container}>
      <Text style={companyStyles.companyName}>{company?.companyName}</Text>
      <Text>{company?.address?.add1}</Text>
      <Text>{company?.address?.add2}</Text>
      <Text>{`${company?.address?.add3}, ${company?.address?.pinCode}`}</Text>
      <Text>{company?.contact}</Text>
      <Text style={companyStyles.email}>{company?.email}</Text>
      <Text>GST - {company?.address?.gstNo}</Text>
    </View>
  );
}

export default CompanyDetails;
