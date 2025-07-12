import { SearchableSelect } from "@/features/components/SearchableSelect";
import type { Client } from "@/store/clientStore";

interface ClientSelectProps {
  clients: Client[];
  value?: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export function ClientSelect({
  clients,
  value,
  onValueChange,
  placeholder = "Search and select client...",
  disabled = false,
}: ClientSelectProps) {
  const clientOptions = clients.map((client) => ({
    value: client._id,
    label: client.clientCompanyName,
    subtitle: `${client.clientName ? client.clientName + " • " : ""}${
      client.address?.city
        ? client.address.city + ", " + client.address.state
        : ""
    } ${client.address.gstNo ? "• GST: " + client.address.gstNo : ""}`.trim(),
  }));

  return (
    <SearchableSelect
      options={clientOptions}
      value={value}
      onValueChange={onValueChange}
      placeholder={placeholder}
      searchPlaceholder="Search clients..."
      emptyMessage="No clients found."
      disabled={disabled}
    />
  );
}
