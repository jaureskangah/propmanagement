import { Mail, Phone, Calendar, DollarSign, Building2, Hash } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tenant } from "@/types/tenant";
import { formatDate } from "@/lib/utils";

interface TenantHeaderProps {
  tenant: Tenant;
}

export const TenantHeader = ({ tenant }: TenantHeaderProps) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-2xl font-bold">{tenant.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-100 text-blue-700">
                <Mail className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{tenant.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-green-100 text-green-700">
                <Phone className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Phone</p>
                <p className="font-medium">{tenant.phone || "Not provided"}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-purple-100 text-purple-700">
                <Building2 className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Property</p>
                <p className="font-medium">{tenant.properties?.name || "Not assigned"}</p>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-orange-100 text-orange-700">
                <Hash className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Unit Number</p>
                <p className="font-medium">{tenant.unit_number}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-yellow-100 text-yellow-700">
                <Calendar className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Lease Period</p>
                <p className="font-medium">
                  {formatDate(tenant.lease_start)} - {formatDate(tenant.lease_end)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-red-100 text-red-700">
                <DollarSign className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Monthly Rent</p>
                <p className="font-medium">${tenant.rent_amount}</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};