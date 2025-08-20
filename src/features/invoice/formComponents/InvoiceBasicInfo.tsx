// components/invoice/InvoiceBasicInfo.tsx
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
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
import { DatePicker } from "@/features/components/DatePicker";
import type { UseFormReturn } from "react-hook-form";
import type { FormValues } from "../invoice/CreateInvoiceBase";

type Props = {
  form: UseFormReturn<FormValues>;
};

export function InvoiceBasicInfo({ form }: Props) {
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Invoice Details</CardTitle>
          <CardDescription>Basic invoice information</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="invoiceNo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Invoice Number</FormLabel>
                <FormControl>
                  <Input {...field} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Invoice Date</FormLabel>
                <FormControl>
                  <DatePicker
                    date={field.value ? new Date(field.value) : undefined}
                    onChange={(selectedDate) =>
                      field.onChange(selectedDate ?? null)
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="details.dueDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Due Date</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="15 Days" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="financialYear"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Financial Year</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="2024-25" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="details.referenceNo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Reference No</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Optional" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="details.referenceDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Reference Date</FormLabel>
                <FormControl>
                  <DatePicker
                    date={field.value}
                    onChange={(selectedDate) =>
                      field.onChange(selectedDate ?? undefined)
                    }
                    placeholder="Pick a date"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Paid">Paid</SelectItem>
                    <SelectItem value="Overdue">Overdue</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="details.otherReferences"
            render={({ field }) => (
              <FormItem className="md:col-span-3">
                <FormLabel>References</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="References" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Purchase & Delivery Details</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="details.purchaseNo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Purchase Order No</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Optional" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="details.purchaseDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Purchase Date</FormLabel>
                <FormControl>
                  <DatePicker
                    date={field.value}
                    onChange={(selectedDate) =>
                      field.onChange(selectedDate ?? undefined)
                    }
                    placeholder="Pick a date"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="details.termsOfDelivery"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>Terms of Delivery</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Delivery terms" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>
    </>
  );
}
