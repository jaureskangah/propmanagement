
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Settings } from "lucide-react";
import { useDashboardPreferences } from "./hooks/useDashboardPreferences";
import { useLocale } from "@/components/providers/LocaleProvider";

export function DashboardCustomization() {
  const { preferences, updatePreferences } = useDashboardPreferences();
  const { t } = useLocale();

  const AVAILABLE_SECTIONS = [
    { id: "metrics", label: t('metricsOverview') },
    { id: "priority", label: t('prioritySection') },
    { id: "revenue", label: t('revenueChart') },
    { id: "activity", label: t('recentActivity') },
  ];

  const toggleSection = (sectionId: string) => {
    const newHiddenSections = preferences.hidden_sections.includes(sectionId)
      ? preferences.hidden_sections.filter((id) => id !== sectionId)
      : [...preferences.hidden_sections, sectionId];

    updatePreferences.mutate({ hidden_sections: newHiddenSections });
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="ml-auto dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-gray-200">
          <Settings className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent className="dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100">
        <SheetHeader>
          <SheetTitle className="dark:text-white">{t('dashboardCustomization')}</SheetTitle>
          <SheetDescription className="dark:text-gray-400">
            {t('customizeDescription')}
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6">
          <h3 className="text-sm font-medium mb-4 dark:text-gray-200">{t('visibleSections')}</h3>
          <div className="space-y-4">
            {AVAILABLE_SECTIONS.map((section) => (
              <div
                key={section.id}
                className="flex items-center justify-between"
              >
                <Label htmlFor={section.id} className="cursor-pointer dark:text-gray-300">
                  {section.label}
                </Label>
                <Switch
                  id={section.id}
                  checked={!preferences.hidden_sections.includes(section.id)}
                  onCheckedChange={() => toggleSection(section.id)}
                  className="dark:data-[state=checked]:bg-blue-600"
                />
              </div>
            ))}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
