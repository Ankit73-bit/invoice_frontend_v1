import { StyleSheet, View } from "@react-pdf/renderer";
import BankDetails from "./BankDetails";
import Inwords from "./Inwords";

function BankDetailsAndAMT({ bankDetails, amountInWords }) {
  const bankDetailsAndAMTStyle = StyleSheet.create({
    container: {
      width: "55%",
      borderRight: "1px solid black",
    },
  });

  return (
    <View style={bankDetailsAndAMTStyle.container}>
      <BankDetails bankDetails={bankDetails} />
      <Inwords amountInWords={amountInWords} />
    </View>
  );
}

export default BankDetailsAndAMT;
