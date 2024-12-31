import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Home, Pencil, Trash2 } from "lucide-react";
import type { Tenant } from "@/types/tenant";

interface TenantListProps {
  tenants: Tenant[];
  selectedTenant: string | null;
  onTenantSelect: (id: string) => void;
  onEditClick: (id: string) => void;
  onDeleteClick: (id: string) => void;
}

export const TenantList = ({
  tenants,
  selectedTenant,
  onTenantSelect,
  onEditClick,
  onDeleteClick,
}: TenantListProps) => {
  return (
    <div className="space-y-4">
      {tenants?.map((tenant) => (
        <Card
          key={tenant.id}
          className={`cursor-pointer hover:bg-accent ${
            selectedTenant === tenant.id ? "border-primary" : ""
          }`}
          onClick={() => onTenantSelect(tenant.id)}
        >
          <div className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold">{tenant.name}</h3>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <Home className="h-4 w-4" />
                  {tenant.properties?.name} - Unit {tenant.unit_number}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEditClick(tenant.id);
                  }}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-destructive hover:text-destructive/90"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteClick(tenant.id);
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};