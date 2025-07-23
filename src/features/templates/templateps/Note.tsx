import { StyleSheet, Text, View } from "@react-pdf/renderer";

const noteStyle = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row",
  },
  description: {
    paddingTop: 20,
    paddingLeft: 4,
    paddingRight: 4,
    paddingBottom: 10,
    flexWrap: "wrap",
    width: "40%",
    borderRight: "1px solid black",
  },
  hsncode: {
    padding: 4,
    width: "15%",
    borderRight: "1px solid black",
    textAlign: "center",
  },
  qty: {
    padding: 4,
    width: "16%",
    borderRight: "1px solid black",
    textAlign: "center",
  },
  unitPrice: {
    padding: 4,
    width: "13%",
    borderRight: "1px solid black",
    textAlign: "center",
  },
  total: { padding: 4, width: "16%", textAlign: "center" },
});

function Note({ note }) {
  return (
    <>
      <View style={noteStyle.container}>
        <Text style={noteStyle.description}>
          {note.length > 0 && "Note: "}
          {note}
        </Text>
        <Text style={noteStyle.hsncode}></Text>
        <Text style={noteStyle.qty}></Text>
        <Text style={noteStyle.unitPrice}></Text>
        <Text style={noteStyle.total}></Text>
      </View>
    </>
  );
}

export default Note;
