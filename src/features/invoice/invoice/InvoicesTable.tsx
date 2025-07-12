import { useState } from "react";
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
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  MoreHorizontal,
  Edit,
  Trash2,
  Copy,
  Eye,
  Download,
  Send,
  CheckCircle,
  Clock,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Invoice } from "@/store/invoiceStore";

interface InvoicesTableProps {
  invoices: Invoice[];
  onEdit: (invoice: Invoice) => void;
  onDelete: (invoiceId: string) => void;
  onCopy: (invoice: Invoice) => void;
  onView: (invoice: Invoice) => void;
  onDownload: (invoice: Invoice) => void;
  onSend: (invoice: Invoice) => void;
  onStatusUpdate: (invoiceId: string, status: Invoice["status"]) => void;
  loading?: boolean;
}

const statusConfig = {
  Pending: {
    icon: Clock,
    color: "bg-yellow-100 text-yellow-800 border-yellow-200",
    variant: "secondary" as const,
  },
  Paid: {
    icon: CheckCircle,
    color: "bg-green-100 text-green-800 border-green-200",
    variant: "default" as const,
  },
  Overdue: {
    icon: AlertCircle,
    color: "bg-red-100 text-red-800 border-red-200",
    variant: "destructive" as const,
  },
};

export function InvoicesTable({
  invoices,
  onEdit,
  onDelete,
  onCopy,
  onView,
  onDownload,
  onSend,
  onStatusUpdate,
  loading = false,
}: InvoicesTableProps) {
  const [selectedInvoices, setSelectedInvoices] = useState<string[]>([]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedInvoices(invoices.map((invoice) => invoice._id));
    } else {
      setSelectedInvoices([]);
    }
  };

  const handleSelectInvoice = (invoiceId: string, checked: boolean) => {
    if (checked) {
      setSelectedInvoices([...selectedInvoices, invoiceId]);
    } else {
      setSelectedInvoices(selectedInvoices.filter((id) => id !== invoiceId));
    }
  };

  const isAllSelected =
    selectedInvoices.length === invoices.length && invoices.length > 0;
  const isPartiallySelected =
    selectedInvoices.length > 0 && selectedInvoices.length < invoices.length;

  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-16 bg-muted animate-pulse rounded" />
        ))}
      </div>
    );
  }

  if (invoices.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
          <Eye className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold mb-2">No invoices found</h3>
        <p className="text-muted-foreground mb-4">
          Get started by creating your first invoice.
        </p>
        <Button>Create Invoice</Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Bulk Actions */}
      {selectedInvoices.length > 0 && (
        <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
          <span className="text-sm font-medium">
            {selectedInvoices.length} invoice
            {selectedInvoices.length > 1 ? "s" : ""} selected
          </span>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              Bulk Download
            </Button>
            <Button variant="outline" size="sm">
              Bulk Send
            </Button>
            <Button variant="outline" size="sm">
              Mark as Paid
            </Button>
            <Button variant="destructive" size="sm">
              Delete Selected
            </Button>
          </div>
        </div>
      )}

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={isAllSelected}
                  onCheckedChange={handleSelectAll}
                  ref={(ref) => {
                    if (ref) ref.indeterminate = isPartiallySelected;
                  }}
                />
              </TableHead>
              <TableHead>Invoice No.</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices.map((invoice) => {
              const StatusIcon = statusConfig[invoice.status].icon;
              const isSelected = selectedInvoices.includes(invoice._id);

              return (
                <TableRow
                  key={invoice._id}
                  className={cn(isSelected && "bg-muted/50")}
                >
                  <TableCell>
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={(checked) =>
                        handleSelectInvoice(invoice._id, checked as boolean)
                      }
                    />
                  </TableCell>
                  <TableCell className="font-medium">
                    <div className="flex flex-col">
                      <span>{invoice.invoiceNo}</span>
                      <span className="text-xs text-muted-foreground">
                        Created: {formatDate(invoice.createdAt)}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>{formatDate(invoice.date)}</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">
                        {invoice.client.clientCompanyName}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">
                    {formatCurrency(invoice.grossAmount)}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-auto p-0"
                        >
                          <Badge
                            variant={statusConfig[invoice.status].variant}
                            className="cursor-pointer"
                          >
                            <StatusIcon className="h-3 w-3 mr-1" />
                            {invoice.status}
                          </Badge>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start">
                        <DropdownMenuLabel>Update Status</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {(["Pending", "Paid", "Overdue"] as const).map(
                          (status) => {
                            const StatusIcon = statusConfig[status].icon;
                            return (
                              <DropdownMenuItem
                                key={status}
                                onClick={() =>
                                  onStatusUpdate(invoice._id, status)
                                }
                                disabled={invoice.status === status}
                              >
                                <StatusIcon className="h-4 w-4 mr-2" />
                                {status}
                              </DropdownMenuItem>
                            );
                          }
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                  <TableCell>
                    {invoice.dueDate ? (
                      <span
                        className={cn(
                          "text-sm",
                          new Date(invoice.dueDate) < new Date() &&
                            invoice.status !== "Paid"
                            ? "text-red-600 font-medium"
                            : "text-muted-foreground"
                        )}
                      >
                        {formatDate(invoice.dueDate)}
                      </span>
                    ) : (
                      <span className="text-muted-foreground text-sm">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => onView(invoice)}>
                          <Eye className="mr-2 h-4 w-4" />
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onEdit(invoice)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onCopy(invoice)}>
                          <Copy className="mr-2 h-4 w-4" />
                          Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => onDownload(invoice)}>
                          <Download className="mr-2 h-4 w-4" />
                          Download PDF
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onSend(invoice)}>
                          <Send className="mr-2 h-4 w-4" />
                          Send Email
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => onDelete(invoice._id)}
                          className="text-red-600"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
