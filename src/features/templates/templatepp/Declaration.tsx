import { StyleSheet, Text, View } from "@react-pdf/renderer";
import Signature from "./Signature";

const declarationStyle = StyleSheet.create({
  container: {
    display: "flex",
    justifyContent: "flex-start",
    flexDirection: "row",
    flexWrap: "wrap",
  },
  declaration: {
    width: "55%",
    borderRight: "1px solid black",
  },
  innerText: {
    paddingTop: 4,
    paddingRight: 4,
    paddingLeft: 4,
    paddingBottom: 40,
    textAlign: "justify",
  },
});

interface declarationProps {
  declarationInput: any;
}

function Declaration({ declarationInput }: declarationProps) {
  return (
    <View style={declarationStyle.container}>
      <View style={declarationStyle.declaration}>
        <Text style={declarationStyle.innerText}>
          Declaration: {declarationInput}
        </Text>
      </View>
      <Signature />
    </View>
  );
}

export default Declaration;
