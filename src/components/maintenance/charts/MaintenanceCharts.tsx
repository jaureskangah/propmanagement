
import React, { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from "recharts";
import { useLocale } from "@/components/providers/LocaleProvider";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import { 
  useMaintenanceChartConfig, 
  useExpensesChartConfig,
  formatMonthsForLocale
} from "./utils/chartUtils";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

interface MaintenanceChartsProps {
  propertyId: string;
  selectedYear?: number;
}

export const MaintenanceCharts = ({ propertyId, selectedYear = new Date().getFullYear() }: MaintenanceChartsProps) => {
  const { t, locale } = useLocale();
  
  // Fetch maintenance requests data for the charts
  const { data: maintenanceRequests = [] } = useQuery({
    queryKey: ['maintenance_requests_chart', propertyId, selectedYear],
    queryFn: async () => {
      console.log("Fetching maintenance requests chart data for property:", propertyId, "and year:", selectedYear);
      
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
  const { data: expensesData = [] } = useQuery({
    queryKey: ['maintenance_expenses_chart', propertyId, selectedYear],
    queryFn: async () => {
      console.log("Fetching expenses chart data for property:", propertyId, "and year:", selectedYear);
      
      const startOfYear = new Date(selectedYear, 0, 1).toISOString().split('T')[0];
      const endOfYear = new Date(selectedYear, 11, 31).toISOString().split('T')[0];
      
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
      
      // Increment completed count if resolved
      if (request.status === 'Resolved') {
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
    
    return formatMonthsForLocale(monthlyData, locale);
  }, [maintenanceRequests, expensesData, locale]);
  
  // Get chart configurations
  const chartConfig = useMaintenanceChartConfig();
  const expensesChartConfig = useExpensesChartConfig();
  
  return (
    <div className="space-y-6">
      <Card className="border-border/40 bg-card/50 backdrop-blur-sm shadow-md dark:bg-gray-800/40 transition-all duration-200 hover:shadow-lg hover:bg-card/60 font-sans">
        <CardHeader>
          <CardTitle className="text-sm font-semibold text-primary/90 dark:text-white/90">
            {t('maintenanceRequestsTrends')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ChartContainer 
              config={chartConfig}
              className="h-full w-full"
            >
              <LineChart
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
                />
                <Tooltip content={<ChartTooltipContent />} />
                <Legend
                  height={36}
                  wrapperStyle={{ paddingTop: "8px" }}
                  verticalAlign="bottom"
                  formatter={(value) => <span className="text-xs">{value}</span>}
                />
                <Line 
                  type="monotone" 
                  dataKey="requests" 
                  name={chartConfig.totalRequests.label}
                  stroke={chartConfig.totalRequests.theme.light}
                  strokeWidth={2}
                  activeDot={{ r: 4, strokeWidth: 1 }}
                  dot={{ r: 0 }}
                  animationDuration={1000}
                  animationBegin={0}
                />
                <Line 
                  type="monotone" 
                  dataKey="completed" 
                  name={chartConfig.completedRequests.label}
                  stroke={chartConfig.completedRequests.theme.light}
                  strokeWidth={2}
                  activeDot={{ r: 4, strokeWidth: 1 }} 
                  dot={{ r: 0 }}
                  animationDuration={1000}
                  animationBegin={300}
                />
                <Line 
                  type="monotone" 
                  dataKey="urgent" 
                  name={chartConfig.urgentRequests.label}
                  stroke={chartConfig.urgentRequests.theme.light}
                  strokeWidth={2}
                  activeDot={{ r: 4, strokeWidth: 1 }}
                  dot={{ r: 0 }}
                  animationDuration={1000}
                  animationBegin={600}
                />
              </LineChart>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>
      
      <Card className="border-border/40 bg-card/50 backdrop-blur-sm shadow-md dark:bg-gray-800/40 transition-all duration-200 hover:shadow-lg hover:bg-card/60 font-sans">
        <CardHeader>
          <CardTitle className="text-sm font-semibold text-primary/90 dark:text-white/90">
            {t('maintenanceExpensesTrends')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ChartContainer
              config={expensesChartConfig}
              className="h-full w-full"
            >
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
                  content={<ChartTooltipContent />}
                />
                <Legend
                  height={36}
                  wrapperStyle={{ paddingTop: "8px" }}
                  verticalAlign="bottom"
                  formatter={(value) => <span className="text-xs">{value}</span>}
                />
                <Bar 
                  dataKey="expenses" 
                  name={expensesChartConfig.expenses.label}
                  fill={expensesChartConfig.expenses.theme.light}
                  animationDuration={1000}
                  animationBegin={0}
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
