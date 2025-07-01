
import React from "react";
import { motion } from "framer-motion";
import AppSidebar from "@/components/AppSidebar";
import { useFinancesFilters } from "@/hooks/useFinancesFilters";
import { useOptimizedFinancialData } from "@/hooks/useOptimizedFinancialData";
import { FinancesHeader } from "@/components/finances/FinancesHeader";
import ModernFinancialMetrics from "@/components/finances/ModernFinancialMetrics";
import FinancialOverview from "@/components/finances/FinancialOverview";
import RevenueExpenseChart from "@/components/finances/RevenueExpenseChart";

const Finances = () => {
  const {
    selectedPropertyId,
    selectedYear,
    handleYearChange,
    handlePropertyChange,
  } = useFinancesFilters();

  const { properties, isLoadingProperties } = useOptimizedFinancialData(selectedPropertyId);
  
  return (
    <div className="min-h-screen bg-background">
      <AppSidebar />
      <div className="ml-20 p-6 md:p-8 pt-24 md:pt-8 transition-all duration-300">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="space-y-6"
        >
          <FinancesHeader
            properties={properties}
            isLoadingProperties={isLoadingProperties}
            selectedPropertyId={selectedPropertyId}
            selectedYear={selectedYear}
            onPropertyChange={handlePropertyChange}
            onYearChange={handleYearChange}
          />
          
          <div className="space-y-6">
            <ModernFinancialMetrics 
              propertyId={selectedPropertyId} 
              selectedYear={selectedYear} 
            />
            
            <div className="grid grid-cols-1 gap-6">
              <RevenueExpenseChart 
                propertyId={selectedPropertyId} 
                selectedYear={selectedYear} 
              />
              <FinancialOverview 
                propertyId={selectedPropertyId} 
                selectedYear={selectedYear} 
              />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Finances;
