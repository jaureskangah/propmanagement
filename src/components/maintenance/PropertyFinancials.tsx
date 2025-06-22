
import React, { useEffect, useState } from "react";
import { MetricsCards } from "./financials/MetricsCards";
import { DataTables } from "./financials/DataTables";
import { useFinancialData } from "./financials/hooks/useFinancialData";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { AddExpenseDialog } from "./financials/dialogs/AddExpenseDialog";
import { useToast } from "@/hooks/use-toast";

interface PropertyFinancialsProps {
  propertyId: string;
  selectedYear?: number;
}

export const PropertyFinancials = ({ 
  propertyId,
  selectedYear = new Date().getFullYear()
}: PropertyFinancialsProps) => {
  console.log("Rendering PropertyFinancials for property:", propertyId, "and year:", selectedYear);
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    console.log("PropertyFinancials monté/mis à jour avec propertyId:", propertyId);
    
    if (!propertyId) {
      console.error("PropertyFinancials - ATTENTION: propertyId est manquant!");
    }
  }, [propertyId]);

  const { expenses, maintenance, rentData } = useFinancialData(propertyId, selectedYear);

  // Combine all expenses for allExpenses prop
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

  const handleOpenAddExpense = () => {
    if (!propertyId) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner une propriété avant d'ajouter une dépense",
        variant: "destructive",
      });
      return;
    }
    setIsAddExpenseOpen(true);
  };

  const handleExpenseAdded = () => {
    setIsAddExpenseOpen(false);
    toast({
      title: "Succès",
      description: "Dépense ajoutée avec succès",
    });
  };

  return (
    <div className="space-y-6">
      {/* Section Header with Add Expense Button */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold">Dépenses</h2>
          <p className="text-muted-foreground">
            Suivez et gérez toutes vos dépenses de maintenance
          </p>
        </div>
        <Button 
          onClick={handleOpenAddExpense}
          className="bg-primary hover:bg-primary/90"
          disabled={!propertyId}
        >
          <Plus className="h-4 w-4 mr-2" />
          Nouvelle dépense
        </Button>
      </div>

      <MetricsCards
        expenses={expenses}
        maintenance={maintenance}
        rentData={rentData}
      />
      <div className="space-y-6">
        <DataTables 
          propertyId={propertyId} 
          expenses={expenses} 
          allExpenses={allExpenses}
        />
      </div>

      {/* Add Expense Dialog */}
      {propertyId && (
        <AddExpenseDialog
          isOpen={isAddExpenseOpen}
          onClose={() => setIsAddExpenseOpen(false)}
          propertyId={propertyId}
          onSuccess={handleExpenseAdded}
        />
      )}
    </div>
  );
};
