import { useEffect } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface Option {
  label: string;
  value: string;
}

interface SearchableSelectProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  items: Option[];
  placeholder?: string;
  disabled?: boolean;
  defaultToFirst?: boolean;
}

export function SearchableSelect({
  label,
  value,
  onChange,
  items,
  placeholder = "Select...",
  disabled = false,
  defaultToFirst = false,
}: SearchableSelectProps) {
  useEffect(() => {
    if (defaultToFirst && !value && items.length > 0) {
      onChange(items[0].value);
    }
  }, [defaultToFirst, value, items, onChange]);

  const selected = items.find((item) => item.value === value);

  return (
    <>
      {label && <Label>{label}</Label>}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-between"
            disabled={disabled}
          >
            {selected?.label || placeholder}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput placeholder="Search..." className="h-9" />
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {items.map((item) => (
                <CommandItem
                  key={item.value}
                  onSelect={() => onChange(item.value)}
                >
                  {item.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    </>
  );
}
