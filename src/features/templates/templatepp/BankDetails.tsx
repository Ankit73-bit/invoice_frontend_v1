import { StyleSheet, Text, View } from "@react-pdf/renderer";

function BankDetails({ bankDetails }) {
  const bankDetailsStyle = StyleSheet.create({
    bankDetails: {
      padding: 4,
      lineHeight: 1,
    },
  });

  return (
    <View style={bankDetailsStyle.bankDetails}>
      <Text>Our Bank Details</Text>
      <Text>Bank Name: {bankDetails?.bankName}</Text>
      <Text>Account No: {bankDetails?.accNo}</Text>
      <Text>IFSC Code: {bankDetails?.ifsc}</Text>
      <Text>Branch Name: {bankDetails?.branchName}</Text>
    </View>
  );
}

export default BankDetails;
