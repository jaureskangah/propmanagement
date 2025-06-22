
import React, { useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useFinancialData } from "./hooks/useFinancialData";
import { DollarSign, FileText, Wrench, Calendar } from "lucide-react";
import { DataTables } from "./DataTables";
import { formatCurrency } from "@/lib/utils";
import { ModernMetricCard } from "./components/ModernMetricCard";

interface SimplifiedExpensesViewProps {
  propertyId: string;
  selectedYear: number;
}

export const SimplifiedExpensesView = ({ 
  propertyId,
  selectedYear 
}: SimplifiedExpensesViewProps) => {
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
      category: expense.category || 'Maintenance',
      type: 'expense' as const
    })),
    ...maintenance.map(intervention => ({
      amount: intervention.cost || 0,
      date: intervention.date,
      category: 'Intervention',
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
      title: "Dépenses totales",
      value: formatCurrency(totalExpenses),
      icon: <DollarSign className="h-5 w-5" />,
      description: "Total des dépenses",
      chartColor: "#3B82F6",
    },
    {
      title: "Moyenne mensuelle",
      value: formatCurrency(monthlyAverage),
      icon: <Calendar className="h-5 w-5" />,
      description: "Dépenses par mois",
      chartColor: "#22C55E",
    },
    {
      title: "Interventions",
      value: totalInterventions.toString(),
      icon: <Wrench className="h-5 w-5" />,
      description: "Nombre d'interventions",
      chartColor: "#8B5CF6",
    },
    {
      title: "Ce mois-ci",
      value: formatCurrency(currentMonthExpenses),
      icon: <FileText className="h-5 w-5" />,
      description: "Dépenses ce mois",
      chartColor: "#F59E0B",
    },
  ];

  if (!propertyId) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-32">
          <p className="text-muted-foreground">
            Veuillez sélectionner une propriété pour voir les dépenses
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
