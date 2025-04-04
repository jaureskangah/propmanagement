
import React from 'react';
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useActivityExport } from '@/hooks/dashboard/activity/useActivityExport';
import { GroupedActivities } from '@/hooks/dashboard/activityTypes';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useLocale } from "@/components/providers/LocaleProvider";

interface ExportButtonProps {
  groupedActivities: GroupedActivities;
  hasActivities: boolean;
}

export const ExportButton = ({ groupedActivities, hasActivities }: ExportButtonProps) => {
  const { exportToCSV, exportToPDF } = useActivityExport(groupedActivities);
  const { t } = useLocale();
  
  if (!hasActivities) {
    return null;
  }
  
  return (
    <div className="flex items-center gap-2 mb-4">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center gap-1 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600 dark:hover:bg-gray-600"
              onClick={exportToCSV}
            >
              <Download className="h-4 w-4" />
              {t('exportCSV')}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Exporter au format CSV</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center gap-1 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600 dark:hover:bg-gray-600"
              onClick={exportToPDF}
            >
              <Download className="h-4 w-4" />
              {t('exportPDF')}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Exporter au format PDF</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};
