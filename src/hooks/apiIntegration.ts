import { api } from "@/lib/api";
import { useState } from "react";

// API integration hook that matches your existing structure
export const useInvoiceAPI = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* ---------- Helpers ---------- */
  const start = () => {
    setLoading(true);
    setError(null);
  };
  const finish = () => setLoading(false);

  /* ---------- Fetch list ---------- */
  const fetchInvoices = async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    client?: string;
    company?: string;
    dateFrom?: string;
    dateTo?: string;
    amountMin?: number;
    amountMax?: number;
  }) => {
    start();
    try {
      // Use admin endpoint if user is admin, otherwise regular endpoint
      const endpoint = "/invoices";

      const { data } = await api.get(endpoint, {
        params: {
          ...params,
        },
      });

      console.log("API response:", data); // Debug log
      return data.data || data;
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      throw err;
    } finally {
      finish();
    }
  };

  /* ---------- Create ---------- */
  const createInvoice = async (invoiceData: any) => {
    start();
    try {
      const { data } = await api.post("/invoices", invoiceData);
      return data.data.invoice;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create invoice");
      throw err;
    } finally {
      finish();
    }
  };

  /* ---------- Get Single ---------- */
  const getInvoice = async (id: string) => {
    start();
    try {
      const { data } = await api.get(`/invoices/${id}`);
      return data.data;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch invoice");
      throw err;
    } finally {
      finish();
    }
  };

  /* ---------- Update ---------- */
  const updateInvoice = async (id: string, invoiceData: any) => {
    start();
    try {
      const { data } = await api.patch(`/invoices/${id}`, invoiceData);
      return data.data.invoice;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update invoice");
      throw err;
    } finally {
      finish();
    }
  };

  /* ---------- Update Status ---------- */
  const updateInvoiceStatus = async (invoiceId: string, status: string) => {
    start();
    try {
      const { data } = await api.patch(`/invoices/${invoiceId}`, { status });
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      throw err;
    } finally {
      finish();
    }
  };

  /* ---------- Delete ---------- */
  const deleteInvoice = async (invoiceId: string) => {
    start();
    try {
      await api.delete(`/invoices/${invoiceId}`);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      throw err;
    } finally {
      finish();
    }
  };

  /* ---------- Download PDF ---------- */
  const downloadInvoicePDF = async (invoiceId: string) => {
    try {
      const { data: blob } = await api.get(`/invoices/${invoiceId}/pdf`, {
        responseType: "blob",
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `invoice-${invoiceId}.pdf`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      throw err;
    }
  };

  /* ---------- Get Next Invoice Number ---------- */
  const getNextInvoiceNumber = async (companyId?: string) => {
    try {
      const { data } = await api.get("/invoices/next-invoice-number", {
        params: companyId ? { companyId } : {},
      });
      return data.invoiceNumber;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to get next invoice number"
      );
      throw err;
    }
  };

  return {
    loading,
    error,
    fetchInvoices,
    createInvoice,
    getInvoice,
    updateInvoice,
    updateInvoiceStatus,
    deleteInvoice,
    downloadInvoicePDF,
    getNextInvoiceNumber,
  };
};
