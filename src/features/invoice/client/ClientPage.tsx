import AccordionSection from "@/features/components/Accordian";
import ClientTable from "./ClientTable";
import { ClientForm } from "./ClientFrom";
import { useClients } from "@/hooks/useClients";

export default function ClientPage() {
  useClients();
  return (
    <div className="space-y-6 px-6 py-4">
      <AccordionSection title="Create Client" defaultOpen>
        <ClientForm />
      </AccordionSection>
      <ClientTable />
    </div>
  );
}
