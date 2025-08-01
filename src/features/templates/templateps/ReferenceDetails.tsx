import { formattedDate } from "@/features/utils/helpers";
import { StyleSheet, View, Text } from "@react-pdf/renderer";

const referenceDetails = StyleSheet.create({
  otherReferences: {
    fontSize: 10,
    borderBottom: "1px solid black",
    width: "100%",
    padding: 4,
    flexWrap: "wrap",
  },
  container: {
    display: "flex",
    alignItems: "flex-start",
    flexDirection: "row",
    justifyContent: "space-evenly",
    fontSize: 10,
    flexWrap: "wrap",
  },
  referenceNo: {
    fontSize: 9,
    borderBottom: "1px solid black",
    width: "50%",
    padding: 4,
  },
  referenceDate: {
    fontSize: 9,
    borderBottom: "1px solid black",
    borderLeft: "1px solid black",
    width: "50%",
    padding: 4,
  },
});

interface ReferenceDetailsProps {
  referenceNo: string | number | undefined;
  referenceDate: string | number | Date;
}

function ReferenceDetails({
  referenceNo,
  referenceDate,
}: ReferenceDetailsProps) {
  return (
    <View style={referenceDetails.container}>
      <Text style={referenceDetails.referenceNo}>
        Ref/challan No: {referenceNo}
      </Text>
      <Text style={referenceDetails.referenceDate}>
        Ref/challan Date: {formattedDate(referenceDate)}
      </Text>

      {/* <Text style={referenceDetails.otherReferences}>Other references: -</Text> */}
    </View>
  );
}

export default ReferenceDetails;
