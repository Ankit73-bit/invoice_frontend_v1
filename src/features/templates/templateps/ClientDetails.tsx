import { StyleSheet, Text, View } from "@react-pdf/renderer";

const clientStyles = StyleSheet.create({
  container: {
    fontSize: 10,
    padding: 4,
    width: "100%",
    borderBottom: "1px solid black",
    borderRight: "1px solid black",
  },
  clientName: {
    fontWeight: "semibold",
    fontSize: 10,
  },
});

interface clientProps {
  client: any;
}

function ClientDetails({ client }: clientProps) {
  return (
    <View style={clientStyles.container}>
      <Text>Client:</Text>
      <Text style={clientStyles.clientName}>{client?.clientCompanyName}</Text>
      {client?.address?.add1 && <Text>{client.address.add1}</Text>}
      {client?.address?.add2 && <Text>{client.address.add2}</Text>}
      {client?.address?.add3 && <Text>{client.address.add3}</Text>}
      {client?.address?.pinCode && (
        <Text>Pincode: {client.address.pinCode}</Text>
      )}
      {client?.address?.panNo && <Text>PAN: {client.address.panNo}</Text>}
      {client?.address?.gstNo && <Text>GST: {client.address.gstNo}</Text>}
    </View>
  );
}

export default ClientDetails;
