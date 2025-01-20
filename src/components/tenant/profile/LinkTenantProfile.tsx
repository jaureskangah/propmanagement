import { Button } from "@/components/ui/button";
import { useTenantProfileLink } from "@/hooks/useTenantProfileLink";
import type { Tenant } from "@/types/tenant";

interface LinkTenantProfileProps {
  tenant: Tenant;
  onProfileLinked: (success: boolean, message: string) => void;
}

export function LinkTenantProfile({ tenant, onProfileLinked }: LinkTenantProfileProps) {
  const { isLoading, linkProfile } = useTenantProfileLink();

  const handleLinkProfile = async () => {
    const result = await linkProfile(tenant);
    onProfileLinked(result.success, result.message);
    
    if (result.success) {
      // Force a page reload after successful linking
      window.location.reload();
    }
  };

  return (
    <div className="flex items-center gap-4">
      <Button 
        onClick={handleLinkProfile} 
        disabled={isLoading || !!tenant.tenant_profile_id}
        variant={tenant.tenant_profile_id ? "secondary" : "default"}
      >
        {tenant.tenant_profile_id 
          ? "Profile Linked" 
          : isLoading 
            ? "Linking..." 
            : "Link Tenant Profile"}
      </Button>
    </div>
  );
}