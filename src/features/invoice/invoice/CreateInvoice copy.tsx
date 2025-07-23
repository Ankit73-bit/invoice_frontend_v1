// import { useForm, useFieldArray, useWatch } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import {
//   Calculator,
//   FileText,
//   Plus,
//   LayoutTemplateIcon as Template,
//   Trash2,
// } from "lucide-react";
// import { useState, useEffect, useMemo } from "react";

// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";

// import type * as z from "zod";
// import { invoiceSchema } from "./invoiceSchema";
// import { useClients } from "@/hooks/useClients";
// import { useConsignees } from "@/hooks/useConsignees";
// import { useCompanies } from "@/hooks/useCompanies";
// import { useAuthStore } from "@/store/authStore";
// import { useCompanyContext } from "@/store/companyContextStore";
// import { api } from "@/lib/api";
// import { InvoicePreviewDialog } from "@/features/components/InvoicePreviewDialog";

// import { ConsigneeSelect } from "./ConsigneeSelect";
// import { ClientSelect } from "./ClientSelect";
// import { ConvertToWords } from "@/features/utils/ConvertToWords";
// import {
//   CGST_OPTIONS,
//   FUEL_SURCHARGE_OPTIONS,
//   IGST_OPTIONS,
// } from "@/features/utils/constant";
// import { DatePicker } from "@/features/components/DatePicker";
// import ClientItems from "../client/ClientItems";
// import AccordionSection from "@/features/components/Accordian";

// type FormValues = z.infer<typeof invoiceSchema>;

// export default function CreateInvoice() {
//   const [previewOpen, setPreviewOpen] = useState(false);
//   const [templatesOpen, setTemplatesOpen] = useState(false);
//   const [manualTotalIndexes, setManualTotalIndexes] = useState<number[]>([]);

//   const { clients } = useClients();
//   const { consignees } = useConsignees();
//   const { companies } = useCompanies();
//   const { user } = useAuthStore();
//   const { selectedCompanyId } = useCompanyContext();

//   const companyObj = companies.find((c) => {
//     if (user?.role === "admin") {
//       return c._id === selectedCompanyId;
//     } else {
//       return c._id === user?.company?._id;
//     }
//   });

//   const form = useForm<FormValues>({
//     resolver: zodResolver(invoiceSchema),
//     defaultValues: {
//       invoiceNo: "INV/25-26/001",
//       date: new Date(),
//       financialYear: "25-26",
//       status: "Pending",
//       client: "",
//       consignee: "",
//       detailsSchema: {},
//       hrDescription: {},
//       company: "",
//       items: [
//         {
//           description: "",
//           hsnCode: "",
//           quantity: 1,
//           unitPrice: "0",
//           total: "0",
//         },
//       ],
//       gstDetails: {
//         type: "CGST",
//         cgstRate: 9,
//         sgstRate: 9,
//         fuelSurchargeRate: 0,
//       },
//       note: "",
//       declaration: "",
//       roundingOff: 0,
//       createdBy: "",
//     },
//   });

//   const { fields, append, remove } = useFieldArray({
//     name: "items",
//     control: form.control,
//   });

//   useEffect(() => {
//     if (!selectedCompanyId) return;

//     const fetchInvoiceNo = async () => {
//       try {
//         const res = await api.get(
//           `/invoices/next-invoice-number?companyId=${selectedCompanyId}`
//         );
//         form.setValue("invoiceNo", res.data.invoiceNumber);
//       } catch (err) {
//         console.error("Failed to fetch invoice number", err);
//       }
//     };

//     fetchInvoiceNo();
//   }, [selectedCompanyId]);

//   const clientObj = clients.find((c) => c._id === form.watch("client"));
//   const consigneeObj = consignees.find(
//     (c) => c._id === form.watch("consignee")
//   );

//   const watchedItems = useWatch({ control: form.control, name: "items" });
//   const gst = useWatch({ control: form.control, name: "gstDetails" });

//   const calculatedTotals = useMemo(() => {
//     const totalBeforeGST = watchedItems.reduce((sum, item) => {
//       const total = Number.parseFloat(item.total || "0");
//       return sum + (isNaN(total) ? 0 : total);
//     }, 0);

//     const cgstRate = Number.parseFloat(gst.cgstRate || "0");
//     const sgstRate = Number.parseFloat(gst.sgstRate || "0");
//     const igstRate = Number.parseFloat(gst.igstRate || "0");
//     const fuelRate = Number.parseFloat(gst.fuelSurchargeRate || "0");

//     const cgstAmount = (totalBeforeGST * cgstRate) / 100;
//     const sgstAmount = (totalBeforeGST * sgstRate) / 100;
//     const igstAmount = (totalBeforeGST * igstRate) / 100;
//     const fuelSurchargeAmount = (totalBeforeGST * fuelRate) / 100;

//     const totalGSTAmount =
//       cgstAmount + sgstAmount + igstAmount + fuelSurchargeAmount;
//     const totalAmount = totalBeforeGST + totalGSTAmount;

//     const grossAmount = Math.round(totalAmount);
//     const roundingOff = Number.parseFloat(
//       (grossAmount - totalAmount).toFixed(2)
//     );

//     return {
//       totalBeforeGST,
//       cgstAmount,
//       sgstAmount,
//       igstAmount,
//       fuelSurchargeAmount,
//       totalGSTAmount,
//       totalAmount,
//       roundingOff,
//       grossAmount,
//     };
//   }, [watchedItems, gst]);

//   useEffect(() => {
//     // Only update if the value is actually different
//     const currentInWords = form.getValues("inWords");
//     const newInWords = ConvertToWords(calculatedTotals.grossAmount);

//     if (form.getValues("totalBeforeGST") !== calculatedTotals.totalBeforeGST) {
//       form.setValue("totalBeforeGST", calculatedTotals.totalBeforeGST);
//     }

//     if (form.getValues("grossAmount") !== calculatedTotals.grossAmount) {
//       form.setValue("grossAmount", calculatedTotals.grossAmount);
//     }

//     if (form.getValues("roundingOff") !== calculatedTotals.roundingOff) {
//       form.setValue("roundingOff", calculatedTotals.roundingOff);
//     }

//     const gstType = form.getValues("gstDetails.type");

//     if (gstType === "CGST") {
//       if (form.getValues("gstDetails.cgst") !== calculatedTotals.cgstAmount) {
//         form.setValue("gstDetails.cgst", calculatedTotals.cgstAmount);
//       }
//       if (form.getValues("gstDetails.sgst") !== calculatedTotals.sgstAmount) {
//         form.setValue("gstDetails.sgst", calculatedTotals.sgstAmount);
//       }
//     } else if (gstType === "IGST") {
//       if (form.getValues("gstDetails.igst") !== calculatedTotals.igstAmount) {
//         form.setValue("gstDetails.igst", calculatedTotals.igstAmount);
//       }
//     }

//     if (
//       form.getValues("gstDetails.fuelSurcharge") !==
//       calculatedTotals.fuelSurchargeAmount
//     ) {
//       form.setValue(
//         "gstDetails.fuelSurcharge",
//         calculatedTotals.fuelSurchargeAmount
//       );
//     }

//     if (
//       form.getValues("gstDetails.totalGstAmount") !==
//       calculatedTotals.totalGSTAmount
//     ) {
//       form.setValue(
//         "gstDetails.totalGstAmount",
//         calculatedTotals.totalGSTAmount
//       );
//     }

//     if (
//       form.getValues("gstDetails.totalAmount") !== calculatedTotals.totalAmount
//     ) {
//       form.setValue("gstDetails.totalAmount", calculatedTotals.totalAmount);
//     }

//     if (currentInWords !== newInWords) {
//       form.setValue("inWords", newInWords);
//     }
//   }, [calculatedTotals, form]);

//   // Handle CGST rate change to sync SGST
//   const handleCGSTRateChange = (value: string) => {
//     const rate = Number.parseFloat(value);
//     form.setValue("gstDetails.cgstRate", rate);
//     form.setValue("gstDetails.sgstRate", rate); // Auto-sync SGST with CGST
//   };

//   // Update item totals when quantity or unit price changes
//   const updateItemTotal = (
//     index: number,
//     quantityOverride?: number,
//     unitPriceOverride?: string
//   ) => {
//     const quantity =
//       quantityOverride ?? Number(watchedItems[index]?.quantity || 0);
//     const unitPriceRaw =
//       unitPriceOverride ?? watchedItems[index]?.unitPrice?.trim();

