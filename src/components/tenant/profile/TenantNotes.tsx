
import { FileText } from "lucide-react";
import { useLocale } from "@/components/providers/LocaleProvider";

interface TenantNotesProps {
  notes: string;
}

export const TenantNotes = ({ notes }: TenantNotesProps) => {
  const { t } = useLocale();
  
  return (
    <div className="px-4 sm:px-6 pb-4 sm:pb-6 pt-0">
      <h3 className="font-medium mb-2 flex items-center">
        <FileText className="h-4 w-4 mr-2 text-primary/70" />
        {t('notes')}
      </h3>
      <p className="text-sm text-muted-foreground bg-secondary/30 p-3 rounded-md border border-border/50">
        {notes}
      </p>
    </div>
  );
};
