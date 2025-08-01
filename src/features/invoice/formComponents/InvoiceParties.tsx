// components/invoice/InvoiceParties.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { DatePicker } from "@/features/components/DatePicker";
import type { UseFormReturn } from "react-hook-form";
import { ClientSelect } from "../invoice/ClientSelect";
import { ConsigneeSelect } from "../invoice/ConsigneeSelect";
import type { FormValues } from "../invoice/CreateInvoiceBase";
import type { Client, Consignee } from "@/lib/types";

type Props = {
  form: UseFormReturn<FormValues>;
  clients: Client[];
  consignees: Consignee[];
};

export function InvoiceParties({ form, clients, consignees }: Props) {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Client Details</CardTitle>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="client"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select Client</FormLabel>
                  <FormControl>
                    <ClientSelect
                      clients={clients}
                      value={field.value}
                      onValueChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Consignee Details</CardTitle>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="consignee"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select Consignee</FormLabel>
                  <FormControl>
                    <ConsigneeSelect
                      consignees={consignees}
                      value={field.value}
                      onValueChange={field.onChange}
                      placeholder="Search and select consignee (optional)..."
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Received Data From</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormField
            control={form.control}
            name="dataFrom"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Data From</FormLabel>
                <FormControl>
                  <Textarea {...field} placeholder="Data description" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Dispatch Details</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="detailsSchema.dispatchDetails.dispatchNo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Dispatch Number</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Optional" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="detailsSchema.dispatchDetails.date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Dispatch Date</FormLabel>
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
            name="detailsSchema.dispatchDetails.through"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Dispatch Through</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Transport method" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="detailsSchema.dispatchDetails.destination"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Destination</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Delivery destination" />
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
