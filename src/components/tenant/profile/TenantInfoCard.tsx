
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LinkTenantProfile } from "./LinkTenantProfile";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { User, Mail, Phone, Home, Calendar, DollarSign, Upload, Pencil } from "lucide-react";
import { useLocale } from "@/components/providers/LocaleProvider";
import type { Tenant } from "@/types/tenant";
import { Separator } from "@/components/ui/separator";

interface TenantInfoCardProps {
  tenant: Tenant;
  onEdit?: () => void;
}

export function TenantInfoCard({ tenant, onEdit }: TenantInfoCardProps) {
  const { t } = useLocale();
  
  const handleProfileLinked = () => {
    // Refresh the tenant data
    window.location.reload();
  };

  // Get initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  return (
    <Card className="shadow-md">
      <CardHeader className="pb-2">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20 border-2 border-primary/10">
              <AvatarImage src={tenant.avatar_url || ""} />
              <AvatarFallback className="text-xl font-semibold bg-primary/10 text-primary">
                {getInitials(tenant.name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-2xl font-bold mb-1">{tenant.name}</CardTitle>
              <CardDescription className="text-base">
                {t('profileSubtitle')}
              </CardDescription>
            </div>
          </div>
          <div className="flex gap-2">
            <LinkTenantProfile tenant={tenant} onProfileLinked={handleProfileLinked} />
            {onEdit && (
              <Button variant="outline" onClick={onEdit}>
                <Pencil className="h-4 w-4 mr-2" />
                {t('edit')}
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-2">
        <Separator className="my-4" />
        
        <h3 className="text-lg font-medium mb-4">
          {t('personalInfo')}
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8 mb-6">
          <div className="flex items-center gap-3">
            <Mail className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-2">{t('emailProfileLabel')}</p>
              <p className="font-medium">{tenant.email}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Phone className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-2">{t('phoneProfileLabel')}</p>
              <p className="font-medium">{tenant.phone || t('notAvailable')}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Home className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-2">{t('unitProfileLabel')}</p>
              <p className="font-medium">{tenant.unit_number}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <DollarSign className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-2">{t('rentAmountLabel')}</p>
              <p className="font-medium">${tenant.rent_amount} {t('perMonth')}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Calendar className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-2">{t('leaseStartProfileLabel')}</p>
              <p className="font-medium">{new Date(tenant.lease_start).toLocaleDateString()}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Calendar className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-2">{t('leaseEndProfileLabel')}</p>
              <p className="font-medium">{new Date(tenant.lease_end).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
