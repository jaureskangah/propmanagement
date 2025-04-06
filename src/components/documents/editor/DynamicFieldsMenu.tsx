import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Variable } from "lucide-react";
import { useLocale } from "@/components/providers/LocaleProvider";

interface DynamicFieldsProps {
  onInsertField: (field: string) => void;
}

interface FieldCategory {
  category: string;
  fields: Array<{
    id: string;
    name: string;
    value: string;
  }>;
}

interface DynamicFieldsMenuProps {
  onInsertField: (field: string) => void;
  title?: string;
}

export function DynamicFieldsMenu({ onInsertField, title }: DynamicFieldsMenuProps) {
  const { t } = useLocale();
  const [open, setOpen] = useState(false);

  const fieldCategories: FieldCategory[] = [
    {
      category: t('tenant') || "Tenant",
      fields: [
        { id: "tenant-name", name: t('tenantName') || "Tenant Name", value: "{{name}}" },
        { id: "tenant-email", name: t('tenantEmail') || "Email", value: "{{email}}" },
        { id: "tenant-phone", name: t('tenantPhone') || "Phone", value: "{{phone}}" },
        { id: "tenant-unit", name: t('unitNumber') || "Unit Number", value: "{{unit_number}}" }
      ]
    },
    {
      category: t('property') || "Property",
      fields: [
        { id: "property-name", name: t('propertyName') || "Property Name", value: "{{properties.name}}" },
        { id: "property-address", name: t('propertyAddress') || "Property Address", value: "{{properties.address}}" }
      ]
    },
    {
      category: t('lease') || "Lease",
      fields: [
        { id: "lease-start", name: t('leaseStart') || "Lease Start", value: "{{lease_start}}" },
        { id: "lease-end", name: t('leaseEnd') || "Lease End", value: "{{lease_end}}" },
        { id: "rent-amount", name: t('rentAmount') || "Rent Amount", value: "{{rent_amount}}" }
      ]
    },
    {
      category: t('date') || "Date",
      fields: [
        { id: "current-date", name: t('currentDate') || "Current Date", value: "{{currentDate}}" }
      ]
    }
  ];

  const handleInsert = (value: string) => {
    onInsertField(value);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          title={t('insertDynamicField') || "Insert Dynamic Field"}
        >
          <Variable className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-0" align="start">
        <Command>
          <CommandInput 
            placeholder={t('searchFields') || "Search fields..."} 
            className="h-9"
          />
          <CommandEmpty>
            {t('noFieldsFound') || "No fields found."}
          </CommandEmpty>
          {fieldCategories.map((category) => (
            <CommandGroup key={category.category} heading={category.category}>
              {category.fields.map((field) => (
                <CommandItem 
                  key={field.id}
                  onSelect={() => handleInsert(field.value)}
                >
                  {field.name}
                </CommandItem>
              ))}
            </CommandGroup>
          ))}
        </Command>
      </PopoverContent>
    </Popover>
  );
}
