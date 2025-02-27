
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLocale } from "@/components/providers/LocaleProvider";

interface TypeFilterProps {
  selectedType: string;
  onTypeChange: (value: string) => void;
}

export const TypeFilter = ({ selectedType, onTypeChange }: TypeFilterProps) => {
  const { t } = useLocale();
  
  return (
    <Select value={selectedType} onValueChange={onTypeChange}>
      <SelectTrigger className="w-[140px] sm:w-[180px]">
        <SelectValue placeholder={t('taskType')} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">{t('all')}</SelectItem>
        <SelectItem value="regular">{t('regularTask')}</SelectItem>
        <SelectItem value="inspection">{t('inspection')}</SelectItem>
        <SelectItem value="seasonal">{t('seasonalTask')}</SelectItem>
      </SelectContent>
    </Select>
  );
};
