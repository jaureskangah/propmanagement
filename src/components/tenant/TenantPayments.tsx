
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { TenantPayment } from "@/types/tenant";
import { AddPaymentDialog } from "./payments/AddPaymentDialog";
import { EditPaymentDialog } from "./payments/EditPaymentDialog";
import { DeletePaymentDialog } from "./payments/DeletePaymentDialog";
import { PaymentsHeader } from "./payments/PaymentsHeader";
import { PaymentsLoadingState } from "./payments/PaymentsLoadingState";
import { PaymentsErrorState } from "./payments/PaymentsErrorState";
import { PaymentsEmptyState } from "./payments/PaymentsEmptyState";
import { PaymentsList } from "./payments/PaymentsList";
import { useQueryClient } from "@tanstack/react-query";
import { useTenantPayments } from "@/hooks/useTenantPayments";

const INITIAL_PAYMENTS_LIMIT = 5;

interface TenantPaymentsProps {
  tenantId: string;
  onPaymentUpdate: () => void;
}

export const TenantPayments = ({ tenantId, onPaymentUpdate }: TenantPaymentsProps) => {
  const queryClient = useQueryClient();
  const [isAddPaymentOpen, setIsAddPaymentOpen] = useState(false);
  const [isEditPaymentOpen, setIsEditPaymentOpen] = useState(false);
  const [isDeletePaymentOpen, setIsDeletePaymentOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<TenantPayment | null>(null);
  const [showAllPayments, setShowAllPayments] = useState(false);

  // Utiliser uniquement useTenantPayments comme source de vérité
  const { data: payments = [], isLoading, error, refetch } = useTenantPayments(tenantId);

  console.log("TenantPayments - Rendering with tenantId:", tenantId);
  console.log("TenantPayments - Payments data:", payments);
  console.log("TenantPayments - IsLoading:", isLoading);
  console.log("TenantPayments - Error:", error);

  const handleEditClick = (payment: TenantPayment) => {
    setSelectedPayment(payment);
    setIsEditPaymentOpen(true);
  };

  const handleDeleteClick = (payment: TenantPayment) => {
    setSelectedPayment(payment);
    setIsDeletePaymentOpen(true);
  };

  const handlePaymentAdded = async () => {
    console.log("Payment added - refreshing data");
    // Refetch immédiatement les paiements
    await refetch();
    // Invalider les queries pour forcer le rechargement
    queryClient.invalidateQueries({ queryKey: ["tenants"] });
    queryClient.invalidateQueries({ queryKey: ["tenant_payments", tenantId] });
    onPaymentUpdate();
    setIsAddPaymentOpen(false);
  };

  const handlePaymentUpdated = async () => {
    console.log("Payment updated - refreshing data");
    // Refetch immédiatement les paiements
    await refetch();
    // Invalider les queries pour forcer le rechargement
    queryClient.invalidateQueries({ queryKey: ["tenants"] });
    queryClient.invalidateQueries({ queryKey: ["tenant_payments", tenantId] });
    onPaymentUpdate();
    setIsEditPaymentOpen(false);
    setSelectedPayment(null);
  };

  const handlePaymentDeleted = async () => {
    console.log("Payment deleted - refreshing data");
    // Refetch immédiatement les paiements
    await refetch();
    // Invalider les queries pour forcer le rechargement
    queryClient.invalidateQueries({ queryKey: ["tenants"] });
    queryClient.invalidateQueries({ queryKey: ["tenant_payments", tenantId] });
    onPaymentUpdate();
    setIsDeletePaymentOpen(false);
    setSelectedPayment(null);
  };

  // Calculer les paiements affichés en fonction de l'état showAllPayments
  const sortedPayments = payments.sort((a, b) => new Date(b.payment_date).getTime() - new Date(a.payment_date).getTime());
  const displayedPayments = showAllPayments 
    ? sortedPayments 
    : sortedPayments.slice(0, INITIAL_PAYMENTS_LIMIT);
  const hasMorePayments = payments.length > INITIAL_PAYMENTS_LIMIT;
  const hiddenPaymentsCount = payments.length - INITIAL_PAYMENTS_LIMIT;

  if (isLoading) {
    return <PaymentsLoadingState />;
  }

  if (error) {
    console.error("Error in TenantPayments:", error);
    return <PaymentsErrorState />;
  }

  return (
    <Card>
      <PaymentsHeader onAddPayment={() => setIsAddPaymentOpen(true)} />
      <CardContent>
        <div className="space-y-4">
          {payments.length === 0 ? (
            <PaymentsEmptyState />
          ) : (
            <PaymentsList
              payments={payments}
              displayedPayments={displayedPayments}
              hasMorePayments={hasMorePayments}
              showAllPayments={showAllPayments}
              hiddenPaymentsCount={hiddenPaymentsCount}
              onEditClick={handleEditClick}
              onDeleteClick={handleDeleteClick}
              onToggleShowAll={() => setShowAllPayments(!showAllPayments)}
            />
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
