
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Check, X } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PricingPlan } from "./getPricingPlans";

interface PlanComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  plans: PricingPlan[];
  t: (key: string) => string;
}

export const PlanComparisonModal = ({ isOpen, onClose, plans, t }: PlanComparisonModalProps) => {
  const allFeatures = plans.flatMap(plan => plan.features);
  const uniqueFeatures = [...new Set(allFeatures)];

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{t('comparePlansTitle')}</DialogTitle>
        </DialogHeader>
        
        <div className="mt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-1/3">{t('feature')}</TableHead>
                {plans.map((plan) => (
                  <TableHead key={plan.name} className="text-center">
                    <div className="font-bold text-lg">{plan.name}</div>
                    <div className="text-lg font-semibold">${plan.price}/{t('month')}</div>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {uniqueFeatures.map((feature) => (
                <TableRow key={feature}>
                  <TableCell className="font-medium">{feature}</TableCell>
                  {plans.map((plan) => (
                    <TableCell key={`${plan.name}-${feature}`} className="text-center">
                      {plan.features.includes(feature) ? (
                        <Check className={`h-5 w-5 ${plan.iconColor} mx-auto`} />
                      ) : (
                        <X className="h-5 w-5 text-gray-300 mx-auto" />
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </DialogContent>
    </Dialog>
  );
};
