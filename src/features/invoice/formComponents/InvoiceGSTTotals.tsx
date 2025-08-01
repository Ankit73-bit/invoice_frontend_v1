// components/invoice/InvoiceGSTTotals.tsx
import { Calculator } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  CGST_OPTIONS,
  IGST_OPTIONS,
  FUEL_SURCHARGE_OPTIONS,
} from "@/features/utils/constant";
import type { UseFormReturn } from "react-hook-form";
import type { FormValues } from "../invoice/CreateInvoiceBase";

type Props = {
  form: UseFormReturn<FormValues>;
  calculatedTotals: any;
  handleGSTTypeChange: (value: string) => void;
  handleCGSTRateChange: (value: string) => void;
};

export function InvoiceGSTTotals({
  form,
  calculatedTotals,
  handleGSTTypeChange,
  handleCGSTRateChange,
}: Props) {
  const gstType = form.watch("gstDetails.type");

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>GST Configuration</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* GST Type */}
          <FormField
            control={form.control}
            name="gstDetails.type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>GST Type</FormLabel>
                <Select onValueChange={handleGSTTypeChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select GST type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="CGST">CGST + SGST</SelectItem>
                    <SelectItem value="IGST">IGST</SelectItem>
                    <SelectItem value="None">No GST</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Fuel Surcharge */}
          <FormField
            control={form.control}
            name="gstDetails.fuelSurchargeRate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fuel Surcharge Rate (%)</FormLabel>
                <Select
                  onValueChange={(value) => field.onChange(Number(value))}
                  value={field.value?.toString()}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select rate" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {FUEL_SURCHARGE_OPTIONS.map((rate) => (
                      <SelectItem key={rate} value={rate.toString()}>
                        {rate}%
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* CGST / SGST */}
          {gstType === "CGST" && (
            <>
              <FormField
                control={form.control}
                name="gstDetails.cgstRate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CGST Rate (%)</FormLabel>
                    <Select
                      onValueChange={handleCGSTRateChange}
                      value={field.value?.toString()}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select rate" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {CGST_OPTIONS.map((rate) => (
                          <SelectItem key={rate} value={rate.toString()}>
                            {rate}%
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="gstDetails.sgstRate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>SGST Rate (%)</FormLabel>
                    <FormControl>
                      <Input {...field} disabled className="bg-muted" />
                    </FormControl>
                  </FormItem>
                )}
              />
            </>
          )}

          {/* IGST */}
          {gstType === "IGST" && (
            <FormField
              control={form.control}
              name="gstDetails.igstRate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>IGST Rate (%)</FormLabel>
                  <Select
                    onValueChange={(val) => field.onChange(Number(val))}
                    value={field.value?.toString()}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select rate" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {IGST_OPTIONS.map((rate) => (
                        <SelectItem key={rate} value={rate.toString()}>
                          {rate}%
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calculator className="h-5 w-5 mr-2" />
            Invoice Totals
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left: Subtotal + GST */}
            <div className="space-y-6">
              <div className="p-4 bg-muted/30 rounded-lg">
                <FormField
                  control={form.control}
                  name="totalBeforeGST"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subtotal (Before GST)</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          disabled
                          className="bg-background text-lg font-medium"
                          value={`₹${calculatedTotals.totalBeforeGST.toFixed(
                            2
                          )}`}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              {/* GST Breakdown */}
              {gstType !== "None" && (
                <div className="space-y-4 border p-4 rounded-lg">
                  {gstType === "CGST" && (
                    <>
                      <ReadOnlyAmount
                        label={`CGST (${
                          form.watch("gstDetails.cgstRate") || 0
                        }%)`}
                        amount={calculatedTotals.cgstAmount}
                      />
                      <ReadOnlyAmount
                        label={`SGST (${
                          form.watch("gstDetails.sgstRate") || 0
                        }%)`}
                        amount={calculatedTotals.sgstAmount}
                      />
                    </>
                  )}
                  {gstType === "IGST" && (
                    <ReadOnlyAmount
                      label={`IGST (${
                        form.watch("gstDetails.igstRate") || 0
                      }%)`}
                      amount={calculatedTotals.igstAmount}
                    />
                  )}
                  {calculatedTotals.fuelSurchargeAmount > 0 && (
                    <ReadOnlyAmount
                      label={`Fuel Surcharge (${form.watch(
                        "gstDetails.fuelSurchargeRate"
                      )}%)`}
                      amount={calculatedTotals.fuelSurchargeAmount}
                    />
                  )}
                  <ReadOnlyAmount
                    label="Total GST + Surcharge"
                    amount={calculatedTotals.totalGSTAmount}
                    bold
                  />
                </div>
              )}
            </div>

            {/* Right: Grand Total */}
            <div className="space-y-4">
              <div className="border p-4 rounded-lg space-y-3">
                <ReadOnlyAmount
                  label="Total Amount (with GST + Fuel)"
                  amount={calculatedTotals.totalAmount}
                />
                <ReadOnlyAmount
                  label="Rounding Off"
                  amount={calculatedTotals.roundingOff}
                />
                <ReadOnlyAmount
                  label="Gross Amount (Rounded)"
                  amount={calculatedTotals.grossAmount}
                  highlight
                />
              </div>
              <FormField
                control={form.control}
                name="inWords"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount in Words</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        className="text-sm bg-muted/50 border-dashed"
                        readOnly
                        rows={3}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function ReadOnlyAmount({
  label,
  amount,
  bold = false,
  highlight = false,
}: {
  label: string;
  amount: number;
  bold?: boolean;
  highlight?: boolean;
}) {
  return (
    <div
      className={`flex justify-between text-sm ${
        highlight ? "bg-primary/10 p-2 rounded" : ""
      }`}
    >
      <span className={bold ? "font-semibold" : ""}>{label}</span>
      <span className={bold || highlight ? "font-semibold" : ""}>
        ₹{amount?.toFixed(2) ?? "0.00"}
      </span>
    </div>
  );
}
