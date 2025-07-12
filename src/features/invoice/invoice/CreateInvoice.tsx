import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Calculator,
  FileText,
  Plus,
  LayoutTemplateIcon as Template,
  Trash2,
} from "lucide-react";
import { useState, useEffect } from "react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import type * as z from "zod";
import { invoiceSchema } from "./invoiceSchema";
import { useClients } from "@/hooks/useClients";
import { useConsignees } from "@/hooks/useConsignees";
import { useCompanies } from "@/hooks/useCompanies";
import { useAuthStore } from "@/store/authStore";
import { useCompanyContext } from "@/store/companyContextStore";
import { api } from "@/lib/api";
import { InvoicePreviewDialog } from "@/features/components/InvoicePreviewDialog";
import { InvoiceTemplates } from "@/features/components/invoiceTemplates";
import { Separator } from "@radix-ui/react-select";
import { ConsigneeSelect } from "./ConsigneeSelect";
import { ClientSelect } from "./ClientSelect";

type FormValues = z.infer<typeof invoiceSchema>;

export default function CreateInvoice() {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [templatesOpen, setTemplatesOpen] = useState(false);
  const [calculatedTotals, setCalculatedTotals] = useState({
    totalBeforeGST: 0,
    gstAmount: 0,
    grossAmount: 0,
  });

  const { clients } = useClients();
  const { consignees } = useConsignees();
  const { companies } = useCompanies();
  const { user } = useAuthStore();
  const { selectedCompanyId } = useCompanyContext();

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
      date: new Date().toISOString().split("T")[0],
      financialYear: "25-26",
      status: "Pending",
      client: "",
      consignee: "",
      dispatchDetails: {},
      hrDescription: {},
      bankDetails: {
        bankName: companyObj?.companyBankDetails?.bankName || "",
        accNo: companyObj?.companyBankDetails?.accNo || "",
        ifsc: companyObj?.companyBankDetails?.ifsc || "",
        branchName: companyObj?.companyBankDetails?.branchName || "",
      },
      company: "",
      items: [{ description: "", quantity: 1, unitPrice: "0", total: 0 }],
      gstDetails: {
        type: "CGST",
        cgstRate: 9,
        sgstRate: 9,
      },
    },
  });

  const { fields, append, remove } = useFieldArray({
    name: "items",
    control: form.control,
  });

  // Fix bank details initialization
  useEffect(() => {
    if (companyObj?.companyBankDetails) {
      form.setValue(
        "bankDetails.bankName",
        companyObj.companyBankDetails.bankName || ""
      );
      form.setValue(
        "bankDetails.accNo",
        companyObj.companyBankDetails.accNo || ""
      );
      form.setValue(
        "bankDetails.ifsc",
        companyObj.companyBankDetails.ifsc || ""
      );
      form.setValue(
        "bankDetails.branchName",
        companyObj.companyBankDetails.branchName || ""
      );
    }
  }, [companyObj, form]);

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

  const watchedItems = form.watch("items");
  const watchedGstDetails = form.watch("gstDetails");

  // Calculate totals whenever items or GST details change
  useEffect(() => {
    const totalBeforeGST = watchedItems.reduce((sum, item) => {
      const quantity = item.quantity || 0;
      const unitPrice = Number.parseFloat(item.unitPrice || "0");
      return sum + quantity * unitPrice;
    }, 0);

    let gstAmount = 0;
    if (watchedGstDetails?.type !== "None") {
      const cgstRate = watchedGstDetails?.cgstRate || 0;
      const sgstRate = watchedGstDetails?.sgstRate || 0;
      const igstRate = watchedGstDetails?.igstRate || 0;

      if (watchedGstDetails?.type === "IGST") {
        gstAmount = (totalBeforeGST * igstRate) / 100;
      } else {
        gstAmount = (totalBeforeGST * (cgstRate + sgstRate)) / 100;
      }
    }

    const fuelSurcharge = watchedGstDetails?.fuelSurcharge || 0;
    const roundingOff = form.watch("roundingOff") || 0;
    const grossAmount =
      totalBeforeGST + gstAmount + fuelSurcharge + roundingOff;

    setCalculatedTotals({ totalBeforeGST, gstAmount, grossAmount });

    // Update form values
    form.setValue("totalBeforeGST", totalBeforeGST);
    form.setValue("grossAmount", grossAmount);

    // Update GST calculations
    if (watchedGstDetails?.type === "IGST") {
      form.setValue("gstDetails.igst", gstAmount);
    } else if (watchedGstDetails?.type !== "None") {
      const cgst = (totalBeforeGST * (watchedGstDetails?.cgstRate || 0)) / 100;
      const sgst = (totalBeforeGST * (watchedGstDetails?.sgstRate || 0)) / 100;
      form.setValue("gstDetails.cgst", cgst);
      form.setValue("gstDetails.sgst", sgst);
    }
  }, [watchedItems, watchedGstDetails, form]);

  // Update item totals when quantity or unit price changes
  const updateItemTotal = (index: number) => {
    const item = watchedItems[index];
    const quantity = item?.quantity || 0;
    const unitPrice = Number.parseFloat(item?.unitPrice || "0");
    const total = quantity * unitPrice;
    form.setValue(`items.${index}.total`, total);
  };

  const onSubmit = async (values: FormValues) => {
    try {
      console.log("Submitting invoice:", {
        ...values,
        company: selectedCompanyId,
      });
      // Replace with your API call
      // await api.post("/invoices", { ...values, company: selectedCompanyId })
      alert("Invoice created successfully!");
      form.reset();
    } catch (error) {
      console.error("Failed to create invoice:", error);
      alert("Failed to create invoice");
    }
  };

  const numberToWords = (num: number): string => {
    // Simple implementation - you might want to use a library for this
    const ones = [
      "",
      "One",
      "Two",
      "Three",
      "Four",
      "Five",
      "Six",
      "Seven",
      "Eight",
      "Nine",
    ];
    const tens = [
      "",
      "",
      "Twenty",
      "Thirty",
      "Forty",
      "Fifty",
      "Sixty",
      "Seventy",
      "Eighty",
      "Ninety",
    ];
    const teens = [
      "Ten",
      "Eleven",
      "Twelve",
      "Thirteen",
      "Fourteen",
      "Fifteen",
      "Sixteen",
      "Seventeen",
      "Eighteen",
      "Nineteen",
    ];

    if (num === 0) return "Zero";
    if (num < 10) return ones[num];
    if (num < 20) return teens[num - 10];
    if (num < 100)
      return (
        tens[Math.floor(num / 10)] + (num % 10 ? " " + ones[num % 10] : "")
      );

    // Add more logic for hundreds, thousands, etc.
    return `${Math.floor(num)} (conversion incomplete)`;
  };

  useEffect(() => {
    const grossAmount = calculatedTotals.grossAmount;
    if (grossAmount > 0) {
      form.setValue("inWords", `${numberToWords(grossAmount)} Rupees Only`);
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Create Invoice</h1>
          <p className="text-muted-foreground">
            Generate a new invoice for your client
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Dialog open={templatesOpen} onOpenChange={setTemplatesOpen}>
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
          </Dialog>
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
                          <Input type="date" {...field} required />
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
                    name="referenceNo"
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
                    name="referenceDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Reference Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
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
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
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
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Purchase & Delivery Details</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="purchaseNo"
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
                    name="purchaseDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Purchase Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="termsOfDelivery"
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
            </TabsContent>

            <TabsContent value="parties" className="space-y-6">
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
                          <FormLabel>Select Consignee (Optional)</FormLabel>
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
                  <CardTitle>Dispatch Details</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="dispatchDetails.dispatchNo"
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
                    name="dispatchDetails.date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Dispatch Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="dispatchDetails.through"
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
                    name="dispatchDetails.destination"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Destination</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Delivery destination"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="items" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    Invoice Items
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        append({
                          description: "",
                          quantity: 1,
                          unitPrice: "0",
                          total: 0,
                        })
                      }
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Item
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {fields.map((field, index) => (
                      <div
                        key={field.id}
                        className="grid grid-cols-12 gap-4 items-end p-4 border rounded-lg"
                      >
                        <div className="col-span-12 md:col-span-4">
                          <FormField
                            control={form.control}
                            name={`items.${index}.description`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Description</FormLabel>
                                <FormControl>
                                  <Textarea
                                    {...field}
                                    placeholder="Item description"
                                    className="min-h-[60px]"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <div className="col-span-6 md:col-span-2">
                          <FormField
                            control={form.control}
                            name={`items.${index}.hsnCode`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>HSN Code</FormLabel>
                                <FormControl>
                                  <Input {...field} placeholder="HSN" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <div className="col-span-6 md:col-span-2">
                          <FormField
                            control={form.control}
                            name={`items.${index}.quantity`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Quantity</FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    {...field}
                                    onChange={(e) => {
                                      field.onChange(
                                        Number.parseInt(e.target.value) || 0
                                      );
                                      setTimeout(
                                        () => updateItemTotal(index),
                                        0
                                      );
                                    }}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <div className="col-span-6 md:col-span-2">
                          <FormField
                            control={form.control}
                            name={`items.${index}.unitPrice`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Unit Price</FormLabel>
                                <FormControl>
                                  <Input
                                    {...field}
                                    placeholder="0.00"
                                    onChange={(e) => {
                                      field.onChange(e.target.value);
                                      setTimeout(
                                        () => updateItemTotal(index),
                                        0
                                      );
                                    }}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <div className="col-span-6 md:col-span-1">
                          <FormField
                            control={form.control}
                            name={`items.${index}.total`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Total</FormLabel>
                                <FormControl>
                                  <Input
                                    {...field}
                                    value={field.value?.toFixed(2) || "0.00"}
                                    disabled
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <div className="col-span-12 md:col-span-1">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => remove(index)}
                            disabled={fields.length === 1}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="gst" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>GST Configuration</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="gstDetails.type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>GST Type</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
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

                    {form.watch("gstDetails.type") === "CGST" && (
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="gstDetails.cgstRate"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>CGST Rate (%)</FormLabel>
                              <FormControl>
                                <Input type="number" step="0.01" {...field} />
                              </FormControl>
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
                                <Input type="number" step="0.01" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    )}

                    {form.watch("gstDetails.type") === "IGST" && (
                      <FormField
                        control={form.control}
                        name="gstDetails.igstRate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>IGST Rate (%)</FormLabel>
                            <FormControl>
                              <Input type="number" step="0.01" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}

                    <FormField
                      control={form.control}
                      name="gstDetails.fuelSurchargeRate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Fuel Surcharge Rate (%)</FormLabel>
                          <FormControl>
                            <Input type="number" step="0.01" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Calculator className="h-5 w-5 mr-2" />
                      Invoice Totals
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span>Subtotal (Before GST):</span>
                        <span className="font-medium">
                          ₹{calculatedTotals.totalBeforeGST.toFixed(2)}
                        </span>
                      </div>

                      {form.watch("gstDetails.type") !== "None" && (
                        <div className="flex justify-between">
                          <span>GST Amount:</span>
                          <span className="font-medium">
                            ₹{calculatedTotals.gstAmount.toFixed(2)}
                          </span>
                        </div>
                      )}

                      <FormField
                        control={form.control}
                        name="roundingOff"
                        render={({ field }) => (
                          <FormItem>
                            <div className="flex justify-between items-center">
                              <FormLabel>Rounding Off:</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  step="0.01"
                                  {...field}
                                  className="w-24 text-right"
                                  onChange={(e) =>
                                    field.onChange(
                                      Number.parseFloat(e.target.value) || 0
                                    )
                                  }
                                />
                              </FormControl>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Separator />

                      <div className="flex justify-between text-lg font-bold">
                        <span>Total Amount:</span>
                        <span>₹{calculatedTotals.grossAmount.toFixed(2)}</span>
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
                                className="text-sm"
                                readOnly
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="additional" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                              <Input
                                type="number"
                                {...field}
                                placeholder="2024"
                              />
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
                            <Input
                              {...field}
                              placeholder="HR representative name"
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
                    <CardTitle>Bank Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="bankDetails.bankName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Bank Name</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="bankDetails.accNo"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Account Number</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="bankDetails.ifsc"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>IFSC Code</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="bankDetails.branchName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Branch Name</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Additional Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
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

                  <FormField
                    control={form.control}
                    name="declaration"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Declaration</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder="Declaration statement"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
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
                Create Invoice
              </Button>
            </div>
          </div>
        </form>
      </Form>

      <InvoicePreviewDialog
        open={previewOpen}
        onOpenChange={setPreviewOpen}
        invoice={form.getValues()}
        company={companyObj}
        client={clientObj}
        consignee={consigneeObj}
      />
    </div>
  );
}
