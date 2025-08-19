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
      <Card className="border-amber-200/60 bg-gradient-to-br from-amber-50 to-orange-50 shadow-md animate-fade-in">
        <CardContent className="p-5">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
              <Zap className="w-5 h-5 text-amber-600" />
            </div>
            <div className="flex-1 space-y-3">
              <div className="space-y-1">
                <div className="text-sm font-semibold text-amber-800">
                  🎯 Limite quotidienne atteinte
                </div>
                <div className="text-sm text-amber-700 leading-relaxed">
                  Vous avez utilisé vos <span className="font-medium">{usage.totalMessages} messages quotidiens</span> de l'assistant IA. 
                  Vos messages se renouvellent chaque jour à minuit.
                </div>
              </div>
              <div className="bg-amber-100/50 rounded-lg p-3 border border-amber-200/50">
                <div className="text-xs font-medium text-amber-800 mb-1">
                  🚀 Accès illimité avec Premium
                </div>
                <div className="text-xs text-amber-700">
                  Messages illimités • Analyses avancées • Support prioritaire
                </div>
              </div>
              <Button 
                size="sm" 
                onClick={() => {
                  console.log('Navigating to pricing section');
                  navigate('/');
                  setTimeout(() => {
                    const pricingSection = document.getElementById('pricing');
                    if (pricingSection) {
                      pricingSection.scrollIntoView({ behavior: 'smooth' });
                    }
                  }, 100);
                }}
                className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white border-0 shadow-sm hover:shadow-md transition-all duration-200"
              >
                <Crown className="w-4 h-4 mr-2" />
                Découvrir Premium
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
        <div className="bg-amber-50/50 rounded-lg p-3 border border-amber-200/30 animate-fade-in">
          <div className="flex items-center gap-2 text-xs text-amber-700">
            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center">
              <Zap className="w-3 h-3 text-amber-600" />
            </div>
            <div className="flex-1">
              <span className="font-medium">Attention :</span> Il ne vous reste que quelques messages aujourd'hui.
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => {
                console.log('Navigating to pricing section from warning');
                navigate('/');
                setTimeout(() => {
                  const pricingSection = document.getElementById('pricing');
                  if (pricingSection) {
                    pricingSection.scrollIntoView({ behavior: 'smooth' });
                  }
                }, 100);
              }}
              className="text-xs h-auto py-1 px-2 text-amber-700 hover:text-amber-800 hover:bg-amber-100/50 transition-colors"
            >
              Premium →
            </Button>
          </div>
        </div>
      )}
      
      {/* Bouton Premium visible quand proche de la limite */}
      {isNearLimit && usage.canSendMessage && (
        <div className="mt-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => {
              console.log('Premium button clicked from indicator');
              navigate('/');
              setTimeout(() => {
                const pricingSection = document.getElementById('pricing');
                if (pricingSection) {
                  pricingSection.scrollIntoView({ behavior: 'smooth' });
                }
              }, 100);
            }}
            className="w-full text-amber-700 border-amber-300 hover:bg-amber-50 transition-colors"
          >
            <Crown className="w-4 h-4 mr-2" />
            Premium
          </Button>
        </div>
      )}
    </div>
  );
};