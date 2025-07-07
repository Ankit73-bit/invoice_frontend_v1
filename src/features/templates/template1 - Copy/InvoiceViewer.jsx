import { PDFViewer } from "@react-pdf/renderer";
import InvoicePDF from "./InvoicePDF";
import Button from "../ui/Button";
import * as React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import { InvoiceContextProvider } from "../features/createInvoice/useInvoiceContext";

function InvoiceViewer({
  invoiceDate,
  invoiceNo,
  referenceNo,
  referenceDate,
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
}) {
  const [state, setState] = React.useState({
    right: false,
  });

  const toggleDrawer = (open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setState({ ...state, right: open });
  };

  class ErrorBoundary extends React.Component {
    constructor(props) {
      super(props);
      this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
      return { hasError: true, error };
    }

    render() {
      if (this.state.hasError) {
        return <div>Error rendering PDF: {this.state.error.message}</div>;
      }
      return this.props.children;
    }
  }

  const list = () => (
    <Box
      sx={{ width: 1000 }} // Set the width of the drawer
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <ErrorBoundary>
        <PDFViewer style={{ width: "100%", height: "100vh" }}>
          <InvoiceContextProvider>
            <InvoicePDF
              referenceNo={referenceNo}
              referenceDate={referenceDate}
              purchaseNo={purchaseNo}
              purchaseDate={purchaseDate}
              invoiceDate={invoiceDate}
              dispatchDetails={dispatchDetails}
              invoiceNo={invoiceNo}
              selectedCompany={selectedCompany}
              selectedClient={selectedClient}
              selectedConsignee={selectedConsignee}
              selectedBank={selectedBank}
              descriptionFields={descriptionFields}
              items={items}
              gstDetails={gstDetails}
              roundingOff={roundingOff}
              grossAmount={grossAmount}
              amountInWords={amountInWords}
              hrDescription={hrDescription}
              totalBeforeGST={totalBeforeGST}
              note={note}
              declarationInput={declarationInput}
              terms={terms}
            />
          </InvoiceContextProvider>
        </PDFViewer>
      </ErrorBoundary>
    </Box>
  );

  return (
    <>
      <Button type="button" onClick={toggleDrawer(true)}>
        View Invoice
      </Button>
      <Drawer
        anchor="right" // Set the drawer anchor to the right
        open={state.right}
        onClose={toggleDrawer(false)}
      >
        {list()}
      </Drawer>
    </>
  );
}

export default InvoiceViewer;
