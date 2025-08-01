import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import type { UseFormReturn } from "react-hook-form";
import type { FormValues } from "../invoice/CreateInvoiceBase";

type Props = {
  form: UseFormReturn<FormValues>;
};

export function InvoiceHRDetails({ form }: Props) {
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>HR Description</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="hrDescription.year"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Year</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="2024" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="hrDescription.month"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Month</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="January" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="hrDescription.hrCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>HR Code</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="HR code" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="hrDescription.hrName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>HR Name</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="HR representative name" />
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
