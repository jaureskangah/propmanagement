
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
      category: t('documentGenerator.tenant') || "Locataire",
      fields: [
        { id: "tenant-name", name: t('documentGenerator.tenantName') || "Nom du locataire", value: "{{name}}" },
        { id: "tenant-email", name: t('documentGenerator.tenantEmail') || "Email", value: "{{email}}" },
        { id: "tenant-phone", name: t('documentGenerator.tenantPhone') || "Téléphone", value: "{{phone}}" },
        { id: "tenant-unit", name: t('documentGenerator.unitNumber') || "Numéro d'unité", value: "{{unit_number}}" }
      ]
    },
    {
      category: t('documentGenerator.property') || "Propriété",
      fields: [
        { id: "property-name", name: t('documentGenerator.propertyName') || "Nom de la propriété", value: "{{properties.name}}" },
        { id: "property-address", name: t('documentGenerator.propertyAddress') || "Adresse de la propriété", value: "{{properties.address}}" }
      ]
    },
    {
      category: t('documentGenerator.lease') || "Bail",
      fields: [
        { id: "lease-start", name: t('documentGenerator.leaseStart') || "Début du bail", value: "{{lease_start}}" },
        { id: "lease-end", name: t('documentGenerator.leaseEnd') || "Fin du bail", value: "{{lease_end}}" },
        { id: "rent-amount", name: t('documentGenerator.rentAmount') || "Montant du loyer", value: "{{rent_amount}}" }
      ]
    },
    {
      category: t('documentGenerator.date') || "Date",
      fields: [
        { id: "current-date", name: t('documentGenerator.currentDate') || "Date actuelle", value: "{{currentDate}}" }
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
          title={t('documentGenerator.insertDynamicField') || "Insérer un champ dynamique"}
          className="flex items-center space-x-1"
        >
          <Variable className="h-4 w-4" />
          <span className="sr-only md:not-sr-only md:inline-block md:ml-1 text-xs">
            {t('documentGenerator.fields') || "Champs"}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-0" align="start">
        <Command>
          <CommandInput 
            placeholder={t('documentGenerator.searchFields') || "Rechercher des champs..."} 
            className="h-9"
          />
          <CommandEmpty>
            {t('documentGenerator.noFieldsFound') || "Aucun champ trouvé."}
          </CommandEmpty>
          {fieldCategories.map((category) => (
            <CommandGroup key={category.category} heading={category.category}>
              {category.fields.map((field) => (
                <CommandItem 
                  key={field.id}
                  onSelect={() => handleInsert(field.value)}
                  className="flex items-center justify-between"
                >
                  <span>{field.name}</span>
                  <code className="text-xs bg-muted px-1 py-0.5 rounded">{field.value}</code>
                </CommandItem>
              ))}
            </CommandGroup>
          ))}
        </Command>
      </PopoverContent>
    </Popover>
  );
}
