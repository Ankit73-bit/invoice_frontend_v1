import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { type ReactNode } from "react";

interface Props {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
}

function AccordionSection({ title, children, defaultOpen = false }: Props) {
  return (
    <Accordion
      type="single"
      collapsible
      defaultValue={defaultOpen ? "item-1" : undefined}
    >
      <AccordionItem value="item-1">
        <AccordionTrigger>{title}</AccordionTrigger>
        <AccordionContent>{children}</AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

export default AccordionSection;
