import { useState, useEffect } from "react";

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

// Fixed version of your analytics hook
export function useInvoiceAnalytics(companyId?: string) {
  const [summary, setSummary] = useState<InvoiceSummary | null>(null);
  const [monthlyStats, setMonthlyStats] = useState<MonthlyStats[]>([]);
  const [topClients, setTopClients] = useState<TopClient[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Mock API function
  const mockApi = {
    get: async (url: string, config?: any) => {
      console.log(`📊 Analytics API Call: ${url}`, config?.params);
      await new Promise((resolve) => setTimeout(resolve, 300));

      if (url.includes("/analytics/summary")) {
        return {
          data: {
            status: "success",
            data: {
              totalInvoices: 150,
              totalRevenue: 450000,
              paid: 120,
              pending: 25,
              overdue: 5,
            },
          },
        };
      }

      if (url.includes("/analytics/monthly")) {
        return {
          data: {
            status: "success",
            data: [
              { month: "Jan", count: 12, revenue: 45000 },
              { month: "Feb", count: 15, revenue: 52000 },
              { month: "Mar", count: 18, revenue: 61000 },
              { month: "Apr", count: 14, revenue: 48000 },
              { month: "May", count: 20, revenue: 67000 },
              { month: "Jun", count: 16, revenue: 54000 },
            ],
          },
        };
      }

      if (url.includes("/analytics/top-clients")) {
        return {
          data: {
            status: "success",
            data: [
              {
                client: { _id: "client_1", clientCompanyName: "ABC Corp" },
                invoiceCount: 25,
                totalRevenue: 125000,
              },
              {
                client: { _id: "client_2", clientCompanyName: "XYZ Ltd" },
                invoiceCount: 18,
                totalRevenue: 89000,
              },
            ],
          },
        };
      }

      return { data: { status: "success", data: [] } };
    },
  };

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      setError(null);

      try {
        const params = companyId ? { companyId } : {};
        console.log("📊 Fetching analytics with params:", params);

        // 🔥 FIXED: Correct number of variables for Promise.all
        const [summaryRes, monthlyRes, clientsRes] = await Promise.all([
          mockApi.get("/analytics/summary", { params }),
          mockApi.get("/analytics/monthly", { params }),
          mockApi.get("/analytics/top-clients", { params }),
        ]);

        console.log("📊 Analytics responses:", {
          summaryRes,
          monthlyRes,
          clientsRes,
        });

        setSummary(summaryRes.data.data);
        setMonthlyStats(monthlyRes.data.data);
        setTopClients(clientsRes.data.data);
      } catch (err) {
        console.error("❌ Analytics error:", err);
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
