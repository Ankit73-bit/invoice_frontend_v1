import CreateInvoicePS from "./CreateInvoicePS";
import CreateInvoicePP from "./CreateInvoicePP";
import { useCompanyContext } from "@/store/companyContextStore";

export default function CreateInvoiceRouter() {
  const { selectedCompanyId } = useCompanyContext();
  const companyId = selectedCompanyId ?? "Default";

  const companyFormMap: Record<string, React.FC> = {
    "686229f9f8998a2972ba8d7a": CreateInvoicePS,
    "685e835863244aefe1b2820b": CreateInvoicePP,
    Default: CreateInvoicePS,
  };

  const InvoiceForm = companyFormMap[companyId] || companyFormMap.Default;

  return <InvoiceForm key={companyId} />;
}
