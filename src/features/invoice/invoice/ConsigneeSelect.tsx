import { SearchableSelect } from "@/features/components/SearchableSelect";
import type { Consignee } from "@/store/consigneeStore";

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
    subtitle: `${
      consignee.consigneeName ? consignee.consigneeName + " • " : ""
    }${
      consignee.address?.city
        ? consignee.address.city + ", " + consignee.address.state
        : ""
    }`.trim(),
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
