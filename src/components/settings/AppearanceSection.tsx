
import { Moon } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { useLocale } from "@/components/providers/LocaleProvider";

interface AppearanceSectionProps {
  theme: string | undefined;
  onThemeChange: (checked: boolean) => void;
}

export function AppearanceSection({ theme, onThemeChange }: AppearanceSectionProps) {
  const { t } = useLocale();

  return (
    <Card className="overflow-hidden border-none shadow-md transition-all hover:shadow-lg">
      <div className="absolute inset-0 bg-gradient-to-r from-purple-50 to-violet-50 opacity-50" />
      <div className="absolute top-0 h-1 w-full bg-gradient-to-r from-purple-400 to-violet-500" />
      <CardHeader className="relative">
        <CardTitle className="flex items-center gap-2 text-xl">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100 text-purple-600">
            <Moon className="h-5 w-5" />
          </div>
          {t('appearance')}
        </CardTitle>
        <CardDescription className="text-sm opacity-75">
          {t('appearanceDescription')}
        </CardDescription>
      </CardHeader>
      <CardContent className="relative pb-6">
        <div className="flex justify-between items-center rounded-lg bg-white/60 p-4 shadow-sm">
          <div>
            <p className="font-medium text-slate-800">{t('darkTheme')}</p>
            <p className="text-sm text-slate-600">{t('darkThemeDescription')}</p>
          </div>
          <Switch 
            className="data-[state=checked]:bg-purple-500"
            checked={theme === "dark"}
            onCheckedChange={onThemeChange}
          />
        </div>
      </CardContent>
    </Card>
  );
}
