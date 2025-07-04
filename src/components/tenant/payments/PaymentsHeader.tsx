
import { Plus, DollarSign } from "lucide-react";
import { CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLocale } from "@/components/providers/LocaleProvider";

interface PaymentsHeaderProps {
  onAddPayment: () => void;
}

export const PaymentsHeader = ({ onAddPayment }: PaymentsHeaderProps) => {
  const { t } = useLocale();

  return (
    <CardHeader className="flex flex-row items-center justify-between">
      <div className="flex items-center gap-2">
        <DollarSign className="h-5 w-5 text-green-600" />
        <CardTitle className="text-lg">{t('paymentsLabel')}</CardTitle>
      </div>
      <Button 
        onClick={onAddPayment}
        className="bg-green-600 hover:bg-green-700"
      >
        <Plus className="h-4 w-4 mr-2" />
        {t('addPayment')}
      </Button>
    </CardHeader>
  );
};
