
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { PropertyFinancials } from "../PropertyFinancials";
import { AddExpenseDialog } from "../financials/dialogs/AddExpenseDialog";

export const MaintenanceFinancesSection = () => {
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  
  const savedPropertyId = localStorage.getItem('selectedPropertyId') || "property-1";
  const savedYear = localStorage.getItem('selectedYear') ? 
    parseInt(localStorage.getItem('selectedYear') || '') : new Date().getFullYear();

  return (
    <div className="space-y-6">
      {/* Section Header with Actions */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold">Finances et dépenses</h2>
          <p className="text-muted-foreground">
            Suivez les coûts et dépenses de maintenance
          </p>
        </div>
        <Button 
          onClick={() => setIsAddExpenseOpen(true)}
          variant="outline"
          className="border-primary text-primary hover:bg-primary/10"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nouvelle dépense
        </Button>
      </div>

      {/* Financial Data */}
      <PropertyFinancials 
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
