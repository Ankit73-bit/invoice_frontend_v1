import { Navigate, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import { Slide, ToastContainer } from "react-toastify";
import { ThemeProvider } from "./hooks/theme-provider";
import ProtectedRoute from "./features/authentication/ProtectedRoute";
import LayoutPage from "./pages/LayoutPage";
import Invoices from "./features/invoice/invoice/Invoices";
import ClientPage from "./features/invoice/client/ClientPage";
import ConsigneePage from "./features/invoice/consignee/ConsigneePage";
import CreateInvoiceRouter from "./features/invoice/invoice/CreateInvoiceRouter";
import { useSoftReloadableRoute } from "./hooks/useSoftReloadableRoute";

function App() {
  const refreshKey = useSoftReloadableRoute();
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
                  <Navigate replace to="invoices/dashboard" />
                </ProtectedRoute>
              }
            />
            <Route
              path="invoices/dashboard"
              element={
                <ProtectedRoute>
                  <Invoices key={refreshKey} />
                </ProtectedRoute>
              }
            />
            <Route
              path="invoice/new"
              element={
                <ProtectedRoute>
                  <CreateInvoiceRouter key={refreshKey} />
                </ProtectedRoute>
              }
            />
            <Route
              path="invoice/edit/:id"
              element={
                <ProtectedRoute>
                  <CreateInvoiceRouter key={refreshKey} />
                </ProtectedRoute>
              }
            />
            <Route
              path="clients"
              element={
                <ProtectedRoute>
                  <ClientPage key={refreshKey} />
                </ProtectedRoute>
              }
            />
            <Route
              path="consignees"
              element={
                <ProtectedRoute>
                  <ConsigneePage key={refreshKey} />
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
