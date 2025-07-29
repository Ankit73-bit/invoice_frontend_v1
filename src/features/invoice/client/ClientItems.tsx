"use client";

import { useMemo, useState, useEffect } from "react";
import {
  Plus,
  Search,
  Filter,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Star,
  Download,
  Edit,
  X,
  MoreHorizontal,
  Tag,
  Grid3X3,
  List,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

// ✅ Custom hook & store
import { useClientItems } from "@/hooks/useClientItems";
import { useClientItemStore } from "@/store/clientItemStore";
import { api } from "@/lib/api";
import { useCompanyContext } from "@/store/companyContextStore";
import { toast } from "react-toastify";

interface ClientItemsManagerProps {
  clientId: string;
  onItemSelect: (item: any) => void;
  onBulkSelect: (items: any[]) => void;
  selectedItems: any[];
}

export default function ClientItems({
  clientId,
  onItemSelect,
  onBulkSelect,
  selectedItems,
}: ClientItemsManagerProps) {
  const { items } = useClientItems(clientId);
  const { selectedCompanyId } = useCompanyContext();
  const { addItem, updateItem, deleteItem } = useClientItemStore();

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [selectedItemIds, setSelectedItemIds] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<"table" | "cards" | "grouped">(
    "table"
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  }>({ key: "description", direction: "asc" });

  const [bulkQuantities, setBulkQuantities] = useState<Record<string, number>>(
    {}
  );
  const [categories, setCategories] = useState<string[]>([]);
  const [collapsedCategories, setCollapsedCategories] = useState<Set<string>>(
    new Set()
  );
  const [newItem, setNewItem] = useState({
    description: "",
    unitPrice: "",
    hsnCode: "",
    category: "",
  });

  // Fetch categories when clientId changes
  useEffect(() => {
    if (clientId) {
      fetchCategories();
    }
  }, [clientId]);

  const fetchCategories = async () => {
    try {
      const response = await api.get(
        `client-items/client/${clientId}/categories`
      );
      setCategories(response.data.data);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  };

  const clientItems = items.filter((item) =>
    typeof item.clientId === "object"
      ? item.clientId._id === clientId
      : item.clientId === clientId
  );

  const filteredAndSortedItems = useMemo(() => {
    let filtered = clientItems;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (item) =>
          item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.hsnCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (item.category &&
            item.category.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Filter by category
    if (selectedCategory && selectedCategory !== "all") {
      filtered = filtered.filter((item) => item.category === selectedCategory);
    }

    // Sort items
    filtered.sort((a, b) => {
      let aVal = a[sortConfig.key as keyof typeof a];
      let bVal = b[sortConfig.key as keyof typeof b];

      if (typeof aVal === "string") {
        aVal = aVal.toLowerCase();
        bVal = (bVal as string).toLowerCase();
      }

      if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [clientItems, searchQuery, selectedCategory, sortConfig]);

  // Group items by category for grouped view
  const groupedItems = useMemo(() => {
    const groups = filteredAndSortedItems.reduce((acc, item) => {
      const category = item.category || "Uncategorized";
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(item);
      return acc;
    }, {} as Record<string, any[]>);

    return Object.keys(groups)
      .sort()
      .map((category) => ({
        category,
        items: groups[category],
        count: groups[category].length,
      }));
  }, [filteredAndSortedItems]);

  const handleAddItem = async () => {
    try {
      const itemToAdd = {
        clientId,
        ...newItem,
        unitPrice: Number.parseFloat(newItem.unitPrice),
        company: selectedCompanyId,
        category: newItem.category || "General",
      };
      const res = await api.post("client-items", itemToAdd);
      addItem(res.data.data);
      toast.success("Item created successfully!");
      setNewItem({ description: "", unitPrice: "", hsnCode: "", category: "" });
      setIsAddDialogOpen(false);
      fetchCategories(); // Refresh categories
    } catch (error) {
      console.error("Failed to add item:", error);
      toast.error("Failed to add item");
    }
  };

  const handleUpdateItem = async () => {
    try {
      const updatedItem = {
        ...editingItem,
        unitPrice: Number.parseFloat(editingItem.unitPrice),
      };
      const res = await api.patch(
        `client-items/${editingItem._id}`,
        updatedItem
      );
      toast.success("Item updated successfully!");
      updateItem(res.data.data);
      setEditingItem(null);
      fetchCategories(); // Refresh categories
    } catch (error) {
      console.error("Failed to update item:", error);
      toast.error("Failed to update item");
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    try {
      await api.delete(`client-items/${itemId}`);
      toast.success("Item deleted successfully!");
      deleteItem(itemId);
      setSelectedItemIds((prev) => prev.filter((id) => id !== itemId));
      fetchCategories(); // Refresh categories
    } catch (error) {
      console.error("Failed to delete item:", error);
      toast.error("Failed to delete item");
    }
  };

  const handleSort = (key: string) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const getSortIcon = (key: string) => {
    if (sortConfig.key !== key) return <ArrowUpDown className="h-3 w-3" />;
    return sortConfig.direction === "asc" ? (
      <ArrowUp className="h-3 w-3" />
    ) : (
      <ArrowDown className="h-3 w-3" />
    );
  };

  const handleSelectItem = (item: any) => {
    onItemSelect({
      description: item.description,
      unitPrice: item.unitPrice.toString(),
      hsnCode: item.hsnCode,
      quantity: 1,
      total: item.unitPrice.toString(),
    });
  };

  const handleItemSelection = (itemId: string, isSelected: boolean) => {
    if (isSelected) {
      setSelectedItemIds((prev) => [...prev, itemId]);
      setBulkQuantities((prev) => ({ ...prev, [itemId]: 1 }));
    } else {
      setSelectedItemIds((prev) => prev.filter((id) => id !== itemId));
      setBulkQuantities((prev) => {
        const { [itemId]: removed, ...rest } = prev;
        return rest;
      });
    }
  };

  const handleSelectAll = (isSelected: boolean) => {
    if (isSelected) {
      const allIds = filteredAndSortedItems.map((item) => item._id);
      setSelectedItemIds(allIds);
      const quantities = allIds.reduce((acc, id) => ({ ...acc, [id]: 1 }), {});
      setBulkQuantities(quantities);
    } else {
      setSelectedItemIds([]);
      setBulkQuantities({});
    }
  };

  const handleQuantityChange = (itemId: string, quantity: number) => {
    setBulkQuantities((prev) => ({ ...prev, [itemId]: Math.max(1, quantity) }));
  };

  const handleAddSelectedItems = () => {
    const selectedItems = filteredAndSortedItems.filter((item) =>
      selectedItemIds.includes(item._id)
    );
    const itemsToAdd = selectedItems.map((item) => ({
      description: item.description,
      unitPrice: item.unitPrice.toString(),
      hsnCode: item.hsnCode,
      quantity: bulkQuantities[item._id] || 1,
      total: (item.unitPrice * (bulkQuantities[item._id] || 1)).toString(),
    }));

    onBulkSelect(itemsToAdd);
    setSelectedItemIds([]);
    setBulkQuantities({});
  };

  const handleAddAllItems = () => {
    const itemsToAdd = filteredAndSortedItems.map((item) => ({
      description: item.description,
      unitPrice: item.unitPrice.toString(),
      hsnCode: item.hsnCode,
      quantity: 1,
      total: item.unitPrice.toString(),
    }));

    onBulkSelect(itemsToAdd);
  };

  const handleExportItems = () => {
    const csvContent = [
      ["Description", "Category", "HSN Code", "Unit Price", "Last Used"],
      ...filteredAndSortedItems.map((item) => [
        item.description,
        item.category || "Uncategorized",
        item.hsnCode,
        item.unitPrice.toString(),
        item.lastUsed || "",
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `client-items-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const toggleCategoryCollapse = (category: string) => {
    setCollapsedCategories((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(category)) {
        newSet.delete(category);
      } else {
        newSet.add(category);
      }
      return newSet;
    });
  };

  if (!clientId) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-muted-foreground">
          Please select a client first to view their saved items
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center">
              <div className="h-5 w-5 mr-2 bg-primary rounded-sm flex items-center justify-center">
                <span className="text-xs text-primary-foreground font-bold">
                  {filteredAndSortedItems.length}
                </span>
              </div>
              Client Items
              {selectedCategory !== "all" && (
                <Badge variant="secondary" className="ml-2">
                  {selectedCategory}
                </Badge>
              )}
            </CardTitle>
            <CardDescription>
              {selectedItemIds.length > 0
                ? `${selectedItemIds.length} items selected`
                : "Select items to add to invoice or manage client's catalog"}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            {/* Export Button */}
            <Button variant="outline" size="sm" onClick={handleExportItems}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>

            {/* View Mode Toggle */}
            <div className="flex items-center border rounded-md">
              <Button
                variant={viewMode === "table" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("table")}
                className="rounded-r-none"
                title="Table View"
              >
                <List className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "cards" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("cards")}
                className="rounded-none"
                title="Cards View"
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "grouped" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grouped")}
                className="rounded-l-none"
                title="Grouped by Category"
              >
                <Tag className="h-4 w-4" />
              </Button>
            </div>

            {/* Add Item Dialog */}
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Item
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Client Item</DialogTitle>
                  <DialogDescription>
                    Add a new item to this client's catalog
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Description</label>
                    <Textarea
                      value={newItem.description}
                      onChange={(e) =>
                        setNewItem((prev) => ({
                          ...prev,
                          description: e.target.value,
                        }))
                      }
                      placeholder="Item description"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Unit Price</label>
                      <Input
                        type="number"
                        value={newItem.unitPrice}
                        onChange={(e) =>
                          setNewItem((prev) => ({
                            ...prev,
                            unitPrice: e.target.value,
                          }))
                        }
                        placeholder="0.00"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">HSN Code</label>
                      <Input
                        value={newItem.hsnCode}
                        onChange={(e) =>
                          setNewItem((prev) => ({
                            ...prev,
                            hsnCode: e.target.value,
                          }))
                        }
                        placeholder="HSN Code"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Category</label>
                    <Select
                      value={newItem.category}
                      onValueChange={(value) =>
                        setNewItem((prev) => ({ ...prev, category: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select or type category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="General">General</SelectItem>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Input
                      className="mt-2"
                      value={newItem.category}
                      onChange={(e) =>
                        setNewItem((prev) => ({
                          ...prev,
                          category: e.target.value,
                        }))
                      }
                      placeholder="Or type new category"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setIsAddDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleAddItem}>Add Item</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {clientItems.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No items found for this client. Add some items to get started.
          </div>
        ) : (
          <>
            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search items by description, HSN code, or category..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div className="flex gap-2">
                {/* Category Filter */}
                <Select
                  value={selectedCategory}
                  onValueChange={setSelectedCategory}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Button
                  variant={showFavoritesOnly ? "default" : "outline"}
                  size="sm"
                  onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                >
                  <Star
                    className={`h-4 w-4 mr-2 ${
                      showFavoritesOnly ? "fill-current" : ""
                    }`}
                  />
                  Favorites
                </Button>

                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Filter className="h-4 w-4 mr-2" />
                      Filters
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80">
                    <div className="space-y-4">
                      <h4 className="font-medium">Filter Options</h4>
                      <div className="space-y-2">
                        <label className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={showFavoritesOnly}
                            onChange={(e) =>
                              setShowFavoritesOnly(e.target.checked)
                            }
                          />
                          <span className="text-sm">Show favorites only</span>
                        </label>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between mb-4 p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground">
                  {selectedItemIds.length} of {filteredAndSortedItems.length}
                  selected
                </span>
                {selectedItemIds.length > 0 && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">
                      Set quantities:
                    </span>
                    {selectedItemIds.slice(0, 3).map((id) => {
                      const item = filteredAndSortedItems.find(
                        (i) => i._id === id
                      );
                      return (
                        <div key={id} className="flex items-center gap-1">
                          <span className="text-xs truncate max-w-20">
                            {item?.description}
                          </span>
                          <Input
                            type="number"
                            min="1"
                            value={bulkQuantities[id] || 1}
                            onChange={(e) =>
                              handleQuantityChange(
                                id,
                                Number.parseInt(e.target.value)
                              )
                            }
                            className="w-16 h-6 text-xs"
                          />
                        </div>
                      );
                    })}
                    {selectedItemIds.length > 3 && (
                      <span className="text-xs text-muted-foreground">
                        +{selectedItemIds.length - 3} more
                      </span>
                    )}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleAddAllItems}
                  disabled={filteredAndSortedItems.length === 0}
                >
                  Add All ({filteredAndSortedItems.length})
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  onClick={handleAddSelectedItems}
                  disabled={selectedItemIds.length === 0}
                >
                  Add Selected ({selectedItemIds.length})
                </Button>
              </div>
            </div>

            {filteredAndSortedItems.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No items match your current filters. Try adjusting your search
                or filters.
              </div>
            ) : viewMode === "grouped" ? (
              /* Grouped View */
              <div className="space-y-4">
                {groupedItems.map(({ category, items, count }) => (
                  <Collapsible
                    key={category}
                    open={!collapsedCategories.has(category)}
                    onOpenChange={() => toggleCategoryCollapse(category)}
                  >
                    <CollapsibleTrigger asChild>
                      <Button
                        variant="ghost"
                        className="w-full justify-between p-4 h-auto border rounded-lg hover:bg-muted/50"
                      >
                        <div className="flex items-center gap-2">
                          <Tag className="h-4 w-4" />
                          <span className="font-medium">{category}</span>
                          <Badge variant="secondary">{count} items</Badge>
                        </div>
                        <ArrowDown
                          className={`h-4 w-4 transition-transform ${
                            collapsedCategories.has(category)
                              ? "rotate-180"
                              : ""
                          }`}
                        />
                      </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="mt-2">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pl-6">
                        {items.map((item) => (
                          <Card
                            key={item._id}
                            className={`cursor-pointer hover:shadow-md transition-all border-2 ${
                              selectedItemIds.includes(item._id)
                                ? "border-primary bg-primary/5"
                                : "hover:border-primary/50"
                            }`}
                          >
                            <CardContent className="p-4">
                              <div className="flex items-start justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <input
                                    type="checkbox"
                                    checked={selectedItemIds.includes(item._id)}
                                    onChange={(e) =>
                                      handleItemSelection(
                                        item._id,
                                        e.target.checked
                                      )
                                    }
                                    className="rounded"
                                    onClick={(e) => e.stopPropagation()}
                                  />
                                </div>
                                <div className="flex gap-1">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 w-6 p-0"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleSelectItem(item);
                                    }}
                                    title="Add single item"
                                  >
                                    <Plus className="h-3 w-3" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 w-6 p-0"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setEditingItem(item);
                                    }}
                                  >
                                    <Edit className="h-3 w-3" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDeleteItem(item._id);
                                    }}
                                  >
                                    <X className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>
                              <h4 className="font-medium text-sm mb-2 line-clamp-2">
                                {item.description}
                              </h4>
                              <div className="flex justify-between items-center text-sm mb-2">
                                <span className="text-muted-foreground">
                                  HSN: {item.hsnCode}
                                </span>
                                <span className="font-semibold">
                                  ₹{item.unitPrice.toLocaleString()}
                                </span>
                              </div>
                              {selectedItemIds.includes(item._id) && (
                                <div className="mt-2 flex items-center gap-2">
                                  <span className="text-xs">Qty:</span>
                                  <Input
                                    type="number"
                                    min="1"
                                    value={bulkQuantities[item._id] || 1}
                                    onChange={(e) =>
                                      handleQuantityChange(
                                        item._id,
                                        Number.parseInt(e.target.value)
                                      )
                                    }
                                    className="w-16 h-6 text-xs"
                                    onClick={(e) => e.stopPropagation()}
                                  />
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                ))}
              </div>
            ) : viewMode === "table" ? (
              /* Table View */
              <div className="border rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="p-3 text-left">
                        <input
                          type="checkbox"
                          checked={
                            selectedItemIds.length ===
                              filteredAndSortedItems.length &&
                            filteredAndSortedItems.length > 0
                          }
                          onChange={(e) => handleSelectAll(e.target.checked)}
                          className="rounded"
                        />
                      </th>
                      <th className="p-3 text-left">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleSort("description")}
                          className="font-medium p-0 h-auto"
                        >
                          Description {getSortIcon("description")}
                        </Button>
                      </th>
                      <th className="p-3 text-left">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleSort("category")}
                          className="font-medium p-0 h-auto"
                        >
                          Category {getSortIcon("category")}
                        </Button>
                      </th>
                      <th className="p-3 text-left">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleSort("hsnCode")}
                          className="font-medium p-0 h-auto"
                        >
                          HSN Code {getSortIcon("hsnCode")}
                        </Button>
                      </th>
                      <th className="p-3 text-left">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleSort("unitPrice")}
                          className="font-medium p-0 h-auto"
                        >
                          Unit Price {getSortIcon("unitPrice")}
                        </Button>
                      </th>
                      <th className="p-3 text-left font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAndSortedItems.map((item, index) => (
                      <tr
                        key={item._id}
                        className={`border-t hover:bg-muted/30 ${
                          index % 2 === 0 ? "bg-background" : "bg-muted/10"
                        }`}
                      >
                        <td className="p-3">
                          <input
                            type="checkbox"
                            checked={selectedItemIds.includes(item._id)}
                            onChange={(e) =>
                              handleItemSelection(item._id, e.target.checked)
                            }
                            className="rounded"
                          />
                        </td>
                        <td className="p-3">
                          <div className="max-w-xs">
                            <p className="font-medium text-sm line-clamp-2">
                              {item.description}
                            </p>
                          </div>
                        </td>
                        <td className="p-3">
                          <Badge variant="outline" className="text-xs">
                            {item.category || "Uncategorized"}
                          </Badge>
                        </td>
                        <td className="p-3 text-sm text-muted-foreground">
                          {item.hsnCode}
                        </td>
                        <td className="p-3 font-semibold">
                          ₹{item.unitPrice.toLocaleString()}
                        </td>
                        <td className="p-3">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="size-8"
                              >
                                <MoreHorizontal className="size-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => handleSelectItem(item)}
                              >
                                Add
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => setEditingItem(item)}
                              >
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-destructive focus:text-destructive"
                                onClick={() => handleDeleteItem(item._id)}
                              >
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              /* Cards View */
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredAndSortedItems.map((item) => (
                  <Card
                    key={item._id}
                    className={`cursor-pointer hover:shadow-md transition-all border-2 ${
                      selectedItemIds.includes(item._id)
                        ? "border-primary bg-primary/5"
                        : "hover:border-primary/50"
                    }`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={selectedItemIds.includes(item._id)}
                            onChange={(e) =>
                              handleItemSelection(item._id, e.target.checked)
                            }
                            className="rounded"
                            onClick={(e) => e.stopPropagation()}
                          />
                          <Badge variant="outline" className="text-xs">
                            {item.category || "Uncategorized"}
                          </Badge>
                        </div>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSelectItem(item);
                            }}
                            title="Add single item"
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0"
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingItem(item);
                            }}
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteItem(item._id);
                            }}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      <h4 className="font-medium text-sm mb-2 line-clamp-2">
                        {item.description}
                      </h4>
                      <div className="flex justify-between items-center text-sm mb-2">
                        <span className="text-muted-foreground">
                          HSN: {item.hsnCode}
                        </span>
                        <span className="font-semibold">
                          ₹{item.unitPrice.toLocaleString()}
                        </span>
                      </div>
                      {selectedItemIds.includes(item._id) && (
                        <div className="mt-2 flex items-center gap-2">
                          <span className="text-xs">Qty:</span>
                          <Input
                            type="number"
                            min="1"
                            value={bulkQuantities[item._id] || 1}
                            onChange={(e) =>
                              handleQuantityChange(
                                item._id,
                                Number.parseInt(e.target.value)
                              )
                            }
                            className="w-16 h-6 text-xs"
                            onClick={(e) => e.stopPropagation()}
                          />
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </>
        )}

        {/* Edit Item Dialog */}
        <Dialog open={!!editingItem} onOpenChange={() => setEditingItem(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Client Item</DialogTitle>
              <DialogDescription>Update the item details</DialogDescription>
            </DialogHeader>
            {editingItem && (
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Description</label>
                  <Textarea
                    value={editingItem.description}
                    onChange={(e) =>
                      setEditingItem((prev: any) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    placeholder="Item description"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Unit Price</label>
                    <Input
                      type="number"
                      value={editingItem.unitPrice}
                      onChange={(e) =>
                        setEditingItem((prev: any) => ({
                          ...prev,
                          unitPrice: e.target.value,
                        }))
                      }
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">HSN Code</label>
                    <Input
                      value={editingItem.hsnCode}
                      onChange={(e) =>
                        setEditingItem((prev: any) => ({
                          ...prev,
                          hsnCode: e.target.value,
                        }))
                      }
                      placeholder="HSN Code"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Category</label>
                  <Select
                    value={editingItem.category || ""}
                    onValueChange={(value) =>
                      setEditingItem((prev: any) => ({
                        ...prev,
                        category: value,
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select or type category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="General">General</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    className="mt-2"
                    value={editingItem.category || ""}
                    onChange={(e) =>
                      setEditingItem((prev: any) => ({
                        ...prev,
                        category: e.target.value,
                      }))
                    }
                    placeholder="Or type new category"
                  />
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditingItem(null)}>
                Cancel
              </Button>
              <Button onClick={handleUpdateItem}>Update Item</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
