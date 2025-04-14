
import React, { useState, useEffect } from "react";
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
import { YearFilter } from "@/components/finances/YearFilter";
import { cn } from "@/lib/utils";
import { FileBarChart, Loader2 } from "lucide-react";

// Storage key for localStorage
const SELECTED_PROPERTY_KEY = "finances_selected_property_id";
const SELECTED_YEAR_KEY = "finances_selected_year";

const Finances = () => {
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const { t } = useLocale();
  const isMobile = useIsMobile();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  // Fetch properties
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

  // Load saved property ID and year from localStorage on initial render
  useEffect(() => {
    const savedPropertyId = localStorage.getItem(SELECTED_PROPERTY_KEY);
    const savedYear = localStorage.getItem(SELECTED_YEAR_KEY);
    
    if (savedPropertyId) {
      setSelectedPropertyId(savedPropertyId);
    }
    
    if (savedYear) {
      setSelectedYear(parseInt(savedYear, 10));
    }
  }, []);

  // Save property ID to localStorage when it changes
  useEffect(() => {
    if (selectedPropertyId) {
      localStorage.setItem(SELECTED_PROPERTY_KEY, selectedPropertyId);
    }
  }, [selectedPropertyId]);
  
  // Save selected year to localStorage when it changes
  useEffect(() => {
    localStorage.setItem(SELECTED_YEAR_KEY, selectedYear.toString());
  }, [selectedYear]);

  const handleYearChange = (year: number) => {
    console.log("Year changed to:", year);
    setSelectedYear(year);
  };

  const handlePropertyChange = (value: string) => {
    setSelectedPropertyId(value || null);
  };
  
  return (
    <div className="min-h-screen bg-background">
      <AppSidebar isCollapsed={sidebarCollapsed} setIsCollapsed={setSidebarCollapsed} />
      <div className={cn(
        "p-6 md:p-8 pt-24 md:pt-8 transition-all duration-300",
        sidebarCollapsed ? "md:ml-[80px]" : "md:ml-[270px]"
      )}>
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="space-y-6"
        >
          <div className="mb-8 bg-gradient-to-r from-background to-muted/30 backdrop-blur-sm p-6 rounded-xl border border-border/40 shadow-sm">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <FileBarChart className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">{t('finances')}</h1>
                  <p className="text-muted-foreground mt-1">{t('financialOverview')}</p>
                </div>
              </div>
              
              <div className="w-full md:w-auto flex flex-col sm:flex-row gap-3">
                <Card className="w-full md:w-64">
                  <CardContent className="p-3">
                    {isLoadingProperties ? (
                      <div className="flex items-center justify-center h-9 gap-2">
                        <Loader2 className="h-4 w-4 animate-spin text-primary" />
                        <span className="text-sm text-muted-foreground">{t('loading', { fallback: 'Loading...' })}</span>
                      </div>
                    ) : (
                      <Select 
                        value={selectedPropertyId || ""} 
                        onValueChange={handlePropertyChange}
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
                
                <Card className="w-full sm:w-auto">
                  <CardContent className="p-3">
                    <YearFilter selectedYear={selectedYear} onYearChange={handleYearChange} />
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
          
          <div className="space-y-6">
            <FinancialMetrics propertyId={selectedPropertyId} selectedYear={selectedYear} />
            
            <div className="grid grid-cols-1 gap-6">
              <RevenueExpenseChart propertyId={selectedPropertyId} selectedYear={selectedYear} />
              <FinancialOverview propertyId={selectedPropertyId} selectedYear={selectedYear} />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Finances;
