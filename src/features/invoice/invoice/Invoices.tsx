import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { InvoicesFilters, type InvoiceFilters } from "./InvoicesFilters";
import { InvoicesTable } from "./InvoicesTable";
import { InvoicesPagination } from "./InvoicesPagination";

// Mock data - replace with your actual data source
const mockInvoices = [
  {
    _id: "1",
    invoiceNo: "INV/2024/001",
    date: "2024-01-15",
    client: { _id: "c1", clientCompanyName: "ABC Corporation" },
    grossAmount: 25000,
    status: "Paid" as const,
    createdAt: "2024-01-15",
    dueDate: "2024-02-15",
  },
  {
    _id: "2",
    invoiceNo: "INV/2024/002",
    date: "2024-01-16",
    client: { _id: "c2", clientCompanyName: "XYZ Industries" },
    grossAmount: 15000,
    status: "Pending" as const,
    createdAt: "2024-01-16",
    dueDate: "2024-02-16",
  },
  {
    _id: "3",
    invoiceNo: "INV/2024/003",
    date: "2024-01-10",
    client: { _id: "c3", clientCompanyName: "Tech Solutions" },
    grossAmount: 35000,
    status: "Overdue" as const,
    createdAt: "2024-01-10",
    dueDate: "2024-01-25",
  },
  // Add more mock data as needed
];

const mockClients = [
  { _id: "c1", clientCompanyName: "ABC Corporation" },
  { _id: "c2", clientCompanyName: "XYZ Industries" },
  { _id: "c3", clientCompanyName: "Tech Solutions" },
];

export function Invoices() {
  const [filters, setFilters] = useState<InvoiceFilters>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Filter and search logic
  const filteredInvoices = useMemo(() => {
    let result = mockInvoices;

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
    if (filters.status) {
      result = result.filter((invoice) => invoice.status === filters.status);
    }

    if (filters.client) {
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

    if (filters.dueStatus) {
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
  }, [mockInvoices, searchQuery, filters]);

  // Pagination
  const totalPages = Math.ceil(filteredInvoices.length / pageSize);
  const paginatedInvoices = filteredInvoices.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Statistics
  const stats = useMemo(() => {
    const total = mockInvoices.reduce((sum, inv) => sum + inv.grossAmount, 0);
    const paid = mockInvoices
      .filter((inv) => inv.status === "Paid")
      .reduce((sum, inv) => sum + inv.grossAmount, 0);
    const pending = mockInvoices
      .filter((inv) => inv.status === "Pending")
      .reduce((sum, inv) => sum + inv.grossAmount, 0);
    const overdue = mockInvoices
      .filter((inv) => inv.status === "Overdue")
      .reduce((sum, inv) => sum + inv.grossAmount, 0);

    return {
      total: { amount: total, count: mockInvoices.length },
      paid: {
        amount: paid,
        count: mockInvoices.filter((inv) => inv.status === "Paid").length,
      },
      pending: {
        amount: pending,
        count: mockInvoices.filter((inv) => inv.status === "Pending").length,
      },
      overdue: {
        amount: overdue,
        count: mockInvoices.filter((inv) => inv.status === "Overdue").length,
      },
    };
  }, [mockInvoices]);

  // Event handlers
  const handleEdit = (invoice: any) => {
    console.log("Edit invoice:", invoice);
    // Navigate to edit page or open edit modal
  };

  const handleDelete = (invoiceId: string) => {
    console.log("Delete invoice:", invoiceId);
    // Show confirmation dialog and delete
  };

  const handleCopy = (invoice: any) => {
    console.log("Copy invoice:", invoice);
    // Create a copy of the invoice
  };

  const handleView = (invoice: any) => {
    console.log("View invoice:", invoice);
    // Open invoice preview
  };

  const handleDownload = (invoice: any) => {
    console.log("Download invoice:", invoice);
    // Generate and download PDF
  };

  const handleSend = (invoice: any) => {
    console.log("Send invoice:", invoice);
    // Open email dialog
  };

  const handleStatusUpdate = (invoiceId: string, status: any) => {
    console.log("Update status:", invoiceId, status);
    // Update invoice status
  };

  const handleExport = () => {
    console.log("Export invoices");
    // Export filtered invoices
  };

  const handleCreateNew = () => {
    console.log("Create new invoice");
    // Navigate to create invoice page
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);
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

      {/* Filters */}
      <InvoicesFilters
        onFiltersChange={setFilters}
        onSearch={setSearchQuery}
        onExport={handleExport}
        onCreateNew={handleCreateNew}
        clients={mockClients}
        totalCount={mockInvoices.length}
        filteredCount={filteredInvoices.length}
      />

      {/* Table */}
      <InvoicesTable
        invoices={paginatedInvoices}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onCopy={handleCopy}
        onView={handleView}
        onDownload={handleDownload}
        onSend={handleSend}
        onStatusUpdate={handleStatusUpdate}
      />

      {/* Pagination */}
      <InvoicesPagination
        currentPage={currentPage}
        totalPages={totalPages}
        pageSize={pageSize}
        totalItems={filteredInvoices.length}
        onPageChange={setCurrentPage}
        onPageSizeChange={(newPageSize) => {
          setPageSize(newPageSize);
          setCurrentPage(1);
        }}
      />
    </div>
  );
}
