
import { Languages } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLocale } from "@/components/providers/LocaleProvider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function LanguageSection() {
  const { t, language, setLanguage } = useLocale();
  
  return (
    <Card className="transition-all duration-300 hover:shadow-md overflow-hidden border-border">
      <div className="h-1 bg-emerald-500" />
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <div className="p-2 rounded-full bg-emerald-100 dark:bg-emerald-900/30">
            <Languages className="h-5 w-5 text-emerald-500 dark:text-emerald-400" />
          </div>
          {t('language')}
        </CardTitle>
        <CardDescription>
          {t('languageDescription')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50">
          <p className="font-medium">{t('selectLanguage')}</p>
          <p className="text-sm text-muted-foreground mt-1 mb-3">{t('selectLanguageDescription')}</p>
          
          <Select 
            value={language} 
            onValueChange={(value: 'en' | 'fr') => setLanguage(value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={t('selectLanguage')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="fr">Français</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}
