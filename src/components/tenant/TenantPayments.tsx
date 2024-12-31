import { useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TenantPayment } from "@/types/tenant";
import { PaymentStatus } from "./payments/PaymentStatus";
import { AddPaymentDialog } from "./payments/AddPaymentDialog";
import { EditPaymentDialog } from "./payments/EditPaymentDialog";
import { DeletePaymentDialog } from "./payments/DeletePaymentDialog";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface TenantPaymentsProps {
  payments: TenantPayment[];
  tenantId: string;
  onPaymentUpdate: () => void;
}

export const TenantPayments = ({ payments, tenantId, onPaymentUpdate }: TenantPaymentsProps) => {
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
                  <div className="flex items-center gap-4">
                    <PaymentStatus status={payment.status} />
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEditClick(payment)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteClick(payment)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
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
        onPaymentAdded={() => {
          onPaymentUpdate();
          setIsAddPaymentOpen(false);
        }}
      />

      {selectedPayment && (
        <>
          <EditPaymentDialog
            open={isEditPaymentOpen}
            onOpenChange={setIsEditPaymentOpen}
            payment={selectedPayment}
            onPaymentUpdated={() => {
              onPaymentUpdate();
              setIsEditPaymentOpen(false);
              setSelectedPayment(null);
            }}
          />

          <DeletePaymentDialog
            open={isDeletePaymentOpen}
            onOpenChange={setIsDeletePaymentOpen}
            payment={selectedPayment}
            onPaymentDeleted={() => {
              onPaymentUpdate();
              setIsDeletePaymentOpen(false);
              setSelectedPayment(null);
            }}
          />
        </>
      )}
    </Card>
  );
};