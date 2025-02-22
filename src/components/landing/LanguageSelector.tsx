
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLocale } from "../providers/LocaleProvider";
import { Globe } from "lucide-react";

export function LanguageSelector() {
  const { language, setLanguage } = useLocale();

  const getLanguageLabel = (lang: string) => {
    return lang === 'en' ? 'English' : 'Français';
  };

  return (
    <Select value={language} onValueChange={(value: 'en' | 'fr') => setLanguage(value)}>
      <SelectTrigger className="w-[130px] bg-white border-gray-300 text-gray-900">
        <div className="flex items-center gap-2">
          <Globe className="h-4 w-4 text-gray-600" />
          <span className="text-sm font-medium">{getLanguageLabel(language)}</span>
        </div>
      </SelectTrigger>
      <SelectContent className="bg-white border border-gray-300">
        <SelectItem value="en" className="cursor-pointer">
          <span className="text-sm font-medium text-gray-900">English</span>
        </SelectItem>
        <SelectItem value="fr" className="cursor-pointer">
          <span className="text-sm font-medium text-gray-900">Français</span>
        </SelectItem>
      </SelectContent>
    </Select>
  );
}
