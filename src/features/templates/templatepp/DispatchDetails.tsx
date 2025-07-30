import { formattedDate } from "@/features/utils/helpers";
import { StyleSheet, View, Text } from "@react-pdf/renderer";

const dispatchDetailsStyle = StyleSheet.create({
  container: {
    display: "flex",
    alignItems: "flex-start",
    flexDirection: "row",
    justifyContent: "space-evenly",
    fontSize: 10,
    flexWrap: "wrap",
  },
  dispatch: {
    fontSize: 9,
    borderBottom: "1px solid black",
    width: "100%",
    padding: 4,
  },
  dispatchDestination: {
    fontSize: 9,
    width: "100%",
    padding: 4,
  },
  dispatchflex: {
    display: "flex",
    alignItems: "flex-start",
    flexDirection: "row",
    justifyContent: "space-evenly",
    flexWrap: "wrap",
  },
  dispatchNo: {
    fontSize: 9,
    borderBottom: "1px solid black",
    width: "50%",
    padding: 4,
  },
  dispatchDate: {
    fontSize: 9,
    borderBottom: "1px solid black",
    borderLeft: "1px solid black",
    width: "50%",
    padding: 4,
  },
});

interface dispatchDetailsProps {
  dispatchDetails: any;
}

function DispatchDetails({ dispatchDetails }: dispatchDetailsProps) {
  return (
    <View style={dispatchDetailsStyle.container}>
      <View style={dispatchDetailsStyle.dispatchflex}>
        <Text style={dispatchDetailsStyle.dispatchNo}>
          Dispatch DOC No: {dispatchDetails?.dispatchNo}
        </Text>
        <Text style={dispatchDetailsStyle.dispatchDate}>
          Dispatch Date: {formattedDate(dispatchDetails?.date)}
        </Text>
      </View>
      <Text style={dispatchDetailsStyle.dispatch}>
        Dispatch Through: {dispatchDetails?.through}
      </Text>
      <Text style={dispatchDetailsStyle.dispatchDestination}>
        Dispatch Destination: {dispatchDetails?.destination}
      </Text>
    </View>
  );
}

export default DispatchDetails;
