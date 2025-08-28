import {
  useForm,
  useFieldArray,
  useWatch,
  type SubmitHandler,
} from "react-hook-form";
import { useState, useEffect, useMemo } from "react";
import { FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form } from "@/components/ui/form";
import AccordionSection from "@/features/components/Accordian";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { api } from "@/lib/api";
import { downloadInvoicePDF } from "@/lib/utils";

import { ConvertToWords } from "@/features/utils/ConvertToWords";
import { useClients } from "@/hooks/useClients";
import { useConsignees } from "@/hooks/useConsignees";
import { useCompanies } from "@/hooks/useCompanies";
import { useCompanyContext } from "@/store/companyContextStore";
import { useAuthStore } from "@/store/authStore";
import { useInvoiceAPI } from "@/hooks/apiIntegration";

import { InvoicePreviewDialog } from "@/features/components/InvoicePreviewDialog";
import { InvoiceBasicInfo } from "../formComponents/InvoiceBasicInfo";
import { InvoiceParties } from "../formComponents/InvoiceParties";
import { InvoiceItems } from "../formComponents/InvoiceItems";
import { InvoiceGSTTotals } from "../formComponents/InvoiceGSTTotals";
import { InvoiceAdditional } from "../formComponents/InvoiceAdditional";
import { InvoiceHRDetails } from "../formComponents/InvoiceHRDetails";
import ClientItems from "../client/ClientItems";

import { invoiceSchema } from "./invoiceSchema";
import type * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { calculateInvoiceTotals } from "@/features/utils/calculateInvoiceTotals";
import {
  handleCGSTRateChange,
  handleGSTTypeChange,
} from "@/features/utils/invoiceHelpers";
import { getCompanyDefaultFormValues } from "./defaultFormValuesMap";

export type FormValues = z.infer<typeof invoiceSchema>;

interface CreateInvoiceBaseProps {
  invoiceType: "PP" | "PS";
  PDFTemplate: React.FC<any>;
  showHRSection?: boolean;
}

