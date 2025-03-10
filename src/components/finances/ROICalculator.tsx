
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useLocale } from "@/components/providers/LocaleProvider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TrendingUp, Calculator } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

interface ROICalculatorProps {
  propertyId: string | null;
}

export default function ROICalculator({ propertyId }: ROICalculatorProps) {
  const { t } = useLocale();
  const [propertyValue, setPropertyValue] = useState<number>(250000);
  const [mortgageRate, setMortgageRate] = useState<number>(4.5);
  const [isCalculating, setIsCalculating] = useState<boolean>(false);

  const { data: financialData } = useQuery({
    queryKey: ['roi_calculator_data', propertyId],
    queryFn: async () => {
      if (!propertyId) return null;

      // Get property tenants
      const { data: tenants } = await supabase
        .from('tenants')
        .select('id, rent_amount')
        .eq('property_id', propertyId);

      // Get expenses for this property
      const { data: expenses } = await supabase
        .from('maintenance_expenses')
        .select('amount')
        .eq('property_id', propertyId);

      const annualRent = tenants?.reduce((sum, tenant) => sum + (tenant.rent_amount * 12), 0) || 0;
      const annualExpenses = expenses?.reduce((sum, expense) => sum + expense.amount, 0) || 0;
      
      return {
        annualRent,
        annualExpenses
      };
    },
    enabled: !!propertyId
  });

  const calculateROI = () => {
    setIsCalculating(true);
    setTimeout(() => setIsCalculating(false), 800);
  };

  // Calculate ROI based on input values and financial data
  const annualRent = financialData?.annualRent || 0;
  const annualExpenses = financialData?.annualExpenses || 0;
  const annualMortgagePayment = propertyValue * (mortgageRate / 100);
  
  const grossIncome = annualRent;
  const operatingExpenses = annualExpenses;
  const netOperatingIncome = grossIncome - operatingExpenses;
  const cashFlow = netOperatingIncome - annualMortgagePayment;
  const cashOnCashReturn = (propertyValue > 0) ? (cashFlow / (propertyValue * 0.2)) * 100 : 0;
  const capRate = (propertyValue > 0) ? (netOperatingIncome / propertyValue) * 100 : 0;

  if (!propertyId) {
    return (
      <Card className="bg-muted/20">
        <CardContent className="p-6 text-center text-muted-foreground">
          {t('selectPropertyToCalculateROI')}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-purple-500" />
          {t('roiCalculator')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="propertyValue">{t('propertyValue')}</Label>
            <div className="flex gap-2">
              <span className="flex items-center text-muted-foreground px-3 bg-muted/50 rounded-l-md border border-r-0">$</span>
              <Input
                id="propertyValue"
                type="number"
                value={propertyValue}
                onChange={(e) => setPropertyValue(Number(e.target.value))}
                className="rounded-l-none"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="mortgageRate">{t('mortgageInterestRate')}: {mortgageRate}%</Label>
            </div>
            <Slider
              id="mortgageRate"
              min={0}
              max={10}
              step={0.1}
              value={[mortgageRate]}
              onValueChange={(values) => setMortgageRate(values[0])}
              className="py-2"
            />
          </div>

          <Button 
            onClick={calculateROI} 
            className="w-full"
            disabled={isCalculating}
          >
            {isCalculating ? (
              <>
                <Calculator className="mr-2 h-4 w-4 animate-spin" />
                {t('calculating')}
              </>
            ) : (
              <>
                <Calculator className="mr-2 h-4 w-4" />
                {t('calculate')}
              </>
            )}
          </Button>

          <div className="grid grid-cols-2 gap-4 pt-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">{t('cashOnCashReturn')}</p>
              <p className="text-2xl font-bold">{cashOnCashReturn.toFixed(2)}%</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">{t('capitalizationRate')}</p>
              <p className="text-2xl font-bold">{capRate.toFixed(2)}%</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">{t('annualCashFlow')}</p>
              <p className="text-2xl font-bold ${cashFlow >= 0 ? 'text-green-500' : 'text-red-500'}">
                ${cashFlow.toLocaleString()}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">{t('netOperatingIncome')}</p>
              <p className="text-2xl font-bold">${netOperatingIncome.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
