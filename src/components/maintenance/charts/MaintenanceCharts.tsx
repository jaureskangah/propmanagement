import React, { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  Area, 
  AreaChart 
} from "recharts";
import { useLocale } from "@/components/providers/LocaleProvider";
import { ChartContainer } from "@/components/ui/chart";
import { 
  useMaintenanceChartConfig, 
  useExpensesChartConfig,
  formatMonthsForLocale
} from "./utils/chartUtils";
import { MaintenanceChartTooltip } from "./MaintenanceChartTooltip";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { motion } from "framer-motion";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { chartColors } from "@/components/dashboard/revenue/chartColors";
import { Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface MaintenanceChartsProps {
  propertyId: string;
  selectedYear?: number;
}

export const MaintenanceCharts = ({ propertyId, selectedYear = new Date().getFullYear() }: MaintenanceChartsProps) => {
  const { t, language } = useLocale();
  const [activeMetrics, setActiveMetrics] = useState<string[]>(["totalRequests", "completedRequests", "urgentRequests"]);
  const [expensesView, setExpensesView] = useState<'bar' | 'area'>('area');
  
  // Only filter when both propertyId and selectedYear are provided AND different from defaults
  const shouldFilter = propertyId && 
                      selectedYear && 
                      propertyId !== "property-1" && 
                      selectedYear !== new Date().getFullYear();
  
  // Function to toggle metrics visibility
  const toggleMetric = (metricKey: string) => {
    setActiveMetrics(current => 
      current.includes(metricKey) 
        ? current.filter(key => key !== metricKey)
        : [...current, metricKey]
    );
  };
  
  // Fetch maintenance requests data for the charts
  const { 
    data: maintenanceRequests = [], 
    isLoading: isLoadingRequests,
    error: requestsError,
    refetch: refetchRequests
  } = useQuery({
    queryKey: ['maintenance_requests_chart', propertyId, selectedYear],
    queryFn: async () => {
      console.log("Fetching maintenance requests chart data for property:", propertyId, "and year:", selectedYear);
      
      // If filtering is disabled, fetch all maintenance requests
      if (!shouldFilter) {
        const { data, error } = await supabase
          .from('maintenance_requests')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) {
          console.error("Error fetching all maintenance requests:", error);
          throw error;
        }
        
        console.log(`Fetched ${data?.length || 0} maintenance requests (no filtering)`);
        return data || [];
      }
      
      const startOfYear = new Date(selectedYear, 0, 1).toISOString().split('T')[0];
      const endOfYear = new Date(selectedYear, 11, 31).toISOString().split('T')[0];
      
      // Get property's tenants to filter maintenance requests
      const { data: tenants, error: tenantsError } = await supabase
        .from('tenants')
        .select('id')
        .eq('property_id', propertyId);
        
      if (tenantsError) {
        console.error("Error fetching tenants:", tenantsError);
        throw tenantsError;
      }
      
      if (!tenants?.length) return [];
      
      const tenantIds = tenants.map(t => t.id);
      
      // Fetch maintenance requests for these tenants within selected year
      const { data, error } = await supabase
        .from('maintenance_requests')
        .select('*')
        .in('tenant_id', tenantIds)
        .gte('created_at', startOfYear)
        .lte('created_at', endOfYear);
      
      if (error) {
        console.error("Error fetching maintenance requests:", error);
        throw error;
      }
      
      console.log(`Fetched ${data?.length || 0} maintenance requests for property ${propertyId} in year ${selectedYear}`);
      return data || [];
    },
  });
  
  // Fetch expenses data for the charts
  const { 
    data: expensesData = [],
    isLoading: isLoadingExpenses,
    error: expensesError,
    refetch: refetchExpenses
  } = useQuery({
    queryKey: ['maintenance_expenses_chart', propertyId, selectedYear],
    queryFn: async () => {
      console.log("Fetching expenses chart data for property:", propertyId, "and year:", selectedYear);
      
      const startOfYear = new Date(selectedYear, 0, 1).toISOString().split('T')[0];
      const endOfYear = new Date(selectedYear, 11, 31).toISOString().split('T')[0];
      
      // If filtering is disabled, fetch all expenses
      if (!shouldFilter) {
        // Fetch all maintenance expenses
        const { data: expenses, error: expensesError } = await supabase
          .from('maintenance_expenses')
          .select('*')
          .gte('date', startOfYear)
          .lte('date', endOfYear);
          
        if (expensesError) {
          console.error("Error fetching all maintenance expenses:", expensesError);
          throw expensesError;
        }
        
        // Fetch all vendor interventions
        const { data: interventions, error: interventionsError } = await supabase
          .from('vendor_interventions')
          .select('*')
          .gte('date', startOfYear)
          .lte('date', endOfYear);
          
        if (interventionsError) {
          console.error("Error fetching all vendor interventions:", interventionsError);
          throw interventionsError;
        }
        
        const allExpenses = [
          ...(expenses || []),
          ...(interventions || []).map(i => ({
            date: i.date,
            amount: i.cost || 0
          }))
        ];
        
        console.log(`Fetched ${allExpenses.length} expense items (no filtering)`);
        return allExpenses;
      }
      
      // Fetch maintenance expenses for the property
      const { data: expenses, error: expensesError } = await supabase
        .from('maintenance_expenses')
        .select('*')
        .eq('property_id', propertyId)
        .gte('date', startOfYear)
        .lte('date', endOfYear);
        
      if (expensesError) {
        console.error("Error fetching maintenance expenses:", expensesError);
        throw expensesError;
      }
      
      // Fetch vendor interventions for the property
      const { data: interventions, error: interventionsError } = await supabase
        .from('vendor_interventions')
        .select('*')
        .eq('property_id', propertyId)
        .gte('date', startOfYear)
        .lte('date', endOfYear);
        
      if (interventionsError) {
        console.error("Error fetching vendor interventions:", interventionsError);
        throw interventionsError;
      }
      
      const allExpenses = [
        ...(expenses || []),
        ...(interventions || []).map(i => ({
          date: i.date,
          amount: i.cost || 0
        }))
      ];
      
      console.log(`Fetched ${allExpenses.length} expense items for property ${propertyId} in year ${selectedYear}`);
      return allExpenses;
    },
  });
  
  const isLoading = (isLoadingRequests || isLoadingExpenses) && shouldFilter;
  const error = requestsError || expensesError;

  // Handle refetching data
  const handleRefetch = () => {
    refetchRequests();
    refetchExpenses();
  };
  
  // Process chart data
  const chartData = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    // Initialize base data structure with all months
    const monthlyData = months.map(month => ({
      month,
      requests: 0,
      completed: 0,
      urgent: 0,
      expenses: 0
    }));
    
    // Process maintenance requests
    maintenanceRequests.forEach(request => {
      const date = new Date(request.created_at);
      const monthIndex = date.getMonth();
      
      // Increment request count
      monthlyData[monthIndex].requests += 1;
      
      // Increment completed count if resolved (handle both 'Resolved' and case variants)
      if (request.status === 'Resolved' || request.status === 'resolved') {
        monthlyData[monthIndex].completed += 1;
      }
      
      // Increment urgent count if priority is urgent
      if (request.priority === 'Urgent') {
        monthlyData[monthIndex].urgent += 1;
      }
    });
    
    // Process expenses
    expensesData.forEach(expense => {
      const date = new Date(expense.date);
      const monthIndex = date.getMonth();
      
      // Add expense amount
      monthlyData[monthIndex].expenses += parseFloat(expense.amount || 0);
    });
    
    return formatMonthsForLocale(monthlyData, language);
  }, [maintenanceRequests, expensesData, language]);
  
  // Get chart configurations
  const chartConfig = useMaintenanceChartConfig();
  const expensesChartConfig = useExpensesChartConfig();
  
  const MotionCard = ({ children, className }: { children: React.ReactNode, className?: string }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={className}
    >
      {children}
    </motion.div>
  );

  if (error) {
    return (
      <div className="space-y-6">
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <span>{t('errorLoadingData')}</span>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleRefetch}
              className="ml-2 h-7 px-2"
            >
              <RefreshCw className="h-3.5 w-3.5 mr-1" />
              {t('retry')}
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <MotionCard>
        <Card className="border-border/40 bg-card/50 backdrop-blur-sm shadow-md dark:bg-gray-800/40 transition-all duration-200 hover:shadow-lg hover:bg-card/60 font-sans">
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
              <CardTitle className="text-sm font-semibold text-primary/90 dark:text-white/90">
                {t('maintenanceRequestsTrends')}
              </CardTitle>
              <div className="flex flex-wrap gap-2">
                {Object.keys(chartConfig).map(key => (
                  <div
                    key={key}
                    className={`flex items-center gap-1.5 cursor-pointer px-2 py-1 rounded-md transition-all duration-200 text-xs
                      ${activeMetrics.includes(key) 
                        ? 'bg-blue-50 dark:bg-blue-900/20 shadow-sm' 
                        : 'opacity-60 hover:opacity-80'}`}
                    onClick={() => toggleMetric(key)}
                  >
                    <div 
                      className="h-2.5 w-2.5 rounded-full" 
                      style={{ backgroundColor: chartConfig[key].theme.light }} 
                    />
                    <span>{chartConfig[key].label}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center items-center h-80">
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
              </div>
            ) : (
              <div className="h-80">
                <ChartContainer 
                  config={chartConfig}
                  className="h-full w-full"
                >
                  <AreaChart
                    data={chartData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <defs>
                      {Object.keys(chartConfig).map(key => (
                        <linearGradient key={`gradient-${key}`} id={`color${key}`} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={chartConfig[key].theme.light} stopOpacity={0.8}/>
                          <stop offset="95%" stopColor={chartConfig[key].theme.light} stopOpacity={0.1}/>
                        </linearGradient>
                      ))}
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted/40" vertical={false} />
                    <XAxis 
                      dataKey="month" 
                      fontSize={10}
                      tickLine={false}
                      axisLine={false}
                      padding={{ left: 10, right: 10 }}
                    />
                    <YAxis 
                      fontSize={10}
                      tickLine={false}
                      axisLine={false}
                      padding={{ top: 10, bottom: 10 }}
                      width={30}
                    />
                    <Tooltip 
                      content={<MaintenanceChartTooltip />} 
                      animationDuration={200}
                    />
                    
                    {activeMetrics.includes('totalRequests') && (
                      <Area 
                        type="monotone" 
                        dataKey="requests" 
                        name={chartConfig.totalRequests.label}
                        stroke={chartConfig.totalRequests.theme.light}
                        strokeWidth={2}
                        activeDot={{ r: 6, strokeWidth: 1 }}
                        fillOpacity={1}
                        fill={`url(#colortotalRequests)`}
                        animationDuration={1200}
                        animationBegin={0}
                      />
                    )}
                    
                    {activeMetrics.includes('completedRequests') && (
                      <Area 
                        type="monotone" 
                        dataKey="completed" 
                        name={chartConfig.completedRequests.label}
                        stroke={chartConfig.completedRequests.theme.light}
                        strokeWidth={2}
                        activeDot={{ r: 6, strokeWidth: 1 }} 
                        fillOpacity={1}
                        fill={`url(#colorcompletedRequests)`}
                        animationDuration={1200}
                        animationBegin={300}
                      />
                    )}
                    
                    {activeMetrics.includes('urgentRequests') && (
                      <Area 
                        type="monotone" 
                        dataKey="urgent" 
                        name={chartConfig.urgentRequests.label}
                        stroke={chartConfig.urgentRequests.theme.light}
                        strokeWidth={2}
                        activeDot={{ r: 6, strokeWidth: 1 }}
                        fillOpacity={1}
                        fill={`url(#colorurgentRequests)`}
                        animationDuration={1200}
                        animationBegin={600}
                      />
                    )}
                  </AreaChart>
                </ChartContainer>
              </div>
            )}
          </CardContent>
        </Card>
      </MotionCard>
      
      <MotionCard className="animate-delay-150">
        <Card className="border-border/40 bg-card/50 backdrop-blur-sm shadow-md dark:bg-gray-800/40 transition-all duration-200 hover:shadow-lg hover:bg-card/60 font-sans">
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
              <CardTitle className="text-sm font-semibold text-primary/90 dark:text-white/90">
                {t('maintenanceExpensesTrends')}
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center items-center h-80">
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
              </div>
            ) : (
              <div className="h-80">
                <ChartContainer
                  config={expensesChartConfig}
                  className="h-full w-full"
                >
                  {expensesView === 'bar' ? (
                    <BarChart
                      data={chartData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted/40" vertical={false} />
                      <XAxis 
                        dataKey="month" 
                        fontSize={10}
                        tickLine={false}
                        axisLine={false}
                        padding={{ left: 10, right: 10 }}
                      />
                      <YAxis 
                        fontSize={10}
                        tickLine={false}
                        axisLine={false}
                        padding={{ top: 10, bottom: 10 }}
                        width={30}
                        tickFormatter={(value) => `$${value}`}
                      />
                      <Tooltip 
                        content={<MaintenanceChartTooltip />}
                        animationDuration={200}
                      />
                      <Bar 
                        dataKey="expenses" 
                        name={expensesChartConfig.expenses.label}
                        fill={chartColors.pendingColor}
                        animationDuration={1200}
                        animationBegin={0}
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  ) : (
                    <AreaChart
                      data={chartData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <defs>
                        <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={chartColors.pendingColor} stopOpacity={0.8} />
                          <stop offset="95%" stopColor={chartColors.pendingColor} stopOpacity={0.1} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted/40" vertical={false} />
                      <XAxis 
                        dataKey="month" 
                        fontSize={10}
                        tickLine={false}
                        axisLine={false}
                        padding={{ left: 10, right: 10 }}
                      />
                      <YAxis 
                        fontSize={10}
                        tickLine={false}
                        axisLine={false}
                        padding={{ top: 10, bottom: 10 }}
                        width={30}
                        tickFormatter={(value) => `$${value}`}
                      />
                      <Tooltip 
                        content={<MaintenanceChartTooltip />}
                        animationDuration={200}
                      />
                      <Area 
                        type="monotone"
                        dataKey="expenses" 
                        name={expensesChartConfig.expenses.label}
                        stroke={chartColors.pendingColor}
                        strokeWidth={2}
                        dot={{ r: 3, fill: chartColors.pendingColor }}
                        activeDot={{ r: 6, stroke: chartColors.pendingColor, strokeWidth: 1, fill: '#fff' }}
                        fill="url(#colorExpenses)"
                        fillOpacity={1}
                        animationDuration={1200}
                      />
                    </AreaChart>
                  )}
                </ChartContainer>
              </div>
            )}
          </CardContent>
        </Card>
      </MotionCard>
    </div>
  );
};
