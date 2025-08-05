import { StyleSheet, Text, View } from "@react-pdf/renderer";

interface BankDetailsProps {
  bankDetails: any;
}

function BankDetails({ bankDetails }: BankDetailsProps) {
  const bankDetailsStyle = StyleSheet.create({
    bankDetails: {
      padding: 4,
      lineHeight: 1,
    },
    bankLabel: {
      fontStyle: "italic",
      color: "#0096FF",
    },
  });

  return (
    <View style={bankDetailsStyle.bankDetails}>
      <Text style={bankDetailsStyle.bankLabel}>Our Bank Details</Text>
      <Text>Bank Name: {bankDetails?.bankName}</Text>
      <Text>Account No: {bankDetails?.accNo}</Text>
      <Text>IFSC Code: {bankDetails?.ifsc}</Text>
      <Text>Branch Name: {bankDetails?.branchName}</Text>
    </View>
  );
}

export default BankDetails;