//     if (!unitPriceRaw || unitPriceRaw === "-") {
//       if (!manualTotalIndexes.includes(index)) {
//         setManualTotalIndexes((prev) => [...prev, index]);
//       }
//       return;
//     }

//     if (manualTotalIndexes.includes(index)) {
//       setManualTotalIndexes((prev) => prev.filter((i) => i !== index));
//     }

//     const price = Number.parseFloat(unitPriceRaw);
//     if (!isNaN(price)) {
//       const total = quantity * price;
//       form.setValue(`items.${index}.total`, total.toFixed(2));
//     }
//   };

//   const onSubmit = async (values: FormValues) => {
//     try {
//       const cleanedItems = values.items.map((item) => {
//         const isManual = item.unitPrice.trim() === "-";

//         return {
//           ...item,
//           unitPrice: isManual ? "-" : Number.parseFloat(item.unitPrice),
//           quantity: Number(item.quantity),
//           total: Number(item.total),
//         };
//       });

//       console.log("Submitting invoice:", {
//         ...values,
//         company: selectedCompanyId,
//         items: cleanedItems,
//         createdBy: user,
//       });
//       // Replace with your API call
//       // await api.post("/invoices", { ...values, company: selectedCompanyId })
//       alert("Invoice created successfully!");
//       form.reset();
//     } catch (error) {
//       console.error("Failed to create invoice:", error);
//       alert("Failed to create invoice");
//     }
//   };

//   useEffect(() => {
//     const grossAmount = calculatedTotals.grossAmount;
//     if (grossAmount > 0) {
//       form.setValue("inWords", `${ConvertToWords(grossAmount)}`);
//     }
//   }, [calculatedTotals.grossAmount, form]);

//   const handleTemplateSelect = (template: any) => {
//     // Apply template settings to form
//     form.setValue("gstDetails.type", template.gstConfig.defaultType);
//     if (template.gstConfig.defaultType === "CGST") {
//       form.setValue("gstDetails.cgstRate", template.gstConfig.rates[0] / 2);
//       form.setValue("gstDetails.sgstRate", template.gstConfig.rates[0] / 2);
//     } else if (template.gstConfig.defaultType === "IGST") {
//       form.setValue("gstDetails.igstRate", template.gstConfig.rates[0]);
//     }
//     form.setValue("declaration", template.defaultTerms);
//     setTemplatesOpen(false);
//   };

//   return (
//     <div className="max-w-6xl mx-auto p-6 space-y-6">
//       <AccordionSection title="Client Items">
//         <ClientItems
//           clientId={clientObj?._id}
//           onItemSelect={(item) => append(item)}
//           onBulkSelect={(items) => items.forEach((i) => append(i))}
//           selectedItems={fields}
//         />
//       </AccordionSection>
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-3xl font-bold">Create Invoice</h1>
//           <p className="text-muted-foreground">
//             Generate a new invoice for your client
//           </p>
//         </div>
//         <div className="flex items-center gap-2">
//           {/* <Dialog open={templatesOpen} onOpenChange={setTemplatesOpen}>
//             <DialogTrigger asChild>
//               <Button variant="outline">
//                 <Template className="h-4 w-4 mr-2" />
//                 Templates
//               </Button>
//             </DialogTrigger>
//             <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
//               <DialogHeader>
//                 <DialogTitle>Choose Invoice Template</DialogTitle>
//                 <DialogDescription>
//                   Select a template that matches your business type
//                 </DialogDescription>
//               </DialogHeader>
//               <InvoiceTemplates onSelectTemplate={handleTemplateSelect} />
//             </DialogContent>
//           </Dialog> */}
//           <Badge variant="outline" className="text-lg px-3 py-1">
//             {form.watch("invoiceNo")}
//           </Badge>
//         </div>
//       </div>

//       <Form {...form}>
//         <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
//           <Tabs defaultValue="basic" className="w-full">
//             <TabsList className="grid w-full grid-cols-5">
//               <TabsTrigger value="basic">Basic Info</TabsTrigger>
//               <TabsTrigger value="parties">Parties</TabsTrigger>
//               <TabsTrigger value="items">Items</TabsTrigger>
//               <TabsTrigger value="gst">GST & Totals</TabsTrigger>
//               <TabsTrigger value="additional">Additional</TabsTrigger>
//             </TabsList>

//             <TabsContent value="basic" className="space-y-6">
//               <Card>
//                 <CardHeader>
//                   <CardTitle>Invoice Details</CardTitle>
//                   <CardDescription>Basic invoice information</CardDescription>
//                 </CardHeader>
//                 <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                   <FormField
//                     control={form.control}
//                     name="invoiceNo"
//                     render={({ field }) => (
//                       <FormItem>
//                         <FormLabel>Invoice Number</FormLabel>
//                         <FormControl>
//                           <Input {...field} disabled />
//                         </FormControl>
//                         <FormMessage />
//                       </FormItem>
//                     )}
//                   />

//                   <FormField
//                     control={form.control}
//                     name="date"
//                     render={({ field }) => (
//                       <FormItem>
//                         <FormLabel>Invoice Date</FormLabel>
//                         <FormControl>
//                           <DatePicker
//                             date={
//                               field.value ? new Date(field.value) : undefined
//                             }
//                             onChange={(selectedDate) => {
//                               field.onChange(selectedDate ?? null);
//                             }}
//                           />
//                         </FormControl>
//                         <FormMessage />
//                       </FormItem>
//                     )}
//                   />

//                   <FormField
//                     control={form.control}
//                     name="financialYear"
//                     render={({ field }) => (
//                       <FormItem>
//                         <FormLabel>Financial Year</FormLabel>
//                         <FormControl>
//                           <Input {...field} placeholder="2024-25" />
//                         </FormControl>
//                         <FormMessage />
//                       </FormItem>
//                     )}
//                   />

//                   <FormField
//                     control={form.control}
//                     name="detailsSchema.referenceNo"
//                     render={({ field }) => (
//                       <FormItem>
//                         <FormLabel>Reference No</FormLabel>
//                         <FormControl>
//                           <Input {...field} placeholder="Optional" />
//                         </FormControl>
//                         <FormMessage />
//                       </FormItem>
//                     )}
//                   />

//                   <FormField
//                     control={form.control}
//                     name="detailsSchema.referenceDate"
//                     render={({ field }) => (
//                       <FormItem>
//                         <FormLabel>Reference Date</FormLabel>
//                         <FormControl>
//                           <DatePicker
//                             date={field.value}
//                             onChange={(selectedDate) =>
//                               field.onChange(selectedDate ?? undefined)
//                             }
//                             placeholder="Pick a date"
//                           />
//                         </FormControl>
//                         <FormMessage />
//                       </FormItem>
//                     )}
//                   />

//                   <FormField
//                     control={form.control}
//                     name="status"
//                     render={({ field }) => (
//                       <FormItem>
//                         <FormLabel>Status</FormLabel>
//                         <Select
//                           onValueChange={field.onChange}
//                           value={field.value}
//                         >
//                           <FormControl>
//                             <SelectTrigger>
//                               <SelectValue placeholder="Select status" />
//                             </SelectTrigger>
//                           </FormControl>
//                           <SelectContent>
//                             <SelectItem value="Pending">Pending</SelectItem>
//                             <SelectItem value="Paid">Paid</SelectItem>
//                             <SelectItem value="Overdue">Overdue</SelectItem>
//                           </SelectContent>
//                         </Select>
//                         <FormMessage />
//                       </FormItem>
//                     )}
//                   />
//                   <FormField
//                     control={form.control}
//                     name="detailsSchema.otherReferences"
//                     render={({ field }) => (
//                       <FormItem className="md:col-span-3">
//                         <FormLabel>References</FormLabel>
//                         <FormControl>
//                           <Input {...field} placeholder="References" />
//                         </FormControl>
//                         <FormMessage />
//                       </FormItem>
//                     )}
//                   />
//                 </CardContent>
//               </Card>

//               <Card>
//                 <CardHeader>
//                   <CardTitle>Purchase & Delivery Details</CardTitle>
//                 </CardHeader>
//                 <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <FormField
//                     control={form.control}
//                     name="detailsSchema.purchaseNo"
//                     render={({ field }) => (
//                       <FormItem>
//                         <FormLabel>Purchase Order No</FormLabel>
//                         <FormControl>
//                           <Input {...field} placeholder="Optional" />
//                         </FormControl>
//                         <FormMessage />
//                       </FormItem>
//                     )}
//                   />

