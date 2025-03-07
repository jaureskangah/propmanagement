
import { Filter } from "lucide-react";
import { useLocale } from "@/components/providers/LocaleProvider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ActivityFilterProps {
  value: string;
  onChange: (value: string) => void;
}

export const ActivityFilter = ({ value, onChange }: ActivityFilterProps) => {
  const { t } = useLocale();
  
  return (
    <div className="mb-4 flex justify-end">
      <div className="flex items-center space-x-2">
        <Filter className="h-4 w-4 text-muted-foreground" />
        <Select value={value} onValueChange={onChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder={t('filterBy')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('all')}</SelectItem>
            <SelectItem value="tenant">{t('tenant')}</SelectItem>
            <SelectItem value="payment">{t('payment')}</SelectItem>
            <SelectItem value="maintenance">{t('maintenance')}</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
