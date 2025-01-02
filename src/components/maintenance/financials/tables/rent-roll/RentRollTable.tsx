import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RentRollTableContent } from "./RentRollTableContent";
import { useRentRollData } from "./useRentRollData";

interface RentRollTableProps {
  propertyId: string;
}

export const RentRollTable = ({ propertyId }: RentRollTableProps) => {
  const { data: rentRollData = [], isLoading } = useRentRollData(propertyId);

  if (isLoading) {
    return <div>Loading rent roll data...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Rent Roll</CardTitle>
      </CardHeader>
      <CardContent>
        <RentRollTableContent rentRollData={rentRollData} />
      </CardContent>
    </Card>
  );
};