
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
      <SelectTrigger className="w-[130px] bg-white/90 backdrop-blur-sm border-gray-200 hover:bg-gray-50/90 transition-colors">
        <div className="flex items-center gap-2">
          <Globe className="h-4 w-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-600">{getLanguageLabel(language)}</span>
        </div>
      </SelectTrigger>
      <SelectContent className="bg-white/95 backdrop-blur-sm border border-gray-200">
        <SelectItem value="en" className="cursor-pointer hover:bg-gray-50">
          <span className="text-sm font-medium text-gray-600">English</span>
        </SelectItem>
        <SelectItem value="fr" className="cursor-pointer hover:bg-gray-50">
          <span className="text-sm font-medium text-gray-600">Français</span>
        </SelectItem>
      </SelectContent>
    </Select>
  );
}
