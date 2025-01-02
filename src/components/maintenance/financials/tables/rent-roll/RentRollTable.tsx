import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RentRollTableContent } from "./RentRollTableContent";
import { useRentRollData } from "./useRentRollData";

export const RentRollTable = () => {
  const { data: rentRollData = [], isLoading } = useRentRollData();

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