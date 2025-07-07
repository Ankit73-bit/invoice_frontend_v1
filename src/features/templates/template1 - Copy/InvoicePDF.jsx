import { Page, Document, StyleSheet, View, Text } from "@react-pdf/renderer";
import InvoiceDetails from "./InvoiceDetails";
import DescriptionHead from "./DescriptionHead";
import Description from "./Description";
import Note from "./Note";
import Declaration from "./Declaration";
import AmountDetails from "./AmountDetails";
import HrDescription from "./HrDescription";
import ConsigneeDetails from "./ConsgineeDetails";
import ClientDetails from "./ClientDetails";
import TermsOfDelivery from "./TermsOfDelivery";
import CompanyDetails from "./CompanyDetails";

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

const InvoicePDF = ({
  referenceDate,
  referenceNo,
  invoiceDate,
  invoiceNo,
  purchaseNo,
  purchaseDate,
  selectedCompany,
  selectedClient,
  selectedConsignee,
  selectedBank,
  descriptionFields,
  items,
  gstDetails,
  roundingOff,
  grossAmount,
  amountInWords,
  hrDescription,
  totalBeforeGST,
  note,
  declarationInput,
  dispatchDetails,
  terms,
}) => {
  const isPiramal = selectedClient.clientCompanyName.startsWith("PIRAMAL");

  return (
    <Document>
      <Page style={styles.page} wrap={true}>
        <View style={styles.header}>
          <Text>Tax Invoice (Original)</Text>
        </View>
        <View style={styles.section1}>
          <CompanyDetails company={selectedCompany} />
          <InvoiceDetails
            invoiceNo={invoiceNo}
            invoiceDate={invoiceDate}
            referenceNo={referenceNo}
            referenceDate={referenceDate}
            purchaseNo={purchaseNo}
            purchaseDate={purchaseDate}
            dispatchDetails={dispatchDetails}
          />
        </View>
        <View style={styles.sectionClientAddress}>
          <ConsigneeDetails consignee={selectedConsignee} />
          <ClientDetails client={selectedClient} />
        </View>
        {terms?.length > 0 && (
          <View style={styles.section3}>
            <TermsOfDelivery terms={terms} />
          </View>
        )}
        <View style={styles.section2}>
          <DescriptionHead descriptionFields={descriptionFields} />

          {isPiramal && <HrDescription hrDescription={hrDescription} />}
          <Description items={items} />
          {selectedCompany.clientCompanyName === "Paras Solutions" && (
            <Note note={note} />
          )}
        </View>
        <View style={styles.section3}>
          <AmountDetails
            gstDetails={gstDetails}
            roundingOff={roundingOff}
            grossAmount={grossAmount}
            amountInWords={amountInWords}
            bankDetails={selectedBank}
            totalBeforeGST={totalBeforeGST}
            selectedClient={selectedClient}
            items={items}
          />
        </View>
        <View style={styles.section4}>
          <Declaration declarationInput={declarationInput} />
          {/* Signature is inside the Declaration component */}
        </View>
      </Page>
    </Document>
  );
};

export default InvoicePDF;
