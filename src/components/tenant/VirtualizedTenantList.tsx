
import { useCallback, useEffect, useRef, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { TenantListItem } from "./TenantListItem";
import type { Tenant } from "@/types/tenant";

interface VirtualizedTenantListProps {
  tenants: Tenant[];
  selectedTenant: string | null;
  onTenantSelect: (id: string) => void;
  onEditClick: (id: string) => void;
  onDeleteClick: (id: string) => void;
}

export const VirtualizedTenantList = ({
  tenants,
  selectedTenant,
  onTenantSelect,
  onEditClick,
  onDeleteClick,
}: VirtualizedTenantListProps) => {
  const [visibleCount, setVisibleCount] = useState(5);
  const listRef = useRef<HTMLDivElement>(null);
  
  const handleScroll = useCallback(() => {
    if (!listRef.current) return;
    
    const element = listRef.current;
    const scrollRight = element.scrollLeft + element.clientWidth;
    const scrollThreshold = element.scrollWidth - 300;
    
    if (scrollRight >= scrollThreshold && visibleCount < tenants.length) {
      setVisibleCount(prev => Math.min(prev + 3, tenants.length));
    }
  }, [tenants.length, visibleCount]);
  
  useEffect(() => {
    const element = listRef.current;
    if (element) {
      element.addEventListener("scroll", handleScroll);
      return () => element.removeEventListener("scroll", handleScroll);
    }
  }, [handleScroll]);
  
  // Reset visible count when tenants change
  useEffect(() => {
    setVisibleCount(Math.min(10, tenants.length));
  }, [tenants]);
  
  return (
    <div 
      className="flex gap-3 pb-6 overflow-x-auto" 
      ref={listRef}
      style={{ scrollbarWidth: 'thin' }}
    >
      {tenants.slice(0, visibleCount).map((tenant, index) => (
        <TenantListItem
          key={tenant.id}
          tenant={tenant}
          isSelected={selectedTenant === tenant.id}
          onSelect={onTenantSelect}
          onEdit={onEditClick}
          onDelete={onDeleteClick}
          index={index}
        />
      ))}
      
      {visibleCount < tenants.length && (
        <div className="flex gap-3">
          {[...Array(Math.min(2, tenants.length - visibleCount))].map((_, index) => (
            <Skeleton key={index} className="h-64 w-[320px] rounded-md flex-shrink-0" />
          ))}
        </div>
      )}
    </div>
  );
};
