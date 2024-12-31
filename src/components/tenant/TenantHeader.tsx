import { Mail, Phone, Calendar, DollarSign } from "lucide-react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Tenant } from "@/types/tenant";

interface TenantHeaderProps {
  tenant: Tenant;
}

export const TenantHeader = ({ tenant }: TenantHeaderProps) => {
  return (
    <Card>
      <CardHeader className="p-4">
        <CardTitle className="text-xl">{tenant.name}</CardTitle>
        <div className="grid grid-cols-2 gap-4 mt-2">
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{tenant.email}</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{tenant.phone}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">
              Lease: {tenant.lease_start} to {tenant.lease_end}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">Rent: ${tenant.rent_amount}/month</span>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
};