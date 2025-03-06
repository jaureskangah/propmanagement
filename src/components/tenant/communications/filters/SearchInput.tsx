
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import { useLocale } from "@/components/providers/LocaleProvider";
import { Button } from "@/components/ui/button";

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
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={t('searchMessages')}
        className="pl-9"
      />
      {value && (
        <Button 
          variant="ghost" 
          size="sm" 
          className="absolute right-1 top-1 h-7 w-7 p-0" 
          onClick={() => onChange("")}
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};
