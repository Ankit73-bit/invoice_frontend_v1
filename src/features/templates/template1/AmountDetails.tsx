import { StyleSheet, View } from "@react-pdf/renderer";
import AmountCalculations from "./AmountCalculations";
import BankDetailsAndAMT from "./BankDetailsAndAMT";

function AmountDetails({
  bankDetails,
  gstDetails,
  roundingOff,
  grossAmount,
  amountInWords,
  totalBeforeGST,
  selectedClient,
  items,
}) {
  const amountStyles = StyleSheet.create({
    container: {
      display: "flex",
      flexDirection: "row",
    },
  });
  return (
    <View style={amountStyles.container}>
      <BankDetailsAndAMT
        amountInWords={amountInWords}
        bankDetails={bankDetails}
      />
      <AmountCalculations
        gstDetails={gstDetails}
        roundingOff={roundingOff}
        grossAmount={grossAmount}
        totalBeforeGST={totalBeforeGST}
        selectedClient={selectedClient}
        items={items}
      />
    </View>
  );
}

export default AmountDetails;
