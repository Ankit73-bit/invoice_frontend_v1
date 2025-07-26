import { api } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import { useCompanyContext } from "@/store/companyContextStore";
import { useState } from "react";

// API integration example - replace with your actual API endpoints

export const useInvoiceAPI = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const user = useAuthStore((state) => state.user);
  const { selectedCompanyId } = useCompanyContext();

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
    dateFrom?: string;
    dateTo?: string;
    amountMin?: number;
    amountMax?: number;
  }) => {
    try {
      const endpoint = user?.role === "admin" ? "/invoices/admin" : "/invoices";

      const { data } = await api.get(endpoint, {
        params: {
          ...params,
          ...(user?.role === "admin" &&
            selectedCompanyId && { company: selectedCompanyId }),
        },
      });

      console.log("API response:", data); // Debug log
      return data.data;
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
      console.log("📦 Updating invoice...", { id, invoiceData });
      return data.data.invoice;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update invoice");
      console.log(err);
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

// Example API route handler (Next.js App Router)
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = Number.parseInt(searchParams.get("page") || "1");
  const limit = Number.parseInt(searchParams.get("limit") || "10");
  const search = searchParams.get("search");
  const status = searchParams.get("status");
  const client = searchParams.get("client");
  const dateFrom = searchParams.get("dateFrom");
  const dateTo = searchParams.get("dateTo");
  const amountMin = searchParams.get("amountMin");
  const amountMax = searchParams.get("amountMax");

  try {
    // Build your database query based on the parameters
    const query: any = {};

    if (search) {
      query.$or = [
        { invoiceNo: { $regex: search, $options: "i" } },
        { "client.clientCompanyName": { $regex: search, $options: "i" } },
      ];
    }

    if (status) query.status = status;
    if (client) query.client = client;

    if (dateFrom || dateTo) {
      query.date = {};
      if (dateFrom) query.date.$gte = new Date(dateFrom);
      if (dateTo) query.date.$lte = new Date(dateTo);
    }

    if (amountMin || amountMax) {
      query.grossAmount = {};
      if (amountMin) query.grossAmount.$gte = Number.parseFloat(amountMin);
      if (amountMax) query.grossAmount.$lte = Number.parseFloat(amountMax);
    }

    // Execute your database query here
    // const invoices = await Invoice.find(query)
    //   .populate('client')
    //   .populate('consignee')
    //   .skip((page - 1) * limit)
    //   .limit(limit)
    //   .sort({ createdAt: -1 })

    // const total = await Invoice.countDocuments(query)

    return Response.json({
      status: "success",
      data: {
        invoices: [], // Your actual invoice data
        pagination: {
          page,
          limit,
          total: 0, // Your actual total count
          pages: 0, // Math.ceil(total / limit)
        },
      },
    });
  } catch (error) {
    return Response.json(
      { status: "error", message: "Failed to fetch invoices" },
      { status: 500 }
    );
  }
}
