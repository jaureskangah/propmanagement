
import React, { ReactNode } from 'react';

interface MetricIconProps {
  icon: ReactNode;
  chartColor?: string;
}

export const MetricIcon = ({ icon, chartColor = "#3B82F6" }: MetricIconProps) => {
  // Créer un style avec une couleur de fond légèrement transparente basée sur la couleur du graphique
  const bgColor = `${chartColor}15`; // Ajoute 15 en hexadécimal pour 8% d'opacité

  return (
    <div 
      className="mr-2 p-1.5 rounded-full" 
      style={{ backgroundColor: bgColor, color: chartColor }}
    >
      {icon}
    </div>
  );
};
