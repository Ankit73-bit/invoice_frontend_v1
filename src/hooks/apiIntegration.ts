import { api } from "@/lib/api";
import { useState } from "react";

// Fixed version of your invoice API hook
export const useInvoiceAPI = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const start = () => {
    setLoading(true);
    setError(null);
  };
  const finish = () => setLoading(false);

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
      console.log("🔍 Fetching invoices with params:", params);

      // Clean up params - remove undefined/empty values
      const cleanParams = Object.entries(params || {}).reduce(
        (acc, [key, value]) => {
          if (
            value !== undefined &&
            value !== null &&
            value !== "" &&
            value !== "All Status" &&
            value !== "All Clients" &&
            value !== "All Companies"
          ) {
            acc[key] = value;
          }
          return acc;
        },
        {} as Record<string, any>
      );

      console.log("🧹 Cleaned params:", cleanParams);

      const { data } = await api.get("/invoices", { params: cleanParams });

      console.log("📥 API Response:", data);

      // Normalize response structure
      const result = {
        invoices: data.data?.invoices || data.data || [],
        total: data.results || data.data?.invoices?.length || 0,
        pagination: data.pagination,
      };

      console.log("✅ Normalized result:", result);

      return { data: result };
    } catch (err) {
      console.error("❌ Fetch error:", err);
      setError(err instanceof Error ? err.message : "An error occurred");
      throw err;
    } finally {
      finish();
    }
  };

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

  const updateInvoiceStatus = async (invoiceId: string, status: string) => {
    start();
    try {
      const { data } = await api.patch(`/invoices/${invoiceId}`, {
        status,
      });
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      throw err;
    } finally {
      finish();
    }
  };

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

  const downloadInvoicePDF = async (element: unknown, invoiceId: string) => {
    try {
      // Mock PDF download
      console.log(`📄 Downloading PDF for invoice: ${invoiceId}`);
      const blob = new Blob(["Mock PDF content"], { type: "application/pdf" });
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

  const getNextInvoiceNumber = async (companyId?: string) => {
    try {
      const { data } = await api.get("/invoices/next-invoice-number", {
        params: companyId ? { companyId } : {},
      });
      return data.invoiceNumber || "INV/2024/001";
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
