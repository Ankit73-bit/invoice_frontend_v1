import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useIsMobile } from "@/hooks/use-mobile";
import { Separator } from "@radix-ui/react-select";

interface TableCellViewerProps<T> {
  item: T;
  title?: string | ((item: T) => React.ReactNode);
  description?: string | ((item: T) => React.ReactNode);
  renderDetails: (item: T) => React.ReactNode;
  trigger: React.ReactNode;
}

export default function TableCellViewer<T>({
  item,
  trigger,
  title,
  description,
  renderDetails,
}: TableCellViewerProps<T>) {
  const isMobile = useIsMobile();

  const resolvedTitle =
    typeof title === "function" ? title(item) : title || "Details";
  const resolvedDescription =
    typeof description === "function" ? description(item) : description || "";

  return (
    <Drawer direction={isMobile ? "bottom" : "right"}>
      <DrawerTrigger asChild>{trigger}</DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="gap-1">
          <DrawerTitle>{resolvedTitle}</DrawerTitle>
          <DrawerDescription>{resolvedDescription}</DrawerDescription>
        </DrawerHeader>
        <div className="flex flex-col gap-4 overflow-y-auto px-4 text-sm max-h-[70vh]">
          <Separator />
          {renderDetails(item)}
        </div>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="outline">Close</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
