
import { DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TenantPayment } from "@/types/tenant";
import { PaymentStatus } from "./PaymentStatus";
import { ShowMoreButton } from "./ShowMoreButton";
import { format } from "date-fns";
import { fr, enUS } from "date-fns/locale";
import { useLocale } from "@/components/providers/LocaleProvider";

interface PaymentsListProps {
  payments: TenantPayment[];
  displayedPayments: TenantPayment[];
  hasMorePayments: boolean;
  showAllPayments: boolean;
  hiddenPaymentsCount: number;
  onEditClick: (payment: TenantPayment) => void;
  onDeleteClick: (payment: TenantPayment) => void;
  onToggleShowAll: () => void;
}

export const PaymentsList = ({
  displayedPayments,
  hasMorePayments,
  showAllPayments,
  hiddenPaymentsCount,
  onEditClick,
  onDeleteClick,
  onToggleShowAll,
}: PaymentsListProps) => {
  const { t, language } = useLocale();

  return (
    <>
      {displayedPayments.map((payment) => (
        <div
          key={payment.id}
          className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-green-100 text-green-700">
              <DollarSign className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-medium">${payment.amount}</span>
                <PaymentStatus status={payment.status} />
              </div>
              <span className="text-sm text-muted-foreground">
                {format(new Date(payment.payment_date), 'MMMM dd, yyyy', { 
                  locale: language === 'fr' ? fr : enUS 
                })}
              </span>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEditClick(payment)}
              className="hover:text-blue-600 hover:border-blue-600"
            >
              {t('editPayment')}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDeleteClick(payment)}
              className="text-red-500 hover:text-red-600 hover:border-red-600"
            >
              {t('deletePayment')}
            </Button>
          </div>
        </div>
      ))}
      
      {hasMorePayments && (
        <ShowMoreButton
          showAllPayments={showAllPayments}
          onToggle={onToggleShowAll}
          hiddenPaymentsCount={hiddenPaymentsCount}
        />
      )}
    </>
  );
};