//                   <FormField
//                     control={form.control}
//                     name="detailsSchema.purchaseDate"
//                     render={({ field }) => (
//                       <FormItem>
//                         <FormLabel>Purchase Date</FormLabel>
//                         <FormControl>
//                           <DatePicker
//                             date={field.value}
//                             onChange={(selectedDate) =>
//                               field.onChange(selectedDate ?? undefined)
//                             }
//                             placeholder="Pick a date"
//                           />
//                         </FormControl>
//                         <FormMessage />
//                       </FormItem>
//                     )}
//                   />

//                   <FormField
//                     control={form.control}
//                     name="detailsSchema.termsOfDelivery"
//                     render={({ field }) => (
//                       <FormItem className="md:col-span-2">
//                         <FormLabel>Terms of Delivery</FormLabel>
//                         <FormControl>
//                           <Input {...field} placeholder="Delivery terms" />
//                         </FormControl>
//                         <FormMessage />
//                       </FormItem>
//                     )}
//                   />
//                 </CardContent>
//               </Card>
//             </TabsContent>

//             <TabsContent value="parties" className="space-y-6">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <Card>
//                   <CardHeader>
//                     <CardTitle>Client Details</CardTitle>
//                   </CardHeader>
//                   <CardContent>
//                     <FormField
//                       control={form.control}
//                       name="client"
//                       render={({ field }) => (
//                         <FormItem>
//                           <FormLabel>Select Client</FormLabel>
//                           <FormControl>
//                             <ClientSelect
//                               clients={clients}
//                               value={field.value}
//                               onValueChange={field.onChange}
//                             />
//                           </FormControl>
//                           <FormMessage />
//                         </FormItem>
//                       )}
//                     />
//                   </CardContent>
//                 </Card>

//                 <Card>
//                   <CardHeader>
//                     <CardTitle>Consignee Details</CardTitle>
//                   </CardHeader>
//                   <CardContent>
//                     <FormField
//                       control={form.control}
//                       name="consignee"
//                       render={({ field }) => (
//                         <FormItem>
//                           <FormLabel>Select Consignee</FormLabel>
//                           <FormControl>
//                             <ConsigneeSelect
//                               consignees={consignees}
//                               value={field.value}
//                               onValueChange={field.onChange}
//                               placeholder="Search and select consignee (optional)..."
//                             />
//                           </FormControl>
//                           <FormMessage />
//                         </FormItem>
//                       )}
//                     />
//                   </CardContent>
//                 </Card>
//               </div>

//               <Card>
//                 <CardHeader>
//                   <CardTitle>Recieved Data From</CardTitle>
//                 </CardHeader>
//                 <CardContent className="space-y-4">
//                   <FormField
//                     control={form.control}
//                     name="dataFrom"
//                     render={({ field }) => (
//                       <FormItem>
//                         <FormLabel>Data From</FormLabel>
//                         <FormControl>
//                           <Textarea {...field} placeholder="Data description" />
//                         </FormControl>
//                         <FormMessage />
//                       </FormItem>
//                     )}
//                   />
//                 </CardContent>
//               </Card>

//               <Card>
//                 <CardHeader>
//                   <CardTitle>Dispatch Details</CardTitle>
//                 </CardHeader>
//                 <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <FormField
//                     control={form.control}
//                     name="detailsSchema.dispatchDetails.dispatchNo"
//                     render={({ field }) => (
//                       <FormItem>
//                         <FormLabel>Dispatch Number</FormLabel>
//                         <FormControl>
//                           <Input {...field} placeholder="Optional" />
//                         </FormControl>
//                         <FormMessage />
//                       </FormItem>
//                     )}
//                   />

//                   <FormField
//                     control={form.control}
//                     name="detailsSchema.dispatchDetails.date"
//                     render={({ field }) => (
//                       <FormItem>
//                         <FormLabel>Dispatch Date</FormLabel>
//                         <FormControl>
//                           <DatePicker
//                             date={field.value}
//                             onChange={(selectedDate) =>
//                               field.onChange(selectedDate ?? undefined)
//                             }
//                             placeholder="Pick a date"
//                           />
//                         </FormControl>
//                         <FormMessage />
//                       </FormItem>
//                     )}
//                   />

//                   <FormField
//                     control={form.control}
//                     name="detailsSchema.dispatchDetails.through"
//                     render={({ field }) => (
//                       <FormItem>
//                         <FormLabel>Dispatch Through</FormLabel>
//                         <FormControl>
//                           <Input {...field} placeholder="Transport method" />
//                         </FormControl>
//                         <FormMessage />
//                       </FormItem>
//                     )}
//                   />

//                   <FormField
//                     control={form.control}
//                     name="detailsSchema.dispatchDetails.destination"
//                     render={({ field }) => (
//                       <FormItem>
//                         <FormLabel>Destination</FormLabel>
//                         <FormControl>
//                           <Input
//                             {...field}
//                             placeholder="Delivery destination"
//                           />
//                         </FormControl>
//                         <FormMessage />
//                       </FormItem>
//                     )}
//                   />
//                 </CardContent>
//               </Card>
//             </TabsContent>

//             <TabsContent value="items" className="space-y-6">
//               <Card>
//                 <CardHeader>
//                   <CardTitle className="flex items-center justify-between">
//                     Invoice Items ({fields.length})
//                     <Button
//                       type="button"
//                       variant="outline"
//                       size="sm"
//                       onClick={() =>
//                         append({
//                           description: "",
//                           quantity: 1,
//                           unitPrice: "0",
//                           total: "0",
//                         })
//                       }
//                     >
//                       <Plus className="h-4 w-4 mr-2" />
//                       Add Item
//                     </Button>
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent className="space-y-4">
//                   <FormField
//                     control={form.control}
//                     name="note"
//                     render={({ field }) => (
//                       <FormItem>
//                         <FormLabel>Notes</FormLabel>
//                         <FormControl>
//                           <Textarea
//                             {...field}
//                             placeholder="Additional notes or comments"
//                             defaultValue="TDS Not applicable on postal reimbursement charges"
//                           />
//                         </FormControl>
//                         <FormMessage />
//                       </FormItem>
//                     )}
//                   />
//                 </CardContent>
//                 <CardContent>
//                   <div className="space-y-2">
//                     {/* Header Row */}
//                     <div className="hidden md:grid grid-cols-12 gap-4 p-3 bg-muted/50 rounded-lg text-sm font-medium">
//                       <div className="col-span-4">Description</div>
//                       <div className="col-span-2">HSN Code</div>
//                       <div className="col-span-1">Qty</div>
//                       <div className="col-span-2">Unit Price</div>
//                       <div className="col-span-2">Total</div>
//                       <div className="col-span-1">Action</div>
//                     </div>

//                     {/* Items List */}
//                     <div className="max-h-[600px] overflow-y-auto space-y-2">
//                       {fields.map((field, index) => (
//                         <div
//                           key={field.id}
//                           className="group border rounded-lg p-4 hover:bg-muted/30 transition-colors"
//                         >
//                           {/* Mobile Layout */}
//                           <div className="md:hidden space-y-3">
//                             <div className="flex items-center justify-between">
//                               <span className="text-sm font-medium text-muted-foreground">
//                                 Item #{index + 1}
//                               </span>
//                               <Button
//                                 type="button"
//                                 variant="ghost"
//                                 size="sm"
//                                 onClick={() => remove(index)}
//                                 disabled={fields.length === 1}
//                                 className="opacity-0 group-hover:opacity-100 transition-opacity"
//                               >
//                                 <Trash2 className="h-4 w-4" />
//                               </Button>
//                             </div>

//                             <FormField
//                               control={form.control}
//                               name={`items.${index}.description`}
//                               render={({ field }) => (
//                                 <FormItem>
//                                   <FormLabel>Description</FormLabel>
//                                   <FormControl>
//                                     <Textarea
//                                       {...field}
//                                       placeholder="Item description"
//                                       className="min-h-[60px]"
//                                     />
//                                   </FormControl>
//                                   <FormMessage />
//                                 </FormItem>
//                               )}
//                             />

