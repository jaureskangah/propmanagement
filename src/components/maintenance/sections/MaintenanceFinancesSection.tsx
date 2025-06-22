
import React, { useState, useEffect } from "react";
import { SimplifiedExpensesView } from "../financials/SimplifiedExpensesView";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export const MaintenanceFinancesSection = () => {
  const [currentPropertyId, setCurrentPropertyId] = useState<string>("");
  const { toast } = useToast();

  // Récupérer les propriétés de l'utilisateur
  const { data: properties = [] } = useQuery({
    queryKey: ["properties"],
    queryFn: async () => {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError || !userData.user) return [];

      const { data, error } = await supabase
        .from("properties")
        .select("id, name")
        .eq("user_id", userData.user.id)
        .order("name");

      if (error) {
        console.error("Erreur lors de la récupération des propriétés:", error);
        return [];
      }

      return data || [];
    },
  });
  
  // Gérer la sélection automatique de propriété
  useEffect(() => {
    const savedPropertyId = localStorage.getItem('selectedPropertyId');
    console.log("MaintenanceFinancesSection - propertyId depuis localStorage:", savedPropertyId);
    
    if (savedPropertyId && properties.some(p => p.id === savedPropertyId)) {
      // La propriété sauvegardée existe toujours
      setCurrentPropertyId(savedPropertyId);
      console.log("Propriété trouvée dans localStorage:", savedPropertyId);
    } else if (properties.length === 1) {
      // Sélection automatique si une seule propriété
      const propertyId = properties[0].id;
      setCurrentPropertyId(propertyId);
      localStorage.setItem('selectedPropertyId', propertyId);
      console.log("Sélection automatique de la propriété unique:", propertyId);
    } else if (properties.length > 1 && !savedPropertyId) {
      // Plusieurs propriétés mais aucune sélectionnée
      toast({
        title: "Sélection de propriété requise",
        description: "Veuillez sélectionner une propriété pour gérer les dépenses",
        variant: "default",
      });
    }
  }, [properties, toast]);

  const savedYear = localStorage.getItem('selectedYear') ? 
    parseInt(localStorage.getItem('selectedYear') || '') : new Date().getFullYear();

  const handlePropertySelect = (propertyId: string) => {
    setCurrentPropertyId(propertyId);
    localStorage.setItem('selectedPropertyId', propertyId);
    console.log("Nouvelle propriété sélectionnée:", propertyId);
  };

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold">Dépenses</h2>
          <p className="text-muted-foreground">
            Suivez et gérez toutes vos dépenses de maintenance
          </p>
        </div>
        <div className="flex items-center space-x-4">
          {/* Property Selector */}
          {properties.length > 1 && (
            <select
              value={currentPropertyId}
              onChange={(e) => handlePropertySelect(e.target.value)}
              className="px-3 py-2 border rounded-md text-sm"
            >
              <option value="">Sélectionner une propriété</option>
              {properties.map((property) => (
                <option key={property.id} value={property.id}>
                  {property.name}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* Property Status Message */}
      {properties.length === 0 && (
        <div className="text-center p-6 bg-muted/50 rounded-lg">
          <p className="text-muted-foreground">
            Aucune propriété trouvée. Ajoutez d'abord une propriété pour gérer les dépenses.
          </p>
        </div>
      )}

      {properties.length > 0 && !currentPropertyId && (
        <div className="text-center p-6 bg-muted/50 rounded-lg">
          <p className="text-muted-foreground">
            Sélectionnez une propriété pour voir et gérer les dépenses.
          </p>
        </div>
      )}

      {/* Simplified Expenses View */}
      {currentPropertyId && (
        <SimplifiedExpensesView 
          propertyId={currentPropertyId}
          selectedYear={savedYear}
        />
      )}
    </div>
  );
};
