
import { Filter } from "lucide-react";
import { useLocale } from "@/components/providers/LocaleProvider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

interface ActivityFilterProps {
  value: string;
  onChange: (value: string) => void;
}

export const ActivityFilter = ({ value, onChange }: ActivityFilterProps) => {
  const { t } = useLocale();
  const initialRender = useRef(true);
  const [internalValue, setInternalValue] = useState(value);
  const prevValueRef = useRef(value);
  const lastChangeTimeRef = useRef<number>(0);
  
  // Synchroniser la valeur interne avec la valeur externe
  useEffect(() => {
    console.log("[ActivityFilter] Valeur externe mise à jour:", value, "Ancienne valeur:", prevValueRef.current);
    if (value !== prevValueRef.current) {
      setInternalValue(value);
      prevValueRef.current = value;
    }
  }, [value]);
  
  // Détecter les sélections successives du même filtre
  useEffect(() => {
    if (initialRender.current) {
      initialRender.current = false;
      return;
    }
    
    console.log("[ActivityFilter] Valeur actuelle du filtre:", value);
  }, [value]);
  
  const handleValueChange = (newValue: string) => {
    console.log("[ActivityFilter] Changement de filtre demandé:", newValue, "depuis:", internalValue);
    
    // Prévenir les multiples clics très rapides
    const now = Date.now();
    if (now - lastChangeTimeRef.current < 300) {
      console.log("[ActivityFilter] Clics trop rapides, ignoré");
      return;
    }
    lastChangeTimeRef.current = now;
    
    setInternalValue(newValue); // Mettre à jour la valeur interne immédiatement
    
    // Gérer le cas où on sélectionne le même filtre à nouveau
    if (newValue === value) {
      console.log("[ActivityFilter] Même filtre sélectionné à nouveau: forçage du rafraîchissement");
      toast.info(`${t('refreshing')}: ${t(newValue)}`);
    }
    
    // Toujours appeler onChange, même si la valeur est la même
    onChange(newValue);
  };
  
  return (
    <div className="mb-4 flex justify-end">
      <div className="flex items-center space-x-2">
        <Filter className="h-4 w-4 text-muted-foreground" />
        <Select value={internalValue} onValueChange={handleValueChange}>
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
