
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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Moon className="h-5 w-5" />
          {t('appearance')}
        </CardTitle>
        <CardDescription>
          {t('appearanceDescription')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center">
          <div>
            <p className="font-medium">{t('darkTheme')}</p>
            <p className="text-sm text-muted-foreground">{t('darkThemeDescription')}</p>
          </div>
          <Switch 
            checked={theme === "dark"}
            onCheckedChange={onThemeChange}
          />
        </div>
      </CardContent>
    </Card>
  );
}
