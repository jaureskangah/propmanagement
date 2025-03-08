
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
      className="mt-12 p-6 bg-card rounded-xl shadow-sm border"
    >
      <h2 className="text-xl font-bold mb-6 flex items-center">
        <DollarSign className="h-5 w-5 mr-2 text-primary" />
        {t('financialOverview')} - {selectedProperty?.name}
      </h2>
      <PropertyFinancials propertyId={selectedPropertyId} />
    </motion.div>
  );
};

export default PropertyFinancialsSection;
