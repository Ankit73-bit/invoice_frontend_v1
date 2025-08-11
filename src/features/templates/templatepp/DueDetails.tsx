import { StyleSheet, View, Text } from "@react-pdf/renderer";

const dueDateDetailsStyle = StyleSheet.create({
  container: {
    display: "flex",
    alignItems: "flex-start",
    flexDirection: "row",
    justifyContent: "space-evenly",
    fontSize: 10,
    flexWrap: "wrap",
  },
  dueDate: {
    fontSize: 9,
    borderBottom: "1px solid black",
    width: "100%",
    padding: 4,
  },
  dueDateDestination: {
    fontSize: 9,
    width: "100%",
    padding: 4,
  },
  dueDateflex: {
    display: "flex",
    alignItems: "flex-start",
    flexDirection: "row",
    justifyContent: "space-evenly",
    flexWrap: "wrap",
  },
  dueDates: {
    fontSize: 9,
    borderTop: "1px solid black",
    width: "100%",
    padding: 4,
  },
});

interface dueDetailsProps {
  dueDate: any;
}

function DueDetails({ dueDate }: dueDetailsProps) {
  return (
    <View style={dueDateDetailsStyle.container}>
      <View style={dueDateDetailsStyle.dueDateflex}>
        <Text style={dueDateDetailsStyle.dueDates}>Due Date: {dueDate}</Text>
      </View>
    </View>
  );
}

export default DueDetails;
