import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import type { UseFormReturn, FieldArrayWithId } from "react-hook-form";
import type { FormValues } from "../invoice/CreateInvoiceBase";

type Props = {
  form: UseFormReturn<FormValues>;
  fields: FieldArrayWithId<FormValues, "items", "id">[];
  append: (item: any) => void;
  remove: (index: number) => void;
  manualTotalIndexes: number[];
  setManualTotalIndexes: React.Dispatch<React.SetStateAction<number[]>>;
  updateItemTotal: (
    index: number,
    quantityOverride?: number,
    unitPriceOverride?: string
  ) => void;
  calculatedTotals: { totalBeforeGST: number };
};

export function InvoiceItems({
  form,
  fields,
  append,
  remove,
  manualTotalIndexes,
  setManualTotalIndexes,
  updateItemTotal,
  calculatedTotals,
}: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Invoice Items ({fields.length})
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              append({
                description: "",
                hsnCode: "",
                quantity: 1,
                unitPrice: "0",
                total: "0",
              })
            }
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Item
          </Button>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        <FormField
          control={form.control}
          name="note"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Additional notes or comments"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-2">
          {/* Header Row (Desktop) */}
          <div className="hidden md:grid grid-cols-12 gap-4 p-3 bg-muted/50 rounded-lg text-sm font-medium">
            <div className="col-span-4">Description</div>
            <div className="col-span-2">HSN Code</div>
            <div className="col-span-1">Qty</div>
            <div className="col-span-2">Unit Price</div>
            <div className="col-span-2">Total</div>
            <div className="col-span-1">Action</div>
          </div>

          {/* Item Rows */}
          <div className="space-y-2">
            {fields.map((field, index) => (
              <div
                key={field.id}
                className="group border rounded-lg p-4 hover:bg-muted/30 transition-colors"
              >
                <div className="grid grid-cols-12 gap-4 items-start">
                  <div className="col-span-4">
                    <FormField
                      control={form.control}
                      name={`items.${index}.description`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Textarea
                              {...field}
                              placeholder="Item description"
                              className="min-h-[40px] resize-none"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="col-span-2">
                    <FormField
                      control={form.control}
                      name={`items.${index}.hsnCode`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input {...field} placeholder="HSN" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="col-span-1">
                    <FormField
                      control={form.control}
                      name={`items.${index}.quantity`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              type="text"
                              {...field}
                              onChange={(e) => {
                                const val = parseInt(e.target.value) || 0;
                                field.onChange(val);
                                updateItemTotal(index, val);
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="col-span-2">
                    <FormField
                      control={form.control}
                      name={`items.${index}.unitPrice`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="0.00"
                              onChange={(e) => {
                                const val = e.target.value;
                                field.onChange(val);
                                updateItemTotal(index, undefined, val);
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="col-span-2">
                    <FormField
                      control={form.control}
                      name={`items.${index}.total`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              {...field}
                              value={field.value ?? "0"}
                              onChange={(e) => {
                                field.onChange(e.target.value);
                                if (!manualTotalIndexes.includes(index)) {
                                  setManualTotalIndexes((prev) => [
                                    ...prev,
                                    index,
                                  ]);
                                }
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="col-span-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => remove(index)}
                      disabled={fields.length === 1}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Subtotal Preview */}
        <div className="mt-4 p-4 bg-muted/30 rounded-lg text-right font-medium">
          Subtotal: ₹{calculatedTotals.totalBeforeGST.toFixed(2)}
        </div>

        {/* Bulk Actions */}
        {fields.length > 1 && (
          <div className="flex justify-between pt-4 border-t">
            <div className="text-sm text-muted-foreground">
              {fields.length} items added
            </div>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  const itemsToRemove = fields.length - 1;
                  for (let i = 0; i < itemsToRemove; i++) {
                    remove(fields.length - 1 - i);
                  }
                }}
              >
                Clear All
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  append({
                    description: "",
                    hsnCode: "",
                    quantity: 1,
                    unitPrice: "0",
                    total: "0",
                  })
                }
              >
                <Plus className="h-4 w-4 mr-1" />
                Quick Add
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
