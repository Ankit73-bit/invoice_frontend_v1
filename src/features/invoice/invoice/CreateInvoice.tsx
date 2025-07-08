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
import { PDFDownloadLink } from "@react-pdf/renderer";

import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose,
} from "@/components/ui/drawer";

import { DatePicker } from "@/features/components/DatePicker";
import { InvoicePDF } from "@/features/templates/template1/InvoicePDF";
import type { Invoice } from "@/store/invoiceStore";
import { useCompanies } from "@/hooks/useCompanies";
import { useAuthStore } from "@/store/authStore";

const schema = z.object({
  invoiceNo: z.string(),
  company: z.string(),
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
  const { clients } = useClients();
  const { consignees } = useConsignees();
  const { companies } = useCompanies();
  const { user } = useAuthStore();
  const { selectedCompanyId } = useCompanyContext();

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

  const clientObj = clients.find((c) => c._id === form.watch("client"));
  const consigneeObj = consignees.find(
    (c) => c._id === form.watch("consignee")
  );

  const companyObj = companies.find((c) => {
    if (user?.role === "admin") {
      return c._id === selectedCompanyId;
    } else {
      return c._id === user?.company?._id;
    }
  });

  const { fields, append, remove } = useFieldArray({
    name: "items",
    control: form.control,
  });

  const onSubmit = async (values: FormValues) => {
    try {
      await api.post("/invoices", {
        ...values,
        company: selectedCompanyId,
      });
      toast.success("Invoice created");
      console.log(values);
      form.reset();
    } catch (err) {
      toast.error("Failed to create invoice");
    }
  };

  const handlePreview = () => {
    const values = form.getValues();
    const invoice: Invoice = {
      ...values,
      _id: "temp-id",
      status: "Pending",
      createdAt: new Date().toISOString(),
      invoiceNo: "TEMP-INV",
      client: clientObj,
      consignee: consigneeObj,
      company: companyObj,
    };
    // console.log("Previewing Invoice:", invoice);
  };

  return (
    <div className="space-y-6 px-6 py-4 bg-card m-4 rounded-md">
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Company</Label>
            <Select value={form.watch("company")}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select a fruit" />
              </SelectTrigger>
            </Select>
          </div>
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
            <DatePicker
              label="Invoice Date"
              value={form.watch("date")}
              onChange={(val) => form.setValue("date", val)}
            />
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

        <Drawer>
          <DrawerTrigger asChild>
            <Button variant="outline" onClick={handlePreview}>
              Preview Invoice
            </Button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Invoice Preview</DrawerTitle>
              <DrawerDescription>
                Review your invoice before final submission or download.
              </DrawerDescription>
            </DrawerHeader>

            {/* PDF Preview */}
            <div className="h-[80vh] overflow-hidden border rounded-md">
              <PDFViewer width="100%" height="100%">
                <InvoicePDF invoice={form.getValues()} />
              </PDFViewer>
            </div>

            <DrawerFooter>
              {/* Download PDF */}
              <PDFDownloadLink
                document={<InvoicePDF invoice={form.getValues()} />}
                fileName={`invoice-${form.watch("invoiceNo") || "draft"}.pdf`}
              >
                {({ loading }) => (
                  <Button variant="secondary">
                    {loading ? "Preparing..." : "Download PDF"}
                  </Button>
                )}
              </PDFDownloadLink>

              {/* Submit */}
              <Button onClick={form.handleSubmit(onSubmit)}>
                Submit Invoice
              </Button>

              {/* Cancel */}
              <DrawerClose asChild>
                <Button variant="outline">Cancel</Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </form>
    </div>
  );
}
