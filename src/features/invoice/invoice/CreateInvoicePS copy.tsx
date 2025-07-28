import { useForm, useFieldArray, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FileText } from "lucide-react";
import { useState, useEffect, useMemo } from "react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form } from "@/components/ui/form";

import type * as z from "zod";
import { invoiceSchema } from "./invoiceSchema";
import { useClients } from "@/hooks/useClients";
import { useConsignees } from "@/hooks/useConsignees";
import { useCompanies } from "@/hooks/useCompanies";
import { useAuthStore } from "@/store/authStore";
import { useCompanyContext } from "@/store/companyContextStore";
import { api } from "@/lib/api";
import { InvoicePreviewDialog } from "@/features/components/InvoicePreviewDialog";

import { ConvertToWords } from "@/features/utils/ConvertToWords";
import ClientItems from "../client/ClientItems";
import AccordionSection from "@/features/components/Accordian";
import { InvoiceBasicInfo } from "../formComponents/InvoiceBasicInfo";
import { InvoiceParties } from "../formComponents/InvoiceParties";
import { InvoiceItems } from "../formComponents/InvoiceItems";
import { InvoiceGSTTotals } from "../formComponents/InvoiceGSTTotals";
import { InvoiceAdditional } from "../formComponents/InvoiceAdditional";
import { toast } from "react-toastify";
import { downloadInvoicePDF } from "@/lib/utils";
import { InvoicePDFPS } from "@/features/templates/templateps/InvoicePDFPS";
import { useNavigate, useParams } from "react-router-dom";
import { useInvoiceAPI } from "@/hooks/apiIntegration";

export type FormValues = z.infer<typeof invoiceSchema>;

