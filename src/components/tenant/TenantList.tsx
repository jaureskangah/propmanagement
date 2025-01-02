import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Home, Pencil, Trash2, Phone, Mail, Calendar, UserPlus } from "lucide-react";
import type { Tenant } from "@/types/tenant";

interface TenantListProps {
  tenants: Tenant[];
  selectedTenant: string | null;
  onTenantSelect: (id: string) => void;
  onEditClick: (id: string) => void;
  onDeleteClick: (id: string) => void;
}

const getLeaseBadgeVariant = (leaseEnd: string) => {
  const today = new Date();
  const endDate = new Date(leaseEnd);
  const monthsUntilEnd = (endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24 * 30);

  if (endDate < today) {
    return "destructive";
  } else if (monthsUntilEnd <= 2) {
    return "warning";
  } else {
    return "success";
  }
};

const getLeaseBadgeText = (leaseEnd: string) => {
  const today = new Date();
  const endDate = new Date(leaseEnd);
  const monthsUntilEnd = (endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24 * 30);

  if (endDate < today) {
    return "Expired";
  } else if (monthsUntilEnd <= 2) {
    return "Expiring Soon";
  } else {
    return "Active";
  }
};

export const TenantList = ({
  tenants,
  selectedTenant,
  onTenantSelect,
  onEditClick,
  onDeleteClick,
}: TenantListProps) => {
  if (!tenants?.length) {
    return (
      <Card className="p-8 text-center space-y-4 animate-fade-in">
        <div className="w-20 h-20 mx-auto bg-muted rounded-full flex items-center justify-center">
          <UserPlus className="h-10 w-10 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold">Aucun locataire pour le moment</h3>
        <p className="text-muted-foreground">
          Commencez à gérer vos locations en ajoutant votre premier locataire. 
          Cliquez sur le bouton "Add Tenant" ci-dessus pour démarrer.
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {tenants?.map((tenant) => (
        <Card
          key={tenant.id}
          className={`cursor-pointer hover:bg-accent transition-colors ${
            selectedTenant === tenant.id ? "border-primary" : ""
          }`}
          onClick={() => onTenantSelect(tenant.id)}
        >
          <div className="p-4 space-y-4">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-semibold">{tenant.name}</h3>
                  <Badge variant={getLeaseBadgeVariant(tenant.lease_end)} className="animate-fade-in">
                    {getLeaseBadgeText(tenant.lease_end)}
                  </Badge>
                </div>
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
            <div className="grid grid-cols-3 gap-4 pt-2 border-t">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span className="truncate">{tenant.email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4" />
                <span>{tenant.phone || "N/A"}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>${tenant.rent_amount}/month</span>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};