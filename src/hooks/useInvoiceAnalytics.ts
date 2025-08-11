import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import type { InvoiceSummary, MonthlyStats, TopClient } from "@/lib/types";

export function useInvoiceAnalytics(companyId?: string) {
  const [summary, setSummary] = useState<InvoiceSummary | null>(null);
  const [monthlyStats, setMonthlyStats] = useState<MonthlyStats[]>([]);
  const [topClients, setTopClients] = useState<TopClient[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = companyId ? { companyId } : {};
      const summaryRes = await api.get("/analytics/summary", { params });
      setSummary(summaryRes.data.data);
      const monthlyRes = await api.get("/analytics/monthly", { params });
      setMonthlyStats(monthlyRes.data.data);
      const clientsRes = await api.get("/analytics/top-clients", { params });
      setTopClients(clientsRes.data.data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch analytics"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [companyId]);

  return {
    summary,
    monthlyStats,
    topClients,
    loading,
    error,
    refreshAnalytics: fetchAnalytics,
  };
}
