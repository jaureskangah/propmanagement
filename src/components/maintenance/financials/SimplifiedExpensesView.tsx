
import React, { useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useFinancialData } from "./hooks/useFinancialData";
import { DollarSign, FileText, Wrench, Calendar } from "lucide-react";
import { DataTables } from "./DataTables";
import { formatCurrency } from "@/lib/utils";
import { ModernMetricCard } from "./components/ModernMetricCard";
import { useLocale } from "@/components/providers/LocaleProvider";

interface SimplifiedExpensesViewProps {
  propertyId: string;
  selectedYear: number;
}

export const SimplifiedExpensesView = ({ 
  propertyId,
  selectedYear 
}: SimplifiedExpensesViewProps) => {
  const { t } = useLocale();
  const { expenses, maintenance, refetch } = useFinancialData(propertyId, selectedYear);

  // Écouter l'événement personnalisé pour rafraîchir les données
  useEffect(() => {
    const handleExpenseAdded = () => {
      console.log("Événement expenseAdded reçu, rafraîchissement des données");
      refetch();
    };

    window.addEventListener('expenseAdded', handleExpenseAdded);
    return () => {
      window.removeEventListener('expenseAdded', handleExpenseAdded);
    };
  }, [refetch]);

  // Combine all expenses from maintenance_expenses and vendor_interventions
  const allExpenses = [
    ...expenses.map(expense => ({
      amount: expense.amount || 0,
      date: expense.date,
      category: expense.category || t('maintenance'),
      type: 'expense' as const
    })),
    ...maintenance.map(intervention => ({
      amount: intervention.cost || 0,
      date: intervention.date,
      category: t('maintenance'),
      type: 'intervention' as const
    }))
  ];

  // Calculate simplified metrics focused on expenses
  const totalExpenses = allExpenses.reduce((sum, item) => sum + item.amount, 0);
  const totalInterventions = maintenance.length;
  const monthlyAverage = totalExpenses / 12;
  
  // Calculate current month expenses (sum of amounts, not count)
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const currentMonthExpenses = allExpenses.filter(item => {
    const itemDate = new Date(item.date);
    return itemDate.getMonth() === currentMonth && itemDate.getFullYear() === currentYear;
  }).reduce((sum, item) => sum + item.amount, 0);

  const metrics = [
    {
      title: t('totalExpenses'),
      value: formatCurrency(totalExpenses),
      icon: <DollarSign className="h-5 w-5" />,
      description: t('totalExpenses'),
      chartColor: "#3B82F6",
    },
    {
      title: t('averageMonthlyExpenses'),
      value: formatCurrency(monthlyAverage),
      icon: <Calendar className="h-5 w-5" />,
      description: t('averageMonthlyExpenses'),
      chartColor: "#22C55E",
    },
    {
      title: t('maintenance'),
      value: totalInterventions.toString(),
      icon: <Wrench className="h-5 w-5" />,
      description: t('maintenance'),
      chartColor: "#8B5CF6",
    },
    {
      title: t('thisMonth'),
      value: formatCurrency(currentMonthExpenses),
      icon: <FileText className="h-5 w-5" />,
      description: t('thisMonth'),
      chartColor: "#F59E0B",
    },
  ];

  if (!propertyId) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-32">
          <p className="text-muted-foreground">
            {t('pleaseSelectProperty')}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Modern Metrics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric, index) => (
          <ModernMetricCard
            key={metric.title}
            title={metric.title}
            value={metric.value}
            description={metric.description}
            icon={metric.icon}
            chartColor={metric.chartColor}
            index={index}
          />
        ))}
      </div>

      {/* Data Tables */}
      <DataTables 
        propertyId={propertyId}
        expenses={expenses}
        allExpenses={allExpenses}
      />
    </div>
  );
};
