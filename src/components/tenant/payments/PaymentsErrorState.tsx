
import { Card, CardContent } from "@/components/ui/card";
import { PaymentsHeader } from "./PaymentsHeader";

export const PaymentsErrorState = () => {
  return (
    <Card>
      <PaymentsHeader onAddPayment={() => {}} />
      <CardContent>
        <div className="text-center py-8 text-red-600">
          <p>Erreur lors du chargement des paiements</p>
        </div>
      </CardContent>
    </Card>
  );
};
