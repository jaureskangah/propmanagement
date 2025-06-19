
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { TenantPayment } from "@/types/tenant";
import { AddPaymentDialog } from "./payments/AddPaymentDialog";
import { EditPaymentDialog } from "./payments/EditPaymentDialog";
import { DeletePaymentDialog } from "./payments/DeletePaymentDialog";
import { PaymentsHeader } from "./payments/PaymentsHeader";
import { PaymentsLoadingState } from "./payments/PaymentsLoadingState";
import { PaymentsErrorState } from "./payments/PaymentsErrorState";
import { PaymentsList } from "./payments/PaymentsList";
import { useQueryClient } from "@tanstack/react-query";
import { useTenantPayments } from "@/hooks/useTenantPayments";

const INITIAL_PAYMENTS_LIMIT = 5;

interface TenantPaymentsProps {
  payments: TenantPayment[]; // Keep for compatibility but will be overridden
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

  // Use the custom hook to fetch payments directly
  const { data: payments = [], isLoading, error } = useTenantPayments(tenantId);

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
    // Invalider les queries pour forcer le rechargement des données
    queryClient.invalidateQueries({ queryKey: ["tenants"] });
    queryClient.invalidateQueries({ queryKey: ["tenant_payments", tenantId] });
    onPaymentUpdate();
    setIsAddPaymentOpen(false);
  };

  const handlePaymentUpdated = () => {
    // Invalider les queries pour forcer le rechargement des données
    queryClient.invalidateQueries({ queryKey: ["tenants"] });
    queryClient.invalidateQueries({ queryKey: ["tenant_payments", tenantId] });
    onPaymentUpdate();
    setIsEditPaymentOpen(false);
    setSelectedPayment(null);
  };

  const handlePaymentDeleted = () => {
    // Invalider les queries pour forcer le rechargement des données
    queryClient.invalidateQueries({ queryKey: ["tenants"] });
    queryClient.invalidateQueries({ queryKey: ["tenant_payments", tenantId] });
    onPaymentUpdate();
    setIsDeletePaymentOpen(false);
    setSelectedPayment(null);
  };

  // Calculate displayed payments based on showAllPayments state
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
    return <PaymentsErrorState />;
  }

  return (
    <Card>
      <PaymentsHeader onAddPayment={() => setIsAddPaymentOpen(true)} />
      <CardContent>
        <div className="space-y-4">
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
