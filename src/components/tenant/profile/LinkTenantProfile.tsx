import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useTenantProfileLink } from '@/hooks/useTenantProfileLink';
import { useAuth } from '@/components/AuthProvider';
import type { Tenant } from '@/types/tenant';

interface LinkTenantProfileProps {
  tenant: Tenant;
  onProfileLinked?: (success: boolean, message: string) => void;
}

export const LinkTenantProfile = ({ tenant, onProfileLinked }: LinkTenantProfileProps) => {
  const [isLinking, setIsLinking] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const { linkTenantProfile } = useTenantProfileLink();

  const handleLinkProfile = async () => {
    if (!user) return;
    
    setIsLinking(true);
    try {
      await linkTenantProfile(user);
      toast({
        title: "Success",
        description: "Profile linked successfully",
      });
      onProfileLinked?.(true, "Profile linked successfully");
    } catch (error) {
      console.error('Error linking profile:', error);
      toast({
        title: "Error",
        description: "Failed to link profile. Please try again.",
        variant: "destructive",
      });
      onProfileLinked?.(false, "Failed to link profile. Please try again.");
    } finally {
      setIsLinking(false);
    }
  };

  return (
    <Button 
      onClick={handleLinkProfile} 
      disabled={isLinking}
    >
      {isLinking ? 'Linking...' : 'Link Profile'}
    </Button>
  );
};