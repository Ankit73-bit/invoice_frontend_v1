import { StyleSheet, Text, View } from "@react-pdf/renderer";

const descriptionStyle = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row",
    textAlign: "center",
    position: "relative",
  },
  description: {
    flexWrap: "wrap",
    width: "40%",
    borderRight: "1px solid black",
    textAlign: "left",
    padding: 4,
  },
  hsncode: {
    width: "15%",
    borderRight: "1px solid black",
    padding: 4,
  },
  qty: {
    width: "16%",
    borderRight: "1px solid black",
    padding: 4,
  },
  unitPrice: {
    width: "13%",
    borderRight: "1px solid black",
    padding: 4,
  },
  total: {
    width: "16%",
    padding: 4,
  },
  innerText: {
    padding: 6,
    fontWeight: "normal",
  },
});

interface itemsProps {
  items: any;
}

function Description({ items }: itemsProps) {
  if (!items) return;
  return (
    <>
      {items.map((item, i) => (
        <View key={i} style={descriptionStyle.container}>
          <Text style={descriptionStyle.description}>
            {item.description || ""}
          </Text>
          <Text style={descriptionStyle.hsncode}>{item.hsnCode || ""}</Text>
          <Text style={descriptionStyle.qty}>{item.quantity || ""}</Text>
          <Text style={descriptionStyle.unitPrice}>{item.unitPrice || ""}</Text>
          <Text style={descriptionStyle.total}>{item.total || ""}</Text>
        </View>
      ))}
    </>
  );
}

export default Description;
