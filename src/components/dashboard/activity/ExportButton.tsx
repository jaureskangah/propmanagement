
import { Button } from "@/components/ui/button";
import { Download, FileText, FileSpreadsheet } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useActivityExport } from "@/hooks/dashboard/activity/useActivityExport";
import { GroupedActivities } from "@/hooks/dashboard/activityTypes";
import { useLocale } from "@/components/providers/LocaleProvider";

interface ExportButtonProps {
  groupedActivities: GroupedActivities;
  hasActivities: boolean;
}

export const ExportButton = ({ groupedActivities, hasActivities }: ExportButtonProps) => {
  const { t } = useLocale();
  const { exportToCSV, exportToPDF } = useActivityExport(groupedActivities);
  
  if (!hasActivities) {
    return null; // Don't render if there are no activities
  }
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-1 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-700"
        >
          <Download className="h-4 w-4" />
          {t('export')}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-white dark:bg-gray-800 border dark:border-gray-700">
        <DropdownMenuItem 
          onClick={exportToCSV}
          className="flex items-center gap-2 cursor-pointer dark:text-gray-200 dark:hover:bg-gray-700"
        >
          <FileSpreadsheet className="h-4 w-4" />
          {t('exportCSV')}
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={exportToPDF}
          className="flex items-center gap-2 cursor-pointer dark:text-gray-200 dark:hover:bg-gray-700"
        >
          <FileText className="h-4 w-4" />
          {t('exportPDF')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
