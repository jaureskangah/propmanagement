
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
    <Card className="transition-all duration-300 hover:shadow-md overflow-hidden border-border dark-card-gradient">
      <div className="h-1 bg-indigo-500" />
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 dark:text-white">
          <div className="p-2 rounded-full bg-indigo-100 dark:bg-indigo-900/40">
            <Moon className="h-5 w-5 text-indigo-500 dark:text-indigo-400" />
          </div>
          {t('appearance')}
        </CardTitle>
        <CardDescription className="dark:text-gray-400">
          {t('appearanceDescription')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/60 flex justify-between items-start">
          <div>
            <p className="font-medium dark:text-white">{t('darkTheme')}</p>
            <p className="text-sm text-muted-foreground mt-1 dark:text-gray-400">{t('darkThemeDescription')}</p>
          </div>
          <Switch 
            className="mt-1"
            checked={theme === "dark"}
            onCheckedChange={onThemeChange}
          />
        </div>
      </CardContent>
    </Card>
  );
}
