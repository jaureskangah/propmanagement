import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useTenantProfileLink } from '@/hooks/useTenantProfileLink';
import { useAuth } from '@/components/AuthProvider';
import type { Tenant } from '@/types/tenant';

export const LinkTenantProfile = ({ tenant }: { tenant: Tenant }) => {
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
    } catch (error) {
      console.error('Error linking profile:', error);
      toast({
        title: "Error",
        description: "Failed to link profile. Please try again.",
        variant: "destructive",
      });
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