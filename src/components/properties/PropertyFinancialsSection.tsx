
import React from "react";
import { Property } from "@/hooks/useProperties";
import PropertyFinancials from "@/components/PropertyFinancials";
import { DollarSign } from "lucide-react";
import { motion } from "framer-motion";
import { useLocale } from "@/components/providers/LocaleProvider";

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
      <h2 className="text-xl font-bold mb-6 flex items-center font-sans">
        <DollarSign className="h-5 w-5 mr-2 text-primary" />
        <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
          {t('financialOverview')}
        </span> - {selectedProperty?.name}
      </h2>
      <PropertyFinancials propertyId={selectedPropertyId} />
    </motion.div>
  );
};

export default PropertyFinancialsSection;