export function CreateInvoiceBase({
  PDFTemplate,
  showHRSection = false,
}: CreateInvoiceBaseProps) {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [manualTotalIndexes, setManualTotalIndexes] = useState<number[]>([]);
  const { clients } = useClients();
  const { consignees } = useConsignees();
  const { companies } = useCompanies();
  const { selectedCompanyId } = useCompanyContext();
  const { user } = useAuthStore();
  const { createInvoice, updateInvoice, getNextInvoiceNumber } =
    useInvoiceAPI();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);

  const companyObj = companies.find((c) =>
    user?.role === "admin"
      ? c._id === selectedCompanyId
      : c._id === user?.company?._id
  );

  const form = useForm<FormValues>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: {
      invoiceNo: "INV/25-26/001",
      date: new Date(),
      company: selectedCompanyId ?? "",
      details: {
        referenceNo: "",
        referenceDate: undefined,
        otherReferences: "",
        purchaseNo: "",
        purchaseDate: undefined,
        termsOfDelivery: "",
        dueDate: "",
        dispatchDetails: {
          dispatchNo: "",
          date: undefined,
          through: "",
          destination: "",
        },
      },
      ...getCompanyDefaultFormValues(selectedCompanyId),
    },
  });

  const { fields, append, remove } = useFieldArray({
    name: "items",
    control: form.control,
  });

  const clientObj = clients.find((c) => c._id === form.watch("client"));
  const consigneeObj = consignees.find(
    (c) => c._id === form.watch("consignee")
  );
  const watchedItems = useWatch({ control: form.control, name: "items" });
  const gst = useWatch({ control: form.control, name: "gstDetails" });

  const calculatedTotals = useMemo(
    () => calculateInvoiceTotals(watchedItems, gst),
    [watchedItems, gst]
  );

  // Sync totals to form
  // In CreateInvoiceBase.tsx, update the useEffect to handle GST changes
  useEffect(() => {
    form.setValue("totalBeforeGST", calculatedTotals.totalBeforeGST);
    form.setValue("grossAmount", calculatedTotals.grossAmount);
    form.setValue("roundingOff", calculatedTotals.roundingOff);

    const gstType = form.getValues().gstDetails?.type;
    form.setValue("gstDetails", {
      ...form.getValues().gstDetails,
      cgst: gstType === "CGST" ? calculatedTotals.cgstAmount : 0,
      sgst: gstType === "CGST" ? calculatedTotals.sgstAmount : 0,
      igst: gstType === "IGST" ? calculatedTotals.igstAmount : 0,
      fuelSurcharge: calculatedTotals.fuelSurchargeAmount,
      totalGstAmount: calculatedTotals.totalGSTAmount,
      totalAmount: calculatedTotals.totalAmount,
    });

    form.setValue("inWords", ConvertToWords(calculatedTotals.grossAmount));
  }, [JSON.stringify(calculatedTotals)]);

  const onCGSTRateChange = (v: string) =>
    handleCGSTRateChange(v, form.setValue);
  const onGSTTypeChange = (v: string) =>
    handleGSTTypeChange(v as any, form.setValue);

  const updateItemTotal = (
    index: number,
    quantityOverride?: number,
    unitPriceOverride?: string
  ) => {
    const quantity = quantityOverride ?? Number(watchedItems[index]?.quantity);
    const unitPriceRaw = unitPriceOverride ?? watchedItems[index]?.unitPrice;

    if (!unitPriceRaw || unitPriceRaw === "-") {
      if (!manualTotalIndexes.includes(index))
        setManualTotalIndexes((prev) => [...prev, index]);
      return;
    }

    if (manualTotalIndexes.includes(index))
      setManualTotalIndexes((prev) => prev.filter((i) => i !== index));

    const total = quantity * parseFloat(String(unitPriceRaw));
    form.setValue(`items.${index}.total`, total.toFixed(2));
  };

  useEffect(() => {
    const fetchInvoice = async () => {
      if (!id) return;
      try {
        const res = await api.get(`/invoices/${id}`);
        const invoiceData = res.data.data;
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
            applyGST: item.applyGST || true,
          })),
        });
      } catch (err) {
        toast.error("Failed to load invoice");
      }
    };

    fetchInvoice();
  }, [id]);

  useEffect(() => {
    if (!selectedCompanyId || isEditing) return;

    const fetchInvoiceNo = async () => {
      try {
        const nextInvoiceNo = await getNextInvoiceNumber(selectedCompanyId);
        form.setValue("invoiceNo", nextInvoiceNo);
      } catch (err) {
        console.error("Failed to fetch invoice number:", err);
      }
    };

    fetchInvoiceNo();
  }, [selectedCompanyId, isEditing]);

  const onSubmit: SubmitHandler<FormValues> = async (values: FormValues) => {
    try {
      const cleanedItems = values.items.map((item) => ({
        ...item,
        unitPrice:
          item.unitPrice === "-" ? "-" : parseFloat(String(item.unitPrice)),
        quantity: Number(item.quantity),
        total: Number(item.total),
        applyGST: item.applyGST,
      }));

      const payload = {
        ...values,
        company: selectedCompanyId,
        items: cleanedItems,
        createdBy: user,
      };

      if (isEditing && id) {
        await updateInvoice(id, payload);
        toast.success("Invoice updated!");
        navigate("/invoices/dashboard");
      } else {
        await createInvoice(payload);
        toast.success("Invoice created!");
      }

      const nextInvoiceNo = await getNextInvoiceNumber(selectedCompanyId);
      form.reset({
        invoiceNo: nextInvoiceNo,
        date: new Date(),
        company: selectedCompanyId ?? "",
        ...getCompanyDefaultFormValues(selectedCompanyId),
      });

      await downloadInvoicePDF(
        <PDFTemplate
          invoice={{ ...values, items: cleanedItems }}
          company={companyObj}
          client={clientObj}
          consignee={consigneeObj}
        />,
        `${values.invoiceNo}.pdf`
      );
    } catch (err) {
      toast.error("Failed to submit invoice");
    }
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

            <TabsContent value="basic">
              <InvoiceBasicInfo form={form} />
            </TabsContent>
            <TabsContent value="parties">
              <InvoiceParties
                form={form}
                clients={clients}
                consignees={consignees}
              />
            </TabsContent>
            <TabsContent value="items">
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
            <TabsContent value="gst">
              <InvoiceGSTTotals
                form={form}
                calculatedTotals={calculatedTotals}
                handleGSTTypeChange={onGSTTypeChange}
                handleCGSTRateChange={onCGSTRateChange}
              />
            </TabsContent>
            <TabsContent value="additional">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {showHRSection && <InvoiceHRDetails form={form} />}
                <InvoiceAdditional form={form} companyObj={companyObj} />
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-between items-center pt-6 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => setPreviewOpen(true)}
            >
              <FileText className="h-4 w-4 mr-2" />
              Preview Invoice
            </Button>

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
            unitPrice: item.unitPrice === "-" ? "-" : Number(item.unitPrice),
            total: Number(item.total),
          })),
        }}
        company={companyObj}
        client={clientObj}
        consignee={consigneeObj}
      />
    </div>
  );
}
