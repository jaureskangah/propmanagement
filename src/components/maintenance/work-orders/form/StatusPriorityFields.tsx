
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLocale } from "@/components/providers/LocaleProvider";

interface StatusPriorityFieldsProps {
  status: string;
  setStatus: (value: string) => void;
  priority: string;
  setPriority: (value: string) => void;
}

export const StatusPriorityFields = ({
  status,
  setStatus,
  priority,
  setPriority,
}: StatusPriorityFieldsProps) => {
  const { language } = useLocale();

  // Traduire les valeurs françaises en valeurs anglaises pour le stockage
  const handleStatusChange = (value: string) => {
    // Si la langue est française, convertir les valeurs françaises en anglais pour le stockage
    if (language === 'fr') {
      switch (value) {
        case "Planifié": setStatus("Scheduled"); return;
        case "En cours": setStatus("In Progress"); return;
        case "Terminé": setStatus("Completed"); return;
        default: setStatus(value); return;
      }
    }
    setStatus(value);
  };

  // Traduire les libellés des statuts pour l'affichage
  const getStatusLabel = (statusValue: string) => {
    if (language === 'fr') {
      switch (statusValue) {
        case "Scheduled": return "Planifié";
        case "In Progress": return "En cours";
        case "Completed": return "Terminé";
        default: return statusValue;
      }
    }
    return statusValue;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <label htmlFor="status">Statut</label>
        <Select 
          value={language === 'fr' ? getStatusLabel(status) : status} 
          onValueChange={handleStatusChange}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {language === 'fr' ? (
              <>
                <SelectItem value="Planifié">Planifié</SelectItem>
                <SelectItem value="En cours">En cours</SelectItem>
                <SelectItem value="Terminé">Terminé</SelectItem>
              </>
            ) : (
              <>
                <SelectItem value="Scheduled">Scheduled</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
              </>
            )}
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <label htmlFor="priority">Priorité</label>
        <Select value={priority} onValueChange={setPriority}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Basse">Basse</SelectItem>
            <SelectItem value="Moyenne">Moyenne</SelectItem>
            <SelectItem value="Haute">Haute</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
