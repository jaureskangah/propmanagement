import React from "react";
import { Box } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AddPropertyModal } from "@/components/AddPropertyModal";

interface EmptyStateProps {
  isFiltering: boolean;
}

const EmptyState = ({ isFiltering }: EmptyStateProps) => {
  return (
    <div className="text-center py-16 bg-slate-50 rounded-xl animate-fade-in">
      <div className="max-w-md mx-auto space-y-6">
        <div className="flex justify-center">
          <Box className="h-16 w-16 text-slate-400 animate-pulse" />
        </div>
        
        {isFiltering ? (
          <>
            <h3 className="text-lg font-semibold text-slate-700">
              Aucune propriété ne correspond à vos critères
            </h3>
            <p className="text-slate-500">
              Essayez d'ajuster vos filtres ou votre recherche pour voir plus de résultats.
            </p>
          </>
        ) : (
          <>
            <h3 className="text-lg font-semibold text-slate-700">
              Commencez à gérer vos propriétés
            </h3>
            <p className="text-slate-500">
              Ajoutez votre première propriété pour commencer à suivre vos biens immobiliers.
            </p>
            <div className="pt-4">
              <AddPropertyModal />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default EmptyState;