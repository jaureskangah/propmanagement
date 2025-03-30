
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLocale } from "../providers/LocaleProvider";
import { Globe } from "lucide-react";
import { motion } from "framer-motion";

export function LanguageSelector() {
  const { language, setLanguage } = useLocale();

  const getLanguageLabel = (lang: string) => {
    return lang === 'en' ? 'English' : 'Français';
  };

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
    >
      <Select value={language} onValueChange={(value: 'en' | 'fr') => setLanguage(value)}>
        <SelectTrigger className="w-[110px] sm:w-[130px] bg-white/70 backdrop-blur-sm border-gray-200 hover:bg-gray-50/80 transition-colors rounded-full shadow-sm">
          <div className="flex items-center gap-1 sm:gap-2">
            <Globe className="h-4 w-4 text-gray-500" />
            <span className="text-xs sm:text-sm font-medium text-gray-600">{getLanguageLabel(language)}</span>
          </div>
        </SelectTrigger>
        <SelectContent className="min-w-[110px] sm:min-w-[130px] bg-white/95 backdrop-blur-sm border border-gray-200 rounded-lg shadow-md">
          <SelectItem value="en" className="cursor-pointer hover:bg-gray-50 rounded-md my-1">
            <span className="text-xs sm:text-sm font-medium text-gray-600">English</span>
          </SelectItem>
          <SelectItem value="fr" className="cursor-pointer hover:bg-gray-50 rounded-md my-1">
            <span className="text-xs sm:text-sm font-medium text-gray-600">Français</span>
          </SelectItem>
        </SelectContent>
      </Select>
    </motion.div>
  );
}
