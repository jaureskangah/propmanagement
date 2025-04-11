
import { Input } from "@/components/ui/input";

interface CostFieldProps {
  cost: string;
  setCost: (value: string) => void;
}

export const CostField = ({
  cost,
  setCost,
}: CostFieldProps) => {
  return (
    <div className="space-y-2">
      <label htmlFor="cost">Coût</label>
      <Input
        id="cost"
        type="number"
        step="0.01"
        value={cost}
        onChange={(e) => setCost(e.target.value)}
        required
      />
    </div>
  );
};
