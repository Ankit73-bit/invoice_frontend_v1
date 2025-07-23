import { Navigate, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import { Slide, ToastContainer } from "react-toastify";
import { ThemeProvider } from "./hooks/theme-provider";
import ProtectedRoute from "./features/authentication/ProtectedRoute";
import LayoutPage from "./pages/LayoutPage";
import Invoices from "./features/invoice/invoice/Invoices";
import ClientPage from "./features/invoice/client/ClientPage";
import ConsigneePage from "./features/invoice/consignee/ConsigneePage";
import CreateInvoiceRouter from "./features/invoice/invoice/CreateInvoiceRouter";

function App() {
  return (
    <>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <ToastContainer
          position="top-center"
          autoClose={2000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick={false}
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          transition={Slide}
        />
        <Routes>
          <Route index path="/" element={<LoginPage />} />
          <Route element={<LayoutPage />}>
            <Route
              element={
                <ProtectedRoute>
                  <Navigate replace to="dashboard" />
                </ProtectedRoute>
              }
            />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="invoice/new" element={<CreateInvoiceRouter />} />
            <Route path="invoices" element={<Invoices />} />
            <Route
              path="clients"
              element={
                <ProtectedRoute>
                  <ClientPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="consignees"
              element={
                <ProtectedRoute>
                  <ConsigneePage />
                </ProtectedRoute>
              }
            />
          </Route>
        </Routes>
      </ThemeProvider>
    </>
  );
}

export default App;
