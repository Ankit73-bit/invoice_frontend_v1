import type React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import CompanyDetails from "./CompanyDetails";
import InvoiceDetails from "./InvoiceDetails";
import ConsigneeDetails from "./ConsgineeDetails";
import ClientDetails from "./ClientDetails";
import TermsOfDelivery from "./TermsOfDelivery";
import DescriptionHead from "./DescriptionHead";
import Description from "./Description";
import Note from "./Note";
import AmountDetails from "./AmountDetails";
import Declaration from "./Declaration";

// Register fonts if needed
// Font.register({
//   family: 'Roboto',
//   src: 'https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu4mxK.woff2'
// });

const styles = StyleSheet.create({
  page: { padding: 20, fontSize: 10 },
  header: {
    textAlign: "center",
    padding: 5,
    letterSpacing: 1,
    backgroundColor: "#E9EAEC",
    borderTop: "1px solid black",
    borderLeft: "1px solid black",
    borderRight: "1px solid black",
  },
  section1: {
    border: "1px solid black",
    display: "flex",
    flexDirection: "row",
  },
  section2: {
    borderBottom: "1px solid black",
    borderLeft: "1px solid black",
    borderRight: "1px solid black",
  },
  sectionClientAddress: {
    display: "flex",
    flexDirection: "row",
  },
  section3: {
    borderBottom: "1px solid black",
    borderLeft: "1px solid black",
    borderRight: "1px solid black",
  },
  section4: {
    borderBottom: "1px solid black",
    borderLeft: "1px solid black",
    borderRight: "1px solid black",
  },
  text: { fontSize: 12 },
});

interface InvoicePDFProps {
  invoice: any;
  company: any;
  client: any;
  consignee?: any;
}

export const InvoicePDFPS: React.FC<InvoicePDFProps> = ({
  invoice,
  company,
  client,
  consignee,
}) => {
  return (
    <Document>
      <Page style={styles.page} wrap={true}>
        <View style={styles.header}>
          <Text>Tax Invoice (Original)</Text>
        </View>
        <View style={styles.section1}>
          <CompanyDetails company={company} />
          <InvoiceDetails invoice={invoice} />
        </View>
        <View style={styles.sectionClientAddress}>
          <ConsigneeDetails consignee={consignee} invoice={invoice} />
          <ClientDetails client={client} />
        </View>
        {invoice?.detailsSchema?.termsOfDelivery?.length > 0 && (
          <View style={styles.section3}>
            <TermsOfDelivery terms={invoice.detailsSchema.termsOfDelivery} />
          </View>
        )}
        <View style={styles.section2}>
          <DescriptionHead />
          <Description items={invoice.items} />
          <Note note={invoice.note} />
        </View>
        <View style={styles.section3}>
          <AmountDetails invoice={invoice} company={company} />
        </View>
        <View style={styles.section4}>
          <Declaration declarationInput={invoice.declaration} />
          {/* Signature is inside the Declaration component */}
        </View>
      </Page>
    </Document>
  );
};
