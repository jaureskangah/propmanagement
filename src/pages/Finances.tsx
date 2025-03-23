
import { useAuth } from "@/components/AuthProvider";
import AppSidebar from "@/components/AppSidebar";
import { useToast } from "@/hooks/use-toast";
import { useLocale } from "@/components/providers/LocaleProvider";
import FinancialOverview from "@/components/finances/FinancialOverview";
import FinancialMetrics from "@/components/finances/FinancialMetrics";
import RevenueExpenseChart from "@/components/finances/RevenueExpenseChart";
import PropertyFinancialSelector from "@/components/finances/PropertyFinancialSelector";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { MaintenanceCharts } from "@/components/maintenance/charts/MaintenanceCharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Finances() {
  const { user } = useAuth();
  const { toast } = useToast();
  const { t } = useLocale();
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);

  const { data: properties, isLoading: propertiesLoading } = useQuery({
    queryKey: ['properties'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('user_id', user?.id);

      if (error) throw error;
      
      // Set the first property as selected by default
      if (data && data.length > 0 && !selectedPropertyId) {
        setSelectedPropertyId(data[0].id);
      }
      
      return data;
    },
    enabled: !!user?.id
  });

  return (
    <div className="flex h-screen">
      <AppSidebar />
      <div className="flex-1 overflow-y-auto bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="space-y-4 p-3 md:p-5 lg:p-6 pb-16 max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-3 md:mb-4 animate-fade-in">
            <h1 className="text-xl md:text-2xl font-bold text-gradient-primary">{t('finances')}</h1>
            <PropertyFinancialSelector 
              properties={properties || []}
              isLoading={propertiesLoading}
              selectedPropertyId={selectedPropertyId}
              onPropertySelect={setSelectedPropertyId}
            />
          </div>

          <div className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <FinancialMetrics propertyId={selectedPropertyId} />
          </div>
          
          <div className="grid grid-cols-1 gap-4 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <RevenueExpenseChart propertyId={selectedPropertyId} />
          </div>
          
          <div className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <FinancialOverview propertyId={selectedPropertyId} />
          </div>

          {/* Section des graphiques de maintenance */}
          <div className="animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <Card className="border-border/40 bg-card/50 backdrop-blur-sm shadow-md dark:bg-gray-800/40 transition-all duration-200 hover:shadow-lg hover:bg-card/60 font-sans">
              <CardHeader>
                <CardTitle className="text-sm font-semibold text-primary/90 dark:text-white/90">
                  {t('maintenanceAnalytics')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <MaintenanceCharts propertyId={selectedPropertyId || ''} />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
