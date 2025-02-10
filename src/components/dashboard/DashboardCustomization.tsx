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

const AVAILABLE_SECTIONS = [
  { id: "metrics", label: "Metrics Overview" },
  { id: "priority", label: "Priority Section" },
  { id: "revenue", label: "Revenue Chart" },
  { id: "activity", label: "Recent Activity" },
];

export function DashboardCustomization() {
  const { preferences, updatePreferences } = useDashboardPreferences();

  const toggleSection = (sectionId: string) => {
    const newHiddenSections = preferences.hidden_sections.includes(sectionId)
      ? preferences.hidden_sections.filter((id) => id !== sectionId)
      : [...preferences.hidden_sections, sectionId];

    updatePreferences.mutate({ hidden_sections: newHiddenSections });
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="ml-auto">
          <Settings className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Dashboard Customization</SheetTitle>
          <SheetDescription>
            Customize your dashboard layout and visible sections
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6">
          <h3 className="text-sm font-medium mb-4">Visible Sections</h3>
          <div className="space-y-4">
            {AVAILABLE_SECTIONS.map((section) => (
              <div
                key={section.id}
                className="flex items-center justify-between"
              >
                <Label htmlFor={section.id} className="cursor-pointer">
                  {section.label}
                </Label>
                <Switch
                  id={section.id}
                  checked={!preferences.hidden_sections.includes(section.id)}
                  onCheckedChange={() => toggleSection(section.id)}
                />
              </div>
            ))}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}