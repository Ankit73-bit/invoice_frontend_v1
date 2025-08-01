import { useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  restrictToVerticalAxis,
  restrictToFirstScrollableAncestor,
} from "@dnd-kit/modifiers";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { api } from "@/lib/api";
import { MoreHorizontal } from "lucide-react";
import { ConfirmDeleteDialog } from "./ConfirmDeleteDialog";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { toast } from "react-toastify";
import type { Client, Consignee } from "@/lib/types";

interface ColumnConfig<T> {
  label: string;
  accessor: keyof T | string;
}

interface GenericTableProps<T> {
  items: T[];
  endpoint: string;
  itemName?: string;
  columns: ColumnConfig<T>[];
  getRowKey: (item: T) => string;
  setSelectedItem: (item: T) => void;
  removeItem: (id: string) => void;
  renderViewer?: (item: T) => React.ReactNode;
}

interface ColumnConfig<T> {
  label: string;
  accessor: keyof T | string;
  customCell?: (item: T) => React.ReactNode;
}

export function GenericTable<T>({
  items,
  endpoint,
  itemName = "item",
  columns,
  getRowKey,
  setSelectedItem,
  removeItem,
}: GenericTableProps<T>) {
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/${endpoint}/${id}`);
      removeItem(id);
      toast.success(`${itemName} deleted.`);
    } catch (error) {
      toast.error(`Failed to delete ${itemName}.`);
      console.error(error);
    } finally {
      setConfirmDialogOpen(false);
      setSelectedId(null);
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  );

  if (!items.length) {
    return (
      <p className="text-muted-foreground text-sm mt-4">
        No {itemName}s found.
      </p>
    );
  }

  return (
    <Tabs
      value="outline"
      className="relative flex flex-col gap-4 overflow-auto"
    >
      <TabsContent
        value="outline"
        className="relative flex flex-col gap-4 overflow-auto "
      >
        <div className="overflow-hidden rounded-lg border">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            modifiers={[
              restrictToVerticalAxis,
              restrictToFirstScrollableAncestor,
            ]}
          >
            <Table>
              <TableHeader className="sticky top-0 z-10 bg-muted">
                <TableRow>
                  {columns.map((col, i) => (
                    <TableHead key={i}>{col.label}</TableHead>
                  ))}
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => {
                  const key = getRowKey(item);
                  return (
                    <TableRow key={key} className="border-b hover:bg-muted/50">
                      {columns.map((col, i) => {
                        if (col.customCell) {
                          return (
                            <td key={i} className="px-4 py-2">
                              {col.customCell(item)}
                            </td>
                          );
                        }
                        const val = col.accessor
                          .split(".")
                          .reduce((acc: any, part) => acc?.[part], item);
                        return (
                          <td key={i} className="px-4 py-2">
                            {val || "-"}
                          </td>
                        );
                      })}
                      <td className="px-4 py-2 flex gap-2">
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
                              onClick={() => setSelectedItem(item)}
                            >
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-destructive focus:text-destructive"
                              onClick={() => {
                                setSelectedId(key);
                                setConfirmDialogOpen(true);
                              }}
                            >
                              Delete
                            </DropdownMenuItem>
                            {endpoint === "clients" && (
                              <DropdownMenuItem
                                onClick={async () => {
                                  const client = item as Client;

                                  const mapped = {
                                    consigneeName: client.clientName || "",
                                    consigneeCompanyName:
                                      client.clientCompanyName || "",
                                    email: client.email || "",
                                    contact: client.contact || "",
                                    company: client.company || "",
                                    address: { ...client.address },
                                  };

                                  try {
                                    toast.success("Copied to consignee");
                                  } catch (error) {
                                    toast.error("Failed to copy");
                                    console.error(error);
                                  }
                                }}
                              >
                                Copy To Consignee
                              </DropdownMenuItem>
                            )}
                            {endpoint === "consignees" && (
                              <DropdownMenuItem
                                onClick={async () => {
                                  const consignee = item as Consignee;

                                  const mapped = {
                                    clientName: consignee.consigneeName || "",
                                    clientCompanyName:
                                      consignee.consigneeCompanyName || "",
                                    email: consignee.email || "",
                                    contact: consignee.contact || "",
                                    company: consignee.company || "",
                                    address: { ...consignee.address },
                                  };

                                  try {
                                    const res = await api.post(
                                      "/clients",
                                      mapped
                                    );
                                    toast.success("Copied to client");
                                  } catch (error) {
                                    toast.error("Failed to copy");
                                    console.error(error);
                                  }
                                }}
                              >
                                Copy To Client
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>

            <ConfirmDeleteDialog
              open={confirmDialogOpen}
              onClose={() => setConfirmDialogOpen(false)}
              onConfirm={() => selectedId && handleDelete(selectedId)}
              title={`Are you sure you want to delete this ${itemName}?`}
              description={`This will permanently remove the ${itemName}.`}
            />
          </DndContext>
        </div>
      </TabsContent>
    </Tabs>
  );
}
