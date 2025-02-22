
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
      <SelectTrigger className="w-[130px] bg-white/50 backdrop-blur-sm border-gray-200">
        <div className="flex items-center gap-2">
          <Globe className="h-4 w-4 text-gray-600" />
          <SelectValue placeholder={getLanguageLabel(language)} />
        </div>
      </SelectTrigger>
      <SelectContent className="bg-white">
        <SelectItem value="en" className="cursor-pointer">
          <span className="text-sm font-medium">English</span>
        </SelectItem>
        <SelectItem value="fr" className="cursor-pointer">
          <span className="text-sm font-medium">Français</span>
        </SelectItem>
      </SelectContent>
    </Select>
  );
}
