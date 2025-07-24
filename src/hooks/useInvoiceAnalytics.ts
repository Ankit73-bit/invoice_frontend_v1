import { useState, useEffect } from "react";
import { api } from "@/lib/api";

interface InvoiceSummary {
  totalInvoices: number;
  totalRevenue: number;
  paid: number;
  pending: number;
  overdue: number;
}

interface MonthlyStats {
  month: string;
  count: number;
  revenue: number;
}

interface TopClient {
  client: {
    _id: string;
    clientCompanyName: string;
  };
  invoiceCount: number;
  totalRevenue: number;
}

export function useInvoiceAnalytics(companyId?: string) {
  const [summary, setSummary] = useState<InvoiceSummary | null>(null);
  const [monthlyStats, setMonthlyStats] = useState<MonthlyStats[]>([]);
  const [topClients, setTopClients] = useState<TopClient[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      setError(null);

      try {
        const params = companyId ? { companyId } : {};

        const [summaryRes, monthlyRes, clientsRes] = await Promise.all([
          api.get("/analytics/invoice-summary", { params }),
          api.get("/analytics/monthly-invoice-stats", { params }),
          api.get("/analytics/top-clients", { params }),
        ]);

        setSummary(summaryRes.data.data);
        setMonthlyStats(monthlyRes.data.data);
        setTopClients(clientsRes.data.data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch analytics"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [companyId]);

  return { summary, monthlyStats, topClients, loading, error };
}
