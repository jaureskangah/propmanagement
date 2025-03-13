
import React from "react";
import { Property } from "@/hooks/useProperties";
import PropertyFinancials from "@/components/PropertyFinancials";
import { DollarSign } from "lucide-react";
import { motion } from "framer-motion";
import { useLocale } from "@/components/providers/LocaleProvider";
import FinancialMetrics from "@/components/finances/FinancialMetrics";

interface PropertyFinancialsSectionProps {
  selectedPropertyId: string | null;
  selectedProperty: Property | undefined;
}

const PropertyFinancialsSection = ({ 
  selectedPropertyId, 
  selectedProperty 
}: PropertyFinancialsSectionProps) => {
  const { t } = useLocale();

  if (!selectedPropertyId) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mt-12 p-6 bg-card/50 backdrop-blur-sm rounded-xl shadow-sm border border-border/40 hover:shadow-md transition-all duration-300"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
          <DollarSign className="h-4 w-4 text-primary" />
        </div>
        <div>
          <h2 className="text-xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent font-sans">
            {t('financialOverview')} - {selectedProperty?.name}
          </h2>
        </div>
      </div>
      
      {/* Afficher les KPI avec le nouveau design */}
      <FinancialMetrics propertyId={selectedPropertyId} />
      
      {/* Le reste des données financières */}
      <PropertyFinancials propertyId={selectedPropertyId} />
    </motion.div>
  );
};

export default PropertyFinancialsSection;
