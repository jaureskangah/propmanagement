
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLocale } from "@/components/providers/LocaleProvider";

interface PrioritySelectProps {
  value: "low" | "medium" | "high" | "urgent";
  onChange: (value: "low" | "medium" | "high" | "urgent") => void;
  label: string;
}

export const PrioritySelect = ({ value, onChange, label }: PrioritySelectProps) => {
  const { t } = useLocale();
  
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Select value={value} onValueChange={(value: "low" | "medium" | "high" | "urgent") => onChange(value)}>
        <SelectTrigger>
          <SelectValue placeholder={t('selectPriority')} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="low">{t('low')}</SelectItem>
          <SelectItem value="medium">{t('medium')}</SelectItem>
          <SelectItem value="high">{t('high')}</SelectItem>
          <SelectItem value="urgent">{t('urgent')}</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
