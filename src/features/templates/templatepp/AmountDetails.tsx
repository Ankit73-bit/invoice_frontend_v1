import { StyleSheet, View } from "@react-pdf/renderer";
import BankDetailsAndAMT from "./BankDetailsAndAMT";
import AmountCalculations from "./AmountCalculations";

interface AmountDetailsProps {
  invoice: any;
  company: any;
}

function AmountDetails({ invoice, company }: AmountDetailsProps) {
  const amountStyles = StyleSheet.create({
    container: {
      display: "flex",
      flexDirection: "row",
    },
  });
  return (
    <View style={amountStyles.container}>
      <BankDetailsAndAMT
        amountInWords={invoice.inWords}
        bankDetails={company.companyBankDetails}
      />
      <AmountCalculations
        gstDetails={invoice.gstDetails}
        roundingOff={invoice.roundingOff}
        grossAmount={invoice.grossAmount}
        totalBeforeGST={invoice.totalBeforeGST}
      />
    </View>
  );
}

export default AmountDetails;
