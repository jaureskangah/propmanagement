
import { DollarSign } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { PaymentsHeader } from "./PaymentsHeader";

export const PaymentsLoadingState = () => {
  return (
    <Card>
      <PaymentsHeader onAddPayment={() => {}} />
      <CardContent>
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      </CardContent>
    </Card>
  );
};
