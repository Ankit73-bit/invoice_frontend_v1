import AccordionSection from "@/features/components/Accordian";
import { ConsigneeForm } from "./ConsigneeFrom";
import { useConsignees } from "@/hooks/useConsignees";
import ConsigneeTable from "./ConsigneeTable";

export default function ConsigneePage() {
  useConsignees();
  return (
    <div className="space-y-6 px-6 py-4">
      <AccordionSection title="Create Consignee" defaultOpen>
        <ConsigneeForm />
      </AccordionSection>
      <ConsigneeTable />
    </div>
  );
}
