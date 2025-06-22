
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { SimplifiedExpensesView } from "../financials/SimplifiedExpensesView";
import { AddExpenseDialog } from "../financials/dialogs/AddExpenseDialog";

export const MaintenanceFinancesSection = () => {
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  
  const savedPropertyId = localStorage.getItem('selectedPropertyId') || "";
  const savedYear = localStorage.getItem('selectedYear') ? 
    parseInt(localStorage.getItem('selectedYear') || '') : new Date().getFullYear();

  return (
    <div className="space-y-6">
      {/* Section Header with Actions */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold">Dépenses</h2>
          <p className="text-muted-foreground">
            Suivez et gérez toutes vos dépenses de maintenance
          </p>
        </div>
        <Button 
          onClick={() => setIsAddExpenseOpen(true)}
          className="bg-primary hover:bg-primary/90"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nouvelle dépense
        </Button>
      </div>

      {/* Simplified Expenses View */}
      <SimplifiedExpensesView 
        propertyId={savedPropertyId}
        selectedYear={savedYear}
      />

      {/* Add Expense Dialog */}
      <AddExpenseDialog
        isOpen={isAddExpenseOpen}
        onClose={() => setIsAddExpenseOpen(false)}
        propertyId={savedPropertyId}
      />
    </div>
  );
};
