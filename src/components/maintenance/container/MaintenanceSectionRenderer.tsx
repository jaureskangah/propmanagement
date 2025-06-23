
import React from "react";
import { MaintenanceOverview } from "../sections/MaintenanceOverview";
import { MaintenanceRequestsSection } from "../sections/MaintenanceRequestsSection";
import { MaintenanceTasksSection } from "../sections/MaintenanceTasksSection";
import { MaintenanceVendorsSection } from "../sections/MaintenanceVendorsSection";
import { MaintenanceFinancesSection } from "../sections/MaintenanceFinancesSection";

interface MaintenanceSectionRendererProps {
  activeTab: string;
  onError: (hasError: boolean) => void;
}

export const MaintenanceSectionRenderer = ({ activeTab, onError }: MaintenanceSectionRendererProps) => {
  const renderActiveSection = () => {
    try {
      switch (activeTab) {
        case 'overview':
          return <MaintenanceOverview />;
        case 'requests':
          return <MaintenanceRequestsSection />;
        case 'tasks':
          return <MaintenanceTasksSection />;
        case 'vendors':
          return <MaintenanceVendorsSection />;
        case 'finances':
          return <MaintenanceFinancesSection />;
        default:
          return <MaintenanceOverview />;
      }
    } catch (error) {
      console.error("MaintenanceSectionRenderer - Error rendering section:", activeTab, error);
      onError(true);
      return (
        <div className="text-center py-8">
          <p className="text-muted-foreground">Erreur lors du chargement de la section.</p>
          <button 
            onClick={() => onError(false)} 
            className="mt-4 px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
          >
            Réessayer
          </button>
        </div>
      );
    }
  };

  return renderActiveSection();
};
