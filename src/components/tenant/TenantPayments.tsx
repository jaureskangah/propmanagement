import { DollarSign } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TenantPayment } from "@/types/tenant";

interface TenantPaymentsProps {
  payments: TenantPayment[];
}

export const TenantPayments = ({ payments }: TenantPaymentsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Payment History</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {payments.map((payment) => (
            <div
              key={payment.id}
              className="flex items-center justify-between p-2 border rounded"
            >
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                <span>${payment.amount}</span>
              </div>
              <div className="flex items-center gap-4">
                <span
                  className={`text-sm ${
                    payment.status === "Paid"
                      ? "text-green-600"
                      : "text-yellow-600"
                  }`}
                >
                  {payment.status}
                </span>
                <span className="text-sm text-muted-foreground">
                  {payment.date}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};