
import React from "react";
import { AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useLocale } from "@/components/providers/LocaleProvider";

interface StatusBadgeProps {
  isUpcoming: boolean;
}

export const StatusBadge = ({ isUpcoming }: StatusBadgeProps) => {
  const { t } = useLocale();
  
  if (isUpcoming) {
    return (
      <Badge variant="outline" className="text-amber-600 border-amber-200 bg-amber-50">
        {t('upcoming')}
      </Badge>
    );
  }
  
  return (
    <Badge variant="outline" className="text-red-600 border-red-200 bg-red-50">
      <AlertTriangle className="h-3 w-3 mr-1" />
      {t('now')}
    </Badge>
  );
};
