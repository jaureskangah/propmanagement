
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useFinancialData } from "./hooks/useFinancialData";
import { DollarSign, FileText, Wrench, Calendar } from "lucide-react";
import { DataTables } from "./DataTables";

interface SimplifiedExpensesViewProps {
  propertyId: string;
  selectedYear: number;
}

export const SimplifiedExpensesView = ({ 
  propertyId,
  selectedYear 
}: SimplifiedExpensesViewProps) => {
  const { expenses, maintenance } = useFinancialData(propertyId, selectedYear);

  // Calculate simplified metrics focused on expenses
  const totalExpenses = expenses.reduce((sum, expense) => sum + (expense.amount || 0), 0);
  const totalInterventions = maintenance.length;
  const monthlyAverage = totalExpenses / 12;
  const recentExpenses = expenses.filter(expense => {
    const expenseDate = new Date(expense.date);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return expenseDate >= thirtyDaysAgo;
  }).length;

  const metrics = [
    {
      title: "Dépenses totales",
      value: `${totalExpenses.toLocaleString('fr-FR')} €`,
      icon: <DollarSign className="h-5 w-5" />,
      description: "Total des dépenses",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Moyenne mensuelle",
      value: `${monthlyAverage.toLocaleString('fr-FR', { maximumFractionDigits: 0 })} €`,
      icon: <Calendar className="h-5 w-5" />,
      description: "Dépenses par mois",
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Interventions",
      value: totalInterventions.toString(),
      icon: <Wrench className="h-5 w-5" />,
      description: "Nombre d'interventions",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Ce mois-ci",
      value: recentExpenses.toString(),
      icon: <FileText className="h-5 w-5" />,
      description: "Dépenses récentes",
      color: "text-orange-600",
      bgColor: "bg-orange-50",
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
      {/* Metrics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => (
          <Card key={metric.title} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <div className={`p-2 rounded-lg ${metric.bgColor}`}>
                  <div className={metric.color}>
                    {metric.icon}
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    {metric.title}
                  </p>
                  <p className="text-2xl font-bold">{metric.value}</p>
                  <p className="text-xs text-muted-foreground">
                    {metric.description}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Data Tables */}
      <DataTables 
        propertyId={propertyId}
        expenses={expenses}
        maintenance={maintenance}
      />
    </div>
  );
};
