import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, Filter, X, Search, Download, Plus } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import type { DateRange } from "react-day-picker";

interface InvoicesFiltersProps {
  onFiltersChange: (filters: InvoiceFilters) => void;
  onSearch: (query: string) => void;
  onExport: () => void;
  onCreateNew: () => void;
  clients: Array<{ _id: string; clientCompanyName: string }>;
  totalCount: number;
  filteredCount: number;
}

export interface InvoiceFilters {
  status?: string;
  client?: string;
  dateRange?: DateRange;
  amountRange?: {
    min?: number;
    max?: number;
  };
  dueStatus?: string;
}

export function InvoicesFilters({
  onFiltersChange,
  onSearch,
  onExport,
  onCreateNew,
  clients,
  totalCount,
  filteredCount,
}: InvoicesFiltersProps) {
  const [filters, setFilters] = useState<InvoiceFilters>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  const updateFilters = (newFilters: Partial<InvoiceFilters>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    onFiltersChange(updatedFilters);
  };

  const clearFilters = () => {
    setFilters({});
    setSearchQuery("");
    onFiltersChange({});
    onSearch("");
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    onSearch(query);
  };

  const activeFiltersCount = Object.values(filters).filter(Boolean).length;

  return (
    <div className="space-y-4">
      {/* Main Search and Actions */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search invoices by number, client name..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
            {activeFiltersCount > 0 && (
              <Badge variant="secondary" className="ml-2">
                {activeFiltersCount}
              </Badge>
            )}
          </Button>
          <Button variant="outline" onClick={onExport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button onClick={onCreateNew}>
            <Plus className="h-4 w-4 mr-2" />
            New Invoice
          </Button>
        </div>
      </div>

      {/* Results Summary */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>
          Showing {filteredCount} of {totalCount} invoices
        </span>
        {activeFiltersCount > 0 && (
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            <X className="h-4 w-4 mr-1" />
            Clear filters
          </Button>
        )}
      </div>

      {/* Advanced Filters */}
      {showAdvancedFilters && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Advanced Filters</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Status Filter */}
              <div className="space-y-2">
                <Label>Status</Label>
                <Select
                  value={filters.status || "all"}
                  onValueChange={(value) =>
                    updateFilters({ status: value || undefined })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All statuses</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Paid">Paid</SelectItem>
                    <SelectItem value="Overdue">Overdue</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Client Filter */}
              <div className="space-y-2">
                <Label>Client</Label>
                <Select
                  value={filters.client || "all"}
                  onValueChange={(value) =>
                    updateFilters({ client: value || undefined })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All clients" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All clients</SelectItem>
                    {clients.map((client) => (
                      <SelectItem key={client._id} value={client._id}>
                        {client.clientCompanyName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Due Status Filter */}
              <div className="space-y-2">
                <Label>Due Status</Label>
                <Select
                  value={filters.dueStatus || "all"}
                  onValueChange={(value) =>
                    updateFilters({ dueStatus: value || undefined })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All invoices" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All invoices</SelectItem>
                    <SelectItem value="due-today">Due Today</SelectItem>
                    <SelectItem value="overdue">Overdue</SelectItem>
                    <SelectItem value="due-this-week">Due This Week</SelectItem>
                    <SelectItem value="due-this-month">
                      Due This Month
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Date Range Filter */}
              <div className="space-y-2">
                <Label>Date Range</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !filters.dateRange && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
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
                    <Calendar
                      initialFocus
                      mode="range"
                      defaultMonth={filters.dateRange?.from}
                      selected={filters.dateRange}
                      onSelect={(dateRange) => updateFilters({ dateRange })}
                      numberOfMonths={2}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Amount Range Filter */}
            <div className="space-y-2">
              <Label>Amount Range</Label>
              <div className="flex items-center space-x-2">
                <Input
                  type="number"
                  placeholder="Min amount"
                  value={filters.amountRange?.min || ""}
                  onChange={(e) =>
                    updateFilters({
                      amountRange: {
                        ...filters.amountRange,
                        min: e.target.value
                          ? Number(e.target.value)
                          : undefined,
                      },
                    })
                  }
                />
                <span className="text-muted-foreground">to</span>
                <Input
                  type="number"
                  placeholder="Max amount"
                  value={filters.amountRange?.max || ""}
                  onChange={(e) =>
                    updateFilters({
                      amountRange: {
                        ...filters.amountRange,
                        max: e.target.value
                          ? Number(e.target.value)
                          : undefined,
                      },
                    })
                  }
                />
              </div>
            </div>

            {/* Quick Filter Buttons */}
            <div className="space-y-2">
              <Label>Quick Filters</Label>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => updateFilters({ status: "Pending" })}
                >
                  Pending Invoices
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => updateFilters({ dueStatus: "overdue" })}
                >
                  Overdue
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => updateFilters({ status: "Paid" })}
                >
                  Paid This Month
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => updateFilters({ dueStatus: "due-this-week" })}
                >
                  Due This Week
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Active Filters Display */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap gap-2">
          {filters.status && filters.status !== "all" && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Status: {filters.status}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => updateFilters({ status: undefined })}
              />
            </Badge>
          )}
          {filters.client && filters.client !== "all" && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Client:{" "}
              {clients.find((c) => c._id === filters.client)?.clientCompanyName}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => updateFilters({ client: undefined })}
              />
            </Badge>
          )}
          {filters.dateRange && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Date Range
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => updateFilters({ dateRange: undefined })}
              />
            </Badge>
          )}
          {filters.dueStatus && filters.dueStatus !== "all" && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Due: {filters.dueStatus}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => updateFilters({ dueStatus: undefined })}
              />
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}
