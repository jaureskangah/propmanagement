
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Variable } from "lucide-react";
import { useLocale } from "@/components/providers/LocaleProvider";
import { useDynamicFieldsData } from "./data/dynamicFieldsData";

interface DynamicFieldsMenuProps {
  onInsertField: (field: string) => void;
  title?: string;
}

export function DynamicFieldsMenu({ onInsertField, title }: DynamicFieldsMenuProps) {
  const { t } = useLocale();
  const [open, setOpen] = useState(false);
  const fieldCategories = useDynamicFieldsData();

  const handleInsert = (value: string) => {
    onInsertField(value);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          title={t('documentGenerator.insertDynamicField') || "Insérer un champ dynamique"}
          className="flex items-center gap-2 bg-violet-50 border-violet-200 hover:bg-violet-100 hover:text-violet-900 text-violet-800"
        >
          <Variable className="h-4 w-4 text-violet-600" />
          <span className="hidden md:inline text-sm">
            {title || t('documentGenerator.dynamicFields') || "Champs dynamiques"}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72 p-0" align="start">
        <Command>
          <CommandInput 
            placeholder={t('documentGenerator.searchFields') || "Rechercher des champs..."} 
            className="h-9"
          />
          <CommandList className="max-h-[300px]">
            <CommandEmpty>
              {t('documentGenerator.noFieldsFound') || "Aucun champ trouvé."}
            </CommandEmpty>
            {fieldCategories.map((category) => (
              <CommandGroup key={category.category} heading={category.category}>
                {category.fields.map((field) => (
                  <CommandItem 
                    key={field.id}
                    onSelect={() => handleInsert(field.value)}
                    className="flex items-center justify-between cursor-pointer"
                  >
                    <span>{field.name}</span>
                    <code className="text-xs bg-muted px-1 py-0.5 rounded">{field.value}</code>
                  </CommandItem>
                ))}
              </CommandGroup>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
