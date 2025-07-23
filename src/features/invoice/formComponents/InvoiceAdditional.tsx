import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { UseFormReturn } from "react-hook-form";
import type { FormValues } from "../invoice/CreateInvoicePS";

type Props = {
  form: UseFormReturn<FormValues>;
  companyObj: any;
};

export function InvoiceAdditional({ form, companyObj }: Props) {
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Bank Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormItem>
            <FormLabel>Bank Name</FormLabel>
            <FormControl>
              <Input
                value={companyObj?.companyBankDetails?.bankName}
                disabled
                readOnly
                className="bg-muted"
              />
            </FormControl>
          </FormItem>

          <FormItem>
            <FormLabel>Account Number</FormLabel>
            <FormControl>
              <Input
                value={companyObj?.companyBankDetails?.accNo}
                disabled
                readOnly
                className="bg-muted"
              />
            </FormControl>
            <FormMessage />
          </FormItem>

          <div className="grid grid-cols-2 gap-4">
            <FormItem>
              <FormLabel>IFSC Code</FormLabel>
              <FormControl>
                <Input
                  value={companyObj?.companyBankDetails?.ifsc}
                  disabled
                  readOnly
                  className="bg-muted"
                />
              </FormControl>
              <FormMessage />
            </FormItem>

            <FormItem>
              <FormLabel>Branch Name</FormLabel>
              <FormControl>
                <Input
                  value={companyObj?.companyBankDetails?.branchName}
                  disabled
                  readOnly
                  className="bg-muted"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Additional Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormField
            control={form.control}
            name="declaration"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Declaration</FormLabel>
                <FormControl>
                  <Textarea {...field} placeholder="Declaration statement" />
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
