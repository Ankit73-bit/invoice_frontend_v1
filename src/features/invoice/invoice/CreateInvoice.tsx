import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectItem,
  SelectContent,
} from "@/components/ui/select";
import { useClients } from "@/hooks/useClients";
import { useConsignees } from "@/hooks/useConsignees";
import { useCompanyContext } from "@/store/companyContextStore";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { SearchableSelect } from "@/features/components/SearchableSelect";

import { PDFViewer } from "@react-pdf/renderer";
import { InvoicePDF } from "@/features/templates/template1/InvoicePdf";

const schema = z.object({
  client: z.string(),
  consignee: z.string().optional(),
  date: z.string(),
  status: z.enum(["Pending", "Paid", "Overdue"]).default("Pending"),
  items: z.array(
    z.object({
      description: z.string(),
      quantity: z.coerce.number().min(1),
      unitPrice: z.string(),
      total: z.coerce.number(),
    })
  ),
});

type FormValues = z.infer<typeof schema>;

export default function CreateInvoice() {
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      client: "",
      consignee: "",
      date: new Date().toISOString().split("T")[0],
      status: "Pending",
      items: [{ description: "", quantity: 1, unitPrice: "", total: 0 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    name: "items",
    control: form.control,
  });

  const { clients } = useClients();
  const { consignees } = useConsignees();
  const { selectedCompanyId } = useCompanyContext();

  const onSubmit = async (values: FormValues) => {
    try {
      await api.post("/invoices", {
        ...values,
        company: selectedCompanyId,
      });
      toast.success("Invoice created");
      form.reset();
    } catch (err) {
      toast.error("Failed to create invoice");
    }
  };

  return (
    <>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <SearchableSelect
              label="Client Address"
              value={form.watch("client")}
              onChange={(val) => form.setValue("client", val)}
              items={clients.map((c) => ({
                label: c.clientCompanyName,
                value: c._id,
              }))}
              defaultToFirst
            />
          </div>
          <div>
            <SearchableSelect
              label="Consignee Address"
              value={form.watch("consignee")}
              onChange={(val) => form.setValue("consignee", val)}
              items={consignees.map((c) => ({
                label: c.consigneeCompanyName,
                value: c._id,
              }))}
              defaultToFirst
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Date</Label>
            <Input type="date" {...form.register("date")} />
          </div>
          <div>
            <Label>Status</Label>
            <Select
              value={form.watch("status")}
              onValueChange={(val) =>
                form.setValue("status", val as FormValues["status"])
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Paid">Paid</SelectItem>
                <SelectItem value="Overdue">Overdue</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-3">
          <Label>Items</Label>
          {fields.map((field, index) => (
            <div key={field.id} className="grid grid-cols-12 gap-2">
              <Input
                className="col-span-4"
                placeholder="Description"
                {...form.register(`items.${index}.description`)}
              />
              <Input
                className="col-span-2"
                type="number"
                placeholder="Qty"
                {...form.register(`items.${index}.quantity`, {
                  valueAsNumber: true,
                })}
              />
              <Input
                className="col-span-3"
                placeholder="Unit Price"
                {...form.register(`items.${index}.unitPrice`)}
              />
              <Input
                className="col-span-2"
                placeholder="Total"
                {...form.register(`items.${index}.total`, {
                  valueAsNumber: true,
                })}
              />
              <Button
                type="button"
                variant="destructive"
                onClick={() => remove(index)}
              >
                X
              </Button>
            </div>
          ))}
          <Button
            type="button"
            onClick={() =>
              append({ description: "", quantity: 1, unitPrice: "", total: 0 })
            }
          >
            Add Item
          </Button>
        </div>

        <Button type="submit">Submit Invoice</Button>
      </form>

      <PDFViewer width="100%" height={600}>
        <InvoicePDF invoice={form.watch()} />
      </PDFViewer>
    </>
  );
}
