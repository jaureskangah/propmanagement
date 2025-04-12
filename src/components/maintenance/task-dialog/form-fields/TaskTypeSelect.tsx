
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLocale } from "@/components/providers/LocaleProvider";

interface TaskTypeSelectProps {
  value: "regular" | "inspection" | "seasonal";
  onChange: (value: "regular" | "inspection" | "seasonal") => void;
  label: string;
}

export const TaskTypeSelect = ({ value, onChange, label }: TaskTypeSelectProps) => {
  const { t } = useLocale();
  
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Select value={value} onValueChange={(value: "regular" | "inspection" | "seasonal") => onChange(value)}>
        <SelectTrigger>
          <SelectValue placeholder={t('selectType')} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="regular">{t('regularTask')}</SelectItem>
          <SelectItem value="inspection">{t('inspection')}</SelectItem>
          <SelectItem value="seasonal">{t('seasonalTask')}</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