//                             <div className="grid grid-cols-2 gap-3">
//                               <FormField
//                                 control={form.control}
//                                 name={`items.${index}.hsnCode`}
//                                 render={({ field }) => (
//                                   <FormItem>
//                                     <FormLabel>HSN Code</FormLabel>
//                                     <FormControl>
//                                       <Input {...field} placeholder="HSN" />
//                                     </FormControl>
//                                     <FormMessage />
//                                   </FormItem>
//                                 )}
//                               />

//                               <FormField
//                                 control={form.control}
//                                 name={`items.${index}.quantity`}
//                                 render={({ field }) => (
//                                   <FormItem>
//                                     <FormLabel>Quantity</FormLabel>
//                                     <FormControl>
//                                       <Input
//                                         type="text"
//                                         {...field}
//                                         onChange={(e) => {
//                                           const value =
//                                             Number.parseInt(e.target.value) ||
//                                             0;
//                                           field.onChange(value);
//                                           updateItemTotal(index, value);
//                                         }}
//                                       />
//                                     </FormControl>
//                                     <FormMessage />
//                                   </FormItem>
//                                 )}
//                               />
//                             </div>

//                             <div className="grid grid-cols-2 gap-3">
//                               <FormField
//                                 control={form.control}
//                                 name={`items.${index}.unitPrice`}
//                                 render={({ field }) => (
//                                   <FormItem>
//                                     <FormLabel>Unit Price</FormLabel>
//                                     <FormControl>
//                                       <Input
//                                         {...field}
//                                         placeholder="0.00"
//                                         onChange={(e) => {
//                                           const value = e.target.value;
//                                           field.onChange(value);
//                                           updateItemTotal(
//                                             index,
//                                             undefined,
//                                             value
//                                           );
//                                         }}
//                                       />
//                                     </FormControl>
//                                     <FormMessage />
//                                   </FormItem>
//                                 )}
//                               />

//                               <FormField
//                                 control={form.control}
//                                 name={`items.${index}.total`}
//                                 render={({ field }) => (
//                                   <FormItem>
//                                     <FormLabel>Total</FormLabel>
//                                     <FormControl>
//                                       <Input
//                                         {...field}
//                                         value={field.value ?? "0"}
//                                         onChange={(e) => {
//                                           field.onChange(e.target.value);
//                                           if (
//                                             !manualTotalIndexes.includes(index)
//                                           ) {
//                                             setManualTotalIndexes((prev) => [
//                                               ...prev,
//                                               index,
//                                             ]);
//                                           }
//                                         }}
//                                       />
//                                     </FormControl>
//                                     <FormMessage />
//                                   </FormItem>
//                                 )}
//                               />
//                             </div>
//                           </div>

//                           {/* Desktop Layout */}
//                           <div className="hidden md:grid grid-cols-12 gap-4 items-start">
//                             <div className="col-span-4">
//                               <FormField
//                                 control={form.control}
//                                 name={`items.${index}.description`}
//                                 render={({ field }) => (
//                                   <FormItem>
//                                     <FormControl>
//                                       <Textarea
//                                         {...field}
//                                         placeholder="Item description"
//                                         className="min-h-[40px] resize-none"
//                                       />
//                                     </FormControl>
//                                     <FormMessage />
//                                   </FormItem>
//                                 )}
//                               />
//                             </div>

//                             <div className="col-span-2">
//                               <FormField
//                                 control={form.control}
//                                 name={`items.${index}.hsnCode`}
//                                 render={({ field }) => (
//                                   <FormItem>
//                                     <FormControl>
//                                       <Input {...field} placeholder="HSN" />
//                                     </FormControl>
//                                     <FormMessage />
//                                   </FormItem>
//                                 )}
//                               />
//                             </div>

//                             <div className="col-span-1">
//                               <FormField
//                                 control={form.control}
//                                 name={`items.${index}.quantity`}
//                                 render={({ field }) => (
//                                   <FormItem>
//                                     <FormControl>
//                                       <Input
//                                         type="text"
//                                         {...field}
//                                         onChange={(e) => {
//                                           const value =
//                                             Number.parseInt(e.target.value) ||
//                                             0;
//                                           field.onChange(value);
//                                           updateItemTotal(index, value);
//                                         }}
//                                       />
//                                     </FormControl>
//                                     <FormMessage />
//                                   </FormItem>
//                                 )}
//                               />
//                             </div>

//                             <div className="col-span-2">
//                               <FormField
//                                 control={form.control}
//                                 name={`items.${index}.unitPrice`}
//                                 render={({ field }) => (
//                                   <FormItem>
//                                     <FormControl>
//                                       <Input
//                                         {...field}
//                                         placeholder="0.00"
//                                         onChange={(e) => {
//                                           const value = e.target.value;
//                                           field.onChange(value);
//                                           updateItemTotal(
//                                             index,
//                                             undefined,
//                                             value
//                                           );
//                                         }}
//                                       />
//                                     </FormControl>
//                                     <FormMessage />
//                                   </FormItem>
//                                 )}
//                               />
//                             </div>

//                             <div className="col-span-2">
//                               <FormField
//                                 control={form.control}
//                                 name={`items.${index}.total`}
//                                 render={({ field }) => (
//                                   <FormItem>
//                                     <FormControl>
//                                       <Input
//                                         {...field}
//                                         value={field.value ?? "0"}
//                                         onChange={(e) => {
//                                           field.onChange(e.target.value);
//                                           if (
//                                             !manualTotalIndexes.includes(index)
//                                           ) {
//                                             setManualTotalIndexes((prev) => [
//                                               ...prev,
//                                               index,
//                                             ]);
//                                           }
//                                         }}
//                                       />
//                                     </FormControl>
//                                     <FormMessage />
//                                   </FormItem>
//                                 )}
//                               />
//                             </div>

//                             <div className="col-span-1">
//                               <Button
//                                 type="button"
//                                 variant="ghost"
//                                 size="sm"
//                                 onClick={() => remove(index)}
//                                 disabled={fields.length === 1}
//                                 className="opacity-0 group-hover:opacity-100 transition-opacity"
//                               >
//                                 <Trash2 className="h-4 w-4" />
//                               </Button>
//                             </div>
//                           </div>
//                         </div>
//                       ))}
//                     </div>

//                     {/* Summary Row */}
//                     {fields.length > 0 && (
//                       <div className="mt-4 p-4 bg-muted/30 rounded-lg">
//                         <div className="flex justify-between items-center text-sm">
//                           <span className="font-medium">
//                             Total Items: {fields.length}
//                           </span>
//                           <span className="font-medium">
//                             Subtotal: ₹
//                             {calculatedTotals.totalBeforeGST.toFixed(2)}
//                           </span>
//                         </div>
//                       </div>
//                     )}

//                     {/* Bulk Actions */}
//                     {fields.length > 1 && (
//                       <div className="flex justify-between items-center pt-4 border-t">
//                         <div className="text-sm text-muted-foreground">
//                           {fields.length} items added
//                         </div>
//                         <div className="flex gap-2">
//                           <Button
//                             type="button"
//                             variant="outline"
//                             size="sm"
//                             onClick={() => {
//                               // Clear all items except the first one
//                               const itemsToRemove = fields.length - 1;
//                               for (let i = 0; i < itemsToRemove; i++) {
//                                 remove(fields.length - 1 - i);
//                               }
//                             }}
//                           >
//                             Clear All
//                           </Button>
//                           <Button
//                             type="button"
//                             variant="outline"
//                             size="sm"
//                             onClick={() => {
//                               // Duplicate the last item
//                               const lastItem = fields[fields.length - 1];
//                               if (lastItem) {
//                                 append({
//                                   description: "",
//                                   quantity: 1,
//                                   unitPrice: "0",
//                                   total: "0",
//                                 });
//                               }
//                             }}
//                           >
//                             <Plus className="h-4 w-4 mr-1" />
//                             Quick Add
//                           </Button>
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 </CardContent>
//               </Card>
//             </TabsContent>

