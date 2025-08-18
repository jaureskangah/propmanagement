import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Crown, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AIUsageData } from '@/hooks/useAIUsageLimits';

interface AIUsageIndicatorProps {
  usage: AIUsageData;
  className?: string;
}

export const AIUsageIndicator = ({ usage, className }: AIUsageIndicatorProps) => {
  const navigate = useNavigate();
  
  if (usage.totalMessages === Infinity) {
    return (
      <div className={`text-sm text-muted-foreground flex items-center gap-1 ${className}`}>
        <Crown className="w-4 h-4 text-primary" />
        <span>Messages illimités</span>
      </div>
    );
  }

  if (!usage.canSendMessage) {
    return (
      <Card className="border-amber-200 bg-amber-50">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Zap className="w-5 h-5 text-amber-600 mt-0.5" />
            <div className="flex-1 space-y-2">
              <div className="text-sm font-medium text-amber-800">
                Limite quotidienne atteinte
              </div>
              <div className="text-sm text-amber-700">
                Vous avez utilisé vos {usage.totalMessages} messages quotidiens de l'assistant IA. 
                Passez à un plan Premium pour un accès illimité.
              </div>
              <Button 
                size="sm" 
                onClick={() => navigate('/#pricing')}
                className="w-full"
              >
                <Crown className="w-4 h-4 mr-2" />
                Passer au Premium
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const usagePercentage = (usage.usedToday / usage.totalMessages) * 100;
  const isNearLimit = usagePercentage >= 80;

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">
          Messages restants aujourd'hui
        </span>
        <span className={`font-medium ${isNearLimit ? 'text-amber-600' : 'text-primary'}`}>
          {usage.remainingMessages}/{usage.totalMessages}
        </span>
      </div>
      
      <div className="w-full bg-muted rounded-full h-2">
        <div 
          className={`h-2 rounded-full transition-all duration-300 ${
            isNearLimit ? 'bg-amber-500' : 'bg-primary'
          }`}
          style={{ width: `${usagePercentage}%` }}
        />
      </div>
      
      {isNearLimit && (
        <div className="text-xs text-amber-600 flex items-center gap-1">
          <Zap className="w-3 h-3" />
          <span>Bientôt à court de messages.</span>
          <Button 
            variant="link" 
            size="sm" 
            onClick={() => navigate('/#pricing')}
            className="p-0 h-auto text-xs"
          >
            Passer au Premium
          </Button>
        </div>
      )}
    </div>
  );
};