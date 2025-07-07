import { View, Text, StyleSheet } from "@react-pdf/renderer";
import { fixed2Decimal } from "../utils/helpers";

function AmountCalculations({
  gstDetails,
  roundingOff,
  grossAmount,
  totalBeforeGST,
  selectedClient,
  items,
}) {
  const client = selectedClient?.clientCompanyName;
  const isPiramal =
    client?.startsWith("PIRAMAL") &&
    items.some((item) => item.description === "Courier charges");

  const amountCalculationStyle = StyleSheet.create({
    container: {
      display: "flex",
      flexDirection: "row",
      width: "50%",
      flexWrap: "wrap",
    },
    text: {
      width: "50%",
      padding: 6,
      borderBottom: "1px solid black",
      borderRight: "1px solid black",
      textAlign: "center",
    },
    amount: {
      width: "50%",
      padding: 6,
      borderBottom: "1px solid black",
      textAlign: "center",
    },
    lasttext: {
      width: "50%",
      padding: 6,
      borderRight: "1px solid black",
      textAlign: "center",
    },
    lastamount: {
      width: "50%",
      padding: 6,
      textAlign: "center",
    },
  });

  if (!gstDetails) {
    return <Text>No GST details available</Text>;
  }

  return (
    <View style={amountCalculationStyle.container}>
      <Text style={amountCalculationStyle.text}>Taxable Value</Text>
      <Text style={amountCalculationStyle.amount}>
        {fixed2Decimal(totalBeforeGST)}
      </Text>
      {gstDetails?.type === "CGST" ? (
        <>
          <Text style={amountCalculationStyle.text}>
            CGST {gstDetails?.cgstRate}%
          </Text>
          <Text style={amountCalculationStyle.amount}>
            {fixed2Decimal(gstDetails?.cgst)}
          </Text>
        </>
      ) : (
        <>
          <Text style={amountCalculationStyle.text}>
            IGST {gstDetails?.igstRate}%
          </Text>
          <Text style={amountCalculationStyle.amount}>
            {fixed2Decimal(gstDetails?.igst)}
          </Text>
        </>
      )}
      <Text style={amountCalculationStyle.text}>
        SGST {gstDetails?.sgstRate}%
      </Text>
      <Text style={amountCalculationStyle.amount}>
        {fixed2Decimal(gstDetails?.sgst)}
      </Text>
      {isPiramal && (
        <>
          <Text style={amountCalculationStyle.text}>
            Fuel Surcharge {gstDetails?.fuelSurchargeRate}%
          </Text>
          <Text style={amountCalculationStyle.amount}>
            {fixed2Decimal(gstDetails?.fuelSurcharge)}
          </Text>
        </>
      )}
      <Text style={amountCalculationStyle.text}>Total Amount</Text>
      <Text style={amountCalculationStyle.amount}>
        {fixed2Decimal(gstDetails?.totalAmount)}
      </Text>
      <Text style={amountCalculationStyle.text}>Rounding Off</Text>
      <Text style={amountCalculationStyle.amount}>
        {fixed2Decimal(roundingOff)}
      </Text>
      <Text style={amountCalculationStyle.lasttext}>Gross Amount</Text>
      <Text style={amountCalculationStyle.lastamount}>
        {fixed2Decimal(grossAmount)}
      </Text>
    </View>
  );
}

export default AmountCalculations;
