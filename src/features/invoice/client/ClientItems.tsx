import { useMemo, useState } from "react";
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

// ✅ Custom hook & store
import { useClientItems } from "@/hooks/useClientItems";
import { useClientItemStore } from "@/store/clientItemStore";

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
  const { items } = useClientItems(clientId); // fetch items
  const { addItem, updateItem, deleteItem } = useClientItemStore(); // local store ops

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [selectedItemIds, setSelectedItemIds] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<"table" | "cards">("table");
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
  const [newItem, setNewItem] = useState({
    description: "",
    unitPrice: "",
    hsnCode: "",
    category: "",
  });

  const clientItems = items.filter((item) => item.clientId === clientId);

  const categories = useMemo(() => {
    const cats = [...new Set(clientItems.map((item) => item.category))];
    return cats.sort();
  }, [clientItems]);

  const filteredAndSortedItems = useMemo(() => {
    let filtered = clientItems;

    if (searchQuery) {
      filtered = filtered.filter(
        (item) =>
          item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.hsnCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.category?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter((item) => item.category === selectedCategory);
    }

    if (showFavoritesOnly) {
      filtered = filtered.filter((item) => item.isFavorite);
    }

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
  }, [
    clientItems,
    searchQuery,
    selectedCategory,
    showFavoritesOnly,
    sortConfig,
  ]);

  const handleAddItem = async () => {
    try {
      const itemToAdd = {
        _id: Date.now().toString(),
        clientId,
        ...newItem,
        unitPrice: Number.parseFloat(newItem.unitPrice),
        isFavorite: false,
        lastUsed: new Date().toISOString().split("T")[0],
      };

      addItem(itemToAdd);
      setNewItem({ description: "", unitPrice: "", hsnCode: "", category: "" });
      setIsAddDialogOpen(false);
    } catch (error) {
      console.error("Failed to add item:", error);
    }
  };

  const handleUpdateItem = async () => {
    try {
      const updatedItem = {
        ...editingItem,
        unitPrice: Number.parseFloat(editingItem.unitPrice),
      };

      updateItem(updatedItem);
      setEditingItem(null);
    } catch (error) {
      console.error("Failed to update item:", error);
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    try {
      deleteItem(itemId);
      setSelectedItemIds((prev) => prev.filter((id) => id !== itemId));
    } catch (error) {
      console.error("Failed to delete item:", error);
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
      [
        "Description",
        "Category",
        "HSN Code",
        "Unit Price",
        "Favorite",
        "Last Used",
      ],
      ...filteredAndSortedItems.map((item) => [
        item.description,
        item.hsnCode,
        item.unitPrice.toString(),
        item.isFavorite ? "Yes" : "No",
        item.lastUsed,
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
              >
                Table
              </Button>
              <Button
                variant={viewMode === "cards" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("cards")}
                className="rounded-l-none"
              >
                Cards
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
                  placeholder="Search items by description, HSN code..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div className="flex gap-2">
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
                  {selectedItemIds.length} of {filteredAndSortedItems.length}{" "}
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
                      <th className="p-3 text-left">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleSort("lastUsed")}
                          className="font-medium p-0 h-auto"
                        >
                          Last Used {getSortIcon("lastUsed")}
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
                          <Badge variant="secondary" className="text-xs">
                            {item.category}
                          </Badge>
                        </td>
                        <td className="p-3 text-sm text-muted-foreground">
                          {item.hsnCode}
                        </td>
                        <td className="p-3 font-semibold">
                          ₹{item.unitPrice.toLocaleString()}
                        </td>
                        <td className="p-3 text-sm text-muted-foreground">
                          {item.lastUsed}
                        </td>
                        <td className="p-3">
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                              onClick={() => handleToggleFavorite(item._id)}
                              title={
                                item.isFavorite
                                  ? "Remove from favorites"
                                  : "Add to favorites"
                              }
                            >
                              <Star
                                className={`h-3 w-3 ${
                                  item.isFavorite
                                    ? "fill-current text-yellow-500"
                                    : ""
                                }`}
                              />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                              onClick={() => handleSelectItem(item)}
                              title="Add single item"
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                              onClick={() => setEditingItem(item)}
                              title="Edit item"
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                              onClick={() => handleDeleteItem(item._id)}
                              title="Delete item"
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
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
                          <Badge variant="secondary" className="text-xs">
                            {item.category}
                          </Badge>
                          {item.isFavorite && (
                            <Star className="h-3 w-3 fill-current text-yellow-500" />
                          )}
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
                      <div className="text-xs text-muted-foreground">
                        Last used: {item.lastUsed}
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
                    value={editingItem.category}
                    onValueChange={(value) =>
                      setEditingItem((prev: any) => ({
                        ...prev,
                        category: value,
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
