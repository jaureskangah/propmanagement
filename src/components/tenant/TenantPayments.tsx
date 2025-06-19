
import { useState } from "react";
import { Plus, DollarSign } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TenantPayment } from "@/types/tenant";
import { PaymentStatus } from "./payments/PaymentStatus";
import { AddPaymentDialog } from "./payments/AddPaymentDialog";
import { EditPaymentDialog } from "./payments/EditPaymentDialog";
import { DeletePaymentDialog } from "./payments/DeletePaymentDialog";
import { format } from "date-fns";
import { enUS } from "date-fns/locale";
import { useLocale } from "@/components/providers/LocaleProvider";

interface TenantPaymentsProps {
  payments: TenantPayment[];
  tenantId: string;
  onPaymentUpdate: () => void;
}

export const TenantPayments = ({ payments, tenantId, onPaymentUpdate }: TenantPaymentsProps) => {
  const { t } = useLocale();
  const [isAddPaymentOpen, setIsAddPaymentOpen] = useState(false);
  const [isEditPaymentOpen, setIsEditPaymentOpen] = useState(false);
  const [isDeletePaymentOpen, setIsDeletePaymentOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<TenantPayment | null>(null);

  console.log("Rendering TenantPayments with payments:", payments);

  const handleEditClick = (payment: TenantPayment) => {
    setSelectedPayment(payment);
    setIsEditPaymentOpen(true);
  };

  const handleDeleteClick = (payment: TenantPayment) => {
    setSelectedPayment(payment);
    setIsDeletePaymentOpen(true);
  };

  const handlePaymentAdded = () => {
    onPaymentUpdate();
    setIsAddPaymentOpen(false);
  };

  const handlePaymentUpdated = () => {
    onPaymentUpdate();
    setIsEditPaymentOpen(false);
    setSelectedPayment(null);
  };

  const handlePaymentDeleted = () => {
    onPaymentUpdate();
    setIsDeletePaymentOpen(false);
    setSelectedPayment(null);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <DollarSign className="h-5 w-5 text-green-600" />
          <CardTitle className="text-lg">{t('payments')}</CardTitle>
        </div>
        <Button 
          onClick={() => setIsAddPaymentOpen(true)}
          className="bg-green-600 hover:bg-green-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          {t('addPayment')}
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {payments.length === 0 ? (
            <div className="text-center py-8 border-2 border-dashed rounded-lg">
              <DollarSign className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">
                {t('noPayments')}
              </p>
            </div>
          ) : (
            payments
              .sort((a, b) => new Date(b.payment_date).getTime() - new Date(a.payment_date).getTime())
              .map((payment) => (
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
                        {format(new Date(payment.payment_date), 'MMMM dd, yyyy', { locale: enUS })}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditClick(payment)}
                      className="hover:text-blue-600 hover:border-blue-600"
                    >
                      {t('editPayment')}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteClick(payment)}
                      className="text-red-500 hover:text-red-600 hover:border-red-600"
                    >
                      {t('deletePayment')}
                    </Button>
                  </div>
                </div>
              ))
          )}
        </div>
      </CardContent>

      <AddPaymentDialog
        open={isAddPaymentOpen}
        onOpenChange={setIsAddPaymentOpen}
        tenantId={tenantId}
        onPaymentAdded={handlePaymentAdded}
      />

      {selectedPayment && (
        <>
          <EditPaymentDialog
            open={isEditPaymentOpen}
            onOpenChange={setIsEditPaymentOpen}
            payment={selectedPayment}
            onPaymentUpdated={handlePaymentUpdated}
          />

          <DeletePaymentDialog
            open={isDeletePaymentOpen}
            onOpenChange={setIsDeletePaymentOpen}
            payment={selectedPayment}
            onPaymentDeleted={handlePaymentDeleted}
          />
        </>
      )}
    </Card>
  );
};