export default function CreateInvoicePS() {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [templatesOpen, setTemplatesOpen] = useState(false);
  const [manualTotalIndexes, setManualTotalIndexes] = useState<number[]>([]);

  const { clients } = useClients();
  const { consignees } = useConsignees();
  const { companies } = useCompanies();
  const { user } = useAuthStore();
  const { selectedCompanyId } = useCompanyContext();
  const { createInvoice, updateInvoice, getNextInvoiceNumber } =
    useInvoiceAPI();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);

  const companyObj = companies.find((c) => {
    if (user?.role === "admin") {
      return c._id === selectedCompanyId;
    } else {
      return c._id === user?.company?._id;
    }
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: {
      invoiceNo: "INV/25-26/001",
      date: new Date(),
      financialYear: "25-26",
      status: "Pending",
      client: "",
      consignee: "",
      detailsSchema: {},
      hrDescription: {
        year: "",
        month: "",
        hrCode: "",
        hrName: "",
      },
      company: "",
      items: [
        {
          description: "",
          hsnCode: "",
          quantity: 1,
          unitPrice: "0",
          total: "0",
        },
      ],
      gstDetails: {
        type: "CGST",
        cgstRate: 9,
        sgstRate: 9,
        fuelSurchargeRate: 0,
      },
      note: "TDS Not applicable on postal reimbursement charges",
      declaration:
        "We declare that this Invoice shows the actual price of the Goods described and that all particulars are true and correct.",
      roundingOff: 0,
      createdBy: "",
    },
  });

  const { fields, append, remove } = useFieldArray({
    name: "items",
    control: form.control,
  });

  useEffect(() => {
    if (!selectedCompanyId) return;

    const fetchInvoiceNo = async () => {
      try {
        const res = await api.get(
          `/invoices/next-invoice-number?companyId=${selectedCompanyId}`
        );
        form.setValue("invoiceNo", res.data.invoiceNumber);
      } catch (err) {
        console.error("Failed to fetch invoice number", err);
      }
    };

    fetchInvoiceNo();
  }, [selectedCompanyId]);

  const clientObj = clients.find((c) => c._id === form.watch("client"));
  const consigneeObj = consignees.find(
    (c) => c._id === form.watch("consignee")
  );

  const watchedItems = useWatch({ control: form.control, name: "items" });
  const gst = useWatch({ control: form.control, name: "gstDetails" });

  const calculatedTotals = useMemo(() => {
    const totalBeforeGST = watchedItems.reduce((sum, item) => {
      const total = Number.parseFloat(item.total || "0");
      return sum + (isNaN(total) ? 0 : total);
    }, 0);

    const gstType = gst.type;
    const cgstRate =
      gstType === "CGST" ? Number.parseFloat(gst.cgstRate || "0") : 0;
    const sgstRate =
      gstType === "CGST" ? Number.parseFloat(gst.sgstRate || "0") : 0;
    const igstRate =
      gstType === "IGST" ? Number.parseFloat(gst.igstRate || "0") : 0;
    const fuelRate = Number.parseFloat(gst.fuelSurchargeRate || "0");

    const cgstAmount = (totalBeforeGST * cgstRate) / 100;
    const sgstAmount = (totalBeforeGST * sgstRate) / 100;
    const igstAmount = (totalBeforeGST * igstRate) / 100;
    const fuelSurchargeAmount = (totalBeforeGST * fuelRate) / 100;

    const totalGSTAmount =
      cgstAmount + sgstAmount + igstAmount + fuelSurchargeAmount;
    const totalAmount = totalBeforeGST + totalGSTAmount;

    const grossAmount = Math.round(totalAmount);
    const roundingOff = Number.parseFloat(
      (grossAmount - totalAmount).toFixed(2)
    );

    return {
      totalBeforeGST,
      cgstAmount,
      sgstAmount,
      igstAmount,
      fuelSurchargeAmount,
      totalGSTAmount,
      totalAmount,
      roundingOff,
      grossAmount,
    };
  }, [watchedItems, gst]);

  useEffect(() => {
    const current = form.getValues();

    const safeSet = (path: keyof FormValues | string, newValue: T) => {
      const currentValue = current[path as keyof typeof current];
      if (currentValue !== newValue) {
        form.setValue(path as any, newValue as any);
      }
    };

    safeSet("totalBeforeGST", calculatedTotals.totalBeforeGST);
    safeSet("grossAmount", calculatedTotals.grossAmount);
    safeSet("roundingOff", calculatedTotals.roundingOff);

    const gstType = current.gstDetails?.type;
    if (gstType === "CGST") {
      safeSet("gstDetails.cgst", calculatedTotals.cgstAmount);
      safeSet("gstDetails.sgst", calculatedTotals.sgstAmount);
      safeSet("gstDetails.igst", 0);
    } else if (gstType === "IGST") {
      safeSet("gstDetails.igst", calculatedTotals.igstAmount);
      safeSet("gstDetails.cgst", 0);
      safeSet("gstDetails.sgst", 0);
    } else if (gstType === "None") {
      safeSet("gstDetails.cgst", 0);
      safeSet("gstDetails.sgst", 0);
      safeSet("gstDetails.igst", 0);
    }

    safeSet("gstDetails.fuelSurcharge", calculatedTotals.fuelSurchargeAmount);
    safeSet("gstDetails.totalGstAmount", calculatedTotals.totalGSTAmount);
    safeSet("gstDetails.totalAmount", calculatedTotals.totalAmount);

    const newInWords = ConvertToWords(calculatedTotals.grossAmount);
    if (current.inWords !== newInWords) {
      form.setValue("inWords", newInWords);
    }
  }, [JSON.stringify(calculatedTotals)]);

  // Handle CGST rate change to sync SGST
  const handleCGSTRateChange = (value: string) => {
    const rate = Number.parseFloat(value);
    form.setValue("gstDetails.cgstRate", rate);
    form.setValue("gstDetails.sgstRate", rate); // Auto-sync SGST with CGST
  };

  // Handle GST type change
  const handleGSTTypeChange = (value: string) => {
    // Reset all GST values first
    form.setValue("gstDetails.cgst", 0);
    form.setValue("gstDetails.sgst", 0);
    form.setValue("gstDetails.igst", 0);

    // Set the new type
    form.setValue("gstDetails.type", value);

    // Set default rates based on type
    if (value === "CGST") {
      form.setValue("gstDetails.cgstRate", 9);
      form.setValue("gstDetails.sgstRate", 9);
      form.setValue("gstDetails.igstRate", 0);
    } else if (value === "IGST") {
      form.setValue("gstDetails.igstRate", 18); // Default to 18%
      form.setValue("gstDetails.cgstRate", 0);
      form.setValue("gstDetails.sgstRate", 0);
    } else if (value === "None") {
      form.setValue("gstDetails.cgstRate", 0);
      form.setValue("gstDetails.sgstRate", 0);
      form.setValue("gstDetails.igstRate", 0);
    }
  };

  // Update item totals when quantity or unit price changes
  const updateItemTotal = (
    index: number,
    quantityOverride?: number,
    unitPriceOverride?: string
  ) => {
    const quantity =
      quantityOverride ?? Number(watchedItems[index]?.quantity || 0);
    const unitPriceRaw =
      unitPriceOverride ?? watchedItems[index]?.unitPrice?.trim();

    if (!unitPriceRaw || unitPriceRaw === "-") {
      if (!manualTotalIndexes.includes(index)) {
        setManualTotalIndexes((prev) => [...prev, index]);
      }
      return;
    }

    if (manualTotalIndexes.includes(index)) {
      setManualTotalIndexes((prev) => prev.filter((i) => i !== index));
    }

    const price = Number.parseFloat(unitPriceRaw);
    if (!isNaN(price)) {
      const total = quantity * price;
      form.setValue(`items.${index}.total`, total.toFixed(2));
    }
  };

  useEffect(() => {
    const fetchInvoiceToEdit = async () => {
      if (!id) return;
      try {
        const res = await api.get(`/invoices/${id}`);
        const invoiceData = res.data.data;
        console.log(invoiceData);

        form.reset({
          ...invoiceData,
          client: invoiceData.client?._id ?? "",
          consignee: invoiceData.consignee?._id ?? "",
          date: new Date(invoiceData.date),
          company: invoiceData.company?._id ?? selectedCompanyId,
          items: invoiceData.items.map((item: any) => ({
            ...item,
            hsnCode: item.hsnCode ?? "",
            unitPrice:
              item.unitPrice === "-" ? "-" : item.unitPrice?.toString() || "0",
            quantity: Number(item.quantity),
            total: item.total?.toString() || "0",
          })),
        });
      } catch (error) {
        console.error("Failed to fetch invoice for editing", error);
        toast.error("Failed to load invoice");
      }
    };

    fetchInvoiceToEdit();
  }, [id]);

  const onSubmit = async (values: FormValues) => {
    try {
      const cleanedItems = values.items.map((item) => {
        const isManual = item.unitPrice.trim() === "-";
        return {
          ...item,
          unitPrice: isManual ? "-" : Number.parseFloat(item.unitPrice),
          quantity: Number(item.quantity),
          total: Number(item.total),
        };
      });

      const payload = {
        ...values,
        company: selectedCompanyId,
        items: cleanedItems,
        createdBy: user,
      };

      if (isEditing && id) {
        await updateInvoice(id, payload); // ✅ USE YOUR API FUNCTION HERE
        toast.success("Invoice updated successfully!");
        navigate("invoices/dashboard");
      } else {
        await createInvoice(payload); // ✅ Only create if not editing
        toast.success("Invoice created successfully!");
      }

      // Refresh form and download
      const invoiceNo = await getNextInvoiceNumber(selectedCompanyId);

      form.reset({
        invoiceNo,
        date: new Date(),
        financialYear: values.financialYear,
        status: "Pending",
        client: "",
        consignee: "",
        detailsSchema: {},
        hrDescription: {
          year: "",
          month: "",
          hrCode: "",
          hrName: "",
        },
        company: selectedCompanyId ?? "",
        items: [
          {
            description: "",
            hsnCode: "",
            quantity: 1,
            unitPrice: "0",
            total: "0",
          },
        ],
        gstDetails: {
          type: "CGST",
          cgstRate: 9,
          sgstRate: 9,
          fuelSurchargeRate: 0,
          cgst: 0,
          sgst: 0,
          igst: 0,
          fuelSurcharge: 0,
          totalGstAmount: 0,
          totalAmount: 0,
        },
        roundingOff: 0,
        grossAmount: 0,
        totalBeforeGST: 0,
        inWords: "",
        note: "TDS Not applicable on postal reimbursement charges",
        declaration:
          "We declare that this Invoice shows the actual price of the Goods described and that all particulars are true and correct.",
        createdBy: "",
      });

      await downloadInvoicePDF(
        <InvoicePDFPS
          invoice={{ ...values, items: cleanedItems }}
          company={companyObj}
          client={clientObj}
          consignee={consigneeObj}
        />,
        `${values.invoiceNo}.pdf`
      );
    } catch (error) {
      console.error("Failed to submit invoice:", error);
      toast.error("Failed to submit invoice");
    }
  };

  useEffect(() => {
    const grossAmount = calculatedTotals.grossAmount;
    if (grossAmount > 0) {
      form.setValue("inWords", `${ConvertToWords(grossAmount)}`);
    }
  }, [calculatedTotals.grossAmount, form]);

  const handleTemplateSelect = (template: any) => {
    // Apply template settings to form
    form.setValue("gstDetails.type", template.gstConfig.defaultType);
    if (template.gstConfig.defaultType === "CGST") {
      form.setValue("gstDetails.cgstRate", template.gstConfig.rates[0] / 2);
      form.setValue("gstDetails.sgstRate", template.gstConfig.rates[0] / 2);
    } else if (template.gstConfig.defaultType === "IGST") {
      form.setValue("gstDetails.igstRate", template.gstConfig.rates[0]);
    }
    form.setValue("declaration", template.defaultTerms);
    setTemplatesOpen(false);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <AccordionSection title="Client Items">
        <ClientItems
          clientId={clientObj?._id}
          onItemSelect={(item) => append(item)}
          onBulkSelect={(items) => items.forEach((i) => append(i))}
          selectedItems={fields}
        />
      </AccordionSection>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            {isEditing ? "Edit Invoice" : "Create Invoice"}
          </h1>

          <p className="text-muted-foreground">
            Generate a new invoice for your client
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* <Dialog open={templatesOpen} onOpenChange={setTemplatesOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Template className="h-4 w-4 mr-2" />
                Templates
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Choose Invoice Template</DialogTitle>
                <DialogDescription>
                  Select a template that matches your business type
                </DialogDescription>
              </DialogHeader>
              <InvoiceTemplates onSelectTemplate={handleTemplateSelect} />
            </DialogContent>
          </Dialog> */}
          <Badge variant="outline" className="text-lg px-3 py-1">
            {form.watch("invoiceNo")}
          </Badge>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="parties">Parties</TabsTrigger>
              <TabsTrigger value="items">Items</TabsTrigger>
              <TabsTrigger value="gst">GST & Totals</TabsTrigger>
              <TabsTrigger value="additional">Additional</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-6">
              <InvoiceBasicInfo form={form} />
            </TabsContent>

            <TabsContent value="parties" className="space-y-6">
              <InvoiceParties
                form={form}
                clients={clients}
                consignees={consignees}
              />
            </TabsContent>

            <TabsContent value="items" className="space-y-6">
              <InvoiceItems
                form={form}
                fields={fields}
                append={append}
                remove={remove}
                manualTotalIndexes={manualTotalIndexes}
                setManualTotalIndexes={setManualTotalIndexes}
                updateItemTotal={updateItemTotal}
                calculatedTotals={calculatedTotals}
              />
            </TabsContent>

            <TabsContent value="gst" className="space-y-6">
              <InvoiceGSTTotals
                form={form}
                calculatedTotals={calculatedTotals}
                handleGSTTypeChange={handleGSTTypeChange}
                handleCGSTRateChange={handleCGSTRateChange}
              />
            </TabsContent>

            <TabsContent value="additional" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
                <InvoiceAdditional form={form} companyObj={companyObj} />
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-between items-center pt-6 border-t">
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setPreviewOpen(true)}
              >
                <FileText className="h-4 w-4 mr-2" />
                Preview Invoice
              </Button>
            </div>

            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => form.reset()}
              >
                Reset Form
              </Button>
              <Button type="submit" className="min-w-[120px]">
                {isEditing ? "Update Invoice" : "Create Invoice"}
              </Button>
            </div>
          </div>
        </form>
      </Form>

      <InvoicePreviewDialog
        open={previewOpen}
        onOpenChange={setPreviewOpen}
        invoice={{
          ...form.getValues(),
          items: form.getValues().items.map((item) => ({
            ...item,
            quantity: Number(item.quantity),
            unitPrice:
              item.unitPrice === "-" ? "-" : Number.parseFloat(item.unitPrice),
            total: Number.parseFloat(item.total), // 👈 Ensure this is a number
          })),
        }}
        company={companyObj}
        client={clientObj}
        consignee={consigneeObj}
      />
    </div>
  );
}
