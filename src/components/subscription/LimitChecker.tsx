import { ReactNode } from 'react';
import { useSubscriptionLimits } from '@/hooks/useSubscriptionLimits';
import { useToast } from '@/components/ui/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Crown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface LimitCheckerProps {
  type: 'properties' | 'tenants';
  currentCount: number;
  children: ReactNode;
  onLimitReached?: () => void;
}

export const LimitChecker = ({ 
  type, 
  currentCount, 
  children, 
  onLimitReached 
}: LimitCheckerProps) => {
  const limits = useSubscriptionLimits();
  const { toast } = useToast();
  const navigate = useNavigate();

  const maxCount = type === 'properties' ? limits.maxProperties : limits.maxTenants;
  const limitReached = currentCount >= maxCount;
  const nearLimit = currentCount >= maxCount * 0.8;

  const handleLimitReached = () => {
    const entityName = type === 'properties' ? 'propriétés' : 'locataires';
    const maxText = maxCount === Infinity ? 'illimitées' : maxCount;
    
    toast({
      title: "Limite atteinte",
      description: `Votre plan permet ${maxText} ${entityName}. Passez à un plan supérieur pour en ajouter plus.`,
      variant: "destructive",
    });
    
    if (onLimitReached) {
      onLimitReached();
    }
  };

  if (limitReached) {
    const entityName = type === 'properties' ? 'propriétés' : 'locataires';
    const requiredPlan = type === 'properties' && limits.tier === 'free' ? 'Standard' : 'Pro';
    
    return (
      <Alert className="border-primary/20">
        <Crown className="h-4 w-4" />
        <AlertDescription className="space-y-3">
          <div>
            Vous avez atteint la limite de {maxCount} {entityName} de votre plan {limits.tier === 'free' ? 'Gratuit' : 'actuel'}.
          </div>
          <Button 
            onClick={() => navigate('/#pricing')}
            size="sm"
            className="w-full"
          >
            Passer au plan {requiredPlan}
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  if (nearLimit && maxCount !== Infinity) {
    const entityName = type === 'properties' ? 'propriétés' : 'locataires';
    
    return (
      <div className="space-y-3">
        <Alert className="border-amber-200 bg-amber-50">
          <Crown className="h-4 w-4 text-amber-600" />
          <AlertDescription>
            Attention: Vous approchez de la limite ({currentCount}/{maxCount} {entityName}).
            <Button 
              variant="link" 
              size="sm" 
              onClick={() => navigate('/#pricing')}
              className="p-0 h-auto ml-1"
            >
              Voir les plans
            </Button>
          </AlertDescription>
        </Alert>
        {children}
      </div>
    );
  }

  return <>{children}</>;
};