//             <TabsContent value="gst" className="space-y-6">
//               <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//                 <Card>
//                   <CardHeader>
//                     <CardTitle>GST Configuration</CardTitle>
//                   </CardHeader>
//                   <CardContent className="space-y-4">
//                     <FormField
//                       control={form.control}
//                       name="gstDetails.type"
//                       render={({ field }) => (
//                         <FormItem>
//                           <FormLabel>GST Type</FormLabel>
//                           <Select
//                             onValueChange={field.onChange}
//                             value={field.value}
//                           >
//                             <FormControl>
//                               <SelectTrigger>
//                                 <SelectValue placeholder="Select GST type" />
//                               </SelectTrigger>
//                             </FormControl>
//                             <SelectContent>
//                               <SelectItem value="CGST">CGST + SGST</SelectItem>
//                               <SelectItem value="IGST">IGST</SelectItem>
//                               <SelectItem value="None">No GST</SelectItem>
//                             </SelectContent>
//                           </Select>
//                           <FormMessage />
//                         </FormItem>
//                       )}
//                     />

//                     {form.watch("gstDetails.type") === "CGST" && (
//                       <div className="grid grid-cols-2 gap-4">
//                         <FormField
//                           control={form.control}
//                           name="gstDetails.cgstRate"
//                           render={({ field }) => (
//                             <FormItem>
//                               <FormLabel>CGST Rate (%)</FormLabel>
//                               <Select
//                                 onValueChange={handleCGSTRateChange}
//                                 value={field.value?.toString()}
//                               >
//                                 <FormControl>
//                                   <SelectTrigger>
//                                     <SelectValue placeholder="Select rate" />
//                                   </SelectTrigger>
//                                 </FormControl>
//                                 <SelectContent>
//                                   {CGST_OPTIONS.map((rate) => (
//                                     <SelectItem
//                                       key={rate}
//                                       value={rate.toString()}
//                                     >
//                                       {rate}%
//                                     </SelectItem>
//                                   ))}
//                                 </SelectContent>
//                               </Select>
//                               <FormMessage />
//                             </FormItem>
//                           )}
//                         />

//                         <FormField
//                           control={form.control}
//                           name="gstDetails.sgstRate"
//                           render={({ field }) => (
//                             <FormItem>
//                               <FormLabel>SGST Rate (%)</FormLabel>
//                               <FormControl>
//                                 <Input
//                                   type="number"
//                                   step="0.01"
//                                   {...field}
//                                   disabled
//                                   className="bg-muted"
//                                 />
//                               </FormControl>
//                               <FormMessage />
//                             </FormItem>
//                           )}
//                         />
//                       </div>
//                     )}

//                     {form.watch("gstDetails.type") === "IGST" && (
//                       <FormField
//                         control={form.control}
//                         name="gstDetails.igstRate"
//                         render={({ field }) => (
//                           <FormItem>
//                             <FormLabel>IGST Rate (%)</FormLabel>
//                             <Select
//                               onValueChange={(value) =>
//                                 field.onChange(Number.parseFloat(value))
//                               }
//                               value={field.value?.toString()}
//                             >
//                               <FormControl>
//                                 <SelectTrigger>
//                                   <SelectValue placeholder="Select rate" />
//                                 </SelectTrigger>
//                               </FormControl>
//                               <SelectContent>
//                                 {IGST_OPTIONS.map((rate) => (
//                                   <SelectItem
//                                     key={rate}
//                                     value={rate.toString()}
//                                   >
//                                     {rate}%
//                                   </SelectItem>
//                                 ))}
//                               </SelectContent>
//                             </Select>
//                             <FormMessage />
//                           </FormItem>
//                         )}
//                       />
//                     )}

//                     <FormField
//                       control={form.control}
//                       name="gstDetails.fuelSurchargeRate"
//                       render={({ field }) => (
//                         <FormItem>
//                           <FormLabel>Fuel Surcharge Rate (%)</FormLabel>
//                           <Select
//                             onValueChange={(value) =>
//                               field.onChange(Number.parseFloat(value))
//                             }
//                             value={field.value?.toString()}
//                           >
//                             <FormControl>
//                               <SelectTrigger>
//                                 <SelectValue placeholder="Select rate" />
//                               </SelectTrigger>
//                             </FormControl>
//                             <SelectContent>
//                               {FUEL_SURCHARGE_OPTIONS.map((rate) => (
//                                 <SelectItem key={rate} value={rate.toString()}>
//                                   {rate}%
//                                 </SelectItem>
//                               ))}
//                             </SelectContent>
//                           </Select>
//                           <FormMessage />
//                         </FormItem>
//                       )}
//                     />
//                   </CardContent>
//                 </Card>

//                 <Card>
//                   <CardHeader>
//                     <CardTitle className="flex items-center">
//                       <Calculator className="h-5 w-5 mr-2" />
//                       Invoice Totals
//                     </CardTitle>
//                   </CardHeader>
//                   <CardContent className="space-y-4">
//                     <div className="space-y-3">
//                       <FormField
//                         control={form.control}
//                         name="totalBeforeGST"
//                         render={({ field }) => (
//                           <FormItem>
//                             <FormLabel>Subtotal (Before GST)</FormLabel>
//                             <FormControl>
//                               <Input
//                                 {...field}
//                                 disabled
//                                 className="bg-muted"
//                                 value={field.value?.toFixed(2)}
//                               />
//                             </FormControl>
//                           </FormItem>
//                         )}
//                       />
//                       {form.watch("gstDetails.type") !== "None" && (
//                         <>
//                           {form.watch("gstDetails.type") === "CGST" && (
//                             <>
//                               <FormField
//                                 control={form.control}
//                                 name="gstDetails.cgst"
//                                 render={({ field }) => (
//                                   <FormItem>
//                                     <FormLabel>
//                                       CGST ({form.watch("gstDetails.cgstRate")}
//                                       %):
//                                     </FormLabel>
//                                     <FormControl>
//                                       <Input
//                                         {...field}
//                                         disabled
//                                         className="bg-muted"
//                                         value={field.value?.toFixed(2)}
//                                       />
//                                     </FormControl>
//                                   </FormItem>
//                                 )}
//                               />
//                               <FormField
//                                 control={form.control}
//                                 name="gstDetails.sgst"
//                                 render={({ field }) => (
//                                   <FormItem>
//                                     <FormLabel>
//                                       SGST ({form.watch("gstDetails.sgstRate")}
//                                       %):
//                                     </FormLabel>
//                                     <FormControl>
//                                       <Input
//                                         {...field}
//                                         disabled
//                                         className="bg-muted"
//                                         value={field.value?.toFixed(2)}
//                                       />
//                                     </FormControl>
//                                   </FormItem>
//                                 )}
//                               />
//                             </>
//                           )}

//                           {form.watch("gstDetails.type") === "IGST" && (
//                             <FormField
//                               control={form.control}
//                               name="gstDetails.igst"
//                               render={({ field }) => (
//                                 <FormItem>
//                                   <FormLabel>
//                                     IGST ({form.watch("gstDetails.igstRate")}
//                                     %):
//                                   </FormLabel>
//                                   <FormControl>
//                                     <Input
//                                       {...field}
//                                       disabled
//                                       className="bg-muted"
//                                       value={field.value?.toFixed(2)}
//                                     />
//                                   </FormControl>
//                                 </FormItem>
//                               )}
//                             />
//                           )}

//                           {calculatedTotals.fuelSurchargeAmount > 0 && (
//                             <FormField
//                               control={form.control}
//                               name="gstDetails.fuelSurcharge"
//                               render={({ field }) => (
//                                 <FormItem>
//                                   <FormLabel>
//                                     Fuel Surcharge (
//                                     {form.watch("gstDetails.fuelSurchargeRate")}
//                                     %):
//                                   </FormLabel>
//                                   <FormControl>
//                                     <Input
//                                       {...field}
//                                       disabled
//                                       className="bg-muted"
//                                       value={field.value?.toFixed(2)}
//                                     />
//                                   </FormControl>
//                                 </FormItem>
//                               )}
//                             />
//                           )}

//                           <FormField
//                             control={form.control}
//                             name="gstDetails.totalGstAmount"
//                             render={({ field }) => (
//                               <FormItem>
//                                 <FormLabel>Total GST + Surcharge:</FormLabel>
//                                 <FormControl>
//                                   <Input
//                                     {...field}
//                                     disabled
//                                     className="bg-muted"
//                                     value={field.value?.toFixed(2)}
//                                   />
//                                 </FormControl>
//                               </FormItem>
//                             )}
//                           />
//                         </>
//                       )}

//                       <FormField
//                         control={form.control}
//                         name="gstDetails.totalAmount"
//                         render={({ field }) => (
//                           <FormItem>
//                             <FormLabel>
//                               Total Amount (with GST + Fuel)
//                             </FormLabel>
//                             <FormControl>
//                               <Input
//                                 {...field}
//                                 disabled
//                                 className="bg-muted"
//                                 value={field.value?.toFixed(2)}
//                               />
//                             </FormControl>
//                           </FormItem>
//                         )}
//                       />

