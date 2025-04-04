
import { Filter } from "lucide-react";
import { useLocale } from "@/components/providers/LocaleProvider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEffect, useRef } from "react";

interface ActivityFilterProps {
  value: string;
  onChange: (value: string) => void;
}

export const ActivityFilter = ({ value, onChange }: ActivityFilterProps) => {
  const { t, language } = useLocale();
  const initialRender = useRef(true);
  
  // Détecter les sélections successives du même filtre
  useEffect(() => {
    if (initialRender.current) {
      initialRender.current = false;
      return;
    }
    
    console.log("Valeur du filtre ActivityFilter:", value);
  }, [value]);
  
  const handleValueChange = (newValue: string) => {
    console.log("Activity filter changed to:", newValue);
    
    // Pour forcer une mise à jour même si on revient sur la même valeur
    if (newValue === value) {
      console.log("Même filtre sélectionné à nouveau: forçage du rafraîchissement");
    }
    
    onChange(newValue);
  };
  
  return (
    <div className="mb-4 flex justify-end">
      <div className="flex items-center space-x-2">
        <Filter className="h-4 w-4 text-muted-foreground" />
        <Select value={value} onValueChange={handleValueChange}>
          <SelectTrigger className="w-[180px] dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200">
            <SelectValue placeholder={t('filterBy')} />
          </SelectTrigger>
          <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
            <SelectItem value="all" className="dark:text-gray-200 dark:focus:bg-gray-700">{t('all')}</SelectItem>
            <SelectItem value="tenant" className="dark:text-gray-200 dark:focus:bg-gray-700">{t('tenant')}</SelectItem>
            <SelectItem value="payment" className="dark:text-gray-200 dark:focus:bg-gray-700">{t('payment')}</SelectItem>
            <SelectItem value="maintenance" className="dark:text-gray-200 dark:focus:bg-gray-700">{t('maintenance')}</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
