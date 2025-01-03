import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { DollarSign, TrendingUp, AlertCircle } from "lucide-react";

interface Payment {
  amount: number;
  status: string;
  payment_date: string;
}

interface PaymentSummaryProps {
  payments: Payment[];
}

export const PaymentSummary = ({ payments }: PaymentSummaryProps) => {
  const totalPayments = payments.reduce((sum, payment) => sum + payment.amount, 0);
  const onTimePayments = payments.filter(p => p.status === "paid").length;
  const latePayments = payments.filter(p => p.status === "late").length;

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardContent className="flex items-center p-6">
          <DollarSign className="h-8 w-8 text-green-500" />
          <div className="ml-4">
            <p className="text-sm font-medium text-muted-foreground">Total des Paiements</p>
            <h3 className="text-2xl font-bold">${totalPayments.toLocaleString()}</h3>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex items-center p-6">
          <TrendingUp className="h-8 w-8 text-blue-500" />
          <div className="ml-4">
            <p className="text-sm font-medium text-muted-foreground">Paiements à Temps</p>
            <h3 className="text-2xl font-bold">{onTimePayments}</h3>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex items-center p-6">
          <AlertCircle className="h-8 w-8 text-red-500" />
          <div className="ml-4">
            <p className="text-sm font-medium text-muted-foreground">Paiements en Retard</p>
            <h3 className="text-2xl font-bold">{latePayments}</h3>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};