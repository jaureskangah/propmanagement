
import { useAuth } from "@/components/AuthProvider";
import AppSidebar from "@/components/AppSidebar";
import { useToast } from "@/hooks/use-toast";
import { useLocale } from "@/components/providers/LocaleProvider";
import FinancialOverview from "@/components/finances/FinancialOverview";
import FinancialMetrics from "@/components/finances/FinancialMetrics";
import RevenueExpenseChart from "@/components/finances/RevenueExpenseChart";
import ROICalculator from "@/components/finances/ROICalculator";
import PropertyFinancialSelector from "@/components/finances/PropertyFinancialSelector";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

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
      <div className="flex-1 overflow-y-auto">
        <div className="space-y-8 p-8 pb-16 max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h1 className="text-3xl font-bold">{t('finances')}</h1>
            <PropertyFinancialSelector 
              properties={properties || []}
              isLoading={propertiesLoading}
              selectedPropertyId={selectedPropertyId}
              onPropertySelect={setSelectedPropertyId}
            />
          </div>

          <FinancialMetrics propertyId={selectedPropertyId} />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <RevenueExpenseChart propertyId={selectedPropertyId} />
            <ROICalculator propertyId={selectedPropertyId} />
          </div>
          
          <FinancialOverview propertyId={selectedPropertyId} />
        </div>
      </div>
    </div>
  );
}
