
import React, { useState } from "react";
import { Box, Search, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AddPropertyModal } from "@/components/AddPropertyModal";
import { useLocale } from "@/components/providers/LocaleProvider";
import { motion } from "framer-motion";

interface EmptyStateProps {
  isFiltering: boolean;
}

const EmptyState = ({ isFiltering }: EmptyStateProps) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const { t } = useLocale();

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="text-center py-16 bg-slate-50/80 dark:bg-slate-900/30 backdrop-blur-sm rounded-xl border border-dashed"
    >
      <div className="max-w-md mx-auto space-y-6 px-4">
        <div className="flex justify-center">
          {isFiltering ? (
            <Search className="h-16 w-16 text-slate-300 dark:text-slate-600" />
          ) : (
            <Box className="h-16 w-16 text-slate-300 dark:text-slate-600" />
          )}
        </div>
        
        {isFiltering ? (
          <>
            <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-300">
              {t('noPropertiesFiltered')}
            </h3>
            <p className="text-slate-500 dark:text-slate-400">
              {t('tryAdjustingFilters')}
            </p>
          </>
        ) : (
          <>
            <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-300">
              {t('noProperties')}
            </h3>
            <p className="text-slate-500 dark:text-slate-400">
              {t('addYourFirstProperty')}
            </p>
            <div className="pt-4">
              <Button 
                onClick={() => setIsAddModalOpen(true)}
                className="bg-primary hover:bg-primary/90 transition-all duration-200 shadow-md"
              >
                <PlusCircle className="h-5 w-5 mr-2" />
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
    </motion.div>
  );
};

export default EmptyState;
