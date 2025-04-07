
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import AppSidebar from "@/components/AppSidebar";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLocale } from "@/components/providers/LocaleProvider";
import { useIsMobile } from "@/hooks/use-mobile";
import FinancialMetrics from "@/components/finances/FinancialMetrics";
import FinancialOverview from "@/components/finances/FinancialOverview";
import RevenueExpenseChart from "@/components/finances/RevenueExpenseChart";

const Finances = () => {
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);
  const { t } = useLocale();
  const isMobile = useIsMobile();
  
  const { data: properties, isLoading: isLoadingProperties } = useQuery({
    queryKey: ["properties"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("properties")
        .select("*")
        .order("name");
      
      if (error) throw error;
      return data || [];
    },
  });
  
  return (
    <div className="min-h-screen bg-background">
      <AppSidebar />
      <div className="p-6 md:p-8 pt-24 md:pt-8 md:ml-[270px]">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="space-y-6"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">{t('finances')}</h1>
              <p className="text-sm text-muted-foreground mt-1">{t('financialOverview')}</p>
            </div>
            
            <Card className="w-full md:w-64">
              <CardContent className="p-3">
                {isLoadingProperties ? (
                  <div className="h-9 rounded-md bg-muted animate-pulse"></div>
                ) : (
                  <Select 
                    value={selectedPropertyId || ""} 
                    onValueChange={(value) => setSelectedPropertyId(value || null)}
                  >
                    <SelectTrigger className="w-full h-9">
                      <SelectValue placeholder={t('selectProperty')} />
                    </SelectTrigger>
                    <SelectContent>
                      {properties?.length ? (
                        properties.map((property) => (
                          <SelectItem key={property.id} value={property.id}>
                            {property.name}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="none" disabled>
                          {t('noPropertiesAvailable')}
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                )}
              </CardContent>
            </Card>
          </div>
          
          <div className="space-y-6">
            <FinancialMetrics propertyId={selectedPropertyId} />
            
            <div className="grid grid-cols-1 gap-6">
              <RevenueExpenseChart propertyId={selectedPropertyId} />
              <FinancialOverview propertyId={selectedPropertyId} />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Finances;
