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
import { useInvoiceAPI } from "./apiIntegration";

// Types based on your existing interfaces
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
  grossAmount: number;
  status: "Pending" | "Paid" | "Overdue";
  createdAt: string;
  dueDate?: string;
  items: Array<{
    description: string;
    quantity: number;
    unitPrice: number | string;
    total: number;
  }>;
}

interface InvoiceFilters {
  status?: string;
  client?: string;
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

// Mock data - replace with your actual API calls
const mockInvoices: Invoice[] = [
  {
    _id: "1",
    invoiceNo: "INV/2024/001",
    date: "2024-01-15",
    financialYear: "2024-25",
    client: { _id: "c1", clientCompanyName: "ABC Corporation" },
    consignee: { _id: "cs1", clientCompanyName: "ABC Corp Warehouse" },
    grossAmount: 25000,
    status: "Paid",
    createdAt: "2024-01-15",
    dueDate: "2024-02-15",
    items: [
      { description: "Product A", quantity: 10, unitPrice: 2500, total: 25000 },
    ],
  },
  {
    _id: "2",
    invoiceNo: "INV/2024/002",
    date: "2024-01-16",
    financialYear: "2024-25",
    client: { _id: "c2", clientCompanyName: "XYZ Industries" },
    grossAmount: 15000,
    status: "Pending",
    createdAt: "2024-01-16",
    dueDate: "2024-02-16",
    items: [
      { description: "Service B", quantity: 5, unitPrice: 3000, total: 15000 },
    ],
  },
  {
    _id: "3",
    invoiceNo: "INV/2024/003",
    date: "2024-01-10",
    financialYear: "2024-25",
    client: { _id: "c3", clientCompanyName: "Tech Solutions" },
    grossAmount: 35000,
    status: "Overdue",
    createdAt: "2024-01-10",
    dueDate: "2024-01-25",
    items: [
      { description: "Product C", quantity: 7, unitPrice: 5000, total: 35000 },
    ],
  },
  {
    _id: "4",
    invoiceNo: "INV/2024/004",
    date: "2024-01-20",
    financialYear: "2024-25",
    client: { _id: "c1", clientCompanyName: "ABC Corporation" },
    grossAmount: 12000,
    status: "Pending",
    createdAt: "2024-01-20",
    dueDate: "2024-02-20",
    items: [
      { description: "Product D", quantity: 4, unitPrice: 3000, total: 12000 },
    ],
  },
  {
    _id: "5",
    invoiceNo: "INV/2024/005",
    date: "2024-01-25",
    financialYear: "2024-25",
    client: { _id: "c2", clientCompanyName: "XYZ Industries" },
    grossAmount: 28000,
    status: "Paid",
    createdAt: "2024-01-25",
    dueDate: "2024-02-25",
    items: [
      { description: "Service E", quantity: 8, unitPrice: 3500, total: 28000 },
    ],
  },
];

const mockClients = [
  { _id: "c1", clientCompanyName: "ABC Corporation" },
  { _id: "c2", clientCompanyName: "XYZ Industries" },
  { _id: "c3", clientCompanyName: "Tech Solutions" },
];

export default function InvoiceList() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<InvoiceFilters>({
    status: "All Status",
    client: "All Clients",
    dueStatus: "All Due Status",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedInvoices, setSelectedInvoices] = useState<string[]>([]);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [invoiceToDelete, setInvoiceToDelete] = useState<string | null>(null);

  const {
    fetchInvoices,
    deleteInvoice,
    updateInvoiceStatus,
    downloadInvoicePDF,
    loading,
    error,
  } = useInvoiceAPI();

  useEffect(() => {
    const getInvoices = async () => {
      try {
        const data = await fetchInvoices({
          page: currentPage,
          limit: pageSize,
          search: searchQuery,
          status: filters.status !== "All Status" ? filters.status : undefined,
          client: filters.client !== "All Clients" ? filters.client : undefined,
          dateFrom: filters.dateRange?.from?.toISOString(),
          dateTo: filters.dateRange?.to?.toISOString(),
          amountMin: filters.amountRange?.min,
          amountMax: filters.amountRange?.max,
        });

        setInvoices(data?.data?.invoices || []);
      } catch (err) {
        console.error("Fetch error", err);
      }
    };

    getInvoices();
  }, [filters, searchQuery, currentPage, pageSize]);

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
            .includes(searchQuery.toLowerCase())
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
  }, [invoices, searchQuery, filters]);

  // Pagination
  const totalPages = Math.ceil(filteredInvoices.length / pageSize);
  const paginatedInvoices = filteredInvoices.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Statistics
  const stats = useMemo(() => {
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
  }, [invoices]);

  // Event handlers
  const handleView = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setViewModalOpen(true);
  };

  const handleEdit = (invoice: Invoice) => {
    console.log("Edit invoice:", invoice);
    // Navigate to edit page
  };

  const handleDelete = (invoiceId: string) => {
    setInvoiceToDelete(invoiceId);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!invoiceToDelete) return;

    try {
      await deleteInvoice(invoiceToDelete);
      const updated = await fetchInvoices({ ...filters, search: searchQuery });
      setInvoices(updated?.data?.invoices || []);
      setDeleteModalOpen(false);
      setInvoiceToDelete(null);
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  const handleCopy = (invoice: Invoice) => {
    console.log("Copy invoice:", invoice);
    // Create a copy of the invoice
  };

  const handleDownload = async (invoice: Invoice) => {
    try {
      await downloadInvoicePDF(invoice._id);
    } catch (err) {
      console.error("Download failed:", err);
    }
  };

  const handleSend = (invoice: Invoice) => {
    console.log("Send invoice:", invoice);
    // Open email dialog
  };

  const handleStatusUpdate = async (
    invoiceId: string,
    status: Invoice["status"]
  ) => {
    try {
      await updateInvoiceStatus(invoiceId, status);
      // Refresh after update
      const updated = await fetchInvoices({ ...filters, search: searchQuery });
      setInvoices(updated?.data?.invoices || []);
    } catch (err) {
      console.error("Status update failed:", err);
    }
  };

  const handleBulkAction = (action: string) => {
    console.log("Bulk action:", action, selectedInvoices);
    // Implement bulk actions
  };

  const exportToCSV = useCallback(() => {
    const csvData = filteredInvoices.map((invoice) => ({
      "Invoice No": invoice.invoiceNo,
      Date: format(new Date(invoice.date), "dd/MM/yyyy"),
      Client: invoice.client.clientCompanyName,
      Amount: invoice.grossAmount,
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
  }, [filteredInvoices]);

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

    return <Badge variant={variants[status]}>{status}</Badge>;
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

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(stats.total.amount)}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats.total.count} invoices
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Paid</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(stats.paid.amount)}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats.paid.count} invoices
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {formatCurrency(stats.pending.amount)}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats.pending.count} invoices
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {formatCurrency(stats.overdue.amount)}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats.overdue.count} invoices
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Header and Actions */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Invoices</h1>
          <p className="text-muted-foreground">
            Manage your invoices and track payments
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={exportToCSV} variant="outline">
            <FileDown className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Invoice
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search by invoice number or client name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-2">
              {/* Status Filter */}
              <Select
                value={filters.status}
                onValueChange={(value) =>
                  setFilters((prev) => ({ ...prev, status: value }))
                }
              >
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All Status">All Status</SelectItem>
                  <SelectItem value="Paid">Paid</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Overdue">Overdue</SelectItem>
                </SelectContent>
              </Select>

              {/* Client Filter */}
              <Select
                value={filters.client}
                onValueChange={(value) =>
                  setFilters((prev) => ({ ...prev, client: value }))
                }
              >
                <SelectTrigger className="w-[160px]">
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

              {/* Due Status Filter */}
              <Select
                value={filters.dueStatus}
                onValueChange={(value) =>
                  setFilters((prev) => ({ ...prev, dueStatus: value }))
                }
              >
                <SelectTrigger className="w-[160px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All Due Status">All Due Status</SelectItem>
                  <SelectItem value="due-today">Due Today</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                  <SelectItem value="due-this-week">Due This Week</SelectItem>
                  <SelectItem value="due-this-month">Due This Month</SelectItem>
                </SelectContent>
              </Select>

              {/* Date Range Filter */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-[160px] justify-start bg-transparent"
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    Date Range
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

              {/* Amount Range Filter */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-[160px] justify-start bg-transparent"
                  >
                    <DollarSign className="mr-2 h-4 w-4" />
                    Amount Range
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80" align="start">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Minimum Amount</Label>
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
                      <Label>Maximum Amount</Label>
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

              {/* Clear Filters */}
              <Button
                variant="ghost"
                onClick={() => {
                  setFilters({
                    status: "All Status",
                    client: "All Clients",
                    dueStatus: "All Due Status",
                  });
                  setSearchQuery("");
                }}
              >
                Clear Filters
              </Button>
            </div>
          </div>

          {/* Results Summary */}
          <div className="mt-4 text-sm text-muted-foreground">
            Showing {paginatedInvoices.length} of {filteredInvoices.length}{" "}
            invoices
            {filteredInvoices.length !== invoices.length && (
              <span> (filtered from {invoices.length} total)</span>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      {selectedInvoices.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                {selectedInvoices.length} invoice(s) selected
              </span>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleBulkAction("download")}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download Selected
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleBulkAction("send")}
                >
                  <Send className="h-4 w-4 mr-2" />
                  Send Selected
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleBulkAction("delete")}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
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
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={
                      selectedInvoices.length === paginatedInvoices.length
                    }
                    onCheckedChange={toggleAllInvoices}
                  />
                </TableHead>
                <TableHead>Invoice No</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead className="w-12">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedInvoices.map((invoice) => (
                <TableRow key={invoice._id}>
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
                  <TableCell>{invoice.client.clientCompanyName}</TableCell>
                  <TableCell>{formatCurrency(invoice.grossAmount)}</TableCell>
                  <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                  <TableCell>
                    {invoice.dueDate
                      ? format(new Date(invoice.dueDate), "dd/MM/yyyy")
                      : "-"}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => handleView(invoice)}>
                          <Eye className="mr-2 h-4 w-4" />
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEdit(invoice)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDownload(invoice)}
                        >
                          <Download className="mr-2 h-4 w-4" />
                          Download PDF
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleCopy(invoice)}>
                          <Copy className="mr-2 h-4 w-4" />
                          Copy
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleSend(invoice)}>
                          <Send className="mr-2 h-4 w-4" />
                          Send
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          <Select
                            value={invoice.status}
                            onValueChange={(value) =>
                              handleStatusUpdate(
                                invoice._id,
                                value as Invoice["status"]
                              )
                            }
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Pending">Pending</SelectItem>
                              <SelectItem value="Paid">Paid</SelectItem>
                              <SelectItem value="Overdue">Overdue</SelectItem>
                            </SelectContent>
                          </Select>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleDelete(invoice._id)}
                          className="text-red-600"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Pagination */}
      <div className="flex items-center justify-between">
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

        <div className="flex items-center space-x-1">
          <p className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </p>
          <div className="flex items-center space-x-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
            >
              First
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setCurrentPage((prev) => Math.min(totalPages, prev + 1))
              }
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
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
            <DialogTitle>Invoice Details</DialogTitle>
            <DialogDescription>
              {selectedInvoice?.invoiceNo} -{" "}
              {selectedInvoice?.client.clientCompanyName}
            </DialogDescription>
          </DialogHeader>
          {selectedInvoice && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold mb-2">Invoice Information</h3>
                  <div className="space-y-1 text-sm">
                    <p>
                      <strong>Invoice No:</strong> {selectedInvoice.invoiceNo}
                    </p>
                    <p>
                      <strong>Date:</strong>{" "}
                      {format(new Date(selectedInvoice.date), "dd/MM/yyyy")}
                    </p>
                    <p>
                      <strong>Financial Year:</strong>{" "}
                      {selectedInvoice.financialYear}
                    </p>
                    <p>
                      <strong>Status:</strong>{" "}
                      {getStatusBadge(selectedInvoice.status)}
                    </p>
                    {selectedInvoice.dueDate && (
                      <p>
                        <strong>Due Date:</strong>{" "}
                        {format(
                          new Date(selectedInvoice.dueDate),
                          "dd/MM/yyyy"
                        )}
                      </p>
                    )}
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Client Information</h3>
                  <div className="space-y-1 text-sm">
                    <p>
                      <strong>Client:</strong>{" "}
                      {selectedInvoice.client.clientCompanyName}
                    </p>
                    {selectedInvoice.consignee && (
                      <p>
                        <strong>Consignee:</strong>{" "}
                        {selectedInvoice.consignee.clientCompanyName}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Items</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Description</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Unit Price</TableHead>
                      <TableHead>Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedInvoice.items.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{item.description}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>
                          {typeof item.unitPrice === "string" &&
                          item.unitPrice === "-"
                            ? "-"
                            : formatCurrency(Number(item.unitPrice))}
                        </TableCell>
                        <TableCell>{formatCurrency(item.total)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="flex justify-between items-center pt-4 border-t">
                <div className="text-lg font-semibold">
                  Total Amount: {formatCurrency(selectedInvoice.grossAmount)}
                </div>
                <div className="flex gap-2">
                  <Button onClick={() => handleDownload(selectedInvoice)}>
                    <Download className="h-4 w-4 mr-2" />
                    Download PDF
                  </Button>
                  <Button onClick={() => handleSend(selectedInvoice)}>
                    <Send className="h-4 w-4 mr-2" />
                    Send Invoice
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this invoice? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
