
import { useEffect, useState } from "react";
import { TenantCard } from "./TenantCard";
import type { Tenant } from "@/types/tenant";

interface TenantListItemProps {
  tenant: Tenant;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  index: number;
}

export const TenantListItem = ({
  tenant,
  isSelected,
  onSelect,
  onEdit,
  onDelete,
  index
}: TenantListItemProps) => {
  const [isVisible, setIsVisible] = useState(index < 5);
  
  // Delayed rendering for better initial load performance
  useEffect(() => {
    if (!isVisible && index < 10) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, Math.min(index * 50, 300));
      
      return () => clearTimeout(timer);
    }
  }, [index, isVisible]);
  
  if (!isVisible) {
    return null;
  }
  
  return (
    <div className="animate-fadeIn" style={{ animationDelay: `${Math.min(index * 50, 300)}ms` }}>
      <TenantCard
        tenant={tenant}
        isSelected={isSelected}
        onSelect={onSelect}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    </div>
  );
};
