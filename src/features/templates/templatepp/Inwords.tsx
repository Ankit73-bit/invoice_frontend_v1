import { StyleSheet, Text, View } from "@react-pdf/renderer";

interface InwordsProps {
  amountInWords: string;
}

function Inwords({ amountInWords }: InwordsProps) {
  const inwordsStyle = StyleSheet.create({
    AMTDetails: {
      padding: 4,
      borderTop: "1px solid black",
      lineHeight: 0.9,
      fontWeight: "extrabold",
    },
  });

  return (
    <View style={inwordsStyle.AMTDetails}>
      {amountInWords && <Text>Amount In Words: {amountInWords}</Text>}
    </View>
  );
}

export default Inwords;
