import { useState, useMemo, useCallback, useEffect } from "react";
import { format } from "date-fns";
import {
  Search,
  Download,
  Eye,
  Edit,
  Trash2,
  Copy,
  Send,
  MoreHorizontal,
  Plus,
  FileDown,
  Calendar,
  DollarSign,
  Clock,
  CheckCircle,
  AlertCircle,
  Filter,
  X,
  Loader2,
  Building2,
  FileText,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { useInvoiceAnalytics } from "@/hooks/useInvoiceAnalytics";
import { toast } from "react-toastify";
import { useAuthStore } from "@/store/authStore";
import { useCompanyContext } from "@/store/companyContextStore";

// Types based on your backend data structure
interface Invoice {
  _id: string;
  invoiceNo: string;
  date: string;
  financialYear: string;
  client: {
    _id: string;
    clientCompanyName: string;
  };
  consignee?: {
    _id: string;
    clientCompanyName: string;
  };
  company: {
    _id: string;
    companyName: string;
  };
  grossAmount: number;
  totalBeforeGST: number;
  status: "Pending" | "Paid" | "Overdue";
  createdAt: string;
  dueDate?: string;
  items: Array<{
    description: string;
    quantity: number;
    unitPrice: number | string;
    total: number;
  }>;
  gstDetails?: {
    cgst?: number;
    sgst?: number;
    igst?: number;
    totalGST: number;
  };
  inWords: string;
}

interface InvoiceFilters {
  status?: string;
  client?: string;
  company?: string;
  dateRange?: {
    from?: Date;
    to?: Date;
  };
  amountRange?: {
    min?: number;
    max?: number;
  };
  dueStatus?: string;
}

// Mock API hook - replace with your actual implementation
const useInvoiceAPI = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchInvoices = async (params: any) => {
    setLoading(true);
    setError(null);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock data that matches your backend structure
      const mockInvoices: Invoice[] = [
        {
          _id: "1",
          invoiceNo: "INV/2024-25/001",
          date: "2024-01-15",
          financialYear: "2024-25",
          client: {
            _id: "c1",
            clientCompanyName: "ABC Corporation Ltd.",
          },
          consignee: {
            _id: "c2",
            clientCompanyName: "ABC Corp Warehouse",
          },
          company: {
            _id: "comp1",
            companyName: "Your Company Ltd.",
          },
          grossAmount: 25000,
          totalBeforeGST: 21186.44,
          status: "Paid",
          createdAt: "2024-01-15T10:30:00Z",
          dueDate: "2024-02-15",
          items: [
            {
              description: "Web Development Services",
              quantity: 1,
              unitPrice: 20000,
              total: 20000,
            },
            {
              description: "Hosting Setup",
              quantity: 1,
              unitPrice: 1186.44,
              total: 1186.44,
            },
          ],
          gstDetails: {
            cgst: 1909.32,
            sgst: 1909.32,
            totalGST: 3818.64,
          },
          inWords: "Twenty Five Thousand Only",
        },
        {
          _id: "2",
          invoiceNo: "INV/2024-25/002",
          date: "2024-01-20",
          financialYear: "2024-25",
          client: {
            _id: "c2",
            clientCompanyName: "XYZ Industries Pvt. Ltd.",
          },
          company: {
            _id: "comp1",
            companyName: "Your Company Ltd.",
          },
          grossAmount: 15000,
          totalBeforeGST: 12711.86,
          status: "Pending",
          createdAt: "2024-01-20T14:15:00Z",
          dueDate: "2024-02-20",
          items: [
            {
              description: "Mobile App Development",
              quantity: 1,
              unitPrice: 12711.86,
              total: 12711.86,
            },
          ],
          gstDetails: {
            cgst: 1144.07,
            sgst: 1144.07,
            totalGST: 2288.14,
          },
          inWords: "Fifteen Thousand Only",
        },
        {
          _id: "3",
          invoiceNo: "INV/2024-25/003",
          date: "2024-01-10",
          financialYear: "2024-25",
          client: {
            _id: "c3",
            clientCompanyName: "Tech Solutions Inc.",
          },
          company: {
            _id: "comp1",
            companyName: "Your Company Ltd.",
          },
          grossAmount: 35000,
          totalBeforeGST: 29661.02,
          status: "Overdue",
          createdAt: "2024-01-10T09:00:00Z",
          dueDate: "2024-01-25",
          items: [
            {
              description: "E-commerce Platform Development",
              quantity: 1,
              unitPrice: 29661.02,
              total: 29661.02,
            },
          ],
          gstDetails: {
            cgst: 2669.49,
            sgst: 2669.49,
            totalGST: 5338.98,
          },
          inWords: "Thirty Five Thousand Only",
        },
      ];

      return {
        data: {
          invoices: mockInvoices,
          pagination: {
            page: 1,
            limit: 10,
            total: mockInvoices.length,
            pages: 1,
          },
        },
      };
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteInvoice = async (id: string) => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateInvoiceStatus = async (id: string, status: string) => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return { success: true };
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const downloadInvoicePDF = async (id: string) => {
    try {
      // Simulate PDF download
      const link = document.createElement("a");
      link.href = `/placeholder.svg?height=800&width=600&text=Invoice PDF`;
      link.download = `invoice-${id}.pdf`;
      link.click();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to download");
      throw err;
    }
  };

  return {
    loading,
    error,
    fetchInvoices,
    deleteInvoice,
    updateInvoiceStatus,
    downloadInvoicePDF,
  };
};

// Mock clients data
const mockClients = [
  { _id: "c1", clientCompanyName: "ABC Corporation Ltd." },
  { _id: "c2", clientCompanyName: "XYZ Industries Pvt. Ltd." },
  { _id: "c3", clientCompanyName: "Tech Solutions Inc." },
  { _id: "c4", clientCompanyName: "Digital Marketing Pro" },
  { _id: "c5", clientCompanyName: "Global Enterprises" },
];

const mockCompanies = [
  { _id: "comp1", companyName: "Your Company Ltd." },
  { _id: "comp2", companyName: "Sister Company Pvt. Ltd." },
];

export default function Invoices() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<InvoiceFilters>({
    status: "All Status",
    client: "All Clients",
    company: "All Companies",
    dueStatus: "All Due Status",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedInvoices, setSelectedInvoices] = useState<string[]>([]);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string | null>(
    null
  );
  const [filtersOpen, setFiltersOpen] = useState(false);

  const { user } = useAuthStore((state) => state.user);
  const { selectedCompanyId } = useCompanyContext();

  const {
    fetchInvoices,
    deleteInvoice,
    updateInvoiceStatus,
    downloadInvoicePDF,
    loading,
    error,
  } = useInvoiceAPI();

  // Use analytics hook for dashboard stats
  const { summary, loading: analyticsLoading } = useInvoiceAnalytics(
    user.role === "admin" ? selectedCompanyId : undefined
  );

  useEffect(() => {
    const getInvoices = async () => {
      try {
        const data = await fetchInvoices({
          page: currentPage,
          limit: pageSize,
          search: searchQuery,
          status: filters.status !== "All Status" ? filters.status : undefined,
          client: filters.client !== "All Clients" ? filters.client : undefined,
          company:
            filters.company !== "All Companies" ? filters.company : undefined,
          dateFrom: filters.dateRange?.from?.toISOString(),
          dateTo: filters.dateRange?.to?.toISOString(),
          amountMin: filters.amountRange?.min,
          amountMax: filters.amountRange?.max,
          companyId: user.role === "admin" ? selectedCompanyId : undefined,
        });

        setInvoices(data?.data?.invoices || []);
      } catch (err) {
        console.error("Fetch error", err);
        toast.error("Failed to fetch invoices");
      }
    };

    getInvoices();
  }, [
    filters,
    searchQuery,
    currentPage,
    pageSize,
    selectedCompanyId,
    user.role,
  ]);

  // Filter and search logic
  const filteredInvoices = useMemo(() => {
    let result = invoices;

    // Apply search
    if (searchQuery) {
      result = result.filter(
        (invoice) =>
          invoice.invoiceNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
          invoice.client.clientCompanyName
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          (user.role === "admin" &&
            invoice.company.companyName
              .toLowerCase()
              .includes(searchQuery.toLowerCase()))
      );
    }

    // Apply filters
    if (filters.status && filters.status !== "All Status") {
      result = result.filter((invoice) => invoice.status === filters.status);
    }

    if (filters.client && filters.client !== "All Clients") {
      result = result.filter(
        (invoice) => invoice.client._id === filters.client
      );
    }

    if (
      user.role === "admin" &&
      filters.company &&
      filters.company !== "All Companies"
    ) {
      result = result.filter(
        (invoice) => invoice.company._id === filters.company
      );
    }

    if (filters.dateRange?.from) {
      result = result.filter(
        (invoice) => new Date(invoice.date) >= filters.dateRange!.from!
      );
    }

    if (filters.dateRange?.to) {
      result = result.filter(
        (invoice) => new Date(invoice.date) <= filters.dateRange!.to!
      );
    }

    if (filters.amountRange?.min) {
      result = result.filter(
        (invoice) => invoice.grossAmount >= filters.amountRange!.min!
      );
    }

    if (filters.amountRange?.max) {
      result = result.filter(
        (invoice) => invoice.grossAmount <= filters.amountRange!.max!
      );
    }

    if (filters.dueStatus && filters.dueStatus !== "All Due Status") {
      const today = new Date();
      const thisWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
      const thisMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

      switch (filters.dueStatus) {
        case "due-today":
          result = result.filter(
            (invoice) =>
              invoice.dueDate &&
              new Date(invoice.dueDate).toDateString() === today.toDateString()
          );
          break;
        case "overdue":
          result = result.filter(
            (invoice) =>
              invoice.dueDate &&
              new Date(invoice.dueDate) < today &&
              invoice.status !== "Paid"
          );
          break;
        case "due-this-week":
          result = result.filter(
            (invoice) =>
              invoice.dueDate &&
              new Date(invoice.dueDate) <= thisWeek &&
              new Date(invoice.dueDate) >= today
          );
          break;
        case "due-this-month":
          result = result.filter(
            (invoice) =>
              invoice.dueDate &&
              new Date(invoice.dueDate) <= thisMonth &&
              new Date(invoice.dueDate) >= today
          );
          break;
      }
    }

    return result;
  }, [invoices, searchQuery, filters, user.role]);

  // Pagination
  const totalPages = Math.ceil(filteredInvoices.length / pageSize);
  const paginatedInvoices = filteredInvoices.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Statistics - use analytics data if available, otherwise calculate from local data
  const stats = useMemo(() => {
    if (summary) {
      return {
        total: { amount: summary.totalRevenue, count: summary.totalInvoices },
        paid: { amount: 0, count: summary.paid }, // Backend doesn't provide amount breakdown
        pending: { amount: 0, count: summary.pending },
        overdue: { amount: 0, count: summary.overdue },
      };
    }

    // Fallback to local calculation
    const total = invoices.reduce((sum, inv) => sum + inv.grossAmount, 0);
    const paid = invoices
      .filter((inv) => inv.status === "Paid")
      .reduce((sum, inv) => sum + inv.grossAmount, 0);
    const pending = invoices
      .filter((inv) => inv.status === "Pending")
      .reduce((sum, inv) => sum + inv.grossAmount, 0);
    const overdue = invoices
      .filter((inv) => inv.status === "Overdue")
      .reduce((sum, inv) => sum + inv.grossAmount, 0);

    return {
      total: { amount: total, count: invoices.length },
      paid: {
        amount: paid,
        count: invoices.filter((inv) => inv.status === "Paid").length,
      },
      pending: {
        amount: pending,
        count: invoices.filter((inv) => inv.status === "Pending").length,
      },
      overdue: {
        amount: overdue,
        count: invoices.filter((inv) => inv.status === "Overdue").length,
      },
    };
  }, [invoices, summary]);

  // Event handlers
  const handleView = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setViewModalOpen(true);
  };

  const handleEdit = (invoice: Invoice) => {
    console.log("Edit invoice:", invoice);
    toast.info("Edit functionality to be implemented");
  };

  const handleDeleteClick = (invoiceId: string) => {
    setSelectedInvoiceId(invoiceId);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedInvoiceId) return;
    try {
      await deleteInvoice(selectedInvoiceId);
      toast.success("Invoice deleted successfully");
      setDeleteDialogOpen(false);
      setSelectedInvoiceId(null);
      // Refresh data
      const data = await fetchInvoices({
        page: currentPage,
        limit: pageSize,
        search: searchQuery,
        ...filters,
      });
      setInvoices(data?.data?.invoices || []);
    } catch (err) {
      toast.error("Failed to delete invoice");
    }
  };

  const handleCopy = (invoice: Invoice) => {
    console.log("Copy invoice:", invoice);
    toast.info("Copy functionality to be implemented");
  };

  const handleDownload = async (invoice: Invoice) => {
    try {
      await downloadInvoicePDF(invoice._id);
      toast.success("Invoice downloaded successfully");
    } catch (err) {
      toast.error("Failed to download invoice");
    }
  };

  const handleSend = (invoice: Invoice) => {
    console.log("Send invoice:", invoice);
    toast.info("Send functionality to be implemented");
  };

  const handleStatusUpdate = async (
    invoiceId: string,
    status: Invoice["status"]
  ) => {
    try {
      await updateInvoiceStatus(invoiceId, status);
      toast.success("Invoice status updated successfully");
      // Refresh data
      const data = await fetchInvoices({
        page: currentPage,
        limit: pageSize,
        search: searchQuery,
        ...filters,
      });
      setInvoices(data?.data?.invoices || []);
    } catch (err) {
      toast.error("Failed to update invoice status");
    }
  };

  const handleBulkAction = (action: string) => {
    console.log("Bulk action:", action, selectedInvoices);
    toast.info(`Bulk ${action} functionality to be implemented`);
  };

  const exportToCSV = useCallback(() => {
    const csvData = filteredInvoices.map((invoice) => ({
      "Invoice No": invoice.invoiceNo,
      Date: format(new Date(invoice.date), "dd/MM/yyyy"),
      Client: invoice.client.clientCompanyName,
      ...(user.role === "admin" && { Company: invoice.company.companyName }),
      "Amount Before GST": invoice.totalBeforeGST,
      "GST Amount": invoice.gstDetails?.totalGST || 0,
      "Gross Amount": invoice.grossAmount,
      Status: invoice.status,
      "Due Date": invoice.dueDate
        ? format(new Date(invoice.dueDate), "dd/MM/yyyy")
        : "",
    }));

    const csvContent = [
      Object.keys(csvData[0]).join(","),
      ...csvData.map((row) => Object.values(row).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `invoices-${format(new Date(), "yyyy-MM-dd")}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success("Invoice data exported successfully");
  }, [filteredInvoices, user.role]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);
  };

  const getStatusBadge = (status: Invoice["status"]) => {
    const variants = {
      Paid: "default",
      Pending: "secondary",
      Overdue: "destructive",
    } as const;

    const icons = {
      Paid: CheckCircle,
      Pending: Clock,
      Overdue: AlertCircle,
    };

    const Icon = icons[status];

    return (
      <Badge variant={variants[status]} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {status}
      </Badge>
    );
  };

  const toggleInvoiceSelection = (invoiceId: string) => {
    setSelectedInvoices((prev) =>
      prev.includes(invoiceId)
        ? prev.filter((id) => id !== invoiceId)
        : [...prev, invoiceId]
    );
  };

  const toggleAllInvoices = () => {
    setSelectedInvoices((prev) =>
      prev.length === paginatedInvoices.length
        ? []
        : paginatedInvoices.map((inv) => inv._id)
    );
  };

  const clearFilters = () => {
    setFilters({
      status: "All Status",
      client: "All Clients",
      company: "All Companies",
      dueStatus: "All Due Status",
    });
    setSearchQuery("");
    toast.info("Filters cleared");
  };

  const hasActiveFilters = useMemo(() => {
    return (
      searchQuery ||
      filters.status !== "All Status" ||
      filters.client !== "All Clients" ||
      (user.role === "admin" && filters.company !== "All Companies") ||
      filters.dueStatus !== "All Due Status" ||
      filters.dateRange?.from ||
      filters.dateRange?.to ||
      filters.amountRange?.min ||
      filters.amountRange?.max
    );
  }, [searchQuery, filters, user.role]);

  if (error) {
    return (
      <Alert className="m-6">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>Error loading invoices: {error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="relative overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {analyticsLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-8 w-24" />
                <Skeleton className="h-4 w-16" />
              </div>
            ) : (
              <>
                <div className="text-2xl font-bold">
                  {formatCurrency(stats.total.amount)}
                </div>
                <p className="text-xs text-muted-foreground">
                  {stats.total.count} invoices
                </p>
              </>
            )}
          </CardContent>
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-transparent" />
        </Card>

        <Card className="relative overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Paid</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            {analyticsLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-8 w-24" />
                <Skeleton className="h-4 w-16" />
              </div>
            ) : (
              <>
                <div className="text-2xl font-bold text-green-600">
                  {formatCurrency(stats.paid.amount)}
                </div>
                <p className="text-xs text-muted-foreground">
                  {stats.paid.count} invoices
                </p>
              </>
            )}
          </CardContent>
          <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-transparent" />
        </Card>

        <Card className="relative overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            {analyticsLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-8 w-24" />
                <Skeleton className="h-4 w-16" />
              </div>
            ) : (
              <>
                <div className="text-2xl font-bold text-yellow-600">
                  {formatCurrency(stats.pending.amount)}
                </div>
                <p className="text-xs text-muted-foreground">
                  {stats.pending.count} invoices
                </p>
              </>
            )}
          </CardContent>
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/10 to-transparent" />
        </Card>

        <Card className="relative overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            {analyticsLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-8 w-24" />
                <Skeleton className="h-4 w-16" />
              </div>
            ) : (
              <>
                <div className="text-2xl font-bold text-red-600">
                  {formatCurrency(stats.overdue.amount)}
                </div>
                <p className="text-xs text-muted-foreground">
                  {stats.overdue.count} invoices
                </p>
              </>
            )}
          </CardContent>
          <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-transparent" />
        </Card>
      </div>

      {/* Header and Actions */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Invoices</h1>
          <p className="text-muted-foreground">
            Manage your invoices and track payments
            {user.role === "admin" && " across all companies"}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={exportToCSV}
            variant="outline"
            className="gap-2 bg-transparent"
          >
            <FileDown className="h-4 w-4" />
            Export CSV
          </Button>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            New Invoice
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder={`Search by invoice number, client${
                      user.role === "admin" ? ", or company" : ""
                    }...`}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setFiltersOpen(!filtersOpen)}
                  className={`gap-2 ${
                    hasActiveFilters ? "border-primary" : ""
                  }`}
                >
                  <Filter className="h-4 w-4" />
                  Filters
                  {hasActiveFilters && (
                    <Badge
                      variant="secondary"
                      className="ml-1 h-5 w-5 rounded-full p-0 text-xs"
                    >
                      !
                    </Badge>
                  )}
                </Button>

                {hasActiveFilters && (
                  <Button
                    variant="ghost"
                    onClick={clearFilters}
                    className="gap-2"
                  >
                    <X className="h-4 w-4" />
                    Clear
                  </Button>
                )}
              </div>
            </div>

            {/* Expandable Filters */}
            {filtersOpen && (
              <div className="border-t pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {/* Status Filter */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Status</Label>
                    <Select
                      value={filters.status}
                      onValueChange={(value) =>
                        setFilters((prev) => ({ ...prev, status: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="All Status">All Status</SelectItem>
                        <SelectItem value="Paid">Paid</SelectItem>
                        <SelectItem value="Pending">Pending</SelectItem>
                        <SelectItem value="Overdue">Overdue</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Client Filter */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Client</Label>
                    <Select
                      value={filters.client}
                      onValueChange={(value) =>
                        setFilters((prev) => ({ ...prev, client: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="All Clients">All Clients</SelectItem>
                        {mockClients.map((client) => (
                          <SelectItem key={client._id} value={client._id}>
                            {client.clientCompanyName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Company Filter (Admin only) */}
                  {user.role === "admin" && (
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Company</Label>
                      <Select
                        value={filters.company}
                        onValueChange={(value) =>
                          setFilters((prev) => ({ ...prev, company: value }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="All Companies">
                            All Companies
                          </SelectItem>
                          {mockCompanies.map((company) => (
                            <SelectItem key={company._id} value={company._id}>
                              {company.companyName}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {/* Due Status Filter */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Due Status</Label>
                    <Select
                      value={filters.dueStatus}
                      onValueChange={(value) =>
                        setFilters((prev) => ({ ...prev, dueStatus: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="All Due Status">
                          All Due Status
                        </SelectItem>
                        <SelectItem value="due-today">Due Today</SelectItem>
                        <SelectItem value="overdue">Overdue</SelectItem>
                        <SelectItem value="due-this-week">
                          Due This Week
                        </SelectItem>
                        <SelectItem value="due-this-month">
                          Due This Month
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Date Range Filter */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Date Range</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal bg-transparent"
                        >
                          <Calendar className="mr-2 h-4 w-4" />
                          {filters.dateRange?.from ? (
                            filters.dateRange.to ? (
                              <>
                                {format(filters.dateRange.from, "LLL dd, y")} -{" "}
                                {format(filters.dateRange.to, "LLL dd, y")}
                              </>
                            ) : (
                              format(filters.dateRange.from, "LLL dd, y")
                            )
                          ) : (
                            <span>Pick a date range</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <div className="p-4 space-y-4">
                          <div className="space-y-2">
                            <Label>From Date</Label>
                            <CalendarComponent
                              mode="single"
                              selected={filters.dateRange?.from}
                              onSelect={(date) =>
                                setFilters((prev) => ({
                                  ...prev,
                                  dateRange: { ...prev.dateRange, from: date },
                                }))
                              }
                            />
                          </div>
                          <Separator />
                          <div className="space-y-2">
                            <Label>To Date</Label>
                            <CalendarComponent
                              mode="single"
                              selected={filters.dateRange?.to}
                              onSelect={(date) =>
                                setFilters((prev) => ({
                                  ...prev,
                                  dateRange: { ...prev.dateRange, to: date },
                                }))
                              }
                            />
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>

                  {/* Amount Range Filter */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Amount Range</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal bg-transparent"
                        >
                          <DollarSign className="mr-2 h-4 w-4" />
                          {filters.amountRange?.min || filters.amountRange?.max
                            ? `₹${filters.amountRange?.min || 0} - ₹${
                                filters.amountRange?.max || "∞"
                              }`
                            : "Set amount range"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-80" align="start">
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label>Minimum Amount (₹)</Label>
                            <Input
                              type="number"
                              placeholder="0"
                              value={filters.amountRange?.min || ""}
                              onChange={(e) =>
                                setFilters((prev) => ({
                                  ...prev,
                                  amountRange: {
                                    ...prev.amountRange,
                                    min: e.target.value
                                      ? Number(e.target.value)
                                      : undefined,
                                  },
                                }))
                              }
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Maximum Amount (₹)</Label>
                            <Input
                              type="number"
                              placeholder="100000"
                              value={filters.amountRange?.max || ""}
                              onChange={(e) =>
                                setFilters((prev) => ({
                                  ...prev,
                                  amountRange: {
                                    ...prev.amountRange,
                                    max: e.target.value
                                      ? Number(e.target.value)
                                      : undefined,
                                  },
                                }))
                              }
                            />
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              </div>
            )}

            {/* Results Summary */}
            <div className="flex items-center justify-between text-sm text-muted-foreground border-t pt-4">
              <div>
                Showing {paginatedInvoices.length} of {filteredInvoices.length}{" "}
                invoices
                {filteredInvoices.length !== invoices.length && (
                  <span> (filtered from {invoices.length} total)</span>
                )}
              </div>
              {loading && (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Loading...
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      {selectedInvoices.length > 0 && (
        <Card className="border-primary/50 bg-primary/5">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={selectedInvoices.length === paginatedInvoices.length}
                  onCheckedChange={toggleAllInvoices}
                />
                <span className="text-sm font-medium">
                  {selectedInvoices.length} invoice(s) selected
                </span>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleBulkAction("download")}
                  className="gap-2"
                >
                  <Download className="h-4 w-4" />
                  Download Selected
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleBulkAction("send")}
                  className="gap-2"
                >
                  <Send className="h-4 w-4" />
                  Send Selected
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleBulkAction("delete")}
                  className="gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete Selected
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Invoice Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="w-12">
                    <Checkbox
                      checked={
                        paginatedInvoices.length > 0 &&
                        selectedInvoices.length === paginatedInvoices.length
                      }
                      onCheckedChange={toggleAllInvoices}
                    />
                  </TableHead>
                  <TableHead className="font-semibold">Invoice No</TableHead>
                  <TableHead className="font-semibold">Date</TableHead>
                  <TableHead className="font-semibold">Client</TableHead>
                  {user.role === "admin" && (
                    <TableHead className="font-semibold">Company</TableHead>
                  )}
                  <TableHead className="font-semibold">Amount</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                  <TableHead className="font-semibold">Due Date</TableHead>
                  <TableHead className="w-12 font-semibold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  // Loading skeleton
                  Array.from({ length: pageSize }).map((_, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Skeleton className="h-4 w-4" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-24" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-20" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-32" />
                      </TableCell>
                      {user.role === "admin" && (
                        <TableCell>
                          <Skeleton className="h-4 w-28" />
                        </TableCell>
                      )}
                      <TableCell>
                        <Skeleton className="h-4 w-20" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-6 w-16" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-20" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-8 w-8" />
                      </TableCell>
                    </TableRow>
                  ))
                ) : paginatedInvoices.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={user.role === "admin" ? 9 : 8}
                      className="h-32 text-center"
                    >
                      <div className="flex flex-col items-center gap-2">
                        <FileText className="h-8 w-8 text-muted-foreground" />
                        <p className="text-muted-foreground">
                          No invoices found
                        </p>
                        {hasActiveFilters && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={clearFilters}
                          >
                            Clear filters
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedInvoices.map((invoice) => (
                    <TableRow
                      key={invoice._id}
                      className="hover:bg-muted/50 transition-colors"
                    >
                      <TableCell>
                        <Checkbox
                          checked={selectedInvoices.includes(invoice._id)}
                          onCheckedChange={() =>
                            toggleInvoiceSelection(invoice._id)
                          }
                        />
                      </TableCell>
                      <TableCell className="font-medium">
                        {invoice.invoiceNo}
                      </TableCell>
                      <TableCell>
                        {format(new Date(invoice.date), "dd/MM/yyyy")}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-muted-foreground" />
                          <span className="truncate max-w-[200px]">
                            {invoice.client.clientCompanyName}
                          </span>
                        </div>
                      </TableCell>
                      {user.role === "admin" && (
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Building2 className="h-4 w-4 text-muted-foreground" />
                            <span className="truncate max-w-[150px]">
                              {invoice.company.companyName}
                            </span>
                          </div>
                        </TableCell>
                      )}
                      <TableCell>
                        <div className="text-right">
                          <div className="font-medium">
                            {formatCurrency(invoice.grossAmount)}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            +GST:{" "}
                            {formatCurrency(invoice.gstDetails?.totalGST || 0)}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                      <TableCell>
                        {invoice.dueDate ? (
                          <div className="text-sm">
                            {format(new Date(invoice.dueDate), "dd/MM/yyyy")}
                            {new Date(invoice.dueDate) < new Date() &&
                              invoice.status !== "Paid" && (
                                <div className="text-xs text-red-600 font-medium">
                                  Overdue
                                </div>
                              )}
                          </div>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem
                              onClick={() => handleView(invoice)}
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleEdit(invoice)}
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              Edit Invoice
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDownload(invoice)}
                            >
                              <Download className="mr-2 h-4 w-4" />
                              Download PDF
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleCopy(invoice)}
                            >
                              <Copy className="mr-2 h-4 w-4" />
                              Duplicate
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleSend(invoice)}
                            >
                              <Send className="mr-2 h-4 w-4" />
                              Send to Client
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuSub>
                              <DropdownMenuSubTrigger>
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Update Status
                              </DropdownMenuSubTrigger>
                              <DropdownMenuSubContent>
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleStatusUpdate(invoice._id, "Pending")
                                  }
                                >
                                  <Clock className="mr-2 h-4 w-4" />
                                  Pending
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleStatusUpdate(invoice._id, "Paid")
                                  }
                                >
                                  <CheckCircle className="mr-2 h-4 w-4" />
                                  Paid
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleStatusUpdate(invoice._id, "Overdue")
                                  }
                                >
                                  <AlertCircle className="mr-2 h-4 w-4" />
                                  Overdue
                                </DropdownMenuItem>
                              </DropdownMenuSubContent>
                            </DropdownMenuSub>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => handleDeleteClick(invoice._id)}
                              className="text-red-600 focus:text-red-600"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete Invoice
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-2">
          <p className="text-sm text-muted-foreground">Rows per page:</p>
          <Select
            value={pageSize.toString()}
            onValueChange={(value) => {
              setPageSize(Number(value));
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="w-[70px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center space-x-2">
          <p className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages || 1}
          </p>
          <div className="flex items-center space-x-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1 || loading}
            >
              First
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1 || loading}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setCurrentPage((prev) => Math.min(totalPages, prev + 1))
              }
              disabled={currentPage === totalPages || loading}
            >
              Next
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages || loading}
            >
              Last
            </Button>
          </div>
        </div>
      </div>

      {/* View Invoice Modal */}
      <Dialog open={viewModalOpen} onOpenChange={setViewModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Invoice Details
            </DialogTitle>
            <DialogDescription>
              {selectedInvoice?.invoiceNo} -{" "}
              {selectedInvoice?.client.clientCompanyName}
            </DialogDescription>
          </DialogHeader>
          {selectedInvoice && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      Invoice Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Invoice No:</span>
                      <span className="font-medium">
                        {selectedInvoice.invoiceNo}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Date:</span>
                      <span>
                        {format(new Date(selectedInvoice.date), "dd/MM/yyyy")}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Financial Year:
                      </span>
                      <span>{selectedInvoice.financialYear}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Status:</span>
                      {getStatusBadge(selectedInvoice.status)}
                    </div>
                    {selectedInvoice.dueDate && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Due Date:</span>
                        <span>
                          {format(
                            new Date(selectedInvoice.dueDate),
                            "dd/MM/yyyy"
                          )}
                        </span>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      Client Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Client:</span>
                      <span className="font-medium text-right">
                        {selectedInvoice.client.clientCompanyName}
                      </span>
                    </div>
                    {selectedInvoice.consignee && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Consignee:
                        </span>
                        <span className="text-right">
                          {selectedInvoice.consignee.clientCompanyName}
                        </span>
                      </div>
                    )}
                    {user.role === "admin" && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Company:</span>
                        <span className="text-right">
                          {selectedInvoice.company.companyName}
                        </span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Invoice Items</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Description</TableHead>
                        <TableHead className="text-right">Quantity</TableHead>
                        <TableHead className="text-right">Unit Price</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedInvoice.items.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>{item.description}</TableCell>
                          <TableCell className="text-right">
                            {item.quantity}
                          </TableCell>
                          <TableCell className="text-right">
                            {typeof item.unitPrice === "string" &&
                            item.unitPrice === "-"
                              ? "-"
                              : formatCurrency(Number(item.unitPrice))}
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            {formatCurrency(item.total)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Amount Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Amount Before GST:
                      </span>
                      <span className="font-medium">
                        {formatCurrency(selectedInvoice.totalBeforeGST)}
                      </span>
                    </div>
                    {selectedInvoice.gstDetails && (
                      <>
                        {selectedInvoice.gstDetails.cgst && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">CGST:</span>
                            <span>
                              {formatCurrency(selectedInvoice.gstDetails.cgst)}
                            </span>
                          </div>
                        )}
                        {selectedInvoice.gstDetails.sgst && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">SGST:</span>
                            <span>
                              {formatCurrency(selectedInvoice.gstDetails.sgst)}
                            </span>
                          </div>
                        )}
                        {selectedInvoice.gstDetails.igst && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">IGST:</span>
                            <span>
                              {formatCurrency(selectedInvoice.gstDetails.igst)}
                            </span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            Total GST:
                          </span>
                          <span className="font-medium">
                            {formatCurrency(
                              selectedInvoice.gstDetails.totalGST
                            )}
                          </span>
                        </div>
                      </>
                    )}
                    <Separator />
                    <div className="flex justify-between text-lg font-bold">
                      <span>Gross Amount:</span>
                      <span>{formatCurrency(selectedInvoice.grossAmount)}</span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <strong>In Words:</strong> {selectedInvoice.inWords}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-between items-center pt-4 border-t">
                <div className="text-sm text-muted-foreground">
                  Created on{" "}
                  {format(new Date(selectedInvoice.createdAt), "PPP")}
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => handleDownload(selectedInvoice)}
                    className="gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Download PDF
                  </Button>
                  <Button
                    onClick={() => handleSend(selectedInvoice)}
                    variant="outline"
                    className="gap-2"
                  >
                    <Send className="h-4 w-4" />
                    Send to Client
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <ConfirmDeleteDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Invoice?"
        description="This action cannot be undone. This will permanently delete the invoice and remove it from our servers."
      />
    </div>
  );
}
