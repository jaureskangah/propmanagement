import { useState } from "react";
import { Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TenantPayment } from "@/types/tenant";
import { PaymentStatus } from "./payments/PaymentStatus";
import { AddPaymentDialog } from "./payments/AddPaymentDialog";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface TenantPaymentsProps {
  payments: TenantPayment[];
  tenantId: string;
  onPaymentUpdate: () => void;
}

export const TenantPayments = ({ payments, tenantId, onPaymentUpdate }: TenantPaymentsProps) => {
  const [isAddPaymentOpen, setIsAddPaymentOpen] = useState(false);

  console.log("Rendering TenantPayments with payments:", payments);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Historique des paiements</CardTitle>
        <Button 
          onClick={() => setIsAddPaymentOpen(true)}
          className="bg-[#ea384c] hover:bg-[#ea384c]/90"
        >
          <Plus className="h-4 w-4 mr-2" />
          Ajouter un paiement
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {payments.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">
              Aucun paiement enregistré
            </p>
          ) : (
            payments
              .sort((a, b) => new Date(b.payment_date).getTime() - new Date(a.payment_date).getTime())
              .map((payment) => (
                <div
                  key={payment.id}
                  className="flex items-center justify-between p-4 border rounded hover:bg-accent/50"
                >
                  <div className="flex flex-col gap-1">
                    <span className="font-medium">{payment.amount} €</span>
                    <span className="text-sm text-muted-foreground">
                      {format(new Date(payment.payment_date), 'dd MMMM yyyy', { locale: fr })}
                    </span>
                  </div>
                  <PaymentStatus status={payment.status} />
                </div>
              ))
          )}
        </div>
      </CardContent>

      <AddPaymentDialog
        open={isAddPaymentOpen}
        onOpenChange={setIsAddPaymentOpen}
        tenantId={tenantId}
        onPaymentAdded={() => {
          onPaymentUpdate();
          setIsAddPaymentOpen(false);
        }}
      />
    </Card>
  );
};