//                       <FormField
//                         control={form.control}
//                         name="roundingOff"
//                         render={({ field }) => (
//                           <FormItem>
//                             <FormLabel>Rounding Off</FormLabel>
//                             <FormControl>
//                               <Input
//                                 {...field}
//                                 disabled
//                                 className="bg-muted"
//                                 value={field.value?.toFixed(2)}
//                               />
//                             </FormControl>
//                           </FormItem>
//                         )}
//                       />

//                       <FormField
//                         control={form.control}
//                         name="grossAmount"
//                         render={({ field }) => (
//                           <FormItem>
//                             <FormLabel>Gross Amount (Rounded)</FormLabel>
//                             <FormControl>
//                               <Input
//                                 {...field}
//                                 disabled
//                                 className="bg-muted"
//                                 value={field.value?.toFixed(2)}
//                               />
//                             </FormControl>
//                           </FormItem>
//                         )}
//                       />

//                       <FormField
//                         control={form.control}
//                         name="inWords"
//                         render={({ field }) => (
//                           <FormItem>
//                             <FormLabel>Amount in Words</FormLabel>
//                             <FormControl>
//                               <Textarea
//                                 {...field}
//                                 className="text-sm bg-muted"
//                                 readOnly
//                                 rows={3}
//                               />
//                             </FormControl>
//                             <FormMessage />
//                           </FormItem>
//                         )}
//                       />
//                     </div>
//                   </CardContent>
//                 </Card>
//               </div>
//             </TabsContent>

//             <TabsContent value="additional" className="space-y-6">
//               <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//                 <Card>
//                   <CardHeader>
//                     <CardTitle>HR Description</CardTitle>
//                   </CardHeader>
//                   <CardContent className="space-y-4">
//                     <div className="grid grid-cols-2 gap-4">
//                       <FormField
//                         control={form.control}
//                         name="hrDescription.year"
//                         render={({ field }) => (
//                           <FormItem>
//                             <FormLabel>Year</FormLabel>
//                             <FormControl>
//                               <Input
//                                 type="number"
//                                 {...field}
//                                 placeholder="2024"
//                               />
//                             </FormControl>
//                             <FormMessage />
//                           </FormItem>
//                         )}
//                       />

//                       <FormField
//                         control={form.control}
//                         name="hrDescription.month"
//                         render={({ field }) => (
//                           <FormItem>
//                             <FormLabel>Month</FormLabel>
//                             <FormControl>
//                               <Input {...field} placeholder="January" />
//                             </FormControl>
//                             <FormMessage />
//                           </FormItem>
//                         )}
//                       />
//                     </div>

//                     <FormField
//                       control={form.control}
//                       name="hrDescription.hrCode"
//                       render={({ field }) => (
//                         <FormItem>
//                           <FormLabel>HR Code</FormLabel>
//                           <FormControl>
//                             <Input {...field} placeholder="HR code" />
//                           </FormControl>
//                           <FormMessage />
//                         </FormItem>
//                       )}
//                     />

//                     <FormField
//                       control={form.control}
//                       name="hrDescription.hrName"
//                       render={({ field }) => (
//                         <FormItem>
//                           <FormLabel>HR Name</FormLabel>
//                           <FormControl>
//                             <Input
//                               {...field}
//                               placeholder="HR representative name"
//                             />
//                           </FormControl>
//                           <FormMessage />
//                         </FormItem>
//                       )}
//                     />
//                   </CardContent>
//                 </Card>

//                 <Card>
//                   <CardHeader>
//                     <CardTitle>Bank Details</CardTitle>
//                   </CardHeader>
//                   <CardContent className="space-y-4">
//                     <FormItem>
//                       <FormLabel>Bank Name</FormLabel>
//                       <FormControl>
//                         <Input
//                           value={companyObj?.companyBankDetails?.bankName}
//                           disabled
//                           readOnly
//                           className="bg-muted"
//                         />
//                       </FormControl>
//                     </FormItem>

//                     <FormItem>
//                       <FormLabel>Account Number</FormLabel>
//                       <FormControl>
//                         <Input
//                           value={companyObj?.companyBankDetails?.accNo}
//                           disabled
//                           readOnly
//                           className="bg-muted"
//                         />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>

//                     <div className="grid grid-cols-2 gap-4">
//                       <FormItem>
//                         <FormLabel>IFSC Code</FormLabel>
//                         <FormControl>
//                           <Input
//                             value={companyObj?.companyBankDetails?.ifsc}
//                             disabled
//                             readOnly
//                             className="bg-muted"
//                           />
//                         </FormControl>
//                         <FormMessage />
//                       </FormItem>

//                       <FormItem>
//                         <FormLabel>Branch Name</FormLabel>
//                         <FormControl>
//                           <Input
//                             value={companyObj?.companyBankDetails?.branchName}
//                             disabled
//                             readOnly
//                             className="bg-muted"
//                           />
//                         </FormControl>
//                         <FormMessage />
//                       </FormItem>
//                     </div>
//                   </CardContent>
//                 </Card>
//               </div>

//               <Card>
//                 <CardHeader>
//                   <CardTitle>Additional Information</CardTitle>
//                 </CardHeader>
//                 <CardContent className="space-y-4">
//                   <FormField
//                     control={form.control}
//                     name="declaration"
//                     render={({ field }) => (
//                       <FormItem>
//                         <FormLabel>Declaration</FormLabel>
//                         <FormControl>
//                           <Textarea
//                             {...field}
//                             placeholder="Declaration statement"
//                           />
//                         </FormControl>
//                         <FormMessage />
//                       </FormItem>
//                     )}
//                   />
//                 </CardContent>
//               </Card>
//             </TabsContent>
//           </Tabs>

//           <div className="flex justify-between items-center pt-6 border-t">
//             <div className="flex gap-2">
//               <Button
//                 type="button"
//                 variant="outline"
//                 onClick={() => setPreviewOpen(true)}
//               >
//                 <FileText className="h-4 w-4 mr-2" />
//                 Preview Invoice
//               </Button>
//             </div>

//             <div className="flex gap-2">
//               <Button
//                 type="button"
//                 variant="outline"
//                 onClick={() => form.reset()}
//               >
//                 Reset Form
//               </Button>
//               <Button type="submit" className="min-w-[120px]">
//                 Create Invoice
//               </Button>
//             </div>
//           </div>
//         </form>
//       </Form>

//       <InvoicePreviewDialog
//         open={previewOpen}
//         onOpenChange={setPreviewOpen}
//         invoice={{
//           ...form.getValues(),
//           items: form.getValues().items.map((item) => ({
//             ...item,
//             quantity: Number(item.quantity),
//             unitPrice:
//               item.unitPrice === "-" ? "-" : Number.parseFloat(item.unitPrice),
//             total: Number.parseFloat(item.total), // 👈 Ensure this is a number
//           })),
//         }}
//         company={companyObj}
//         client={clientObj}
//         consignee={consigneeObj}
//       />
//     </div>
//   );
// }

"use client";

import { useForm, useFieldArray, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Calculator, FileText, Plus, Trash2 } from "lucide-react";
import { useState, useEffect, useMemo } from "react";

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

import type * as z from "zod";
import { invoiceSchema } from "./invoiceSchema";
import { useClients } from "@/hooks/useClients";
import { useConsignees } from "@/hooks/useConsignees";
import { useCompanies } from "@/hooks/useCompanies";
import { useAuthStore } from "@/store/authStore";
import { useCompanyContext } from "@/store/companyContextStore";
import { api } from "@/lib/api";
import { InvoicePreviewDialog } from "@/features/components/InvoicePreviewDialog";

import { ConsigneeSelect } from "./ConsigneeSelect";
import { ClientSelect } from "./ClientSelect";
import { ConvertToWords } from "@/features/utils/ConvertToWords";
import {
  CGST_OPTIONS,
  FUEL_SURCHARGE_OPTIONS,
  IGST_OPTIONS,
} from "@/features/utils/constant";
import { DatePicker } from "@/features/components/DatePicker";
import ClientItems from "../client/ClientItems";
import AccordionSection from "@/features/components/Accordian";

type FormValues = z.infer<typeof invoiceSchema>;

