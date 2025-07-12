import type React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Building2, Truck, Wrench, Zap, Check } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface InvoiceTemplate {
  id: string;
  name: string;
  description: string;
  industry: string;
  icon: React.ReactNode;
  features: string[];
  fields: {
    required: string[];
    optional: string[];
    custom: string[];
  };
  gstConfig: {
    defaultType: "CGST" | "IGST" | "None";
    rates: number[];
  };
  defaultTerms: string;
  bankDetailsRequired: boolean;
}

const invoiceTemplates: InvoiceTemplate[] = [
  {
    id: "standard-business",
    name: "Standard Business",
    description:
      "General purpose invoice template suitable for most businesses",
    industry: "General",
    icon: <FileText className="h-5 w-5" />,
    features: [
      "GST Calculation",
      "Multiple Items",
      "Bank Details",
      "Terms & Conditions",
    ],
    fields: {
      required: ["invoiceNo", "date", "client", "items"],
      optional: ["referenceNo", "purchaseNo", "consignee", "note"],
      custom: [],
    },
    gstConfig: {
      defaultType: "CGST",
      rates: [5, 12, 18, 28],
    },
    defaultTerms: "Payment due within 30 days of invoice date.",
    bankDetailsRequired: true,
  },
  {
    id: "construction",
    name: "Construction & Contracting",
    description: "Specialized template for construction and contracting work",
    industry: "Construction",
    icon: <Building2 className="h-5 w-5" />,
    features: [
      "Work Order Reference",
      "Site Details",
      "Material & Labor Split",
      "Progress Billing",
    ],
    fields: {
      required: ["invoiceNo", "date", "client", "items", "siteDetails"],
      optional: ["workOrderNo", "progressPercentage", "retentionAmount"],
      custom: [
        "siteDetails",
        "workOrderNo",
        "progressPercentage",
        "retentionAmount",
      ],
    },
    gstConfig: {
      defaultType: "CGST",
      rates: [12, 18],
    },
    defaultTerms: "Payment due within 15 days. 10% retention applicable.",
    bankDetailsRequired: true,
  },
  {
    id: "logistics",
    name: "Logistics & Transportation",
    description: "Template for logistics, transportation, and freight services",
    industry: "Logistics",
    icon: <Truck className="h-5 w-5" />,
    features: [
      "Route Details",
      "Vehicle Information",
      "Fuel Surcharge",
      "Distance Calculation",
    ],
    fields: {
      required: ["invoiceNo", "date", "client", "items", "routeDetails"],
      optional: ["vehicleNo", "driverDetails", "fuelSurcharge", "tollCharges"],
      custom: ["routeDetails", "vehicleNo", "driverDetails", "tollCharges"],
    },
    gstConfig: {
      defaultType: "IGST",
      rates: [5, 12, 18],
    },
    defaultTerms: "Payment due within 7 days of delivery confirmation.",
    bankDetailsRequired: true,
  },
  {
    id: "manufacturing",
    name: "Manufacturing & Production",
    description:
      "Template for manufacturing companies with detailed product specifications",
    industry: "Manufacturing",
    icon: <Wrench className="h-5 w-5" />,
    features: [
      "Product Specifications",
      "Batch Numbers",
      "Quality Certificates",
      "Warranty Terms",
    ],
    fields: {
      required: ["invoiceNo", "date", "client", "items", "specifications"],
      optional: [
        "batchNo",
        "qualityCertificate",
        "warrantyPeriod",
        "manufacturingDate",
      ],
      custom: [
        "specifications",
        "batchNo",
        "qualityCertificate",
        "warrantyPeriod",
      ],
    },
    gstConfig: {
      defaultType: "CGST",
      rates: [5, 12, 18, 28],
    },
    defaultTerms: "Payment due within 45 days. Warranty as per terms.",
    bankDetailsRequired: true,
  },
  {
    id: "services",
    name: "Professional Services",
    description:
      "Template for consulting, IT services, and professional services",
    industry: "Services",
    icon: <Zap className="h-5 w-5" />,
    features: [
      "Time Tracking",
      "Hourly Rates",
      "Project Milestones",
      "Expense Reimbursement",
    ],
    fields: {
      required: ["invoiceNo", "date", "client", "items", "serviceDetails"],
      optional: [
        "projectName",
        "hoursWorked",
        "milestoneDescription",
        "expenses",
      ],
      custom: [
        "serviceDetails",
        "projectName",
        "hoursWorked",
        "milestoneDescription",
      ],
    },
    gstConfig: {
      defaultType: "CGST",
      rates: [18],
    },
    defaultTerms:
      "Payment due within 30 days. Late payment charges applicable.",
    bankDetailsRequired: true,
  },
];

