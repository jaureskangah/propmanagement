
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { SimplifiedExpensesView } from "../financials/SimplifiedExpensesView";
import { AddExpenseDialog } from "../financials/dialogs/AddExpenseDialog";
import { useToast } from "@/hooks/use-toast";

export const MaintenanceFinancesSection = () => {
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [currentPropertyId, setCurrentPropertyId] = useState<string>("");
  const { toast } = useToast();
  
  // Récupérer le propertyId depuis localStorage et valider
  useEffect(() => {
    const savedPropertyId = localStorage.getItem('selectedPropertyId');
    console.log("MaintenanceFinancesSection - propertyId depuis localStorage:", savedPropertyId);
    
    if (!savedPropertyId) {
      console.warn("Aucun propertyId trouvé dans localStorage");
      toast({
        title: "Attention",
        description: "Veuillez sélectionner une propriété pour ajouter des dépenses",
        variant: "destructive",
      });
    } else {
      setCurrentPropertyId(savedPropertyId);
    }
  }, [toast]);

  const savedYear = localStorage.getItem('selectedYear') ? 
    parseInt(localStorage.getItem('selectedYear') || '') : new Date().getFullYear();

  const handleOpenAddExpense = () => {
    if (!currentPropertyId) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner une propriété avant d'ajouter une dépense",
        variant: "destructive",
      });
      return;
    }
    console.log("Ouverture du dialogue avec propertyId:", currentPropertyId);
    setIsAddExpenseOpen(true);
  };

  const handleExpenseAdded = () => {
    console.log("Dépense ajoutée avec succès, rafraîchissement des données");
    setIsAddExpenseOpen(false);
    // Forcer le rafraîchissement en mettant à jour une clé
    window.dispatchEvent(new CustomEvent('expenseAdded'));
  };

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
          onClick={handleOpenAddExpense}
          className="bg-primary hover:bg-primary/90"
          disabled={!currentPropertyId}
        >
          <Plus className="h-4 w-4 mr-2" />
          Nouvelle dépense
        </Button>
      </div>

      {/* Simplified Expenses View */}
      <SimplifiedExpensesView 
        propertyId={currentPropertyId}
        selectedYear={savedYear}
      />

      {/* Add Expense Dialog */}
      {currentPropertyId && (
        <AddExpenseDialog
          isOpen={isAddExpenseOpen}
          onClose={() => setIsAddExpenseOpen(false)}
          propertyId={currentPropertyId}
          onSuccess={handleExpenseAdded}
        />
      )}
    </div>
  );
};
