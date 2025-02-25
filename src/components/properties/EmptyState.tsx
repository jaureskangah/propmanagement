
import React, { useState } from "react";
import { Box } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AddPropertyModal } from "@/components/AddPropertyModal";
import { useLocale } from "@/components/providers/LocaleProvider";

interface EmptyStateProps {
  isFiltering: boolean;
}

const EmptyState = ({ isFiltering }: EmptyStateProps) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const { t } = useLocale();

  return (
    <div className="text-center py-16 bg-slate-50 rounded-xl animate-fade-in">
      <div className="max-w-md mx-auto space-y-6">
        <div className="flex justify-center">
          <Box className="h-16 w-16 text-slate-400 animate-pulse" />
        </div>
        
        {isFiltering ? (
          <>
            <h3 className="text-lg font-semibold text-slate-700">
              {t('noPropertiesFiltered')}
            </h3>
            <p className="text-slate-500">
              {t('filterByType')}
            </p>
          </>
        ) : (
          <>
            <h3 className="text-lg font-semibold text-slate-700">
              {t('noProperties')}
            </h3>
            <p className="text-slate-500">
              {t('propertiesSubtitle')}
            </p>
            <div className="pt-4">
              <Button onClick={() => setIsAddModalOpen(true)}>
                {t('addProperty')}
              </Button>
              <AddPropertyModal 
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default EmptyState;
