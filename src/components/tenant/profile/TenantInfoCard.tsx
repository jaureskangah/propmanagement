import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LinkTenantProfile } from "./LinkTenantProfile";
import type { Tenant } from "@/types/tenant";

interface TenantInfoCardProps {
  tenant: Tenant;
  onEdit?: () => void;
}

export function TenantInfoCard({ tenant, onEdit }: TenantInfoCardProps) {
  const handleProfileLinked = () => {
    // Refresh the tenant data
    window.location.reload();
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-2xl font-bold">{tenant.name}</CardTitle>
        <div className="flex gap-2">
          <LinkTenantProfile tenant={tenant} onProfileLinked={handleProfileLinked} />
          {onEdit && (
            <Button variant="outline" onClick={onEdit}>
              Edit
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Email</p>
            <p>{tenant.email}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Phone</p>
            <p>{tenant.phone || "N/A"}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Unit</p>
            <p>{tenant.unit_number}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Rent Amount</p>
            <p>${tenant.rent_amount}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Lease Start</p>
            <p>{new Date(tenant.lease_start).toLocaleDateString()}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Lease End</p>
            <p>{new Date(tenant.lease_end).toLocaleDateString()}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}