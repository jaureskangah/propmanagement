
import { Toggle } from "@/components/ui/toggle";
import { useLocale } from "../providers/LocaleProvider";
import { Ruler } from "lucide-react";

export function UnitToggle() {
  const { unitSystem, setUnitSystem, t } = useLocale();

  return (
    <Toggle
      pressed={unitSystem === 'imperial'}
      onPressedChange={(pressed) => setUnitSystem(pressed ? 'imperial' : 'metric')}
      className="bg-white/50 backdrop-blur-sm"
    >
      <Ruler className="h-4 w-4 mr-2" />
      {unitSystem === 'metric' ? 'm²' : 'sq ft'}
    </Toggle>
  );
}
