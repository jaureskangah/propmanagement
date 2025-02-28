
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useLocale } from "@/components/providers/LocaleProvider";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
}

export const SearchInput = ({ value, onChange }: SearchInputProps) => {
  const { t } = useLocale();
  
  return (
    <div className="relative flex-1">
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={t('searchMessages')}
        className="pl-9"
      />
    </div>
  );
};
