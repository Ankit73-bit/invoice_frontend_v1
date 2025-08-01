import { SearchableSelect } from "@/features/components/SearchableSelect";
import type { Consignee } from "@/lib/types";

interface ConsigneeSelectProps {
  consignees: Consignee[];
  value?: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export function ConsigneeSelect({
  consignees,
  value,
  onValueChange,
  placeholder = "Search and select consignee...",
  disabled = false,
}: ConsigneeSelectProps) {
  const consigneeOptions = consignees.map((consignee) => ({
    value: consignee._id,
    label: consignee.consigneeCompanyName,
  }));

  return (
    <SearchableSelect
      options={consigneeOptions}
      value={value}
      onValueChange={onValueChange}
      placeholder={placeholder}
      searchPlaceholder="Search consignees..."
      emptyMessage="No consignees found."
      disabled={disabled}
    />
  );
}
