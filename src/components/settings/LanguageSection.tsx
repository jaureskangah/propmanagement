
import { Globe } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLocale } from "@/components/providers/LocaleProvider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function LanguageSection() {
  const { t, language, setLanguage } = useLocale();

  return (
    <Card className="overflow-hidden border-none shadow-md transition-all hover:shadow-lg">
      <div className="absolute inset-0 bg-gradient-to-r from-teal-50 to-emerald-50 opacity-50" />
      <div className="absolute top-0 h-1 w-full bg-gradient-to-r from-teal-400 to-emerald-500" />
      <CardHeader className="relative">
        <CardTitle className="flex items-center gap-2 text-xl">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-teal-100 text-teal-600">
            <Globe className="h-5 w-5" />
          </div>
          {t('language')}
        </CardTitle>
        <CardDescription className="text-sm opacity-75">
          {t('languageDescription')}
        </CardDescription>
      </CardHeader>
      <CardContent className="relative pb-6">
        <div className="flex justify-between items-center rounded-lg bg-white/60 p-4 shadow-sm">
          <div>
            <p className="font-medium text-slate-800">{t('languagePreference')}</p>
            <p className="text-sm text-slate-600">
              {language === 'en' ? t('english') : t('french')}
            </p>
          </div>
          <Select value={language} onValueChange={(value: 'en' | 'fr') => setLanguage(value)}>
            <SelectTrigger className="w-[180px] data-[state=open]:bg-teal-50">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">{t('english')}</SelectItem>
              <SelectItem value="fr">{t('french')}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}