export default function CreateInvoice() {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [templatesOpen, setTemplatesOpen] = useState(false);
  const [manualTotalIndexes, setManualTotalIndexes] = useState<number[]>([]);

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
      date: new Date(),
      financialYear: "25-26",
      status: "Pending",
      client: "",
      consignee: "",
      detailsSchema: {},
      hrDescription: {},
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
      note: "",
      declaration: "",
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
    // Only update if the value is actually different
    const currentInWords = form.getValues("inWords");
    const newInWords = ConvertToWords(calculatedTotals.grossAmount);

    if (form.getValues("totalBeforeGST") !== calculatedTotals.totalBeforeGST) {
      form.setValue("totalBeforeGST", calculatedTotals.totalBeforeGST);
    }

    if (form.getValues("grossAmount") !== calculatedTotals.grossAmount) {
      form.setValue("grossAmount", calculatedTotals.grossAmount);
    }

    if (form.getValues("roundingOff") !== calculatedTotals.roundingOff) {
      form.setValue("roundingOff", calculatedTotals.roundingOff);
    }

    const gstType = form.getValues("gstDetails.type");

    // Always update GST amounts based on calculations
    if (gstType === "CGST") {
      form.setValue("gstDetails.cgst", calculatedTotals.cgstAmount);
      form.setValue("gstDetails.sgst", calculatedTotals.sgstAmount);
      form.setValue("gstDetails.igst", 0); // Reset IGST
    } else if (gstType === "IGST") {
      form.setValue("gstDetails.igst", calculatedTotals.igstAmount);
      form.setValue("gstDetails.cgst", 0); // Reset CGST
      form.setValue("gstDetails.sgst", 0); // Reset SGST
    } else if (gstType === "None") {
      form.setValue("gstDetails.cgst", 0);
      form.setValue("gstDetails.sgst", 0);
      form.setValue("gstDetails.igst", 0);
    }

    if (
      form.getValues("gstDetails.fuelSurcharge") !==
      calculatedTotals.fuelSurchargeAmount
    ) {
      form.setValue(
        "gstDetails.fuelSurcharge",
        calculatedTotals.fuelSurchargeAmount
      );
    }

    if (
      form.getValues("gstDetails.totalGstAmount") !==
      calculatedTotals.totalGSTAmount
    ) {
      form.setValue(
        "gstDetails.totalGstAmount",
        calculatedTotals.totalGSTAmount
      );
    }

    if (
      form.getValues("gstDetails.totalAmount") !== calculatedTotals.totalAmount
    ) {
      form.setValue("gstDetails.totalAmount", calculatedTotals.totalAmount);
    }

    if (currentInWords !== newInWords) {
      form.setValue("inWords", newInWords);
    }
  }, [calculatedTotals, form]);

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

      console.log("Submitting invoice:", {
        ...values,
        company: selectedCompanyId,
        items: cleanedItems,
        createdBy: user,
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
          <h1 className="text-3xl font-bold">Create Invoice</h1>
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
                            date={
                              field.value ? new Date(field.value) : undefined
                            }
                            onChange={(selectedDate) => {
                              field.onChange(selectedDate ?? null);
                            }}
                          />
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
                    name="detailsSchema.referenceNo"
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
                    name="detailsSchema.referenceDate"
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
                  <FormField
                    control={form.control}
                    name="detailsSchema.otherReferences"
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
                    name="detailsSchema.purchaseNo"
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
                    name="detailsSchema.purchaseDate"
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
                    name="detailsSchema.termsOfDelivery"
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
                  <CardTitle>Recieved Data From</CardTitle>
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
                    Invoice Items ({fields.length})
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        append({
                          description: "",
                          quantity: 1,
                          unitPrice: "0",
                          total: "0",
                        })
                      }
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Item
                    </Button>
                  </CardTitle>
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
                            defaultValue="TDS Not applicable on postal reimbursement charges"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
                <CardContent>
                  <div className="space-y-2">
                    {/* Header Row */}
                    <div className="hidden md:grid grid-cols-12 gap-4 p-3 bg-muted/50 rounded-lg text-sm font-medium">
                      <div className="col-span-4">Description</div>
                      <div className="col-span-2">HSN Code</div>
                      <div className="col-span-1">Qty</div>
                      <div className="col-span-2">Unit Price</div>
                      <div className="col-span-2">Total</div>
                      <div className="col-span-1">Action</div>
                    </div>

                    {/* Items List */}
                    <div className="max-h-[600px] overflow-y-auto space-y-2">
                      {fields.map((field, index) => (
                        <div
                          key={field.id}
                          className="group border rounded-lg p-4 hover:bg-muted/30 transition-colors"
                        >
                          {/* Mobile Layout */}
                          <div className="md:hidden space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium text-muted-foreground">
                                Item #{index + 1}
                              </span>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => remove(index)}
                                disabled={fields.length === 1}
                                className="opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>

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

                            <div className="grid grid-cols-2 gap-3">
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

                              <FormField
                                control={form.control}
                                name={`items.${index}.quantity`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Quantity</FormLabel>
                                    <FormControl>
                                      <Input
                                        type="text"
                                        {...field}
                                        onChange={(e) => {
                                          const value =
                                            Number.parseInt(e.target.value) ||
                                            0;
                                          field.onChange(value);
                                          updateItemTotal(index, value);
                                        }}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
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
                                          const value = e.target.value;
                                          field.onChange(value);
                                          updateItemTotal(
                                            index,
                                            undefined,
                                            value
                                          );
                                        }}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />

                              <FormField
                                control={form.control}
                                name={`items.${index}.total`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Total</FormLabel>
                                    <FormControl>
                                      <Input
                                        {...field}
                                        value={field.value ?? "0"}
                                        onChange={(e) => {
                                          field.onChange(e.target.value);
                                          if (
                                            !manualTotalIndexes.includes(index)
                                          ) {
                                            setManualTotalIndexes((prev) => [
                                              ...prev,
                                              index,
                                            ]);
                                          }
                                        }}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                          </div>

                          {/* Desktop Layout */}
                          <div className="hidden md:grid grid-cols-12 gap-4 items-start">
                            <div className="col-span-4">
                              <FormField
                                control={form.control}
                                name={`items.${index}.description`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormControl>
                                      <Textarea
                                        {...field}
                                        placeholder="Item description"
                                        className="min-h-[40px] resize-none"
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>

                            <div className="col-span-2">
                              <FormField
                                control={form.control}
                                name={`items.${index}.hsnCode`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormControl>
                                      <Input {...field} placeholder="HSN" />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>

                            <div className="col-span-1">
                              <FormField
                                control={form.control}
                                name={`items.${index}.quantity`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormControl>
                                      <Input
                                        type="text"
                                        {...field}
                                        onChange={(e) => {
                                          const value =
                                            Number.parseInt(e.target.value) ||
                                            0;
                                          field.onChange(value);
                                          updateItemTotal(index, value);
                                        }}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>

                            <div className="col-span-2">
                              <FormField
                                control={form.control}
                                name={`items.${index}.unitPrice`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormControl>
                                      <Input
                                        {...field}
                                        placeholder="0.00"
                                        onChange={(e) => {
                                          const value = e.target.value;
                                          field.onChange(value);
                                          updateItemTotal(
                                            index,
                                            undefined,
                                            value
                                          );
                                        }}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>

                            <div className="col-span-2">
                              <FormField
                                control={form.control}
                                name={`items.${index}.total`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormControl>
                                      <Input
                                        {...field}
                                        value={field.value ?? "0"}
                                        onChange={(e) => {
                                          field.onChange(e.target.value);
                                          if (
                                            !manualTotalIndexes.includes(index)
                                          ) {
                                            setManualTotalIndexes((prev) => [
                                              ...prev,
                                              index,
                                            ]);
                                          }
                                        }}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>

                            <div className="col-span-1">
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => remove(index)}
                                disabled={fields.length === 1}
                                className="opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Summary Row */}
                    {fields.length > 0 && (
                      <div className="mt-4 p-4 bg-muted/30 rounded-lg">
                        <div className="flex justify-between items-center text-sm">
                          <span className="font-medium">
                            Total Items: {fields.length}
                          </span>
                          <span className="font-medium">
                            Subtotal: ₹
                            {calculatedTotals.totalBeforeGST.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Bulk Actions */}
                    {fields.length > 1 && (
                      <div className="flex justify-between items-center pt-4 border-t">
                        <div className="text-sm text-muted-foreground">
                          {fields.length} items added
                        </div>
                        <div className="flex gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              // Clear all items except the first one
                              const itemsToRemove = fields.length - 1;
                              for (let i = 0; i < itemsToRemove; i++) {
                                remove(fields.length - 1 - i);
                              }
                            }}
                          >
                            Clear All
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              // Duplicate the last item
                              const lastItem = fields[fields.length - 1];
                              if (lastItem) {
                                append({
                                  description: "",
                                  quantity: 1,
                                  unitPrice: "0",
                                  total: "0",
                                });
                              }
                            }}
                          >
                            <Plus className="h-4 w-4 mr-1" />
                            Quick Add
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="gst" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>GST Configuration</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="gstDetails.type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>GST Type</FormLabel>
                          <Select
                            onValueChange={handleGSTTypeChange}
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

                    <FormField
                      control={form.control}
                      name="gstDetails.fuelSurchargeRate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Fuel Surcharge Rate (%)</FormLabel>
                          <Select
                            onValueChange={(value) =>
                              field.onChange(Number.parseFloat(value))
                            }
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
                  </div>

                  {form.watch("gstDetails.type") === "CGST" && (
                    <div className="space-y-4">
                      <h4 className="text-sm font-semibold text-muted-foreground">
                        CGST + SGST Rates
                      </h4>
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
                                  <SelectItem
                                    key={rate}
                                    value={rate.toString()}
                                  >
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
                              <Input
                                type="number"
                                step="0.01"
                                {...field}
                                disabled
                                className="bg-muted"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}

                  {form.watch("gstDetails.type") === "IGST" && (
                    <div className="space-y-4">
                      <h4 className="text-sm font-semibold text-muted-foreground">
                        IGST Rate
                      </h4>
                      <FormField
                        control={form.control}
                        name="gstDetails.igstRate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>IGST Rate (%)</FormLabel>
                            <Select
                              onValueChange={(value) =>
                                field.onChange(Number.parseFloat(value))
                              }
                              value={field.value?.toString()}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select rate" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {IGST_OPTIONS.map((rate) => (
                                  <SelectItem
                                    key={rate}
                                    value={rate.toString()}
                                  >
                                    {rate}%
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}

                  <div className="space-y-4">
                    <h4 className="text-sm font-semibold text-muted-foreground">
                      Quick Summary
                    </h4>
                    <div className="p-3 bg-muted/30 rounded-lg space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>GST Type:</span>
                        <span className="font-medium">
                          {form.watch("gstDetails.type") || "Not selected"}
                        </span>
                      </div>
                      {form.watch("gstDetails.type") === "CGST" && (
                        <>
                          <div className="flex justify-between text-sm">
                            <span>CGST:</span>
                            <span className="font-medium">
                              {form.watch("gstDetails.cgstRate") || 0}%
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>SGST:</span>
                            <span className="font-medium">
                              {form.watch("gstDetails.sgstRate") || 0}%
                            </span>
                          </div>
                        </>
                      )}
                      {form.watch("gstDetails.type") === "IGST" && (
                        <div className="flex justify-between text-sm">
                          <span>IGST:</span>
                          <span className="font-medium">
                            {form.watch("gstDetails.igstRate") || 0}%
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between text-sm">
                        <span>Fuel Surcharge:</span>
                        <span className="font-medium">
                          {form.watch("gstDetails.fuelSurchargeRate") || 0}%
                        </span>
                      </div>
                    </div>
                  </div>
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
                    {/* Left Column - Calculations */}
                    <div className="space-y-6">
                      {/* Subtotal Section */}
                      <div className="p-4 bg-muted/30 rounded-lg">
                        <FormField
                          control={form.control}
                          name="totalBeforeGST"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-base font-semibold">
                                Subtotal (Before GST)
                              </FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  disabled
                                  className="bg-background text-lg font-medium"
                                  value={`₹${field.value?.toFixed(2)}`}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>

                      {/* GST Section */}
                      {form.watch("gstDetails.type") !== "None" && (
                        <div className="space-y-4">
                          <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                            GST Breakdown
                          </h4>
                          <div className="space-y-3 p-4 border rounded-lg">
                            {form.watch("gstDetails.type") === "CGST" && (
                              <>
                                <FormField
                                  control={form.control}
                                  name="gstDetails.cgst"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel className="text-sm">
                                        CGST (
                                        {form.watch("gstDetails.cgstRate")}%)
                                      </FormLabel>
                                      <FormControl>
                                        <Input
                                          {...field}
                                          disabled
                                          className="bg-muted"
                                          value={`₹${field.value?.toFixed(2)}`}
                                        />
                                      </FormControl>
                                    </FormItem>
                                  )}
                                />
                                <FormField
                                  control={form.control}
                                  name="gstDetails.sgst"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel className="text-sm">
                                        SGST (
                                        {form.watch("gstDetails.sgstRate")}%)
                                      </FormLabel>
                                      <FormControl>
                                        <Input
                                          {...field}
                                          disabled
                                          className="bg-muted"
                                          value={`₹${field.value?.toFixed(2)}`}
                                        />
                                      </FormControl>
                                    </FormItem>
                                  )}
                                />
                              </>
                            )}

                            {form.watch("gstDetails.type") === "IGST" && (
                              <FormField
                                control={form.control}
                                name="gstDetails.igst"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="text-sm">
                                      IGST ({form.watch("gstDetails.igstRate")}
                                      %)
                                    </FormLabel>
                                    <FormControl>
                                      <Input
                                        {...field}
                                        disabled
                                        className="bg-muted"
                                        value={`₹${field.value?.toFixed(2)}`}
                                      />
                                    </FormControl>
                                  </FormItem>
                                )}
                              />
                            )}

                            {calculatedTotals.fuelSurchargeAmount > 0 && (
                              <FormField
                                control={form.control}
                                name="gstDetails.fuelSurcharge"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="text-sm">
                                      Fuel Surcharge (
                                      {form.watch(
                                        "gstDetails.fuelSurchargeRate"
                                      )}
                                      %)
                                    </FormLabel>
                                    <FormControl>
                                      <Input
                                        {...field}
                                        disabled
                                        className="bg-muted"
                                        value={`₹${field.value?.toFixed(2)}`}
                                      />
                                    </FormControl>
                                  </FormItem>
                                )}
                              />
                            )}

                            <div className="pt-2 border-t">
                              <FormField
                                control={form.control}
                                name="gstDetails.totalGstAmount"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="text-sm font-semibold">
                                      Total GST + Surcharge
                                    </FormLabel>
                                    <FormControl>
                                      <Input
                                        {...field}
                                        disabled
                                        className="bg-muted font-medium"
                                        value={`₹${field.value?.toFixed(2)}`}
                                      />
                                    </FormControl>
                                  </FormItem>
                                )}
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Right Column - Final Calculations */}
                    <div className="space-y-6">
                      {/* Calculation Section */}
                      <div className="space-y-4">
                        <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                          Final Calculation
                        </h4>
                        <div className="space-y-3 p-4 border rounded-lg">
                          <FormField
                            control={form.control}
                            name="gstDetails.totalAmount"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-sm">
                                  Total Amount (with GST + Fuel)
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    {...field}
                                    disabled
                                    className="bg-muted"
                                    value={`₹${field.value?.toFixed(2)}`}
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="roundingOff"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-sm">
                                  Rounding Off
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    {...field}
                                    disabled
                                    className="bg-muted"
                                    value={`₹${field.value?.toFixed(2)}`}
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>

                      {/* Final Amount Section */}
                      <div className="p-4 bg-primary/5 border-2 border-primary/20 rounded-lg">
                        <FormField
                          control={form.control}
                          name="grossAmount"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-base font-semibold">
                                Gross Amount (Rounded)
                              </FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  disabled
                                  className="bg-background text-xl font-bold text-primary"
                                  value={`₹${field.value?.toFixed(2)}`}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>

                      {/* Amount in Words */}
                      <div className="space-y-2">
                        <FormField
                          control={form.control}
                          name="inWords"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-semibold">
                                Amount in Words
                              </FormLabel>
                              <FormControl>
                                <Textarea
                                  {...field}
                                  className="text-sm bg-muted/50 border-dashed"
                                  readOnly
                                  rows={3}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
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
              </div>

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