interface InvoiceTemplatesProps {
  onSelectTemplate: (template: InvoiceTemplate) => void;
  selectedTemplateId?: string;
}

export const InvoiceTemplates: React.FC<InvoiceTemplatesProps> = ({
  onSelectTemplate,
  selectedTemplateId,
}) => {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Choose Invoice Template</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Select a template that best fits your business needs. Each template
          comes with pre-configured settings and fields optimized for specific
          industries.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {invoiceTemplates.map((template) => (
          <Card
            key={template.id}
            className={`relative cursor-pointer transition-all duration-200 hover:shadow-md ${
              selectedTemplateId === template.id
                ? "ring-2 ring-primary border-primary"
                : "hover:border-primary/50"
            }`}
            onClick={() => onSelectTemplate(template)}
          >
            {selectedTemplateId === template.id && (
              <div className="absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full p-1">
                <Check className="h-3 w-3" />
              </div>
            )}

            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    {template.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg leading-tight">
                      {template.name}
                    </CardTitle>
                    <Badge variant="secondary" className="mt-1 text-xs">
                      {template.industry}
                    </Badge>
                  </div>
                </div>
              </div>
              <CardDescription className="text-sm leading-relaxed">
                {template.description}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Features */}
              <div>
                <h4 className="text-sm font-medium mb-2">Key Features</h4>
                <div className="grid grid-cols-1 gap-1">
                  {template.features.slice(0, 4).map((feature, index) => (
                    <div
                      key={index}
                      className="flex items-center text-xs text-muted-foreground"
                    >
                      <div className="w-1 h-1 bg-primary rounded-full mr-2 flex-shrink-0" />
                      <span className="truncate">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* GST Configuration */}
              <div>
                <h4 className="text-sm font-medium mb-2">GST Configuration</h4>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Default Type:</span>
                  <Badge variant="outline" className="text-xs">
                    {template.gstConfig.defaultType}
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-xs mt-1">
                  <span className="text-muted-foreground">Rates:</span>
                  <span className="text-xs font-mono">
                    {template.gstConfig.rates.join("%, ")}%
                  </span>
                </div>
              </div>

              <Separator />

              {/* Payment Terms Preview */}
              <div>
                <h4 className="text-sm font-medium mb-2">Payment Terms</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {template.defaultTerms}
                </p>
              </div>

              <Button
                className="w-full mt-4"
                variant={
                  selectedTemplateId === template.id ? "default" : "outline"
                }
                size="sm"
              >
                {selectedTemplateId === template.id
                  ? "Selected"
                  : "Use This Template"}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Template Comparison */}
      <div className="mt-8 p-4 bg-muted/50 rounded-lg">
        <h3 className="font-semibold mb-3">Template Comparison</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2">Template</th>
                <th className="text-center p-2">GST Type</th>
                <th className="text-center p-2">Custom Fields</th>
                <th className="text-center p-2">Payment Terms</th>
                <th className="text-center p-2">Best For</th>
              </tr>
            </thead>
            <tbody>
              {invoiceTemplates.map((template) => (
                <tr key={template.id} className="border-b last:border-b-0">
                  <td className="p-2">
                    <div className="flex items-center space-x-2">
                      {template.icon}
                      <span className="font-medium">{template.name}</span>
                    </div>
                  </td>
                  <td className="text-center p-2">
                    <Badge variant="outline" className="text-xs">
                      {template.gstConfig.defaultType}
                    </Badge>
                  </td>
                  <td className="text-center p-2">
                    <span className="text-xs text-muted-foreground">
                      {template.fields.custom.length} fields
                    </span>
                  </td>
                  <td className="text-center p-2">
                    <span className="text-xs text-muted-foreground">
                      {template.defaultTerms.split(" ").slice(0, 4).join(" ")}
                      ...
                    </span>
                  </td>
                  <td className="text-center p-2">
                    <span className="text-xs text-muted-foreground">
                      {template.industry}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Help Section */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h4 className="font-semibold text-blue-900 mb-2">
          Need Help Choosing?
        </h4>
        <div className="text-sm text-blue-800 space-y-1">
          <p>
            • <strong>Standard Business:</strong> Perfect for general trading,
            retail, or service businesses
          </p>
          <p>
            • <strong>Construction:</strong> Ideal for contractors, builders,
            and construction companies
          </p>
          <p>
            • <strong>Logistics:</strong> Best for transport, courier, and
            logistics service providers
          </p>
          <p>
            • <strong>Manufacturing:</strong> Suited for manufacturers and
            production companies
          </p>
          <p>
            • <strong>Professional Services:</strong> Great for consultants,
            agencies, and service providers
          </p>
        </div>
      </div>
    </div>
  );
};
